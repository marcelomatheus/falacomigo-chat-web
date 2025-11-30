export interface Profile {
  id: string;
  name: string;
  photoUrl?: string | null;
  userId: string;
  tokensBalance: number;
  learningLang: string | null;
  learningLevel: string | null;
  knownLanguages: string[];
  chatIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterProfileParams {
  search?: string;
  learningLang?: string;
  learningLevel?: string;
  knownLanguages?: string;
  page?: number;
  limit?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'name';
  orderDirection?: 'asc' | 'desc';
}

export interface ProfileWithUser extends Profile {
  user?: {
    email: string;
  };
}

export interface PaginatedProfiles {
  data: ProfileWithUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
