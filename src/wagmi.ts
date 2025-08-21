import { http, createConfig, createStorage } from '@wagmi/vue'
import {  walletConnect ,metaMask,injected} from '@wagmi/vue/connectors'
import { defineChain } from 'viem'

const cpChain = defineChain({
  id: 86608,
  name: 'CPChain',
  nativeCurrency: {
    name: 'CPChain',
    symbol: 'CP', // ✅ 关键：正确的 symbol
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.cpchain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CP Explorer',
      url: 'https://explorer.cpchain.com',
    },
  },
  testnet: false,
})
export const config = createConfig({
  // chains: [mainnet, sepolia, optimism],
  chains:[cpChain],
  connectors: [
   injected({shimDisconnect: true}),
    walletConnect({
      projectId: 'f87cf4373910e1766c873dc5df019573',
      qrModalOptions: {
        explorerRecommendedWalletIds: 'NONE',
        enableExplorer: false,
      },
    }),
    // coinbaseWallet({ appName: 'Vite Vue Playground', darkMode: true }),
  ],
  storage: createStorage({ storage: localStorage, key: 'vite-vue' }),
  transports: {
    [cpChain.id]: http('https://rpc.cpchain.com')
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
