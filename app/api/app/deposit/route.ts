import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';

// Solidity contract ABI (Abstract Binary Interface)
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Replace with your contract address
const contractAddress = '0xa763EC2459d41f15aBee53Ff2E5591DFB7B56730';

// Initialize the Ethereum provider
const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia.publicnode.com');

// Initialize the contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
      const userAddress = "0xB5653117d7FE2Da50731B85c6fe53d3133828cf5"

      if (!userAddress) {
          return new Response(JSON.stringify({ error: 'userAddress parameter is missing' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
          });
      }

      // Get the user's balance from the contract
      const balance = await contract.getBalance(userAddress);

      const responseBody = {
          balance: ethers.formatEther(balance),
      };

      return new Response(JSON.stringify(responseBody), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      });
  } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
  }
}



export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
      // Convert amount to Wei (1 Ether = 10^18 Wei)
      const amount = 1.5; // Örnek bir miktar
      const amountInWei = ethers.parseUnits(amount + "");

      // Connect to the user's Ethereum wallet (MetaMask or any Web3 provider)
      const signer = await provider.getSigner("0xc67724051fd288931719fD70f43fb1CA451a5d2f");

      // Connect to the contract with the signer
      const contractWithSigner = contract.connect(signer);

      // Deposit Ether to the contract
      const transaction = await contractWithSigner.deposit({
          value: amountInWei,
      });

      await transaction.wait();

      return new Response(JSON.stringify({ message: 'Deposit successful' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      });
  } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
  }
}