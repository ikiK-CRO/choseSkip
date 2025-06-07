import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Skip {
  id: string;
  size: string;
  price: number;
  imageUrl: string;
  roadLegal: boolean;
}

const fetchSkips = async (postcode: string, area: string): Promise<{skips: Skip[]}> => {
  const { data } = await axios.get(
    `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${postcode}&area=${area}`
  );
  return data;
};

export const useSkips = (postcode: string, area: string) => {
  return useQuery({
    queryKey: ['skips', postcode, area],
    queryFn: () => fetchSkips(postcode, area),
    select: (data) => data.skips,
  });
};
