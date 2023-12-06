import { getIronSession } from "iron-session"
import { prisma } from "@/lib/prisma"
import { SERVER_SESSION_SETTINGS } from "@/lib/session"

export type User = Awaited<ReturnType<typeof prisma.user.findFirst>>

export async function GET(req: Request) {
  const res = new Response()
  const session = await getIronSession(req, res, SERVER_SESSION_SETTINGS)
  const user = await prisma.user.findFirst({
    where: { id: session.siwe.address },
  })


  if (session.siwe) {
    return new Response(
      JSON.stringify({
        address: session.siwe.address,
        igc: user.igc,
        isLoggedIn: true,
        isAdmin: session.isAdmin,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } else {
    return new Response(
      JSON.stringify({
        isLoggedIn: false,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }
}
