import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    const msg = await req.json();
    const body = msg["body"];
    if (typeof body !== "string") {
      return new Response("invalid body", { status: 404 });
    }

    const channel = new BroadcastChannel("chat");

    const message = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      body,
    };

    console.log("body", message);

    channel.postMessage(message);
    channel.close();

    return new Response("message sent");
  },
};
