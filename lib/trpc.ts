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

const customFetch: typeof fetch = async (input, init) => {
  try {
    const response = await fetch(input, init);
    
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      console.warn(`tRPC fetch failed with status ${response.status}`);
      const text = await response.text();
      console.warn('Response body:', text.substring(0, 200));
      
      return new Response(
        JSON.stringify({
          error: {
            message: `Server error: ${response.status}`,
            code: 'INTERNAL_SERVER_ERROR',
          },
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('tRPC received non-JSON response, content-type:', contentType);
      const text = await response.text();
      console.warn('Response body:', text.substring(0, 200));
      
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
  } catch (error) {
    console.error('tRPC fetch error:', error);
    return new Response(
      JSON.stringify({
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          code: 'INTERNAL_SERVER_ERROR',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
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
