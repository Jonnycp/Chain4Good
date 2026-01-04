import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig, task } from "hardhat/config";
import { NewTaskActionFunction, TaskArguments } from "hardhat/types/tasks";

const manageEnte = task("manage-ente", "Gestisce gli NFT degli Enti")
  .setAction(() => import("./tasks/manageEnte.js") as Promise<{ default: NewTaskActionFunction<TaskArguments> }>)
  .addPositionalArgument({
    name: "account",
    description: "L'indirizzo dell'account dell'ente",
  })
  .addPositionalArgument({
    name: "action",
    description: "L'azione da eseguire: 'mint' per assegnare l'NFT, 'burn' per revocarlo",
    defaultValue: "mint",
  })
  .build();

const giveCash = task("giveCash", "Assegna EURC ad un account")
  .setAction(() => import("./tasks/giveCash.js") as Promise<{ default: NewTaskActionFunction<TaskArguments> }>)
  .addPositionalArgument({
    name: "account",
    description: "L'indirizzo dell'account a cui assegnare gli EURC",
  })
  .addPositionalArgument({
    name: "amount",
    description: "L'importo di EURC da assegnare (default 5000)",
    defaultValue: "5000",
  })
  .build();

export default defineConfig({
  tasks: [manageEnte, giveCash],
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
});
