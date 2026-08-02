import { useCallback, useEffect, useState } from 'react';
import { SliderRepository } from '@/data/repositories/home/slider-repository';
import { SliderImage } from '@/domain/models/home/slider-image';

/** Fetches the home banners. Failure leaves the list empty, which hides the
 *  carousel — a home screen with no banner is fine; a broken one is not. */
export const useSliderImages = () => {
  const [data, setData] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setData(await SliderRepository.getSliderImages());
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, reload: load };
};
