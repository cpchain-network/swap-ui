import { parseGwei, parseUnits, encodeFunctionData } from 'viem'
import { Percent } from '@uniswap/sdk-core'
import { ElMessage } from 'element-plus'
import { readContract, estimateFeesPerGas, estimateGas, writeContract } from '@wagmi/core'
import { config } from '../../wagmi.ts'

// 手动定义 maxUint256
const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

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
/**
 * 精确的 gas 预估函数
 */
async function computedGas(abi, functionName, args, to, account, value = undefined) {
  try {
    // Calculate gas fees
    const feesPerGas = await estimateFeesPerGas(config)

    // Estimate gas for the transaction
    const gas = await estimateGas(config, {
      data: encodeFunctionData({
        abi,
        functionName,
        args,
      }),
      to: to,
      account: account,
      maxFeePerGas: feesPerGas.maxFeePerGas,
      maxPriorityFeePerGas: feesPerGas.maxPriorityFeePerGas,
      ...(value && { value })
    })

    // 打印预估gas值
    console.log('⛽ Gas Estimation:', {
      functionName,
      estimatedGas: gas.toString(),
      maxFeePerGas: feesPerGas.maxFeePerGas.toString(),
      maxPriorityFeePerGas: feesPerGas.maxPriorityFeePerGas.toString(),
      totalMaxCost: (gas * feesPerGas.maxFeePerGas).toString() + ' wei'
    })

    return {
      gas,
      maxFeePerGas: feesPerGas.maxFeePerGas,
      maxPriorityFeePerGas: feesPerGas.maxPriorityFeePerGas
    }
  } catch (error) {
    console.error('Gas estimation failed:', error)
    // 回退到默认值
    const fallbackGas = {
      gas: BigInt(2000000),
      maxFeePerGas: parseGwei('20'),
      maxPriorityFeePerGas: parseGwei('2')
    }

    console.log('⛽ Gas Estimation (Fallback):', {
      functionName,
      estimatedGas: fallbackGas.gas.toString(),
      maxFeePerGas: fallbackGas.maxFeePerGas.toString(),
      maxPriorityFeePerGas: fallbackGas.maxPriorityFeePerGas.toString(),
      note: 'Using fallback values due to estimation failure'
    })

    return fallbackGas
  }
}

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

      // 精确 gas 预估
      console.log('⛽ Estimating gas for Native to Token swap...')
      const gasEstimate = await computedGas(
        routerAbi,
        'swapExactETHForTokens',
        [BigInt(minAmount), path, userAddress, deadline],
        routerAddress,
        userAddress,
        amountInParsed
      )

      const hash = await writeContract(config, {
        abi: routerAbi,
        address: routerAddress,
        functionName: 'swapExactETHForTokens',
        args: [
          BigInt(minAmount),
          path,
          userAddress,
          deadline
        ],
        value: amountInParsed,
        gas: gasEstimate.gas,
        maxFeePerGas: gasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: gasEstimate.maxPriorityFeePerGas
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
        const allowanceResult = await readContract(config, {
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

          // 精确 gas 预估 - 授权
          console.log('⛽ Estimating gas for Token approval...')
          const approveGasEstimate = await computedGas(
            erc20Abi,
            'approve',
            [routerAddress, approvalAmount],
            fromTokenAddress,
            userAddress
          )

          const approveHash = await writeContract(config, {
            abi: erc20Abi,
            address: fromTokenAddress,
            functionName: 'approve',
            args: [routerAddress, approvalAmount],
            gas: approveGasEstimate.gas,
            maxFeePerGas: approveGasEstimate.maxFeePerGas,
            maxPriorityFeePerGas: approveGasEstimate.maxPriorityFeePerGas
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
          throw new Error('User cancelled the authorization operation')
        }
        throw new Error('Failed to check/set allowance: ' + (e.message || e))
      }

      // 执行交换
      console.log('🔄 Submitting swap transaction...')

      // 精确 gas 预估 - 交换
      console.log('⛽ Estimating gas for Token to Native swap...')
      const swapGasEstimate = await computedGas(
        routerAbi,
        'swapExactTokensForETH',
        [amountInParsed, BigInt(minAmount), path, userAddress, deadline],
        routerAddress,
        userAddress
      )

      const hash = await writeContract(config, {
        abi: routerAbi,
        address: routerAddress,
        functionName: 'swapExactTokensForETH',
        args: [
          amountInParsed,
          BigInt(minAmount),
          path,
          userAddress,
          deadline
        ],
        gas: swapGasEstimate.gas,
        maxFeePerGas: swapGasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: swapGasEstimate.maxPriorityFeePerGas
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
        const allowanceResult = await readContract(config, {
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

          // 精确 gas 预估 - 授权
          console.log('⛽ Estimating gas for ERC20 approval...')
          const approveGasEstimate = await computedGas(
            erc20Abi,
            'approve',
            [routerAddress, approvalAmount],
            fromTokenAddress,
            userAddress
          )

          const approveHash = await writeContract(config, {
            abi: erc20Abi,
            address: fromTokenAddress,
            functionName: 'approve',
            args: [routerAddress, approvalAmount],
            gas: approveGasEstimate.gas,
            maxFeePerGas: approveGasEstimate.maxFeePerGas,
            maxPriorityFeePerGas: approveGasEstimate.maxPriorityFeePerGas
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
          throw new Error('User cancelled the authorization operation')
        }
        throw new Error('Failed to check/set allowance: ' + (e.message || e))
      }

      // 执行交换
      console.log('🔄 Submitting swap transaction...')

      // 精确 gas 预估 - 交换
      console.log('⛽ Estimating gas for ERC20 to ERC20 swap...')
      const swapGasEstimate = await computedGas(
        routerAbi,
        'swapExactTokensForTokens',
        [amountInParsed, BigInt(minAmount), path, userAddress, deadline],
        routerAddress,
        userAddress
      )

      const hash = await writeContract(config, {
        abi: routerAbi,
        address: routerAddress,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountInParsed,
          BigInt(minAmount),
          path,
          userAddress,
          deadline
        ],
        gas: swapGasEstimate.gas,
        maxFeePerGas: swapGasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: swapGasEstimate.maxPriorityFeePerGas
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
      error = 'User cancelled the transaction operation'
    } else if (e.message && e.message.includes('insufficient funds')) {
      ElMessage({
        message: 'Insufficient funds!',
        type: 'error',
        duration: 2000,
        showClose: true
      })
      error = 'Insufficient balance'
    } else if (e.message && e.message.includes('slippage')) {
      ElMessage({
        message: 'Slippage too high, try increasing slippage tolerance!',
        type: 'error',
        duration: 3000,
        showClose: true
      })
      error = 'Slippage too high, please increase slippage tolerance'
    }
    else if (e.message && e.message.includes('User cancelled the authorization operation')) {
      ElMessage({
        message: 'User Reject!',
        type: 'warning',
        duration: 2000,
        showClose: true
      })
      error = 'User cancelled the transaction operation'
    }
    else {
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