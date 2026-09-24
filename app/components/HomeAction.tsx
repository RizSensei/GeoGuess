"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import GoogleButtons from "./GoogleButtons";

export default function HomeAction() {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <Link className="primary-button" href="/start-journey">
        Dive into the Game
      </Link>
    );
  }

  return <GoogleButtons />;
}