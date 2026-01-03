import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import EnteNFTModule from "./EnteNFT.js";

export default buildModule("Chain4Good", (m) => {
  // 1. Contratto dal modulo EnteNFT
  // m.useModule garantisce che venga eseguito prima e restituisca le istanze
  const { enteNFT } = m.useModule(EnteNFTModule);

  // 2. Deploy della Factory passando l'indirizzo dell'NFT appena ottenuto
  const factory = m.contract("ProjectFactory", [enteNFT]);

  // Test token EURC mock
  const eurc = m.contract("MockERC20", ["Euro Coin", "EURC"]);

  return { enteNFT, factory, eurc };
});