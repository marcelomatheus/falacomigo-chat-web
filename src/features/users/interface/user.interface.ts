export interface User {
  id: string;
  email: string;
  lastLoginTimestamp?: Date | null;
  confirmEmailTimestamp?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterUserParams {
  email?: string;
}
