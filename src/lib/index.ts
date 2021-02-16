import axios from "axios";

export async function downloadUser() {
  const res = await axios.get("/users/me");
  return res.data;
}
