import { parseGwei, parseUnits } from 'viem'
import { Percent } from '@uniswap/sdk-core'
import { ElMessage } from 'element-plus'

// 手动定义 maxUint256
const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

/**
 * Unified doSwaps supporting CP native coin or ERC20 CP token on cp chain.
 * Uses @wagmi/vue hooks for contract interactions
 * 使用精确授权金额来减少钱包警告提示
 */
export async function doSwaps({
  fromToken,
  toToken,
  amountIn,
  slippageInput,
  trade,
  userAddress,
  routerAddress,
  decimals,
  wcpAddress,       // 👈 CP 链上的 Wrapped CP 地址
  nativeSymbol = 'CP', // 👈 原生币符号
  readContractAsync,   // 👈 来自 wagmi 的 readContractAsync
  writeContractAsync,  // 👈 来自 wagmi 的 writeContractAsync
  setTxHash,          // 👈 设置交易哈希的回调
  setApprovalHash,    // 👈 设置授权哈希的回调
  useExactApproval = true // 👈 是否使用精确授权（减少钱包警告）
}) {
  let error = null
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

    console.log('🔄 Starting swap:', {
      from: fromToken.symbol,
      to: toToken.symbol,
      amount: amountIn,
      slippage: slippageInput
    })

    // ✅ 高精度滑点支持：18 位
    const slippageDecimal = Number(slippageInput)
    if (isNaN(slippageDecimal) || slippageDecimal < 0) {
      throw new Error('Invalid slippage input')
    }

    // ✅ 可选：滑点最小限制（防止用户设成0）
    if (slippageDecimal < 0.00000001) {
      throw new Error('Slippage too low, may cause transaction to revert')
    }

    const numerator = BigInt(Math.floor(slippageDecimal * 1e18))
    const slippage = new Percent(numerator.toString(), '1000000000000000000') // 1e18 精度
    const minAmount = trade.minimumAmountOut(slippage).quotient.toString()
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20) // 20 分钟有效

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
        name: 'allowance',
        type: 'function',
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' }
        ],
        outputs: [{ name: '', type: 'uint256' }]
      },
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
       gas:  BigInt(850000)
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
      
      // 检查授权
      try {
        console.log('🔍 Checking allowance...')
        const { data: allowanceResult } = await readContractAsync({
          address: fromTokenAddress,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [userAddress, routerAddress]
        })
        
        const allowance = BigInt(allowanceResult || 0)
        const amountInBigInt = BigInt(amountInParsed)
        
        console.log('💰 Allowance check:', {
          current: allowance.toString(),
          required: amountInBigInt.toString(),
          needsApproval: allowance < amountInBigInt
        })
        
        if (allowance < amountInBigInt) {
          // 根据配置选择授权金额
          const approvalAmount = useExactApproval ? amountInBigInt : maxUint256
          
          console.log('📝 Submitting approval for:', approvalAmount.toString())
          const approveHash = await writeContractAsync({
            address: fromTokenAddress,
            abi: erc20Abi,
            functionName: 'approve',
            args: [routerAddress, approvalAmount],
           gas:  BigInt(850000)
          })
          
          setApprovalHash && setApprovalHash(approveHash)
          didApprove = true
          console.log('✅ Approval submitted:', approveHash)
          
          // 显示授权提示
          ElMessage({
            message: 'Approval submitted, waiting for confirmation...',
            type: 'info',
            duration: 3000,
            showClose: true
          })
        }
      } catch (e) {
        console.error('❌ Approval error:', e)
        if (e.message && e.message.includes('User rejected')) {
          throw new Error('用户取消了授权操作')
        }
        throw new Error('Failed to check/set allowance: ' + (e.message || e))
      }
      
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
       gas:  BigInt(850000)
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
      
      // 检查授权
      try {
        console.log('🔍 Checking allowance...')
        const { data: allowanceResult } = await readContractAsync({
          address: fromTokenAddress,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [userAddress, routerAddress]
        })
        
        const allowance = BigInt(allowanceResult || 0)
        const amountInBigInt = BigInt(amountInParsed)
        
        console.log('💰 Allowance check:', {
          current: allowance.toString(),
          required: amountInBigInt.toString(),
          needsApproval: allowance < amountInBigInt
        })
        
        if (allowance < amountInBigInt) {
          // 根据配置选择授权金额
          const approvalAmount = useExactApproval ? amountInBigInt : maxUint256
          
          console.log('📝 Submitting approval for:', approvalAmount.toString())
          const approveHash = await writeContractAsync({
            address: fromTokenAddress,
            abi: erc20Abi,
            functionName: 'approve',
            args: [routerAddress, approvalAmount],
           gas:  BigInt(850000)
          })
          
          setApprovalHash && setApprovalHash(approveHash)
          didApprove = true
          console.log('✅ Approval submitted:', approveHash)
          
          // 显示授权提示
          ElMessage({
            message: 'Approval submitted, waiting for confirmation...',
            type: 'info',
            duration: 3000,
            showClose: true
          })
        }
      } catch (e) {
        console.error('❌ Approval error:', e)
        if (e.message && e.message.includes('User rejected')) {
          throw new Error('用户取消了授权操作')
        }
        throw new Error('Failed to check/set allowance: ' + (e.message || e))
      }
      
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
       gas:  BigInt(850000)
      })
      
      txHash = hash
      setTxHash && setTxHash(hash)
      console.log('✅ ERC20 to ERC20 swap submitted:', hash)
    }

    console.log('✅ Swap transaction submitted successfully')
    
    return { 
      success: true, 
      txHash, 
      didApprove,
      message: 'Transaction submitted successfully'
    }

  } catch (e) {
    console.error('❌ Swap error details:', {
      message: e.message,
      code: e.code,
      data: e.data,
      fromToken: fromToken?.symbol,
      toToken: toToken?.symbol,
      amountIn
    })
    
    // 根据错误类型显示不同消息
    if (e.message && e.message.includes('User rejected')) {
      ElMessage({
        message: 'User Reject!',
        type: 'warning',
        duration: 2000,
        showClose: true
      })
      error = '用户取消了交易操作'
    } else if (e.message && e.message.includes('insufficient funds')) {
      ElMessage({
        message: 'Insufficient funds!',
        type: 'error',
        duration: 2000,
        showClose: true
      })
      error = '余额不足'
    } else if (e.message && e.message.includes('slippage')) {
      ElMessage({
        message: 'Slippage too high, try increasing slippage tolerance!',
        type: 'error',
        duration: 3000,
        showClose: true
      })
      error = '滑点过高，请增加滑点容忍度'
    } else {
      ElMessage({
        message: 'Swap Fail!',
        type: 'error',
        duration: 2000,
        showClose: true
      })
      error = 'Swap failed: Please try again later!'
    }
    
    return { success: false, error, details: e.message }
  }
}