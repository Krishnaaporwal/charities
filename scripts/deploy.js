import hardhat from "hardhat";
const { ethers } = hardhat;


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    const contractFactory = await ethers.getContractFactory("EscrowDonation");
    const contract = await contractFactory.deploy(ethers.parseEther("0.1")); // ✅ Corrected

    await contract.deployed();
    console.log("Contract deployed at:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
