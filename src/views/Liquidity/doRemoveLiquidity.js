import { parseUnits, formatUnits, encodeFunctionData } from 'viem'
import { ElMessage } from 'element-plus'
import { readContract, estimateFeesPerGas, estimateGas, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '../../wagmi.ts'

// Router ABI - 删除流动性相关函数
const routerAbi = [
  {
    name: 'removeLiquidity',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
      { name: 'liquidity', type: 'uint256' },
      { name: 'amountAMin', type: 'uint256' },
      { name: 'amountBMin', type: 'uint256' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' }
    ],
    outputs: [
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' }
    ]
  },
  {
    name: 'removeLiquidityETH',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'liquidity', type: 'uint256' },
      { name: 'amountTokenMin', type: 'uint256' },
      { name: 'amountETHMin', type: 'uint256' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' }
    ],
    outputs: [
      { name: 'amountToken', type: 'uint256' },
      { name: 'amountETH', type: 'uint256' }
    ]
  },
  {
    name: 'factory',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '', type: 'address' }
    ]
  }
]

// ERC20 ABI - 代币操作相关函数
const erc20Abi = [
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }]
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  }
]

// Pair ABI - LP Token 相关函数
const pairAbi = [
  {
    name: 'getReserves',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'reserve0', type: 'uint112' },
      { name: 'reserve1', type: 'uint112' },
      { name: 'blockTimestampLast', type: 'uint32' }
    ]
  },
  {
    name: 'token0',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    name: 'token1',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  }
]

/**
 * Gas 估算函数
 * @param {Array} abi - 合约 ABI
 * @param {string} functionName - 函数名
 * @param {Array} args - 函数参数
 * @param {string} to - 合约地址
 * @param {string} account - 用户地址
 * @param {bigint} value - 发送的 ETH 数量（可选）
 * @returns {Promise<Object>} Gas 估算结果
 */
async function computedGas(abi, functionName, args, to, account, value = undefined) {
  try {
    console.log('🔍 Estimating gas for:', { functionName, to, account, value: value?.toString() })

    // 1. 估算 Gas 费用
    const feeData = await estimateFeesPerGas(config)
    
    // 2. 估算 Gas 用量
    const gasEstimate = await estimateGas(config, {
      to,
      account,
      data: encodeFunctionData({
        abi,
        functionName,
        args
      }),
      value
    })

    const result = {
      gas: gasEstimate,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    }

    console.log('⛽ Gas estimate:', result)
    return result
  } catch (error) {
    console.error('❌ Gas estimation failed:', error)
    throw new Error('Gas 估算失败: ' + (error.message || error))
  }
}

/**
 * 检查 LP Token 余额
 * @param {string} pairAddress - LP Token 合约地址
 * @param {string} userAddress - 用户地址
 * @param {bigint} amount - 需要的数量
 * @returns {Promise<boolean>} 余额是否足够
 */
async function checkLPTokenBalance(pairAddress, userAddress, amount) {
  try {
    const balance = await readContract(config, {
      address: pairAddress,
      abi: pairAbi,
      functionName: 'balanceOf',
      args: [userAddress]
    })

    const hasEnough = BigInt(balance) >= BigInt(amount)
    console.log('💰 LP Token balance check:', {
      pair: pairAddress,
      balance: balance.toString(),
      required: amount.toString(),
      hasEnough
    })

    return hasEnough
  } catch (error) {
    console.error('❌ LP Token balance check failed:', error)
    return false
  }
}

/**
 * 获取流动性池储备量
 * @param {string} pairAddress - LP Token 合约地址
 * @returns {Promise<Object>} 储备量信息
 */
async function getPoolReserves(pairAddress) {
  try {
    const [reserves, token0Address, token1Address] = await Promise.all([
      readContract(config, {
        address: pairAddress,
        abi: pairAbi,
        functionName: 'getReserves'
      }),
      readContract(config, {
        address: pairAddress,
        abi: pairAbi,
        functionName: 'token0'
      }),
      readContract(config, {
        address: pairAddress,
        abi: pairAbi,
        functionName: 'token1'
      })
    ])

    return {
      reserve0: reserves[0],
      reserve1: reserves[1],
      token0: token0Address,
      token1: token1Address
    }
  } catch (error) {
    console.error('❌ Get pool reserves failed:', error)
    throw new Error('获取流动性池储备量失败')
  }
}

