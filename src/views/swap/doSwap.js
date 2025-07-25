
import { MaxUint256, parseUnits } from 'ethers'
import { Percent } from '@uniswap/sdk-core'
import { Contract } from 'ethers'
import { useAccount, useConnectorClient } from '@wagmi/vue'

// const { connector } = useAccount()
// console.log(connector.name)

/**
 * Unified doSwaps supporting CP native coin or ERC20 CP token on cp chain.
 */
export async function doSwaps({
  fromToken,
  toToken,
  amountIn,
  slippageInput,
  trade,
  userAddress,
  signer,
  routerAddress,
  fromTokenContract,
  decimals,
  wcpAddress, // 👈 cp chain 上的 Wrapped CP 地址
  nativeSymbol = 'CP', // 👈 cp chain native coin symbol
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
    if (!trade) throw new Error('No valid Trade object')
    if (!fromToken || !toToken) throw new Error('Token not defined')
    if (!userAddress || !signer || !routerAddress) throw new Error('Incomplete params')

    const slipPercent = Math.floor(Number(slippageInput) * 100)
    const slippage = new Percent(slipPercent.toString(), '10000')
    const minAmount = trade.minimumAmountOut(slippage).quotient.toString()
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20

    const routerAbi = [
      "function swapExactTokensForTokens(uint,uint,address[],address,uint) returns (uint[])",
      "function swapExactETHForTokens(uint,address[],address,uint) payable returns (uint[])",
      "function swapExactTokensForETH(uint,uint,address[],address,uint) returns (uint[])"
    ]
    const router = new Contract(routerAddress, routerAbi, signer)
    let tx

    // 1️⃣ Native CP → Token
    if (isNative(fromToken)) {
      if (isNative(toToken)) throw new Error(`${nativeSymbol} to ${nativeSymbol} swap not allowed`)
      const path = [wcpAddress, getTokenAddress(toToken)]
      const amountInParsed = parseUnits(amountIn.toString(), 18)
      tx = await router.swapExactETHForTokens(
        minAmount, path, userAddress, deadline,
        {
         value: amountInParsed,
         gasLimit: 1334700n,
  // maxFeePerGas: parseUnits('0.299', 'gwei'),           // 0.000000299 CP
  // maxPriorityFeePerGas: parseUnits('0.5', 'gwei')    // 0.0
     }
       )
    }

    // 2️⃣ Token → Native CP
    else if (isNative(toToken)) {
      if (!fromTokenContract) throw new Error('fromTokenContract null')
      const path = [getTokenAddress(fromToken), wcpAddress]
      const amountInParsed = parseUnits(amountIn.toString(), decimals)
      let allowance = await fromTokenContract.allowance(userAddress, routerAddress)
      if (BigInt(allowance.toString()) < BigInt(amountInParsed.toString())) {
        const txApprove = await fromTokenContract.approve(routerAddress, MaxUint256)
        await txApprove.wait()
        didApprove = true
      }
      tx = await router.swapExactTokensForETH(
        amountInParsed, minAmount, path, userAddress, deadline,
        {
          gasLimit: 1334700n,
          // maxFeePerGas: parseUnits('0.299', 'gwei'),           // 0.000000299 CP
          // maxPriorityFeePerGas: parseUnits('0.5', 'gwei')    // 0.0
        }
      )
    }

    // 3️⃣ ERC20 → ERC20
    else {
      if (!fromTokenContract) throw new Error('fromTokenContract null')
      const path = [getTokenAddress(fromToken), getTokenAddress(toToken)]
      const amountInParsed = parseUnits(amountIn.toString(), decimals)
      let allowance = await fromTokenContract.allowance(userAddress, routerAddress)
      if (BigInt(allowance.toString()) < BigInt(amountInParsed.toString())) {
        const txApprove = await fromTokenContract.approve(routerAddress, MaxUint256)
        await txApprove.wait()
        didApprove = true
      }
      tx = await router.swapExactTokensForTokens(
        amountInParsed, minAmount, path, userAddress, deadline,
        {
          gasLimit: 1334700n,
          // maxFeePerGas: parseUnits('0.299', 'gwei'),           // 0.000000299 CP
          // maxPriorityFeePerGas: parseUnits('0.5', 'gwei')    // 0.0
        }
      )
    }

    txHash = tx.hash
    await tx.wait()
    return { success: true, txHash, didApprove }

  } catch (e) {
    error = 'Swap failed: ' + (e.reason || e.data?.message || e.message || JSON.stringify(e))
    return { success: false, error }
  }
}
// import { MaxUint256, parseUnits } from 'ethers'
// import { Percent } from '@uniswap/sdk-core'
// import { Contract } from 'ethers'

