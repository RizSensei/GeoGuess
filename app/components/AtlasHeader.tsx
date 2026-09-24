"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import GoogleButtons from "./GoogleButtons";

export default function AtlasHeader() {
  const { data: session } = useSession();

  return (
    <header className="atlas-header">
      <div className="atlas-brand">
        <a className="wordmark" href="/" aria-label="GeoGuess home">
          GeoGuess
        </a>
      </div>
      <nav className="account-nav" aria-label="Account navigation">
        {session?.user?.image && (
          <Image
            src={session?.user?.image}
            alt="user image"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
        )}
        <span>{session?.user?.name}</span>
        <span>BEST 1</span>
        <GoogleButtons type="signout" />
      </nav>
    </header>
  );
}
