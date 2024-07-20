import axios from "axios";

const API_INSTANCE = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/",
});

export async function GET(uri: string) {
  return await API_INSTANCE.get(uri);
}
export async function POST(uri: string, body: any) {
  return await API_INSTANCE.post(uri, body);
}
