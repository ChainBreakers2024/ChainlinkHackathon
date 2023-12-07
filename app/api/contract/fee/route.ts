import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getContractABI, getProvider, getContractAddress } from '@/lib/contract';

const contractABI = getContractABI()
const contractAddress = getContractAddress()
const provider = getProvider()
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
      const fee = await contract.getFeePercentage();
      const feestring = ethers.formatUnits(fee, 1)

      return new Response(JSON.stringify(feestring), {
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