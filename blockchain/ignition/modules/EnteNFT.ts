import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EnteNFTModule = buildModule("EnteNFTModule", (m) => {
  const enteNFT = m.contract("EnteNFT");

  return { enteNFT };
});

export default EnteNFTModule;