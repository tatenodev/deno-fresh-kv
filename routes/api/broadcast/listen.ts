import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    const channel = new BroadcastChannel("chat");
    const stream = new ReadableStream({
      start: (controller) => {
        const first = {
          id: "first",
          timestamp: new Date().toISOString(),
          body: "Welcom to Deno Deploy Chat!",
        };
        controller.enqueue(
          `data: ${JSON.stringify(first)}\n\n`,
        );
        channel.onmessage = (e) => {
          const body = `data: ${JSON.stringify(e.data)}\n\n`;
          controller.enqueue(body);
        };
      },
      cancel() {
        channel.close();
      },
    });
    return new Response(stream.pipeThrough(new TextEncoderStream()), {
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-store",
      },
    });
  },
};
