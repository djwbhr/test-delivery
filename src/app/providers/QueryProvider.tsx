import React, { PropsWithChildren, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { focusManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { mmkvStorage } from '../../shared/lib/mmkvStorage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 24 * 60 * 60 * 1000,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: mmkvStorage,
});

export function QueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        focusManager.setFocused(state === 'active');
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
