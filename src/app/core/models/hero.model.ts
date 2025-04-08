export interface Hero {
  id: string;
  name: string;
  alterEgo?: string;
  publisher?: string;
  abilities?: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeroFilter {
  name?: string;
  page?: number;
  limit?: number;
}