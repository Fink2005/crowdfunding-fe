import { type Abi } from 'viem'
import abi from './crowdfunding.abi.json'
export const contractAddress = import.meta.env
  .VITE_CONTRACT_ADDRESS as `0x${string}`
export const contractAbi = abi as Abi
