import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-openid",
    email: "test@ywee.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createAnonContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
    const { ctx } = createAuthContext();
    ctx.res.clearCookie = (name: string, options: Record<string, unknown>) => {
      clearedCookies.push({ name, options });
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
  });
});

describe("auth.me", () => {
  it("returns the current user when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@ywee.com");
  });

  it("returns null when not authenticated", async () => {
    const { ctx } = createAnonContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

describe("newsletter.subscribe", () => {
  it("accepts a valid email and returns success", async () => {
    const { ctx } = createAnonContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.newsletter.subscribe({ email: "subscriber@example.com" });
    expect(result).toEqual({ success: true });
  });

  it("rejects an invalid email", async () => {
    const { ctx } = createAnonContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.newsletter.subscribe({ email: "not-an-email" })
    ).rejects.toThrow();
  });
});

describe("orders.list (protected)", () => {
  it("throws UNAUTHORIZED when not authenticated", async () => {
    const { ctx } = createAnonContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.orders.list()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

describe("orders.create (protected)", () => {
  it("throws UNAUTHORIZED when not authenticated", async () => {
    const { ctx } = createAnonContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.orders.create({
        items: [{ productId: 1, sku: "YW001", name: "Test", price: 100, quantity: 1, size: "M", color: "Black" }],
        total: 100,
        currency: "USD",
        shippingName: "Test User",
        shippingEmail: "test@example.com",
        shippingAddress: "123 Test St",
        shippingCity: "London",
        shippingCountry: "GB",
        shippingPostal: "SW1A 1AA",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
