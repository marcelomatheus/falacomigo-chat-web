import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    profile?: {
      name: string;
      photoUrl?: string;
      id: string;
    };
    accessToken: string;
  }

  interface Session {
    accessToken: string;

    user: {
      profile?: {
        id?: string;
        name?: string;
        photoUrl?: string;
      };
      id: string;
      email: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    id: string;
    email?: string;
    profile?: {
      id?: string;
      name?: string;
      photoUrl?: string;
    };
  }
}