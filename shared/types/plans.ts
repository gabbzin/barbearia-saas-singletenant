export interface Plan {
  name: string;
  imageUrl: string | null;
  id: string;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
  priceInCents: number;
  description: string;
  stripePriceId: string | null;
}
