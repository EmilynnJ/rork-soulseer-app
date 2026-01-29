import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  const url = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (url) {
    return url;
  }

  return '';
};

const customFetch: typeof fetch = async (url, options) => {
  const response = await fetch(url, options);
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.warn('tRPC received non-JSON response, creating error response');
    return new Response(
      JSON.stringify({
        error: {
          message: 'Server returned non-JSON response',
          code: 'INTERNAL_SERVER_ERROR',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  return response;
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: customFetch,
    }),
  ],
});
