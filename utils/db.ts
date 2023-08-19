// https://fresh.deno.dev/docs/examples/creating-a-crud-api
import { User } from "./type.ts";

const kv = await Deno.openKv();

const USER = "user";

export const setUser = async (user: User) => {
  const result = await kv.set([USER, user.id], user);
  return result;
};

export const updateUser = async (user: User, id: string) => {
  const userKey = [USER, id];
  const userRes = await kv.get(userKey);
  if (!userRes.value) throw new Error(`no user with id ${id} found.`);
  const resultOrError = await kv.atomic().check(userRes).set(userKey, user)
    .commit();
  return resultOrError;
};

export const getUserById = async (userId: User["id"]) => {
  const user = await kv.get([USER, userId]);
  return user;
};

export const getAllUser = async () => {
  const users = [];
  // const list = await kv.list({ prefix: [USER] });
  for await (const res of kv.list<User>({ prefix: [USER] })) {
    users.push(res.value);
  }
  return users;
};

export const deleteUserById = async (userId: User["id"]) => {
  const userKey = [USER, userId];
  const userRes = await kv.get(userKey);
  if (!userRes.value) throw new Error(`no user with id ${userId} found.`);
  const resultOrError = await kv.atomic().check(userRes).delete(userKey)
    .commit();
  return resultOrError;
};
