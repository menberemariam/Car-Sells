// src/express-session.d.ts

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number; // ← change to string if your user.id is string
  }
}
