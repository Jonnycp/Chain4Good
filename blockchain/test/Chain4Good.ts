import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();
const time = {
  latest: async () => {
    const block = await ethers.provider.getBlock("latest");
    return block!.timestamp;
  },
  increase: async (seconds: number) => {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
  }
};

describe("Ecosistema Chain4Good", function () {
  // Fixture: Prepara l'ambiente base per i test
  async function deployFixture() {
    const [owner, ente, donatore1, donatore2, fornitore] = await ethers.getSigners();

    // Deploy NFT
    const EnteNFT = await ethers.getContractFactory("EnteNFT");
    const enteNFT = await EnteNFT.deploy();

    // Deploy Factory
    const ProjectFactory = await ethers.getContractFactory("ProjectFactory");
    const factory = await ProjectFactory.deploy(await enteNFT.getAddress());

    // Deploy Mock Token (EURC)
    const MockToken = await ethers.getContractFactory("MockERC20");
    const token: any = await MockToken.deploy("Euro Coin", "EURC");

    return { enteNFT, factory, token, owner, ente, donatore1, donatore2, fornitore };
  }

  // Fixture: Crea un progetto specifico per testare il Vault
  async function projectDeployedFixture() {
    const base = await deployFixture();

    await base.enteNFT.safeMint(base.ente.address);
    
    const target = ethers.parseUnits("100", 18);
    const deadline = (await time.latest()) + 86400; // +1 giorno
    
    const tx = await base.factory.connect(base.ente).createProject(await base.token.getAddress(), target, deadline);
    const receipt = await tx.wait();
    
    // Recuperiamo l'indirizzo del nuovo Vault dall'evento ProjectCreated
    // @ts-ignore
    const vaultAddress = receipt.logs[1].args[0];
    const vault = await ethers.getContractAt("ProjectVault", vaultAddress);

    // Inizializziamo i donatori con dei soldi (EURC finti)
    await base.token.transfer(base.donatore1.address, ethers.parseUnits("100", 18));
    await base.token.transfer(base.donatore2.address, ethers.parseUnits("100", 18));

    return { ...base, vault, target, deadline };
  }

  describe("1. ProjectFactory", function () {
    it("Dovrebbe impedire la creazione di progetti a chi non ha l'NFT Ente", async function () {
      const { factory, token, donatore1 } = await deployFixture();
      const target = ethers.parseUnits("1000", 18);
      const deadline = (await time.latest()) + 86400;

      await expect(
        factory.connect(donatore1).createProject(await token.getAddress(), target, deadline)
      ).to.be.revertedWith("Devi essere un Ente certificato per creare progetti");
    });
  });

  describe("2. ProjectVault - Donazioni", function () {
    it("Dovrebbe impedire all'Ente di donare al proprio progetto", async function () {
      const { vault, ente, token } = await projectDeployedFixture();
      const amount = ethers.parseUnits("10", 18);
      
      // L'ente prova a donare a se stesso
      await token.connect(ente).approve(await vault.getAddress(), amount);
      await expect(vault.connect(ente).donate(amount))
        .to.be.revertedWith("L'Ente non puo' donare al proprio progetto");
    });

    it("Dovrebbe incrementare correttamente il numero di donatori univoci", async function () {
      const { vault, token, donatore1 } = await projectDeployedFixture();
      const amount = ethers.parseUnits("10", 18);
      
      await token.connect(donatore1).approve(await vault.getAddress(), amount * 2n);
      
      // Prima donazione
      await vault.connect(donatore1).donate(amount);
      expect(await vault.totalDonors()).to.equal(1n);

      // Seconda donazione dallo stesso utente (non deve aumentare totalDonors)
      await vault.connect(donatore1).donate(amount);
      expect(await vault.totalDonors()).to.equal(1n);
    });
  });

  describe("3. ProjectVault - Governance e Voto", function () {
    // Fixture interna: Progetto con donazioni già effettuate
    async function projectWithDonationsFixture() {
      const f = await projectDeployedFixture();
      const amount = ethers.parseUnits("50", 18);
      
      // Due donatori diversi donano 50 ciascuno (Tot 100, target 100 raggiunto)
      await f.token.connect(f.donatore1).approve(await f.vault.getAddress(), amount);
      await f.vault.connect(f.donatore1).donate(amount);
      await f.token.connect(f.donatore2).approve(await f.vault.getAddress(), amount);
      await f.vault.connect(f.donatore2).donate(amount);
      
      return f;
    }

    it("Dovrebbe impedire lo sblocco se la votazione è ancora in corso", async function () {
      const { vault, ente } = await projectWithDonationsFixture();
      
      await vault.connect(ente).createRequest(ethers.parseUnits("20", 18));
      
      await expect(vault.connect(ente).executeRequest(0))
        .to.be.revertedWith("Votazione ancora in corso e maggioranza matematica non raggiunta");
    });

    it("Dovrebbe permettere lo sblocco immediato con la maggioranza matematica", async function () {
        const { vault, ente, donatore1, donatore2 } = await projectWithDonationsFixture();
        await vault.connect(ente).createRequest(ethers.parseUnits("20", 18));
        
        // Entrambi votano SI
        await vault.connect(donatore1).vote(0, true);
        await vault.connect(donatore2).vote(0, true); //Passerebbe anche con un voto solo per la parità
        
        // Esecuzione riuscita senza aspettare 3 giorni
        await expect(vault.connect(ente).executeRequest(0)).to.emit(vault, "RequestExecuted");
    });

    it("Dovrebbe rifiutare la spesa se la votazione fallisce dopo la scadenza", async function () {
        const { vault, ente, donatore1 } = await projectWithDonationsFixture();
        await vault.connect(ente).createRequest(ethers.parseUnits("20", 18));
        
        // Voto NO
        await vault.connect(donatore1).vote(0, false);
        
        // Viaggio nel tempo: +3 giorni
        await time.increase(3 * 86400 + 1);
        
        // La richiesta viene respinta (RequestRejected)
        await expect(vault.connect(ente).executeRequest(0)).to.emit(vault, "RequestRejected");
        expect(await vault.isRequestInProgress()).to.be.false;
    });
  });
});