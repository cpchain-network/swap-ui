// src/composables/useEthersProvider.js

import { ref, watchEffect } from 'vue'
import { JsonRpcProvider, FallbackProvider } from 'ethers'
import { useClient } from '@wagmi/vue'

/**
 * 将 wagmi 的 viem client 转为 ethers.js 的 provider
 * @param {object} client - wagmi 返回的 client 对象
 * @returns {JsonRpcProvider | FallbackProvider}
 */
function clientToProvider(client) {
  const { chain, transport } = client
    // console.log()
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  if (transport?.type === 'fallback') {
    const providers = transport.transports.map(({ value }) => {
      return new JsonRpcProvider(value?.url, network)
    })
    return providers.length === 1 ? providers[0] : new FallbackProvider(providers)
  }

  return new JsonRpcProvider(transport?.url, network)
}

/**
 * 用于在 Vue 中获得 ethers.js provider 实例
 * @param {number} [chainId]
 * @returns {import('vue').Ref<JsonRpcProvider | FallbackProvider | undefined>}
 */
export function useEthersProvider(chainId) {
  const provider = ref(undefined)
  const clientRef = useClient({ chainId })

  watchEffect(() => {
    const client = clientRef.value
    if (client && client.transport && client.chain) {
      provider.value = clientToProvider(client)
    } else {
      provider.value = undefined
    }
  })

  return provider
}
