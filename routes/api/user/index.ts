import { Handlers } from "$fresh/server.ts";
import { getAllUser, setUser } from "../../../utils/db.ts";
import { User } from "../../../utils/type.ts";

export const handler: Handlers<User> = {
  async GET(_req) {
    const result = await getAllUser();
    return new Response(JSON.stringify(result));
  },
  async POST(req) {
    const res: User = await req.json();
    const commit = await setUser(res);
    return new Response(JSON.stringify(commit));
  },
};
