"use client";
import { signIn, signOut, useSession } from "next-auth/react";

const GoogleButtons = ({ type = "signin" } : {type?: "signin" | "signout";}) => {
  const { data: session } = useSession();
  console.log("data:", session)

  if ( type === "signout" ) {
    return (
    <button onClick={() => signOut()} className="google-button">
      <span className="google-mark" aria-hidden="true">
        G
      </span>
      <span>Sign out</span>
    </button>
    )
  }
  
  return (
    <button onClick={() => signIn("google")} className="google-button">
      <span className="google-mark" aria-hidden="true">
        G
      </span>
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleButtons;
