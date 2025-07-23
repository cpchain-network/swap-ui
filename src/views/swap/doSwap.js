// import { MaxUint256, parseUnits } from 'ethers'
// import { Percent } from '@uniswap/sdk-core'
// import { Contract } from 'ethers'

// /**
//  * Robust and safe doSwaps function, supports ETH ↔ ERC20 and ERC20 ↔ ERC20
//  * @param {Object} params Various trade parameters
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
//   wethAddress
// }) {
//   let error = null
//   let txHash = null
//   let didApprove = false

//   // ======= Safely get token address, replace ETH with WETH =======
//   function getTokenAddress(token) {
//     if (!token) throw new Error('Token object is undefined')
//     return (token.symbol === 'ETH' || token.isNative) ? wethAddress : token.address
//   }

//   try {
//     if (!trade) throw new Error('No valid Trade object')
//     if (!fromToken || !toToken) throw new Error('Token not defined')
//     if (!userAddress || !signer || !routerAddress) throw new Error('Incomplete parameters')

//     const slipPercent = Math.floor(Number(slippageInput) * 100)
//     const slippage = new Percent(slipPercent.toString(), '10000')
//     const minAmount = trade.minimumAmountOut(slippage).quotient.toString()
//     const deadline = Math.floor(Date.now() / 1000) + 60 * 20

//     const routerAbi = [
//       "function swapExactTokensForTokens(uint,uint,address[],address,uint) returns (uint[] memory)",
//       "function swapExactETHForTokens(uint,address[],address,uint) payable returns (uint[] memory)",
//       "function swapExactTokensForETH(uint,uint,address[],address,uint) returns (uint[] memory)"
//     ]
//     const router = new Contract(routerAddress, routerAbi, signer)
//     let tx

//     // 1. ETH → Token
//     if (fromToken.symbol === 'ETH' || fromToken.isNative) {
//       if (toToken.symbol === 'ETH' || toToken.isNative)
//         throw new Error('ETH to ETH swap is not allowed')
//       const path = [wethAddress, getTokenAddress(toToken)]
//       const amountInParsed = parseUnits(amountIn.toString(), 18)
//       tx = await router.swapExactETHForTokens(
//         minAmount, path, userAddress, deadline,
//         { value: amountInParsed }
//       )
//     }
//     // 2. Token → ETH
//     else if (toToken.symbol === 'ETH' || toToken.isNative) {
//       if (!fromTokenContract) throw new Error('fromTokenContract is null')
//       const path = [getTokenAddress(fromToken), wethAddress]
//       const amountInParsed = parseUnits(amountIn.toString(), decimals)
//       let allowance = await fromTokenContract.allowance(userAddress, routerAddress)
//       if (BigInt(allowance.toString()) < BigInt(amountInParsed.toString())) {
//         const txApprove = await fromTokenContract.approve(routerAddress, MaxUint256)
//         await txApprove.wait()
//         didApprove = true
//       }
//       tx = await router.swapExactTokensForETH(
//         amountInParsed, minAmount, path, userAddress, deadline
//       )
//     }
//     // 3. Token → Token
//     else {
//       if (!fromTokenContract) throw new Error('fromTokenContract is null')
//       const path = [getTokenAddress(fromToken), getTokenAddress(toToken)]
//       const amountInParsed = parseUnits(amountIn.toString(), decimals)
//       let allowance = await fromTokenContract.allowance(userAddress, routerAddress)
//       if (BigInt(allowance.toString()) < BigInt(amountInParsed.toString())) {
//         const txApprove = await fromTokenContract.approve(routerAddress, MaxUint256)
//         await txApprove.wait()
//         didApprove = true
//       }
//       tx = await router.swapExactTokensForTokens(
//         amountInParsed, minAmount, path, userAddress, deadline
//       )
//     }

//     txHash = tx.hash
//     await tx.wait()
//     return { success: true, txHash, didApprove }
//   } catch (e) {
//     error = 'Swap failed: ' +
//       (e.reason || e.data?.message || e.message || (typeof e === 'string' ? e : JSON.stringify(e)))
//     return { success: false, error }
//   }
// }
import { MaxUint256, parseUnits } from 'ethers'
import { Percent } from '@uniswap/sdk-core'
import { Contract } from 'ethers'

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
        { value: amountInParsed }
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
        amountInParsed, minAmount, path, userAddress, deadline
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
        amountInParsed, minAmount, path, userAddress, deadline
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
