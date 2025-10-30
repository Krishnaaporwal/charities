import hardhat from "hardhat";
const { ethers } = hardhat;


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

    // Deploy EscrowDonation contract
    const contractFactory = await ethers.getContractFactory("EscrowDonation");
    
    // Constructor parameters:
    // 1. campaignOwner (address payable) - using deployer for demo
    // 2. fundingGoal (uint256) - setting 1 ETH as example goal
    // Plus platform fee (0.01 ETH) sent as msg.value
    const platformFee = ethers.parseEther("0.01");
    const fundingGoal = ethers.parseEther("1.0");
    
    console.log("Deploying with platform fee:", ethers.formatEther(platformFee), "ETH");
    
    const contract = await contractFactory.deploy(
        deployer.address, // campaignOwner
        fundingGoal,      // fundingGoal
        { value: platformFee } // msg.value for platform fee
    );

    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    console.log("✅ Contract deployed successfully!");
    console.log("Contract address:", contractAddress);
    console.log("Campaign Owner:", deployer.address);
    console.log("Funding Goal:", ethers.formatEther(fundingGoal), "ETH");
    console.log("Platform Fee:", ethers.formatEther(platformFee), "ETH");
    console.log("\n📝 Update this address in client/src/lib/smartContract.ts");
    console.log("   CROWDFUNDING_CONTRACT_ADDRESS =", `"${contractAddress}"`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
