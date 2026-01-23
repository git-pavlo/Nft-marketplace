export interface NFT {
  id: string;
  tokenId: string;
  name: string;
  collection: 'Artwork' | 'Portrait' | 'Animal' | 'Other';
  description: string;
  price: number;
  image: string;
  owner: string;
  seller?: string;
  forSale: boolean;
  isMine?: boolean;
  transactionHistory: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'mint' | 'sale' | 'transfer';
  from: string;
  to: string;
  price?: number;
  date: string;
}
