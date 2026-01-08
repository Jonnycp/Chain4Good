import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// ABI minima per chiamare balanceOf
const minABI = ["function balanceOf(address owner) view returns (uint256)"];
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";

/**
 * Legge l'indirizzo dei contratti deployati da Ignition
 */
export const getContractAddress = (): { enteNft: string; eurc: string; factory: string } | null => {
  try {
    const deploymentPath = process.env.DEPLOYMENT_ADDRESSES_PATH || path.resolve(
      process.cwd(),
      "../blockchain/ignition/deployments/chain-31337/deployed_addresses.json"
    );
    
    if (fs.existsSync(deploymentPath)) {
      const data = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
      return {
        enteNft: data["EnteNFTModule#EnteNFT"],
        eurc: data["Chain4Good#MockERC20"],
        factory: data["Chain4Good#ProjectFactory"],
      }
    }
  } catch (e) {
    console.error("Errore lettura indirizzo contratto:", e);
  }
  return null;
};

export const checkIfIsEnte = async (walletAddress: string): Promise<boolean> => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contractAddress = getContractAddress()?.enteNft;
    
    if (!contractAddress) {
      console.error("Indirizzo contratto NFT non trovato.");
      return false;
    }

    const contract = new ethers.Contract(contractAddress, minABI, provider);
    const balance = await (contract as any).balanceOf(walletAddress);
    
    // Se il bilancio è > 0, l'utente possiede l'NFT Soulbound
    return Number(balance) > 0;
  } catch (error) {
    console.error("Errore verifica NFT on-chain:", error);
    return false;
  }
};