import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || 'dummy',
      clientSecret: process.env.APPLE_SECRET || 'dummy',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'secret_temporary_dev',
});

export { handler as GET, handler as POST };