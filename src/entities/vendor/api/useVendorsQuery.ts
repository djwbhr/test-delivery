import { useQuery } from '@tanstack/react-query';

import { apiGet } from '../../../shared/api/http';
import { VendorsFilterResponse } from '../model/types';

export const vendorsQueryKey = ['vendors', 'filters', 'v2'] as const;

export function useVendorsQuery() {
  return useQuery({
    queryKey: vendorsQueryKey,
    queryFn: () => apiGet<VendorsFilterResponse>('/api/vendors/filters'),
  });
}
