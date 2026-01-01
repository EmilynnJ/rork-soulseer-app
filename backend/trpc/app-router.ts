import { createTRPCRouter } from "./create-context";
import { 
  readersRouter, 
  streamsRouter, 
  productsRouter, 
  communityRouter,
  newsletterRouter 
} from "./routes/example";

export const appRouter = createTRPCRouter({
  readers: readersRouter,
  streams: streamsRouter,
  products: productsRouter,
  community: communityRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
