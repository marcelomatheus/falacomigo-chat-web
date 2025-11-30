import { FilterProfileParams, ProfileWithUser } from "./profile.interface";

export interface UsersFeatureProps {
  onStartChat?: (profile: ProfileWithUser) => void;
  className?: string;
}

export interface UsersListProps {
  users: ProfileWithUser[];
  isLoading?: boolean;
  onViewProfile: (userId: string) => void;
  onStartChat: (profile: ProfileWithUser) => void;
  className?: string;
}

export interface UserListItemProps {
  profile: ProfileWithUser;
  onViewProfile: () => void;
  onStartChat: () => void;
  className?: string;
}

export interface UserProfileProps {
  profile: ProfileWithUser;
  onStartChat: () => void;
  onBack?: () => void;
  className?: string;
}

export interface UserSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export interface UserSearchFilterProps {
  filters: FilterProfileParams;
  onFiltersChange: (filters: FilterProfileParams) => void;
  className?: string;
}
