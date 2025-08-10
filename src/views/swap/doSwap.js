

import { parseGwei, parseUnits } from 'viem'
import { Percent } from '@uniswap/sdk-core'
import { ElMessage } from 'element-plus'

export async function doSwaps({
  fromToken,
  toToken,
  amountIn,
  slippageInput,
  trade,
  userAddress,
  routerAddress,
  decimals,
  wcpAddress,
  nativeSymbol = 'CP',
  readContractAsync,
  writeContractAsync,
  setTxHash,
  setApprovalHash,
  useExactApproval = false // 强制使用最大授权
}) {
  let txHash = null
  let didApprove = false

  function isNative(token) {
    if (!token) return false
    return token.symbol === nativeSymbol || token.isNative
  }

  function getTokenAddress(token) {
    if (!token) throw new Error('Token undefined')
    return isNative(token) ? wcpAddress : token.address
  }

  try {
    // 参数验证
    if (!trade) throw new Error('No valid Trade object')
    if (!fromToken || !toToken) throw new Error('Token not defined')
    if (!userAddress || !routerAddress) throw new Error('Incomplete params')
    if (!readContractAsync || !writeContractAsync) {
      throw new Error('wagmi hooks not provided')
    }

    console.log('🔄 Starting optimized swap:', {
      from: fromToken.symbol,
      to: toToken.symbol,
      amount: amountIn,
      slippage: slippageInput
    })

    // 滑点计算
    const slippageDecimal = Number(slippageInput)
    if (isNaN(slippageDecimal) || slippageDecimal < 0) {
      throw new Error('Invalid slippage input')
    }
    if (slippageDecimal < 0.00000001) {
      throw new Error('Slippage too low, may cause transaction to revert')
    }

    const numerator = BigInt(Math.floor(slippageDecimal * 1e18))
    const slippage = new Percent(numerator.toString(), '1000000000000000000')
    const minAmount = trade.minimumAmountOut(slippage).quotient.toString()
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)

    console.log('📊 Swap parameters:', {
      minAmount,
      deadline: deadline.toString(),
      slippagePercent: slippageDecimal
    })

    // Router ABI 定义
    const routerAbi = [
      {
        name: 'swapExactTokensForTokens',
        type: 'function',
        inputs: [
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMin', type: 'uint256' },
          { name: 'path', type: 'address[]' },
          { name: 'to', type: 'address' },
          { name: 'deadline', type: 'uint256' }
        ],
        outputs: [{ name: 'amounts', type: 'uint256[]' }]
      },
      {
        name: 'swapExactETHForTokens',
        type: 'function',
        stateMutability: 'payable',
        inputs: [
          { name: 'amountOutMin', type: 'uint256' },
          { name: 'path', type: 'address[]' },
          { name: 'to', type: 'address' },
          { name: 'deadline', type: 'uint256' }
        ],
        outputs: [{ name: 'amounts', type: 'uint256[]' }]
      },
      {
        name: 'swapExactTokensForETH',
        type: 'function',
        inputs: [
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMin', type: 'uint256' },
          { name: 'path', type: 'address[]' },
          { name: 'to', type: 'address' },
          { name: 'deadline', type: 'uint256' }
        ],
        outputs: [{ name: 'amounts', type: 'uint256[]' }]
      }
    ]

    // ERC20 ABI 定义
    const erc20Abi = [
      {
        name: 'approve',
        type: 'function',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
      }
    ]

    // 1️⃣ Native CP → Token
    if (isNative(fromToken)) {
      if (isNative(toToken)) throw new Error(`${nativeSymbol} to ${nativeSymbol} swap not allowed`)
      
      console.log('🔄 Native to Token swap')
      const path = [wcpAddress, getTokenAddress(toToken)]
      const amountInParsed = parseUnits(amountIn.toString(), 18)
      
      console.log('📋 Native swap params:', {
        path,
        amountIn: amountInParsed.toString(),
        minAmount
      })
      
      const hash = await writeContractAsync({
        address: routerAddress,
        abi: routerAbi,
        functionName: 'swapExactETHForTokens',
        args: [
          BigInt(minAmount),
          path,
          userAddress,
          deadline
        ],
        value: amountInParsed,
        gas: BigInt(850000)
      })
      
      txHash = hash
      setTxHash && setTxHash(hash)
      console.log('✅ Native swap submitted:', hash)
    }
    
    // 2️⃣ Token → Native CP
    else if (isNative(toToken)) {
      console.log('🔄 Token to Native swap')
      const fromTokenAddress = getTokenAddress(fromToken)
      const path = [fromTokenAddress, wcpAddress]
      const amountInParsed = parseUnits(amountIn.toString(), decimals)
      
      console.log('📋 Token to Native params:', {
        fromToken: fromTokenAddress,
        path,
        amountIn: amountInParsed.toString(),
        minAmount
      })
      
      // 统一进行授权（移除快速检测）
      console.log('📝 Submitting approval...')
      const approveHash = await writeContractAsync({
        address: fromTokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [routerAddress, useExactApproval ? amountInParsed : maxUint256],
        gas: BigInt(850000)
      })
      
      setApprovalHash && setApprovalHash(approveHash)
      didApprove = true
      console.log('✅ Approval submitted:', approveHash)
      
      ElMessage({
        message: useExactApproval ? 'Exact approval submitted, proceeding with swap...' : 'Max approval submitted, proceeding with swap...',
        type: 'info',
        duration: 2000,
        showClose: true
      })
      
      // 等待1秒
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 执行交换
      console.log('🔄 Submitting swap transaction...')
      const hash = await writeContractAsync({
        address: routerAddress,
        abi: routerAbi,
        functionName: 'swapExactTokensForETH',
        args: [
          amountInParsed,
          BigInt(minAmount),
          path,
          userAddress,
          deadline
        ],
        gas: BigInt(850000)
      })
      
      txHash = hash
      setTxHash && setTxHash(hash)
      console.log('✅ Token to Native swap submitted:', hash)
    }
    
    // 3️⃣ ERC20 → ERC20
    else {
      console.log('🔄 ERC20 to ERC20 swap')
      const fromTokenAddress = getTokenAddress(fromToken)
      const toTokenAddress = getTokenAddress(toToken)
      const path = [fromTokenAddress, toTokenAddress]
      const amountInParsed = parseUnits(amountIn.toString(), decimals)
      
      console.log('📋 ERC20 to ERC20 params:', {
        fromToken: fromTokenAddress,
        toToken: toTokenAddress,
        path,
        amountIn: amountInParsed.toString(),
        minAmount
      })
      
      // 统一进行授权（移除快速检测）
      console.log('📝 Submitting approval...')
      const approveHash = await writeContractAsync({
        address: fromTokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [routerAddress, useExactApproval ? amountInParsed : maxUint256],
        gas: BigInt(850000)
      })
      
      setApprovalHash && setApprovalHash(approveHash)
      didApprove = true
      console.log('✅ Approval submitted:', approveHash)
      
      ElMessage({
        message: useExactApproval ? 'Exact approval submitted, proceeding with swap...' : 'Max approval submitted, proceeding with swap...',
        type: 'info',
        duration: 2000,
        showClose: true
      })
      
      // 等待1秒
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 执行交换
      console.log('🔄 Submitting swap transaction...')
      const hash = await writeContractAsync({
        address: routerAddress,
        abi: routerAbi,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountInParsed,
          BigInt(minAmount),
          path,
          userAddress,
          deadline
        ],
        gas: BigInt(850000)
      })
      
      txHash = hash
      setTxHash && setTxHash(hash)
      console.log('✅ ERC20 to ERC20 swap submitted:', hash)
    }

    return {
      success: true,
      txHash,
      didApprove,
      message: 'Swap completed successfully'
    }

  } catch (error) {
    console.error('❌ Swap failed:', error)
    
    ElMessage({
      message: `Swap failed: ${error.message}`,
      type: 'error',
      duration: 5000,
      showClose: true
    })
    
    return {
      success: false,
      error: error.message,
      txHash,
      didApprove
    }
  }
}