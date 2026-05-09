import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";
import { ENV } from "./env";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import type { Request } from "express";
import { parse as parseCookieHeader } from "cookie";

// Lazy bcryptjs import to avoid bundling issues
let _bcrypt: typeof import("bcryptjs") | null = null;
async function getBcrypt() {
  if (!_bcrypt) {
    _bcrypt = await import("bcryptjs");
  }
  return _bcrypt;
}

export type SessionPayload = {
  userId: number;
  email: string;
};

function getSessionSecret() {
  const secret = ENV.cookieSecret || "ywee-default-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await getBcrypt();
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await getBcrypt();
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  const secretKey = getSessionSecret();
  const now = Date.now();
  const expirationSeconds = Math.floor((now + ONE_YEAR_MS) / 1000);

  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(secretKey);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const secretKey = getSessionSecret();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    const { userId, email } = payload as Record<string, unknown>;

    if (typeof userId !== "number" || typeof email !== "string") {
      return null;
    }

    return { userId, email };
  } catch {
    return null;
  }
}

function parseCookies(
  cookieHeader: string | undefined
): Map<string, string> {
  if (!cookieHeader) return new Map();
  return new Map(Object.entries(parseCookieHeader(cookieHeader)));
}

export async function authenticateRequest(
  req: Request
): Promise<User | null> {
  const cookies = parseCookies((req as any).headers?.cookie);
  const sessionCookie = cookies.get(COOKIE_NAME);

  if (!sessionCookie) return null;

  const session = await verifySessionToken(sessionCookie);
  if (!session) return null;

  const user = await db.getUserById(session.userId);
  return user ?? null;
}
