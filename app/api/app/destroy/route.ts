import { getIronSession } from "iron-session"
import { prisma } from "@/lib/prisma"
import { SERVER_SESSION_SETTINGS } from "@/lib/session"

export type User = Awaited<ReturnType<typeof prisma.user.findFirst>>

export async function GET(req: Request) {
  const res = new Response()
  const session = await getIronSession(req, res, SERVER_SESSION_SETTINGS)
  if (session) {
    session.destroy()
    return new Response(
      JSON.stringify({"destroy": "ok"}),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } else {
    return new Response(
      JSON.stringify({"destroy": "ok"}),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }
}
