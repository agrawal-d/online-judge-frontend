import axios from "axios";

export async function downloadUser() {
  const res = await axios.get("/users/me");
  return res.data;
}

export function clone<T>(arg: T) {
  return Object.assign({}, arg) as T;
}

/** Returns if firstDate is in the past compared to secondDate */
export function dateInPast(
  firstDate: Date,
  secondDate: Date = new Date(Date.now())
) {
  if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
    return true;
  }

  return false;
}
