import { Handlers } from "$fresh/server.ts";
import { deleteUserById, getUserById, updateUser } from "../../../utils/db.ts";
import { User } from "../../../utils/type.ts";

export const handler: Handlers<User> = {
  async GET(_req, ctx) {
    const { id } = ctx.params;
    const user = await getUserById(id);
    return new Response(JSON.stringify(user));
  },
  async PUT(req, ctx) {
    const { id } = ctx.params;
    const user: User = await req.json();
    const ok = updateUser(user, id);
    if (!ok) throw new Error("Something went wrong.");
    return new Response(JSON.stringify(user));
  },
  async DELETE(_req, ctx) {
    const { id } = ctx.params;
    const ok = await deleteUserById(id);
    if (!ok) throw new Error("Something went wrong.");
    return new Response(`user ${id} deleted.`);
  },
};
