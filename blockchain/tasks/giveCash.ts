import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import fs from "fs";
import path from "path";

interface AccountTaskArguments {
    account: string;
    amount: number; 
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
    console.error("❌ Errore: File dei deploy non trovato. Esegui prima: npx hardhat ignition deploy ./ignition/modules/Chain4Good.ts --network localhost");
    return;
  }

  const data = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  const contractAddress = data["Chain4Good#MockERC20"];

  const eurc = await ethers.getContractAt("MockERC20", contractAddress);
  const { amount, account } = taskArguments;

  try {
    if(amount <= 0) {
        console.error("❌ Errore: L'importo deve essere maggiore di zero.");
        return;
        }

    const amountEther = ethers.parseUnits(amount.toString() || "5000", 18);

    console.log(`Minting ${amount || "5000"} EURC per ${account}...`);
    const tx = await eurc.mint(account, amountEther);
    await tx.wait();
    console.log("✅ Fatto! Controlla il profilo sul sito.");
  } catch (error: any) {
    console.error("❌ Errore durante l'operazione:", error.reason || error.message);
  }
}