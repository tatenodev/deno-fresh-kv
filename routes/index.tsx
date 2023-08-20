import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { KVDemo } from "../islands/KVDemo.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getAllUser } from "../utils/db.ts";
import { User } from "../utils/type.ts";
import { Chat } from "../islands/Chat.tsx";

type Context = {
  users: User[];
};

export const handler: Handlers<Context> = {
  async GET(_req, ctx) {
    const result = await getAllUser();
    return ctx.render({ users: result });
  },
};

export default function Home({ data }: PageProps<Context>) {
  const count = useSignal(3);
  const { users } = data;
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
        <Counter count={count} />
      </div>
      <KVDemo users={users} />
      <Chat />
    </div>
  );
}
