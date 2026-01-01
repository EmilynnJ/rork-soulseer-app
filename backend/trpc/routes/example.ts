import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

export const readersRouter = createTRPCRouter({
  getOnline: publicProcedure.query(async () => {
    return [];
  }),
  
  getAll: publicProcedure.query(async () => {
    return [];
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return null;
    }),
});

export const streamsRouter = createTRPCRouter({
  getLive: publicProcedure.query(async () => {
    return [];
  }),
});

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return [];
    }),
});

export const communityRouter = createTRPCRouter({
  getPosts: publicProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      return [];
    }),
});

export const newsletterRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      console.log('Newsletter subscription:', input.email);
      return { success: true };
    }),
});
