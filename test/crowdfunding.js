(async () => {
    const chai = await import('chai');
    const { expect } = chai;
    const { ethers } = require('hardhat');
  
    describe("Basic Functionality Test", function () {
      it("Should fetch the list of accounts", async function () {
        const accounts = await ethers.getSigners();
        console.log("Accounts:", accounts.map(account => account.address));
        expect(accounts).to.be.an('array').that.is.not.empty;
      });
    });
  
    // This line ensures Mocha doesn't start before the imports are ready
    run();
  })();
  