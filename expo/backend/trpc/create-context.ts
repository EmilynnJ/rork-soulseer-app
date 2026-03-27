import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export const createContext = async ({ req }: { req: Request }) => {
  const authHeader = req.headers.get("authorization");
  
  return {
    req,
    authHeader,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure;
