import { Pair, Route, Trade } from '@uniswap/v2-sdk'
import {
  CurrencyAmount, TradeType, Percent, Token
} from '@uniswap/sdk-core'
import { Contract, parseUnits, formatUnits } from 'ethers'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'

const FACTORY_ADDRESS = '0x593b44b2C309468072A8f4d952a085E25A4E8E48'
const INIT_CODE_HASH = '0x5a2dc30108940dd053e5fe06fe4deb55d420828f787d508920ac29e08aed3ad9'

// ✅ Token 列表（支持 CP 原生币和 ERC20）
const TOKEN_LIST = {
  CP: {
    symbol: 'CP',
    decimals: 18,
    address: '',
    isNative: true,
    chainId: 86606
  },
  USDT: new Token(86606, '0x6C255b22864bBC176431c42695D16f41576e5618', 18, 'USDT', 'Tether USD'),
  USDC: new Token(86606, '0xb884F1C92AF157dD3dcC54512a595b1D9531423d', 18, 'USDC', 'USD//C'),
  WCP: new Token(86606, '0xC18eA88732464dc5E38372A7Fb1d30b56Dd0E4d5', 18, 'WCP', 'Wrapped CP')
}

// ✅ 获取 SDK Token 实例
function getSdkToken(symbol) {
  const token = TOKEN_LIST[symbol]
  if (!token) throw new Error(`Token ${symbol} not found`)
  return token.isNative ? TOKEN_LIST.WCP : token
}

// ✅ 计算 pair 地址（适配自定义工厂）
function getPairAddress({ tokenA, tokenB }) {
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]
  const salt = keccak256(
    ['bytes'],
    [pack(['address', 'address'], [token0.address, token1.address])]
  )
  return getCreate2Address(FACTORY_ADDRESS, salt, INIT_CODE_HASH)
}

// ✅ 判断 pair 是否存在且有流动性
// 修改：provider 参数可以是 JsonRpcProvider 或 signer
async function isPairAvailable(pairAddress, provider) {
  const abi = ["function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"]
  const pair = new Contract(pairAddress, abi, provider)
  try {
    const { reserve0, reserve1 } = await pair.getReserves()
    return BigInt(reserve0) > 0n && BigInt(reserve1) > 0n
  } catch (e) {
    return false
  }
}

/**
 * 💱 报价计算（含流动性判断）
 * 修改：provider 参数可以是 JsonRpcProvider 或 signer
 */
export async function estimateQuotes({
  fromSymbol,
  toSymbol,
  amountIn,
  slippageInput,
  provider // 修改：参数名从 signer 改为 provider，更通用
}) {
  const fromToken = getSdkToken(fromSymbol)
  const toToken = getSdkToken(toSymbol)
  const pairAddress = getPairAddress({ tokenA: fromToken, tokenB: toToken })
  console.log('[Pair Address]', pairAddress)

  const hasLiquidity = await isPairAvailable(pairAddress, provider)
  if (!hasLiquidity) throw new Error('Pair not deployed or no liquidity')

  const pairAbi = ["function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"]
  const pairContract = new Contract(pairAddress, pairAbi, provider)
  const { reserve0, reserve1 } = await pairContract.getReserves()

  const [token0, token1] = fromToken.sortsBefore(toToken)
    ? [fromToken, toToken]
    : [toToken, fromToken]

  const pairObj = new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
    CurrencyAmount.fromRawAmount(token1, reserve1.toString())
  )

  const amount = parseUnits(String(amountIn), fromToken.decimals)
  const route = new Route([pairObj], fromToken, toToken)
  const tradeTmp = new Trade(
    route,
    CurrencyAmount.fromRawAmount(fromToken, amount.toString()),
    TradeType.EXACT_INPUT
  )

  const outputAmount = formatUnits(tradeTmp.outputAmount.quotient.toString(), toToken.decimals)
  const rate = tradeTmp.executionPrice.toSignificant(6)

  // ✅ 支持高精度滑点：0.000001% ~ 任意小数精度
  const slippageDecimal = Number(slippageInput) / 100
  const slippage = new Percent(
    BigInt(Math.floor(slippageDecimal * 1e18)).toString(),
    '1000000000000000000' // denominator 为 1e18
  )

  const minOut = tradeTmp.minimumAmountOut(slippage)
  const minAmountOut = formatUnits(minOut.quotient.toString(), toToken.decimals)

  return { outputAmount, rate, minAmountOut, trade: tradeTmp }
}

/**
 * 📊 查询储备（含是否存在判断）
 * 修改：provider 参数可以是 JsonRpcProvider 或 signer
 */
export async function getPoolReserves({
  fromSymbol,
  toSymbol,
  provider // 修改：参数名从 signer 改为 provider，更通用
}) {
  const fromToken = getSdkToken(fromSymbol)
  const toToken = getSdkToken(toSymbol)

  const pairAddress = getPairAddress({ tokenA: fromToken, tokenB: toToken })
  const hasLiquidity = await isPairAvailable(pairAddress, provider)
  if (!hasLiquidity) return { fromReserve: 0, toReserve: 0 }

  const pairAbi = ["function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"]
  const pairContract = new Contract(pairAddress, pairAbi, provider)
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

// ✅ 导出
export {
  TOKEN_LIST,
  getSdkToken,
  getPairAddress,
  isPairAvailable,
  FACTORY_ADDRESS,
  INIT_CODE_HASH
}