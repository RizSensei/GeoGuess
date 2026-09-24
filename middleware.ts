import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/start-journey/:path*", "/guess/:path*", "/journey-end/:path*"],
};