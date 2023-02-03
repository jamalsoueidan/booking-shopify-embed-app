import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "react-query";

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
export function QueryProvider({ children }) {
  const client = new QueryClient({
    defaultOptions: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutationCache: new MutationCache(),
    queryCache: new QueryCache(),
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
