import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from "iron-session"
import { SERVER_SESSION_SETTINGS } from "@/lib/session"

// Solidity contract ABI (Abstract Binary Interface)
const contractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const contractAddress = '0xBa5393Ee98b3cA41c5ed363c22444185A99Bca08';
const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia.publicnode.com');
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
      const session = await getIronSession(req, res, SERVER_SESSION_SETTINGS)
      const userAddress = session.siwe.address

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