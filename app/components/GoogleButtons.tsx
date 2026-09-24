"use client";
import { signIn, signOut } from "next-auth/react";

type GoogleButtonsProps = {
  type?: "signin" | "signout";
  className?: string;
};

const GoogleButtons = ({ type = "signin", className = "google-button" }: GoogleButtonsProps) => {
  if (type === "signout") {
    return (
      <button onClick={() => signOut({ callbackUrl: "/" })} className={className}>
        <span>Sign out</span>
      </button>
    );
  }

  return (
    <button onClick={() => signIn("google")} className={className}>
      <span className="google-mark" aria-hidden="true">
        G
      </span>
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleButtons;
