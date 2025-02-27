"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <Image
        src={session.user?.image || ""}
        alt="Profile"
        width={100}
        height={100}
      />
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
