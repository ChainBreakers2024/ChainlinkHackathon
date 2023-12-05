import { initSocket } from "@/lib/socketio";
import { getIronSession } from "iron-session"
import { SERVER_SESSION_SETTINGS } from "@/lib/session"

export async function GET(req: Request) {
  try {
    const res = new Response()
    const session = await getIronSession(req, res, SERVER_SESSION_SETTINGS)

    if (session.siwe) {
      const socket = initSocket();
      const promise = new Promise((resolve, reject) => {
        socket.emit("new_room", session.siwe.address + Math.random());
        socket.emit("get_rooms", session.siwe.address);
        socket.on("get_rooms", (data: any) => {
          const lobiList = data;
          resolve(lobiList);
        });
      });
  
      const lobiList = await promise;
      return new Response(JSON.stringify(lobiList));

    } else {
      return new Response(
        JSON.stringify({
          isLoggedIn: false,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(errorMessage, { status: 500 });
  }
}
