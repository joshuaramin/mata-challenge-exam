import jwt from "jsonwebtoken";
import { Context, Next } from "koa";
import { isValidVersion } from "../apiVersion";

const JWT_SECRET = process.env.JWT_SECRET!;
const VALID_API_KEYS = (process.env.API_KEYS || "testing").split(",");

export interface UserPayload {
  user_id: string;
  email: string;
  role?: string;
  is_deleted: boolean;
  [key: string]: any;
}

declare module "koa" {
  interface DefaultContext {
    user?: UserPayload;
    apiVersion?: string;
    apiKey?: string;
  }
}

export default async function withAuth(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization;
  const version = ctx.headers["x-api-version"] as string;
  const apiKey = ctx.headers["x-api-key"] as string;

  if (!version) {
    ctx.status = 401;
    ctx.body = { message: "API version is required" };
    return;
  }
  if (!isValidVersion(version)) {
    ctx.status = 401;
    ctx.body = { message: `Invalid API version: ${version}` };
    return;
  }

  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    ctx.status = 401;
    ctx.body = { message: "Invalid API key" };
    return;
  }

  const token = authHeader?.split(" ")[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: "Access Denied. No token provided" };
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as UserPayload;

    ctx.user = user;
    ctx.apiVersion = version;
    ctx.apiKey = apiKey;
    await next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    ctx.status = 401;
    ctx.body = { message: "Invalid or expired token" };
  }
}
