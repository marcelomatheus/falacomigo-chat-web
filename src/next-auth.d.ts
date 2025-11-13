import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    accessToken: string;
  }

  interface Session {
    accessToken: string;
    user: {
      id: string;
    } & DefaultSession['user']; 
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    id: string;
  }
}