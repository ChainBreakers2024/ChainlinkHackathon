import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from "iron-session"
import { SERVER_SESSION_SETTINGS } from "@/lib/session"
import { getContractABI, getProvider, getContractAddress } from '@/lib/contract';

const contractABI = getContractABI()
const contractAddress = getContractAddress()
const provider = getProvider()
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
      const balance = await contract.getContractBalance();

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