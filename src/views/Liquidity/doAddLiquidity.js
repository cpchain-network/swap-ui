import { parseUnits, encodeFunctionData } from 'viem'
import { ElMessage } from 'element-plus'
import { readContract, estimateFeesPerGas, estimateGas, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '../../wagmi.ts'

// Router ABI - 添加流动性相关函数
const routerAbi = [
  {
    name: 'addLiquidity',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
      { name: 'amountADesired', type: 'uint256' },
      { name: 'amountBDesired', type: 'uint256' },
      { name: 'amountAMin', type: 'uint256' },
      { name: 'amountBMin', type: 'uint256' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' }
    ],
    outputs: [
      { name: 'amountA', type: 'uint256' },
      { name: 'amountB', type: 'uint256' },
      { name: 'liquidity', type: 'uint256' }
    ]
  },
  {
    name: 'addLiquidityETH',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amountTokenDesired', type: 'uint256' },
      { name: 'amountTokenMin', type: 'uint256' },
      { name: 'amountETHMin', type: 'uint256' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' }
    ],
    outputs: [
      { name: 'amountToken', type: 'uint256' },
      { name: 'amountETH', type: 'uint256' },
      { name: 'liquidity', type: 'uint256' }
    ]
  },
  {
    name: 'getAmountsOut',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'path', type: 'address[]' }
    ],
    outputs: [
      { name: 'amounts', type: 'uint256[]' }
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
  },
  {
    name: 'WETH',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '', type: 'address' }
    ]
  },
  {
    name: 'getPair',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' }
    ],
    outputs: [
      { name: 'pair', type: 'address' }
    ]
  },
  {
    name: 'quote',
    type: 'function',
    stateMutability: 'pure',
    inputs: [
      { name: 'amountA', type: 'uint256' },
      { name: 'reserveA', type: 'uint256' },
      { name: 'reserveB', type: 'uint256' }
    ],
    outputs: [
      { name: 'amountB', type: 'uint256' }
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
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
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
 * 检查代币余额
 * @param {string} tokenAddress - 代币合约地址
 * @param {string} userAddress - 用户地址
 * @param {bigint} amount - 需要的数量
 * @param {boolean} isNative - 是否为原生币
 * @returns {Promise<boolean>} 余额是否足够
 */
async function checkTokenBalance(tokenAddress, userAddress, amount, isNative = false) {
  try {
    let balance
    
    if (isNative) {
      // 检查原生币余额（通过 wagmi 的 getBalance）
      const { getBalance } = await import('@wagmi/core')
      const balanceResult = await getBalance(config, { address: userAddress })
      balance = balanceResult.value
    } else {
      // 检查 ERC20 代币余额
      balance = await readContract(config, {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [userAddress]
      })
    }

    const hasEnough = BigInt(balance) >= BigInt(amount)
    console.log('💰 Balance check:', {
      token: tokenAddress,
      balance: balance.toString(),
      required: amount.toString(),
      hasEnough
    })

    return hasEnough
  } catch (error) {
    console.error('❌ Balance check failed:', error)
    return false
  }
}

/**
 * 检查流动性池是否存在
 * @param {string} factoryAddress - Factory 合约地址
 * @param {string} tokenA - 代币A地址
 * @param {string} tokenB - 代币B地址
 * @returns {Promise<Object>} 流动性池信息
 */
async function checkLiquidityPool(factoryAddress, tokenA, tokenB) {
  try {
    const factoryAbi = [
      {
        name: 'getPair',
        type: 'function',
        stateMutability: 'view',
        inputs: [
          { name: 'tokenA', type: 'address' },
          { name: 'tokenB', type: 'address' }
        ],
        outputs: [
          { name: 'pair', type: 'address' }
        ]
      }
    ]

    const pairAddress = await readContract(config, {
      address: factoryAddress,
      abi: factoryAbi,
      functionName: 'getPair',
      args: [tokenA, tokenB]
    })

    const exists = pairAddress !== '0x0000000000000000000000000000000000000000'
    
    console.log('🏊 Liquidity pool check:', {
      tokenA,
      tokenB,
      pairAddress,
      exists
    })

    return { exists, pairAddress }
  } catch (error) {
    console.error('❌ Pool check failed:', error)
    return { exists: false, pairAddress: null }
  }
}

/**
 * 检查并授权代币（精确授权）
 * @param {string} tokenAddress - 代币合约地址
 * @param {string} tokenSymbol - 代币符号
 * @param {string} userAddress - 用户地址
 * @param {string} routerAddress - 路由器地址
 * @param {bigint} amount - 需要授权的精确数量
 * @param {Function} setApprovalHash - 设置授权哈希的回调
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Object>} 授权结果
 */
async function checkAndApproveToken(tokenAddress, tokenSymbol, userAddress, routerAddress, amount, setApprovalHash, onProgress) {
  try {
    console.log(`🔍 Checking ${tokenSymbol} allowance...`)
    onProgress && onProgress('approval_check', `检查 ${tokenSymbol} 授权状态...`)
    
    // 1. 检查当前授权额度
    const allowanceResult = await readContract(config, {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [userAddress, routerAddress]
    })

    const allowance = BigInt(allowanceResult || 0)
    const amountBN = BigInt(amount)

    console.log(`💰 ${tokenSymbol} allowance check:`, {
      current: allowance.toString(),
      required: amountBN.toString(),
      needsApproval: allowance < amountBN
    })

    // 2. 如果授权不足，进行精确授权
    if (allowance < amountBN) {
      console.log(`📝 Submitting ${tokenSymbol} exact approval for:`, amountBN.toString())
      onProgress && onProgress('approval_pending', `正在授权 ${tokenSymbol}...`)

      // 3. 估算授权交易的 Gas
      const approveGasEstimate = await computedGas(
        erc20Abi,
        'approve',
        [routerAddress, amountBN], // 使用精确金额
        tokenAddress,
        userAddress
      )

      // 4. 提交精确授权交易
      const approveHash = await writeContract(config, {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: 'approve',
        args: [routerAddress, amountBN], // 精确授权金额
        gas: approveGasEstimate.gas,
        maxFeePerGas: approveGasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: approveGasEstimate.maxPriorityFeePerGas
      })

      setApprovalHash && setApprovalHash(approveHash)
      console.log(`✅ ${tokenSymbol} exact approval submitted:`, approveHash)

      // 显示授权提示
      ElMessage({
        message: `${tokenSymbol} 授权已提交，等待确认...`,
        type: 'info',
        duration: 3000,
        showClose: true
      })

      onProgress && onProgress('approval_confirming', `等待 ${tokenSymbol} 授权确认...`)

      // 🔥 等待授权交易确认
      console.log(`⏳ Waiting for ${tokenSymbol} approval confirmation...`)
      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approveHash,
        timeout: 60000 // 60秒超时
      })

      if (approvalReceipt.status !== 'success') {
        throw new Error(`${tokenSymbol} 授权交易失败`)
      }

      console.log(`✅ ${tokenSymbol} approval confirmed:`, approvalReceipt.transactionHash)
      ElMessage({
        message: `${tokenSymbol} 授权确认成功`,
        type: 'success',
        duration: 2000
      })

      onProgress && onProgress('approval_success', `${tokenSymbol} 授权成功`)

      return { approved: true, hash: approveHash }
    }

    onProgress && onProgress('approval_sufficient', `${tokenSymbol} 授权充足，无需重新授权`)
    return { approved: false, hash: null }
  } catch (error) {
    console.error(`❌ ${tokenSymbol} approval error:`, error)
    onProgress && onProgress('approval_error', `${tokenSymbol} 授权失败: ${error.message}`)
    
    if (error.message && error.message.includes('User rejected')) {
      throw new Error('用户取消了授权操作')
    }
    throw new Error(`${tokenSymbol} 授权失败: ` + (error.message || error))
  }
}

