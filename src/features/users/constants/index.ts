export const LANGUAGE_OPTIONS = [
  { value: "pt", label: "Português" },
  { value: "en", label: "Inglês" },
  { value: "es", label: "Espanhol" },
  { value: "fr", label: "Francês" },
  { value: "de", label: "Alemão" },
  { value: "it", label: "Italiano" },
  { value: "ja", label: "Japonês" },
  { value: "ko", label: "Coreano" },
  { value: "zh", label: "Chinês" },
] as const;

export const LANGUAGE_NAMES: Record<string, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  fr: "Francês",
  de: "Alemão",
  it: "Italiano",
  ja: "Japonês",
  ko: "Coreano",
  zh: "Chinês",
};

export const LEVEL_OPTIONS = [
  { value: "A1", label: "A1 - Iniciante" },
  { value: "A2", label: "A2 - Básico" },
  { value: "B1", label: "B1 - Intermediário" },
  { value: "B2", label: "B2 - Intermediário Avançado" },
  { value: "C1", label: "C1 - Avançado" },
  { value: "C2", label: "C2 - Proficiente" },
] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  orderBy: "createdAt" as const,
  orderDirection: "desc" as const,
};

export const MESSAGES_PAGINATION = {
  limit: 50,
  orderDirection: "asc" as const,
};
