import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { computed } from 'vue'
import { useConnectorClient } from '@wagmi/vue'


export function clientToSigner(client) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/** Composable to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId } = {}) {
  const { data: client } = useConnectorClient({ chainId })
  const signer = computed(() => (client.value ? clientToSigner(client.value) : undefined))
  return { signer }
}