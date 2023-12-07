import { Users } from "@/app/api/app/users/route";
import axios from "axios";
import { ethers } from "ethers";
import { getContractABI, getContractAddress, getProvider } from "../contract";

const contractABI = getContractABI()
const contractAddress = getContractAddress()
const provider = getProvider()
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export async function depositTransaction(amount: string) {
  const amountInWei = ethers.parseEther(amount);

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const transaction = await contractWithSigner.deposit({
      value: amountInWei,
    });

    await transaction.wait();

    return JSON.stringify({ message: 'Deposit successful' });
  } catch (error) {
    if (error.message.includes('insufficient funds')) {
      console.log('Insufficient funds for the transaction.');
    } else {
      console.error('Error during deposit:', error);
    }

    return JSON.stringify({ message: 'Deposit failed' });
  }
}
