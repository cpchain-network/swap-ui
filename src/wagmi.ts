import { http, createConfig, createStorage } from '@wagmi/vue'
import {  walletConnect ,metaMask,} from '@wagmi/vue/connectors'
import { defineChain } from 'viem'

const cpChain = defineChain({
  id: 86606,
  name: 'CPChain Testnet',
  nativeCurrency: {
    name: 'CPChain',
    symbol: 'CP', // ✅ 关键：正确的 symbol
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.cpchain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CP Explorer',
      url: 'https://explorer.testnet.cpchain.com',
    },
  },
  testnet: true,
})
export const config = createConfig({
  // chains: [mainnet, sepolia, optimism],
  chains:[cpChain],
  connectors: [
   
    // walletConnect({
    //   projectId: 'f87cf4373910e1766c873dc5df019573',
    // }),
    // coinbaseWallet({ appName: 'Vite Vue Playground', darkMode: true }),
  ],
  storage: createStorage({ storage: localStorage, key: 'vite-vue' }),
  transports: {
     [cpChain.id]: http('https://rpc-testnet.cpchain.com'),
    // [mainnet.id]: http(),
    // [sepolia.id]: http(),
    // [optimism.id]: http(),
  },
})

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}
