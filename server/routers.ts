import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { orders } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
} from "./_core/auth";
import * as db from "./db";

// ─── Auth router ────────────────────────────────────────────────────────────
const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await db.getUserByEmail(input.email);
      if (existing) {
        throw new Error("An account with this email already exists");
      }

      const passwordHash = await hashPassword(input.password);
      const result = await db.createUser({
        email: input.email,
        name: input.name,
        passwordHash,
      });

      const user = await db.getUserById(result.insertId);
      if (!user) throw new Error("Failed to create account");

      const sessionToken = await createSessionToken({
        userId: user.id,
        email: user.email!,
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      (ctx.res as any).cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      return { success: true, user: { id: user.id, name: user.name, email: user.email } };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await db.getUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new Error("Invalid email or password");
      }

      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid email or password");
      }

      const sessionToken = await createSessionToken({
        userId: user.id,
        email: user.email!,
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      (ctx.res as any).cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });

      return { success: true, user: { id: user.id, name: user.name, email: user.email } };
    }),

  me: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) return null;
    return {
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      role: ctx.user.role,
    };
  }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    (ctx.res as any).clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),
});

// ─── Orders router ─────────────────────────────────────────────────────────────
const ordersRouter = router({
  /** Create a new order after checkout */
  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            sku: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
            size: z.string(),
            color: z.string(),
          })
        ),
        total: z.number(),
        currency: z.string().default("INR"),
        shippingName: z.string(),
        shippingEmail: z.string().email(),
        shippingAddress: z.string(),
        shippingCity: z.string(),
        shippingCountry: z.string(),
        shippingPostal: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database unavailable");

      const [result] = await database.insert(orders).values({
        userId: ctx.user.id,
        status: "confirmed",
        total: String(input.total),
        currency: input.currency,
        shippingName: input.shippingName,
        shippingEmail: input.shippingEmail,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        shippingCountry: input.shippingCountry,
        shippingPostal: input.shippingPostal,
        items: input.items,
      });

      return {
        success: true,
        orderId: (result as any).insertId,
        orderNumber: `YW-${String((result as any).insertId).padStart(6, "0")}`,
      };
    }),

  /** List orders for the current user */
  list: protectedProcedure.query(async ({ ctx }) => {
    const database = await getDb();
    if (!database) return [];

    const result = await database
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt))
      .limit(50);

    return result.map(o => ({
      ...o,
      orderNumber: `YW-${String(o.id).padStart(6, "0")}`,
    }));
  }),
});

// ─── Newsletter router ─────────────────────────────────────────────────────────
const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      console.log(`[Newsletter] New subscriber: ${input.email}`);
      return { success: true };
    }),
});

// ─── App router ────────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  orders: ordersRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
