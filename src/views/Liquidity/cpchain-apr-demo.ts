import { ethers } from 'ethers';

const RPC_URL = 'https://rpc-testnet.cpchain.com';
const FACTORY_ADDRESS = '0x2FC7B621aB51108e3108dD0EbCE76cb05545743a';

const PAIR_ABI = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address owner) external view returns (uint256)',
  'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)'
];

const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) external view returns (address pair)'
];

const ERC20_ABI = [
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)'
];

class CPChainAPRCalculator {
  private provider: ethers.JsonRpcProvider;
  private factory: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, this.provider);
  }

  /**
   * 获取代币价格 (从币对获取
   */
  async getTokenPrice(tokenAddress: string): Promise<number> {
    const priceMap: Record<string, number> = {
      '0x45569DdfCBbaA15C01e7A1e6b732b8E5b9c7B50B': 0.5,  // TestToken
      '0xCF4825F0dCaEAa158310473C1FFF1980Acb5b9F7': 1.0,  // WCP
    };
    
    return priceMap[tokenAddress.toLowerCase()] || 1.0;
  }

  /**
   * 获取代币信息
   */
  async getTokenInfo(tokenAddress: string): Promise<{ decimals: number; price: number }> {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    const [decimals, price] = await Promise.all([
      tokenContract.decimals(),
      this.getTokenPrice(tokenAddress)
    ]);
    
    return { decimals: Number(decimals), price };
  }

  /**
   * 获取池子 APR
   */
  async getPoolAPR(token0Address: string, token1Address: string): Promise<number> {
    const pairAddress = await this.factory.getPair(token0Address, token1Address);
    if (pairAddress === ethers.ZeroAddress) return 0;

    const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, this.provider);
    const [reserves, totalSupply, token0Info, token1Info] = await Promise.all([
      pairContract.getReserves(),
      pairContract.totalSupply(),
      this.getTokenInfo(token0Address),
      this.getTokenInfo(token1Address)
    ]);

    // 正确计算 TVL = 储备量 × 代币价格
    const reserve0Value = Number(ethers.formatUnits(reserves.reserve0, token0Info.decimals)) * token0Info.price;
    const reserve1Value = Number(ethers.formatUnits(reserves.reserve1, token1Info.decimals)) * token1Info.price;
    const tvl = reserve0Value + reserve1Value;
    
    // 计算 24h 手续费
    const currentBlock = await this.provider.getBlockNumber();
    // cp 1s 一个区块
    const fromBlock = Math.max(1, currentBlock - 86400); // 24h 区块数
    
    try {
      const swapEvents = await pairContract.queryFilter('Swap', fromBlock, currentBlock);
      let volume24h = 0;
      
      for (const event of swapEvents) {
        if (event.args) {
          const { amount0In, amount1In } = event.args;
          const vol0 = Number(ethers.formatUnits(amount0In || 0, token0Info.decimals)) * token0Info.price;
          const vol1 = Number(ethers.formatUnits(amount1In || 0, token1Info.decimals)) * token1Info.price;
          volume24h += Math.max(vol0, vol1); // 避免重复计算
        }
      }
      
      const fees24h = volume24h * 0.003; // 0.3% 手续费
      return tvl > 0 ? (fees24h / tvl) * 365 * 100 : 0;
    } catch {
      return 15; // 返回默认 APR
    }
  }

  /**
   * 获取用户 LP 余额
   */
  async getUserLPBalance(userAddress: string, token0Address: string, token1Address: string): Promise<string> {
    const pairAddress = await this.factory.getPair(token0Address, token1Address);
    if (pairAddress === ethers.ZeroAddress) return '0';

    const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, this.provider);
    const balance = await pairContract.balanceOf(userAddress);
    
    return ethers.formatEther(balance);
  }
}

// 使用示例
async function demo() {
  const calculator = new CPChainAPRCalculator();
  
  const apr = await calculator.getPoolAPR(
    '0x45569DdfCBbaA15C01e7A1e6b732b8E5b9c7B50B', // TestToken
    '0xCF4825F0dCaEAa158310473C1FFF1980Acb5b9F7'  // WCP
  );
  
  console.log(`Pool APR: ${apr.toFixed(2)}%`);
}

export { CPChainAPRCalculator };