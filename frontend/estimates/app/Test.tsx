"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Test() {
  const { data: session, status } = useSession();
  console.log(session);
  
  if (!session) {
    return (
      <>
        {" "}
        <button onClick={() => signIn()}>sign in</button>
      </>
    );
  } else {
    return (
      <>
        <button onClick={() => signOut()}>SignOut</button>
      </>
    );
  }
}
