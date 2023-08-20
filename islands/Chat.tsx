import { Signal, useSignal } from "@preact/signals";
import type { Message } from "../utils/type.ts";
import { useEffect } from "preact/hooks";

enum ConnectionState {
  Connecting,
  Connected,
  Disconnected,
}

export function Chat() {
  const connectionState = useSignal(ConnectionState.Disconnected);
  const messages = useSignal<Message[]>([]);
  const sendMessage = useSignal("");

  const onSend = async (msg: string) => {
    console.log("hoge", msg);
    if (msg === "") {
      console.log("return");
      return;
    }
    const res = await fetch("http://localhost:8000/api/broadcast/send", {
      method: "POST",
      body: JSON.stringify({ body: msg }),
    });
    console.log("res:", res);
    sendMessage.value = "";
  };

  useEffect(() => {
    const events = new EventSource("/api/broadcast/listen");
    events.addEventListener(
      "open",
      () => connectionState.value = ConnectionState.Connected,
    );

    events.addEventListener("error", () => {
      switch (events.readyState) {
        case EventSource.OPEN:
          connectionState.value = ConnectionState.Connected;
          break;
        case EventSource.CONNECTING:
          connectionState.value = ConnectionState.Connecting;
          break;
        case EventSource.CLOSED:
          connectionState.value = ConnectionState.Disconnected;
          break;
      }
    });

    events.addEventListener("message", (e) => {
      console.log("event!", e.data);
      const message = JSON.parse(e.data);
      messages.value = [...messages.value, message];
      console.log("messages", messages.value);
    });
  }, []);

  return (
    <div>
      <p>Chat Component</p>
      <p>Connection state: {connectionState.value}</p>
      <div>
        <label htmlFor="">message:</label>
        <input
          type="text"
          value={sendMessage.value}
          onChange={(e) => sendMessage.value = e.currentTarget.value}
          onKeyDown={(e) => e.key === "Enter" && onSend(e.currentTarget.value)}
        />
      </div>
      {messages.value.map((message) => (
        <div>
          <p>id: {message.id}</p>
          <p>body: {message.body}</p>
          <p>timestamp: {message.timestamp}</p>
          <div>==========================</div>
        </div>
      ))}
    </div>
  );
}
