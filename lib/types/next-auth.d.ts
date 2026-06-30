import "next-auth";
import "next-auth/jwt";

/**
 * Extend NextAuth types so TypeScript knows about our custom fields.
 *
 * accessToken = JWT from backend login (POST /api/auth/login → data.token)
 * We store it in the NextAuth session and send it as:
 *   Authorization: Bearer <accessToken>
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
    };
    /** Backend JWT — use with apiFetchAuth() on the server */
    accessToken?: string;
  }

  interface User {
    id: string;
    role: string;
    /** Set in authorize() after backend login */
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    /** Persisted in the encrypted session cookie between requests */
    accessToken?: string;
  }
}