/**
 * 计算删除流动性后能获得的代币数量
 * @param {bigint} liquidity - LP Token 数量
 * @param {bigint} totalSupply - LP Token 总供给量
 * @param {bigint} reserve0 - 代币0储备量
 * @param {bigint} reserve1 - 代币1储备量
 * @returns {Object} 预期获得的代币数量
 */
function calculateRemoveAmounts(liquidity, totalSupply, reserve0, reserve1) {
  try {
    if (totalSupply === 0n) {
      return { amount0: 0n, amount1: 0n }
    }

    const amount0 = (liquidity * reserve0) / totalSupply
    const amount1 = (liquidity * reserve1) / totalSupply

    console.log('📊 Remove liquidity calculation:', {
      liquidity: liquidity.toString(),
      totalSupply: totalSupply.toString(),
      reserve0: reserve0.toString(),
      reserve1: reserve1.toString(),
      amount0: amount0.toString(),
      amount1: amount1.toString()
    })

    return { amount0, amount1 }
  } catch (error) {
    console.error('❌ Calculate remove amounts failed:', error)
    return { amount0: 0n, amount1: 0n }
  }
}

/**
 * 检查并授权 LP Token
 * @param {string} pairAddress - LP Token 合约地址
 * @param {string} userAddress - 用户地址
 * @param {string} routerAddress - 路由器地址
 * @param {bigint} amount - 需要授权的数量
 * @param {Function} setApprovalHash - 设置授权哈希的回调
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Object>} 授权结果
 */
async function checkAndApproveLPToken(pairAddress, userAddress, routerAddress, amount, setApprovalHash, onProgress) {
  try {
    console.log('🔍 Checking LP Token allowance...')
    onProgress && onProgress('approval_check', '检查 LP Token 授权状态...')
    
    // 1. 检查当前授权额度
    const allowanceResult = await readContract(config, {
      address: pairAddress,
      abi: pairAbi,
      functionName: 'allowance',
      args: [userAddress, routerAddress]
    })

    const allowance = BigInt(allowanceResult || 0)
    const amountBN = BigInt(amount)

    console.log('💰 LP Token allowance check:', {
      current: allowance.toString(),
      required: amountBN.toString(),
      needsApproval: allowance < amountBN
    })

    // 2. 如果授权不足，进行授权
    if (allowance < amountBN) {
      console.log('📝 Submitting LP Token approval for:', amountBN.toString())
      onProgress && onProgress('approval_pending', '正在授权 LP Token...')

      // 3. 估算授权交易的 Gas
      const approveGasEstimate = await computedGas(
        pairAbi,
        'approve',
        [routerAddress, amountBN],
        pairAddress,
        userAddress
      )

      // 4. 提交授权交易
      const approveHash = await writeContract(config, {
        abi: pairAbi,
        address: pairAddress,
        functionName: 'approve',
        args: [routerAddress, amountBN],
        gas: approveGasEstimate.gas,
        maxFeePerGas: approveGasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: approveGasEstimate.maxPriorityFeePerGas
      })

      setApprovalHash && setApprovalHash(approveHash)
      console.log('✅ LP Token approval submitted:', approveHash)

      // 显示授权提示
      ElMessage({
        message: 'LP Token 授权已提交，等待确认...',
        type: 'info',
        duration: 3000,
        showClose: true
      })

      onProgress && onProgress('approval_confirming', '等待 LP Token 授权确认...')

      // 等待授权交易确认
      console.log('⏳ Waiting for LP Token approval confirmation...')
      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approveHash,
        timeout: 60000 // 60秒超时
      })

      if (approvalReceipt.status !== 'success') {
        throw new Error('LP Token 授权交易失败')
      }

      console.log('✅ LP Token approval confirmed:', approvalReceipt.transactionHash)
      ElMessage({
        message: 'LP Token 授权确认成功',
        type: 'success',
        duration: 2000
      })

      onProgress && onProgress('approval_success', 'LP Token 授权成功')

      return { approved: true, hash: approveHash }
    }

    onProgress && onProgress('approval_sufficient', 'LP Token 授权充足，无需重新授权')
    return { approved: false, hash: null }
  } catch (error) {
    console.error('❌ LP Token approval error:', error)
    onProgress && onProgress('approval_error', `LP Token 授权失败: ${error.message}`)
    
    if (error.message && error.message.includes('User rejected')) {
      throw new Error('用户取消了授权操作')
    }
    throw new Error('LP Token 授权失败: ' + (error.message || error))
  }
}

