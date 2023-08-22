import { tw } from "twind";
import { css } from "twind/css";
import { User } from "../utils/type.ts";
import { useSignal } from "@preact/signals";

type KVDemoProps = {
  users: User[];
};

const SampleStyle = css`
  font-size: 20px;
  color: red;
`;

export function KVDemo({ users }: KVDemoProps) {
  const pageUsers = useSignal(users);
  const user = useSignal({ id: "", name: "" });

  const handleGetUser = async () => {
    const user = await fetch(`${location.origin}/api/user`);
    const result: User[] = await user.json();
    pageUsers.value = [...result];
    console.log(result);
  };

  const handleCreateUser = async (id: string, name: string) => {
    const res = await fetch(`${location.origin}/api/user`, {
      method: "POST",
      body: JSON.stringify({ id, name }),
    });
    const data = await res.json();
    console.log("res:", data);
    handleGetUser();
  };

  const handleDeleteUser = async (id: string) => {
    const res = await fetch(`${location.origin}/api/user/${id}`, {
      method: "DELETE",
    });
    console.log("res:", res);
    handleGetUser();
  };

  return (
    <>
      <button
        onClick={handleGetUser}
        class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors"
      >
        get users
      </button>
      <div>
        <label htmlFor="">id</label>
        <input
          type="text"
          value={user.value.id}
          onChange={(e) => user.value.id = e.currentTarget.value}
        />
      </div>
      <div>
        <label htmlFor="">name</label>
        <input
          type="text"
          value={user.value.name}
          onChange={(e) => user.value.name = e.currentTarget.value}
        />
      </div>
      <button
        onClick={() => handleCreateUser(user.value.id, user.value.name)}
        class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors"
      >
        create user
      </button>
      <button
        onClick={() => handleDeleteUser(user.value.id)}
        class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors"
      >
        delete user
      </button>
      <div class={tw`${SampleStyle}`}>User List</div>
      {JSON.stringify(pageUsers.value)}
    </>
  );
}