// // ✅ 标准 Wrapped CP ABI（兼容 WETH 结构）
// const WCP_ABI = [
//   "function deposit() payable",
//   "function withdraw(uint256)",
//   "function balanceOf(address) view returns (uint256)",
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function allowance(address owner, address spender) view returns (uint256)"
// ]

// /**
//  * doSwaps：兼容原生 CP 包装为 WCP，支持 ERC20 ↔ CP，兼容 OKX/MetaMask
//  */
// export async function doSwaps({
//   fromToken,
//   toToken,
//   amountIn,
//   slippageInput,
//   trade,
//   userAddress,
//   signer,
//   routerAddress,
//   fromTokenContract,
//   decimals,
//   wcpAddress,
//   nativeSymbol = 'CP'
// }) {
//   let error = null
//   let txHash = null
//   let didApprove = false

//   function isNative(token) {
//     return token?.symbol === nativeSymbol || token?.isNative
//   }

//   function getTokenAddress(token) {
//     if (!token) throw new Error('Token undefined')
//     return isNative(token) ? wcpAddress : token.address
//   }

//   try {
//     if (!trade) throw new Error('No valid Trade object')
//     if (!fromToken || !toToken) throw new Error('Token not defined')
//     if (!userAddress || !signer || !routerAddress) throw new Error('Incomplete params')

//     const slipPercent = Math.floor(Number(slippageInput) * 100)
//     const slippage = new Percent(slipPercent.toString(), '10000')
//     const minAmount = trade.minimumAmountOut(slippage).quotient.toString()
//     const deadline = Math.floor(Date.now() / 1000) + 60 * 20

//     const routerAbi = [
//       "function swapExactTokensForTokens(uint,uint,address[],address,uint) returns (uint[])",
//       "function swapExactTokensForETH(uint,uint,address[],address,uint) returns (uint[])"
//     ]
//     const router = new Contract(routerAddress, routerAbi, signer)

//     const fromIsNative = isNative(fromToken)
//     const toIsNative = isNative(toToken)
//     const amountInParsed = parseUnits(amountIn.toString(), decimals || 18)

//     // ✅ 如果输入是原生 CP，先调用 WCP.deposit() 包装
//     if (fromIsNative) {
//       const WCP = new Contract(wcpAddress, WCP_ABI, signer)
//       try {
//         console.log('⏳ 正在包装 CP 为 WCP...')
//         const wrapTx = await WCP.deposit({
//           value: amountInParsed,
//           gasLimit: 100000
//         })
//         await wrapTx.wait()
//         console.log('✅ 包装成功')
//       } catch (wrapError) {
//         const msg = wrapError?.reason || wrapError?.data?.message || wrapError?.message || JSON.stringify(wrapError)
//         console.error('❌ WCP deposit 报错:', msg)
//         throw new Error('WCP deposit failed: ' + msg)
//       }
//     }

//     const path = [getTokenAddress(fromToken), getTokenAddress(toToken)]

//     // ✅ 构建合约（无论是原生包装还是 ERC20）
//     const erc20 = new Contract(path[0], WCP_ABI, signer)
//     const allowance = await erc20.allowance(userAddress, routerAddress)

//     if (BigInt(allowance.toString()) < BigInt(amountInParsed.toString())) {
//       console.log('⏳ 正在授权...')
//       const txApprove = await erc20.approve(routerAddress, MaxUint256)
//       await txApprove.wait()
//       console.log('✅ 授权完成')
//       didApprove = true
//     }

//     // ✅ 执行兑换逻辑
//     let tx
//     if (toIsNative) {
//       tx = await router.swapExactTokensForETH(
//         amountInParsed,
//         minAmount,
//         path,
//         userAddress,
//         deadline
//       )
//     } else {
//       tx = await router.swapExactTokensForTokens(
//         amountInParsed,
//         minAmount,
//         path,
//         userAddress,
//         deadline
//       )
//     }

//     txHash = tx.hash
//     await tx.wait()

//     return { success: true, txHash, didApprove }

//   } catch (e) {
//     error = 'Swap failed: ' + (e.reason || e.data?.message || e.message || JSON.stringify(e))
//     console.error('❌ swap 报错:', error)
//     return { success: false, error }
//   }
// }
