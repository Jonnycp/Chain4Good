import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import fs from "fs";
import path from "path";

interface AccountTaskArguments {
    action: string; 
    account: string;
}

export default async function (
  taskArguments: AccountTaskArguments,
  hre: HardhatRuntimeEnvironment,
) {
  const { ethers } = await hre.network.connect();
  const deploymentPath = path.resolve(
    "ignition/deployments/chain-31337/deployed_addresses.json"
  );

  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ Errore: File dei deploy non trovato. Esegui prima: npx hardhat ignition deploy ./ignition/modules/EnteNFT.ts --network localhost");
    return;
  }

  const data = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  const contractAddress = data["EnteNFTModule#EnteNFT"];

  const enteNFT = await ethers.getContractAt("EnteNFT", contractAddress);
  const { action, account } = taskArguments;

  try {
    if (action === "mint") {
      console.log(`⏳ Assegnazione NFT a ${account}...`);
      const tx = await enteNFT.safeMint(account);
      await tx.wait();
      console.log(`✅ NFT assegnato con successo a ${account}!`);
      
    } else if (action === "burn") {
      console.log(`⏳ Revoca NFT per ${account}...`);
      const tx = await enteNFT.revokeEnte(account);
      await tx.wait();
      console.log(`🔥 Accesso Ente revocato per ${account}!`);
      
    } else {
      console.log("❌ Azione non valida. Usa 'mint' o 'burn'.");
    }
  } catch (error: any) {
    console.error("❌ Errore durante l'operazione:", error.reason || error.message);
  }
}