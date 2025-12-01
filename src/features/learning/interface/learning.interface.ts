export interface LearningItem {
  id: string;
  profileId: string;
  messageId: string;
  title: string;
  explanation: string;
  example: string;
  targetLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedLearning {
  data: LearningItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterLearningParams {
  profileId: string;
  title?: string;
  page?: number;
  limit?: number;
  orderBy?: 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}