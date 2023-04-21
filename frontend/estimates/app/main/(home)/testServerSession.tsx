import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function Test() {
  const session = await getServerSession(authOptions);
  console.log("session on serverSide Component", session);
  return <h1>{JSON.stringify(session, null, 2)}</h1>;
}
