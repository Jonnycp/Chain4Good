import 'express-session';

declare module 'express-session' {
  interface SessionData {
    nonce?: string;
    address?: string;
    chainId?: number;
  }
}