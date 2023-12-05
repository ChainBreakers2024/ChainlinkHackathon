import { initSocket } from "@/lib/socketio";

export async function GET(req: Request) {
  try {
    const socket = initSocket();
    const promise = new Promise((resolve, reject) => {
      socket.emit("get_rooms", "temp");
      socket.on("get_rooms", (data: any) => {
        const lobiList = data;
        resolve(lobiList);
      });
    });

    const lobiList = await promise;
    return new Response(JSON.stringify(lobiList));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(errorMessage, { status: 500 });
  }
}