/**
 * 删除流动性主函数
 * @param {Object} params - 参数对象
 * @param {Object} params.tokenA - 代币A对象 (包含 address, symbol, decimals)
 * @param {Object} params.tokenB - 代币B对象 (包含 address, symbol, decimals)
 * @param {string} params.pairAddress - LP Token 合约地址
 * @param {string} params.liquidityAmount - LP Token 数量（用户输入格式）
 * @param {number} params.slippageInput - 滑点容忍度（百分比，如 0.5 表示 0.5%）
 * @param {string} params.userAddress - 用户钱包地址
 * @param {string} params.routerAddress - 路由器合约地址
 * @param {string} params.wcpAddress - Wrapped CP 地址
 * @param {string} [params.nativeSymbol='CP'] - 原生币符号
 * @param {Function} [params.setTxHash] - 设置交易哈希的回调
 * @param {Function} [params.setApprovalHash] - 设置授权哈希的回调
 * @param {Function} [params.onProgress] - 进度回调函数
 * @returns {Promise<Object>} 交易结果
 */
export async function doRemoveLiquidity({
  tokenA,
  tokenB,
  pairAddress,
  liquidityAmount,
  slippageInput = 0.5,
  userAddress,
  routerAddress,
  wcpAddress,
  nativeSymbol = 'CP',
  setTxHash,
  setApprovalHash,
  onProgress
}) {
  let txHash = null
  let error = null
  let didApprove = false
  let approvalHash = null
  let expectedAmounts = { amount0: 0n, amount1: 0n }

  // 进度更新函数
  const updateProgress = (stage, message, data = {}) => {
    console.log(`📊 Progress [${stage}]:`, message, data)
    onProgress && onProgress(stage, message, data)
  }

  try {
    console.log('🚀 Starting remove liquidity process...')
    updateProgress('start', '开始删除流动性...')

    // 1. 参数验证
    if (!userAddress || !routerAddress || !pairAddress) throw new Error('参数不完整')
    if (!tokenA || !tokenB) throw new Error('代币信息不完整')
    if (!liquidityAmount || liquidityAmount === '0') throw new Error('请输入有效的 LP Token 数量')

    console.log('📋 Remove liquidity params:', {
      tokenA: { symbol: tokenA.symbol, address: tokenA.address },
      tokenB: { symbol: tokenB.symbol, address: tokenB.address },
      pairAddress,
      liquidityAmount,
      slippageInput,
      userAddress,
      routerAddress
    })

    // 2. 滑点计算和验证
    const slippageBN = BigInt(Math.floor(slippageInput * 100)) // 转换为基点
    if (slippageBN < 1n || slippageBN > 5000n) { // 0.01% 到 50%
      throw new Error('滑点设置无效，请设置在 0.01% 到 50% 之间')
    }

    console.log('📊 Slippage settings:', {
      input: slippageInput,
      basisPoints: slippageBN.toString()
    })

    // 3. 解析 LP Token 数量（LP Token 通常是 18 位精度）
    const liquidityParsed = parseUnits(liquidityAmount.toString(), 18)

    console.log('💰 Parsed liquidity amount:', {
      liquidity: liquidityParsed.toString()
    })

    // 4. 检查 LP Token 余额
    updateProgress('validation', '验证 LP Token 余额...')
    
    const balanceCheck = await checkLPTokenBalance(
      pairAddress,
      userAddress,
      liquidityParsed
    )

    if (!balanceCheck) {
      throw new Error('LP Token 余额不足')
    }

    // 5. 获取流动性池信息
    updateProgress('pool_info', '获取流动性池信息...')
    
    const [poolReserves, totalSupply] = await Promise.all([
      getPoolReserves(pairAddress),
      readContract(config, {
        address: pairAddress,
        abi: pairAbi,
        functionName: 'totalSupply'
      })
    ])

    console.log('🏊 Pool info:', {
      reserves: {
        reserve0: poolReserves.reserve0.toString(),
        reserve1: poolReserves.reserve1.toString(),
        token0: poolReserves.token0,
        token1: poolReserves.token1
      },
      totalSupply: totalSupply.toString()
    })

    // 6. 计算预期获得的代币数量
    expectedAmounts = calculateRemoveAmounts(
      liquidityParsed,
      totalSupply,
      poolReserves.reserve0,
      poolReserves.reserve1
    )

    // 7. 确定代币顺序（token0 对应 tokenA 还是 tokenB）
    const getTokenAddress = (token) => {
      if (token.symbol === nativeSymbol) {
        return wcpAddress // 原生币使用 WETH 地址
      }
      return token.address
    }

    const tokenAAddress = getTokenAddress(tokenA)
    const tokenBAddress = getTokenAddress(tokenB)
    
    // 确定代币在池子中的顺序
    const isTokenAFirst = tokenAAddress.toLowerCase() === poolReserves.token0.toLowerCase()
    const amountAExpected = isTokenAFirst ? expectedAmounts.amount0 : expectedAmounts.amount1
    const amountBExpected = isTokenAFirst ? expectedAmounts.amount1 : expectedAmounts.amount0

    console.log('🔄 Token order analysis:', {
      tokenA: { symbol: tokenA.symbol, address: tokenAAddress, isFirst: isTokenAFirst },
      tokenB: { symbol: tokenB.symbol, address: tokenBAddress, isFirst: !isTokenAFirst },
      expectedAmounts: {
        amountA: amountAExpected.toString(),
        amountB: amountBExpected.toString()
      }
    })

    // 8. 计算最小接受数量（考虑滑点）
    const amountAMinBN = (amountAExpected * (10000n - slippageBN)) / 10000n
    const amountBMinBN = (amountBExpected * (10000n - slippageBN)) / 10000n

    console.log('📉 Minimum amounts (with slippage):', {
      amountAMin: amountAMinBN.toString(),
      amountBMin: amountBMinBN.toString()
    })

    // 9. 设置交易截止时间（15分钟后）
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 900)

    // 10. 判断流动性类型
    const isNativeA = tokenA.symbol === nativeSymbol
    const isNativeB = tokenB.symbol === nativeSymbol
    const hasNative = isNativeA || isNativeB

    console.log('🔍 Liquidity type analysis:', {
      isNativeA,
      isNativeB,
      hasNative,
      type: hasNative ? 'Native + ERC20' : 'ERC20 + ERC20'
    })

    // 11. 检查并授权 LP Token
    updateProgress('approval', '检查 LP Token 授权...')

    const approvalResult = await checkAndApproveLPToken(
      pairAddress,
      userAddress,
      routerAddress,
      liquidityParsed,
      setApprovalHash,
      updateProgress
    )

    if (approvalResult.approved) {
      didApprove = true
      approvalHash = approvalResult.hash
    }

    updateProgress('transaction', '提交删除流动性交易...')

    let hash

    if (hasNative) {
      // Native + ERC20 流动性删除
      console.log('🔄 Processing Native + ERC20 liquidity removal')
      const erc20Token = isNativeA ? tokenB : tokenA
      const tokenAmountMin = isNativeA ? amountBMinBN : amountAMinBN
      const nativeAmountMin = isNativeA ? amountAMinBN : amountBMinBN

      console.log('📋 Native + ERC20 remove params:', {
        erc20Token: { symbol: erc20Token.symbol, address: erc20Token.address },
        liquidity: liquidityParsed.toString(),
        tokenAmountMin: tokenAmountMin.toString(),
        nativeAmountMin: nativeAmountMin.toString()
      })

      // 执行删除流动性
      console.log('🔄 Submitting remove liquidity ETH transaction...')
      const removeLiquidityGasEstimate = await computedGas(
        routerAbi,
        'removeLiquidityETH',
        [erc20Token.address, liquidityParsed, tokenAmountMin, nativeAmountMin, userAddress, deadline],
        routerAddress,
        userAddress
      )

      hash = await writeContract(config, {
        abi: routerAbi,
        address: routerAddress,
        functionName: 'removeLiquidityETH',
        args: [
          erc20Token.address,
          liquidityParsed,
          tokenAmountMin,
          nativeAmountMin,
          userAddress,
          deadline
        ],
        gas: removeLiquidityGasEstimate.gas,
        maxFeePerGas: removeLiquidityGasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: removeLiquidityGasEstimate.maxPriorityFeePerGas
      })

      txHash = hash
      setTxHash && setTxHash(hash)
      console.log('✅ Native + Token liquidity removal submitted:', hash)
    }
    else {
      // ERC20 + ERC20 流动性删除
      console.log('🔄 Processing ERC20 + ERC20 liquidity removal')

      console.log('📋 ERC20 + ERC20 remove params:', {
        tokenA: { symbol: tokenA.symbol, address: tokenAAddress },
        tokenB: { symbol: tokenB.symbol, address: tokenBAddress },
        liquidity: liquidityParsed.toString(),
        amountAMin: amountAMinBN.toString(),
        amountBMin: amountBMinBN.toString()
      })

      // 执行删除流动性
      console.log('🔄 Submitting remove liquidity transaction...')
      const removeLiquidityGasEstimate = await computedGas(
        routerAbi,
        'removeLiquidity',
        [tokenAAddress, tokenBAddress, liquidityParsed, amountAMinBN, amountBMinBN, userAddress, deadline],
        routerAddress,
        userAddress
      )

      hash = await writeContract(config, {
        abi: routerAbi,
        address: routerAddress,
        functionName: 'removeLiquidity',
        args: [
          tokenAAddress,
          tokenBAddress,
          liquidityParsed,
          amountAMinBN,
          amountBMinBN,
          userAddress,
          deadline
        ],
        gas: removeLiquidityGasEstimate.gas,
        maxFeePerGas: removeLiquidityGasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: removeLiquidityGasEstimate.maxPriorityFeePerGas
      })

      txHash = hash
      setTxHash && setTxHash(hash)
      console.log('✅ ERC20 + ERC20 liquidity removal submitted:', hash)
    }

    // 等待交易确认
    updateProgress('pending', '等待交易确认...', { txHash })
    console.log('⏳ Waiting for transaction confirmation:', txHash)

    const receipt = await waitForTransactionReceipt(config, {
      hash: txHash,
      timeout: 120000 // 2分钟超时
    })

    if (receipt.status === 'success') {
      updateProgress('success', '交易确认成功', { 
        txHash,
        expectedAmounts: {
          amountA: formatUnits(amountAExpected, tokenA.decimals),
          amountB: formatUnits(amountBExpected, tokenB.decimals)
        },
        gasUsed: receipt.gasUsed?.toString()
      })
      console.log('✅ Transaction confirmed successfully:', receipt.transactionHash)
      
      // 显示成功提示
      ElMessage({
        message: '删除流动性成功！',
        type: 'success',
        duration: 5000,
        showClose: true
      })

      return {
        success: true,
        transactionHash: txHash,
        receipt,
        approvalHash,
        didApprove,
        expectedAmounts: {
          amountA: formatUnits(amountAExpected, tokenA.decimals),
          amountB: formatUnits(amountBExpected, tokenB.decimals)
        },
        error: null
      }
    } else {
      throw new Error('交易执行失败')
    }

  } catch (e) {
    console.error('❌ Remove liquidity failed:', e)
    error = e

    updateProgress('error', '交易失败', { error: e.message })

    // 提供更友好的错误信息
    let errorMessage = e.message
    if (e.message && e.message.includes('User rejected')) {
      errorMessage = '用户取消了交易'
    } else if (e.message && e.message.includes('insufficient funds')) {
      errorMessage = '余额不足'
    } else if (e.message && e.message.includes('INSUFFICIENT_LIQUIDITY_BURNED')) {
      errorMessage = 'LP Token 数量不足'
    } else if (e.message && e.message.includes('INSUFFICIENT_A_AMOUNT')) {
      errorMessage = '代币A数量不足，请调整滑点'
    } else if (e.message && e.message.includes('INSUFFICIENT_B_AMOUNT')) {
      errorMessage = '代币B数量不足，请调整滑点'
    } else if (e.message && e.message.includes('EXPIRED')) {
      errorMessage = '交易已过期，请重试'
    } else if (e.message && e.message.includes('timeout')) {
      errorMessage = '交易确认超时，请检查区块链浏览器'
    } else if (e.message && e.message.includes('Gas estimation failed')) {
      errorMessage = 'Gas 估算失败，请检查网络连接或合约地址'
    }

    // 显示错误提示
    ElMessage({
      message: errorMessage,
      type: 'error',
      duration: 5000,
      showClose: true
    })

    return {
      success: false,
      transactionHash: txHash,
      receipt: null,
      approvalHash,
      didApprove,
      expectedAmounts: {
        amountA: '0',
        amountB: '0'
      },
      error: errorMessage
    }
  }
}

export default doRemoveLiquidity