import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import EscrowDonationABI from "./EscrowDonation.json"; // Add your ABI here

const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; // Replace with deployed address

export async function getContract() {
    const provider = await detectEthereumProvider();

    if (!provider) {
        console.error("MetaMask not found");
        return null;
    }

    await provider.request({ method: "eth_requestAccounts" });
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, EscrowDonationABI, signer);
}

export async function donate(amount) {
    const contract = await getContract();
    if (!contract) return;
    
    try {
        const tx = await contract.donate({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        console.log("Donation successful!");
    } catch (error) {
        console.error("Donation failed:", error);
    }
}

export async function withdrawFunds() {
    const contract = await getContract();
    if (!contract) return;

    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        console.log("Funds withdrawn successfully!");
    } catch (error) {
        console.error("Withdrawal failed:", error);
    }
}
