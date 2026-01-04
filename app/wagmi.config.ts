import { http, createConfig } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { metaMask } from '@wagmi/connectors'

export const config = createConfig({
  chains: [hardhat],
  connectors: [metaMask()],
  transports: {
    [hardhat.id]: http(import.meta.env.VITE_HARDHAT_RPC_URL),
  },
})