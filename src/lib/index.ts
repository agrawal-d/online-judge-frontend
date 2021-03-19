import axios from "axios";

export async function downloadUser() {
  const res = await axios.get("/users/me");
  return res.data;
}

export function clone<T>(arg: T) {
  return Object.assign({}, arg) as T;
}
