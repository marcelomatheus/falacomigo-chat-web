export const USER_QUERY_KEYS = {
  users: (params?: unknown) => ["users", params] as const,
  user: (id: string) => ["user", id] as const,
  currentUser: () => ["user", "me"] as const,
  profiles: (params?: unknown) => ["profiles", params] as const,
  profile: (id: string) => ["profile", id] as const,
  profileByUser: (userId: string) => ["profile", "user", userId] as const,
  myProfile: () => ["profile", "me"] as const,
} as const;
