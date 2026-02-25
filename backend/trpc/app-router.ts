import { createTRPCRouter } from "./create-context";
import { 
  readersRouter, 
  streamsRouter, 
  productsRouter, 
  communityRouter,
  newsletterRouter,
  adminRouter,
  readerDashboardRouter,
  clientDashboardRouter,
} from "./routes/example";

export const appRouter = createTRPCRouter({
  readers: readersRouter,
  streams: streamsRouter,
  products: productsRouter,
  community: communityRouter,
  newsletter: newsletterRouter,
  admin: adminRouter,
  readerDashboard: readerDashboardRouter,
  clientDashboard: clientDashboardRouter,
});

export type AppRouter = typeof appRouter;
