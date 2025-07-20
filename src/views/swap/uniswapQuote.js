import { Pair, Route, Trade } from '@uniswap/v2-sdk'
import { CurrencyAmount, TradeType, Percent, WETH9, ChainId, Token } from '@uniswap/sdk-core'
import { Contract, parseUnits, formatUnits } from 'ethers'

// 预设常用主网Token对象，方便引用
let TOKEN_LIST = {
    ETH: {
      symbol: 'ETH',
      decimals: 18,
      address: '',
      isNative: true,
      chainId: 1
    },
    DAI: new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
    USDT: new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD'),
    USDC: new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C'),
    WETH: WETH9[ChainId.MAINNET] // 只做SDK内部用
  }
/**
 * 计算Uniswap V2两Token兑换的报价（模拟Swap，不实际发送交易）
 * Estimate Uniswap V2 swap output/price/minimum amount out
 * 
 * @param {Object} params 参数对象
 * @param {string} params.fromSymbol 输入Token符号（如'ETH','DAI'）
 * @param {string} params.toSymbol 输出Token符号
 * @param {string|number} params.amountIn 输入Token数量（用户输入）
 * @param {string|number} params.slippageInput 用户设置的滑点百分比（如0.5）
 * @param {object} params.signer 必须传入ethers.js的Signer对象
 * @returns {Promise<{ outputAmount: string, rate: string, minAmountOut: string, trade: Trade } | undefined>}
 * - outputAmount：预期输出数量（格式化字符串）
 * - rate：兑换价格（1 fromToken 可兑换多少 toToken）
 * - minAmountOut：滑点保护后的最小输出
 * - trade：Uniswap Trade对象（后续Swap可用）
 */
export async function estimateQuotes({
    fromSymbol,
    toSymbol,
    amountIn,
    slippageInput,
    signer
  }) {
    // ----------- 关键替换 ----------
    // SDK只认WETH，前端ETH自动转
    const fromToken = fromSymbol === 'ETH' ? TOKEN_LIST.WETH : TOKEN_LIST[fromSymbol]
    const toToken   = toSymbol === 'ETH'   ? TOKEN_LIST.WETH : TOKEN_LIST[toSymbol]
    // --------------------------------
    if (!fromToken || !toToken) return
  
    // 后面原样
    const pairAddress = Pair.getAddress(fromToken, toToken)
    const pairAbi = ["function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"]
    const pairContract = new Contract(pairAddress, pairAbi, signer)
    const { reserve0, reserve1 } = await pairContract.getReserves()
  
    const [token0, token1] = fromToken.sortsBefore(toToken)
      ? [fromToken, toToken]
      : [toToken, fromToken]
    const pairObj = new Pair(
      CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
      CurrencyAmount.fromRawAmount(token1, reserve1.toString())
    )
  
    const fromDecimals = fromToken.decimals
    const amount = parseUnits(String(amountIn), fromDecimals)
    const route = new Route([pairObj], fromToken, toToken)
    const tradeTmp = new Trade(route, CurrencyAmount.fromRawAmount(fromToken, amount.toString()), TradeType.EXACT_INPUT)
  
    const outputAmount = formatUnits(tradeTmp.outputAmount.quotient.toString(), toToken.decimals)
    const rate = tradeTmp.executionPrice.toSignificant(6)
    const slipPercent = Math.floor(Number(slippageInput) * 100)
    const slippage = new Percent(slipPercent.toString(), '10000')
    const minOut = tradeTmp.minimumAmountOut(slippage)
    const minAmountOut = formatUnits(minOut.quotient.toString(), toToken.decimals)
  
    return { outputAmount, rate, minAmountOut, trade: tradeTmp }
  }
// 导出TOKEN_LIST供外部统一管理Token对象



/**
 * 查询池子储备（fromToken 和 toToken 的当前余额）
 */
export async function getPoolReserves({
  fromSymbol,
  toSymbol,
  signer
}) {
  const fromToken = fromSymbol === 'ETH' ? TOKEN_LIST.WETH : TOKEN_LIST[fromSymbol]
  const toToken = toSymbol === 'ETH' ? TOKEN_LIST.WETH : TOKEN_LIST[toSymbol]
  if (!fromToken || !toToken) return { fromReserve: 0, toReserve: 0 }

  const pairAddress = Pair.getAddress(fromToken, toToken)
  const pairAbi = ["function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"]
  const pairContract = new Contract(pairAddress, pairAbi, signer)
  const { reserve0, reserve1 } = await pairContract.getReserves()

  const [token0, token1] = fromToken.sortsBefore(toToken)
    ? [fromToken, toToken]
    : [toToken, fromToken]

  const reserve0Formatted = Number(formatUnits(reserve0.toString(), token0.decimals))
  const reserve1Formatted = Number(formatUnits(reserve1.toString(), token1.decimals))

  return token0.address === fromToken.address
    ? { fromReserve: reserve0Formatted, toReserve: reserve1Formatted }
    : { fromReserve: reserve1Formatted, toReserve: reserve0Formatted }
}
export { TOKEN_LIST }
