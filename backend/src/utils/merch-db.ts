import { MerchItem } from '@rootTypes';

interface BackendMerchItem extends MerchItem {
  created_at: string;
  updated_at: string;
}

let merchItems: BackendMerchItem[] = [
  {
    id: 'merch1',
    title: 'Echoes On Tape - Classic Logo Tee',
    price: 2500,
    type: 'clothing',
    image: 'https://via.placeholder.com/300/B19CD9/FFFFFF?text=Tee',
    sizes: ['S', 'M', 'L', 'XL'],
    discount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'merch2',
    title: '"Meadow Cushion" Album Art Poster',
    price: 1500,
    type: 'poster',
    image: 'https://via.placeholder.com/300/C0B6F2/FFFFFF?text=Poster',
    discount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'merch3',
    title: 'EOT Logo Beanie',
    price: 1800,
    type: 'accessory',
    image: 'https://via.placeholder.com/300/B19CD9/FFFFFF?text=Beanie',
    sizes: ['One Size'],
    discount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'merch4',
    title: '"Cosmic Drift" Longsleeve',
    price: 3200,
    type: 'clothing',
    image: 'https://via.placeholder.com/300/C0B6F2/FFFFFF?text=Longsleeve',
    sizes: ['M', 'L'],
    discount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getAllMerchItems = async (): Promise<BackendMerchItem[]> => {
  // Simulate async operation
  return new Promise(resolve => setTimeout(() => resolve(merchItems), 500));
};

export const getMerchItemById = async (id: string): Promise<BackendMerchItem | undefined> => {
  // Simulate async operation
  return new Promise(resolve => setTimeout(() => resolve(merchItems.find(item => item.id === id)), 500));
};
