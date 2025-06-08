import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Skip {
  id: string;
  size: string;
  price: number;
  imageUrl: string;
  roadLegal: boolean;
}

interface ApiSkip {
  id: number;
  size: number;
  price_before_vat: number;
  allowed_on_road: boolean;
}

const fetchSkips = async (postcode: string, area: string): Promise<ApiSkip[]> => {
  const { data } = await axios.get(
    `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${postcode}&area=${area}`
  );
  return data;
};

export const useSkips = (postcode: string, area: string) => {
  return useQuery({
    queryKey: ['skips', postcode, area],
    queryFn: () => fetchSkips(postcode, area),
    select: (data: ApiSkip[]): Skip[] => {
      return data.map((item) => ({
        id: item.id.toString(),
        size: `${item.size} Yard`,
        price: item.price_before_vat,
        roadLegal: item.allowed_on_road,
        imageUrl: `/skip-img/${item.size}-yarder-skip.webp`,
      }));
    },
  });
};
