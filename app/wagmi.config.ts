import { http, createConfig } from 'wagmi'
import { mainnet, hardhat } from 'wagmi/chains'
import { metaMask } from '@wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, hardhat],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [hardhat.id]: http(import.meta.env.VITE_HARDHAT_RPC_URL),
  },
})