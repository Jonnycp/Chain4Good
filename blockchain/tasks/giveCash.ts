import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import fs from "fs";
import path from "path";

interface AccountTaskArguments {
    account: string;
    amount: number; 
    token: "EURC" | "ETH"
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

  const [deployer] = await ethers.getSigners();
  const data = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  const contractAddress = data["Chain4Good#MockERC20"];

  const eurc = await ethers.getContractAt("MockERC20", contractAddress);
  const { amount, account, token } = taskArguments;

  
  try {
    if(amount <= 0) {
        console.error("❌ Errore: L'importo deve essere maggiore di zero.");
        return;
        }

    if (token.toUpperCase() === "ETH") {
      // --- LOGICA ETH ---
      console.log(`⏳ Trasferimento di ${amount} ETH a ${account}...`);
      
      const tx = await deployer.sendTransaction({
        to: account,
        value: ethers.parseEther(amount.toString()),
      });
      
      await tx.wait();
      console.log(`✅ ETH inviati con successo!`);

    } else {
      // --- LOGICA EURC ---
      const amountUnits = ethers.parseUnits(amount.toString(), 18);

      console.log(`⏳ Minting di ${amount} EURC per ${account}...`);
      const tx = await eurc.mint(account, amountUnits);
      await tx.wait();
      
      console.log("✅ EURC generati con successo!");
    }

    console.log("👉 Controlla il profilo sul sito per vedere l'aggiornamento.");;
  } catch (error: any) {
    console.error("❌ Errore durante l'operazione:", error.reason || error.message);
  }
}