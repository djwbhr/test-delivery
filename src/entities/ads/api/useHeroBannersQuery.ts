import { useQuery } from '@tanstack/react-query';

import { apiGet } from '../../../shared/api/http';
import { HeroBannersResponse } from '../model/types';

export const heroBannersQueryKey = ['ads', 'hero-banners'] as const;

export function useHeroBannersQuery() {
  return useQuery({
    queryKey: heroBannersQueryKey,
    queryFn: () => apiGet<HeroBannersResponse>('/api/customer/ads/hero-banners'),
  });
}
