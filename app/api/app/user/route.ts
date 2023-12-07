import { getIronSession } from "iron-session"
import { prisma } from "@/lib/prisma"
import { SERVER_SESSION_SETTINGS } from "@/lib/session"
import axios from "axios"
import { getContractABI, getProvider, getContractAddress } from "@/lib/contract"
import { ethers } from "ethers"

const contractABI = getContractABI()
const contractAddress = getContractAddress()
const provider = getProvider()
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export type User = Awaited<ReturnType<typeof prisma.user.findFirst>>
interface AxiosResponseData {
  balance: string
}
export async function GET(req: Request) {
  const res = new Response()
  const session = await getIronSession(req, res, SERVER_SESSION_SETTINGS)

  if (session.siwe) {
    try {
      const balance = await contract.userBalances(session.siwe.address);
      const balancefixed = ethers.formatEther(balance)

      return new Response(
        JSON.stringify({
          address: session.siwe.address,
          igc: balancefixed,
          isLoggedIn: true,
          isAdmin: session.isAdmin,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    } catch (error) {
      console.error("Error fetching balance:", error)
      return new Response(
        JSON.stringify({
          error: "Error fetching balance",
          isLoggedIn: true,
          isAdmin: session.isAdmin,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }
  } else {
    return new Response(
      JSON.stringify({
        isLoggedIn: false,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }
}