/**
 * 计算价格影响
 * @param {bigint} amountA - 代币A数量
 * @param {bigint} amountB - 代币B数量
 * @param {bigint} reserveA - 代币A储备量
 * @param {bigint} reserveB - 代币B储备量
 * @returns {number} 价格影响百分比
 */
function calculatePriceImpact(amountA, amountB, reserveA, reserveB) {
  try {
    if (reserveA === 0n || reserveB === 0n) {
      return 0 // 新池子没有价格影响
    }

    const currentPrice = (reserveB * 1000000n) / reserveA
    const newReserveA = reserveA + amountA
    const newReserveB = reserveB + amountB
    const newPrice = (newReserveB * 1000000n) / newReserveA
    
    const priceImpact = Number((currentPrice - newPrice) * 10000n / currentPrice) / 100
    
    console.log('📊 Price impact calculation:', {
      currentPrice: currentPrice.toString(),
      newPrice: newPrice.toString(),
      priceImpact: priceImpact.toFixed(2) + '%'
    })

    return Math.abs(priceImpact)
  } catch (error) {
    console.error('❌ Price impact calculation failed:', error)
    return 0
  }
}

/**
 * 添加流动性主函数
 * @param {Object} params - 参数对象
 * @param {Object} params.tokenA - 代币A对象 (包含 address, symbol, decimals)
 * @param {Object} params.tokenB - 代币B对象 (包含 address, symbol, decimals)
 * @param {string} params.amountA - 代币A数量（用户输入格式）
 * @param {string} params.amountB - 代币B数量（用户输入格式）
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
export async function doAddLiquidity({
  tokenA,
  tokenB,
  amountA,
  amountB,
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
  const approvalHashes = []
  let priceImpact = 0

  // 进度更新函数
  const updateProgress = (stage, message, data = {}) => {
    console.log(`📊 Progress [${stage}]:`, message, data)
    onProgress && onProgress(stage, message, data)
  }

  try {
    console.log('🚀 Starting add liquidity process...')
    updateProgress('start', '开始添加流动性...')

    // 1. 参数验证
    if (!userAddress || !routerAddress) throw new Error('Incomplete params')
    if (!tokenA || !tokenB) throw new Error('代币信息不完整')
    if (!amountA || !amountB) throw new Error('请输入有效的数量')

    console.log('📋 Add liquidity params:', {
      tokenA: { symbol: tokenA.symbol, address: tokenA.address },
      tokenB: { symbol: tokenB.symbol, address: tokenB.address },
      amountA,
      amountB,
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

    // 3. 解析金额
    const amountAParsed = parseUnits(amountA.toString(), tokenA.decimals)
    const amountBParsed = parseUnits(amountB.toString(), tokenB.decimals)

    console.log('💰 Parsed amounts:', {
      amountA: amountAParsed.toString(),
      amountB: amountBParsed.toString()
    })

    // 4. 计算最小接受数量（考虑滑点）
    const amountAMinBN = (amountAParsed * (10000n - slippageBN)) / 10000n
    const amountBMinBN = (amountBParsed * (10000n - slippageBN)) / 10000n

    console.log('📉 Minimum amounts (with slippage):', {
      amountAMin: amountAMinBN.toString(),
      amountBMin: amountBMinBN.toString()
    })

    // 5. 设置交易截止时间（15分钟后）
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 900)

    // 6. 获取代币地址的辅助函数
    const getTokenAddress = (token) => {
      if (token.symbol === nativeSymbol) {
        return wcpAddress // 原生币使用 WETH 地址
      }
      return token.address
    }

    // 7. 判断流动性类型
    const isNativeA = tokenA.symbol === nativeSymbol
    const isNativeB = tokenB.symbol === nativeSymbol
    const hasNative = isNativeA || isNativeB

    console.log('🔍 Liquidity type analysis:', {
      isNativeA,
      isNativeB,
      hasNative,
      type: hasNative ? 'Native + ERC20' : 'ERC20 + ERC20'
    })

    // 8. 检查流动性池（可选）
    try {
      const factoryAddress = await readContract(config, {
        address: routerAddress,
        abi: routerAbi,
        functionName: 'factory'
      })
      
      const poolInfo = await checkLiquidityPool(
        factoryAddress,
        getTokenAddress(tokenA),
        getTokenAddress(tokenB)
      )
      
      updateProgress('pool_check', poolInfo.exists ? '流动性池已存在' : '将创建新的流动性池', poolInfo)
    } catch (error) {
      console.warn('⚠️ Pool check failed, continuing...', error)
    }

    // 9. 余额验证
    updateProgress('validation', '验证代币余额...')
    
    const balanceCheckA = await checkTokenBalance(
      getTokenAddress(tokenA),
      userAddress,
      amountAParsed,
      isNativeA
    )
    
    const balanceCheckB = await checkTokenBalance(
      getTokenAddress(tokenB),
      userAddress,
      amountBParsed,
      isNativeB
    )

    if (!balanceCheckA) {
      throw new Error(`${tokenA.symbol} 余额不足`)
    }
    if (!balanceCheckB) {
      throw new Error(`${tokenB.symbol} 余额不足`)
    }

    let hash

    if (hasNative) {
      // Native + ERC20 流动性
      console.log('🔄 Processing Native + ERC20 liquidity')
      const erc20Token = isNativeA ? tokenB : tokenA
      const nativeAmount = isNativeA ? amountAParsed : amountBParsed
      const tokenAmount = isNativeA ? amountBParsed : amountAParsed
      const nativeAmountMin = isNativeA ? amountAMinBN : amountBMinBN
      const tokenAmountMin = isNativeA ? amountBMinBN : amountAMinBN

      console.log('📋 Native + ERC20 params:', {
        erc20Token: { symbol: erc20Token.symbol, address: erc20Token.address },
        tokenAmount: tokenAmount.toString(),
        tokenAmountMin: tokenAmountMin.toString(),
        nativeAmount: nativeAmount.toString(),
        nativeAmountMin: nativeAmountMin.toString()
      })

      // 10. 检查并授权 ERC20 代币（精确授权）
      updateProgress('approval', `检查 ${erc20Token.symbol} 授权...`)

      const approvalResult = await checkAndApproveToken(
        erc20Token.address,
        erc20Token.symbol,
        userAddress,
        routerAddress,
        tokenAmount,
        setApprovalHash,
        updateProgress
      )

      if (approvalResult.approved) {
        didApprove = true
        approvalHashes.push(approvalResult.hash)
      }

      updateProgress('transaction', '提交添加流动性交易...')

      // 11. 执行添加流动性
      console.log('🔄 Submitting add liquidity ETH transaction...')
      const addLiquidityGasEstimate = await computedGas(
        routerAbi,
        'addLiquidityETH',
        [erc20Token.address, tokenAmount, tokenAmountMin, nativeAmountMin, userAddress, deadline],
        routerAddress,
        userAddress,
        nativeAmount
      )

      hash = await writeContract(config, {
        abi: routerAbi,
        address: routerAddress,
        functionName: 'addLiquidityETH',
        args: [
          erc20Token.address,
          tokenAmount,
          tokenAmountMin,
          nativeAmountMin,
          userAddress,
          deadline
        ],
        value: nativeAmount,
        gas: addLiquidityGasEstimate.gas,
        maxFeePerGas: addLiquidityGasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: addLiquidityGasEstimate.maxPriorityFeePerGas
      })

      txHash = hash
      setTxHash && setTxHash(hash)
      console.log('✅ Native + Token liquidity submitted:', hash)
    }
    else {
      // ERC20 + ERC20 流动性
      console.log('🔄 Processing ERC20 + ERC20 liquidity')
      const tokenAAddress = getTokenAddress(tokenA)
      const tokenBAddress = getTokenAddress(tokenB)

      console.log('📋 ERC20 + ERC20 params:', {
        tokenA: { symbol: tokenA.symbol, address: tokenAAddress },
        tokenB: { symbol: tokenB.symbol, address: tokenBAddress },
        amountA: amountAParsed.toString(),
        amountB: amountBParsed.toString(),
        amountAMin: amountAMinBN.toString(),
        amountBMin: amountBMinBN.toString()
      })

      // 12. 🔥 优化：按界面显示顺序进行授权，确保用户体验一致
      const tokensToApprove = [
        { token: tokenA, amount: amountAParsed, address: tokenAAddress },
        { token: tokenB, amount: amountBParsed, address: tokenBAddress }
      ]

      console.log('🔄 Token approval order:', tokensToApprove.map(t => t.token.symbol))

      for (const { token, amount, address } of tokensToApprove) {
        updateProgress('approval', `检查 ${token.symbol} 授权...`)

        const approvalResult = await checkAndApproveToken(
          address,
          token.symbol,
          userAddress,
          routerAddress,
          amount,
          setApprovalHash,
          updateProgress
        )

        if (approvalResult.approved) {
          didApprove = true
          approvalHashes.push(approvalResult.hash)
        }
      }

      updateProgress('transaction', '提交添加流动性交易...')

      // 13. 执行添加流动性
      console.log('🔄 Submitting add liquidity transaction...')
      const addLiquidityGasEstimate = await computedGas(
        routerAbi,
        'addLiquidity',
        [tokenAAddress, tokenBAddress, amountAParsed, amountBParsed, amountAMinBN, amountBMinBN, userAddress, deadline],
        routerAddress,
        userAddress
      )

      hash = await writeContract(config, {
        abi: routerAbi,
        address: routerAddress,
        functionName: 'addLiquidity',
        args: [
          tokenAAddress,
          tokenBAddress,
          amountAParsed,
          amountBParsed,
          amountAMinBN,
          amountBMinBN,
          userAddress,
          deadline
        ],
        gas: addLiquidityGasEstimate.gas,
        maxFeePerGas: addLiquidityGasEstimate.maxFeePerGas,
        maxPriorityFeePerGas: addLiquidityGasEstimate.maxPriorityFeePerGas
      })

      txHash = hash
      setTxHash && setTxHash(hash)
      console.log('✅ ERC20 + ERC20 liquidity submitted:', hash)
    }

    // 🔥 关键修复：等待交易确认
    updateProgress('pending', '等待交易确认...', { txHash })
    console.log('⏳ Waiting for transaction confirmation:', txHash)

    const receipt = await waitForTransactionReceipt(config, {
      hash: txHash,
      timeout: 120000 // 2分钟超时
    })

    if (receipt.status === 'success') {
      updateProgress('success', '交易确认成功', { 
        txHash, 
        priceImpact,
        gasUsed: receipt.gasUsed?.toString()
      })
      console.log('✅ Transaction confirmed successfully:', receipt.transactionHash)
      
      // 显示成功提示
      ElMessage({
        message: '添加流动性成功！',
        type: 'success',
        duration: 5000,
        showClose: true
      })

      return {
        success: true,
        transactionHash: txHash,
        receipt,
        approvalHashes,
        didApprove,
        priceImpact,
        error: null
      }
    } else {
      throw new Error('交易执行失败')
    }

  } catch (e) {
    console.error('❌ Add liquidity failed:', e)
    error = e

    updateProgress('error', '交易失败', { error: e.message })

    // 提供更友好的错误信息
    let errorMessage = e.message
    if (e.message && e.message.includes('User rejected')) {
      errorMessage = '用户取消了交易'
    } else if (e.message && e.message.includes('insufficient funds')) {
      errorMessage = '余额不足'
    } else if (e.message && e.message.includes('INSUFFICIENT_A_AMOUNT')) {
      errorMessage = '代币A数量不足，请调整滑点或输入金额'
    } else if (e.message && e.message.includes('INSUFFICIENT_B_AMOUNT')) {
      errorMessage = '代币B数量不足，请调整滑点或输入金额'
    } else if (e.message && e.message.includes('EXPIRED')) {
      errorMessage = '交易已过期，请重试'
    } else if (e.message && e.message.includes('IDENTICAL_ADDRESSES')) {
      errorMessage = '不能添加相同代币的流动性'
    } else if (e.message && e.message.includes('ZERO_ADDRESS')) {
      errorMessage = '无效的代币地址'
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
      approvalHashes,
      didApprove,
      priceImpact,
      error: errorMessage
    }
  }
}

export default doAddLiquidity