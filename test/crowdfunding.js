describe("Crowdfunding Contract", function () {
    let ethers;

    before(async function () {
        try {
            const hardhat = await import("hardhat");
            console.log("Imported Hardhat:", hardhat);
            ethers = hardhat.ethers;
            console.log("Ethers loaded:", !!ethers);
        } catch (error) {
            console.error("Error importing Hardhat:", error);
        }

        if (!ethers) {
            throw new Error("Ethers is not initialized");
        }
    });

    it("should test if ethers is loaded", function () {
        console.log("Testing if ethers is loaded...");
        if (!ethers) {
            throw new Error("Failed to load ethers");
        }
    });
});
