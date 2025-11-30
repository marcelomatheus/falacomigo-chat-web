"use client";

import { useState, useMemo } from "react";
import { UserSearchInput } from "./components/user-search-input";
import { UserSearchFilter } from "./components/user-search-filter";
import { UsersList } from "./components/users-list";
import { UserProfile } from "./components/user-profile";
import { useProfiles } from "./hooks/useProfile";
import { FilterProfileParams, ProfileWithUser } from "./interface/profile.interface";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface UsersFeatureProps {
  onStartChat?: (profile: ProfileWithUser) => void;
  className?: string;
}

export default function UsersFeature({
  onStartChat,
  className,
}: UsersFeatureProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentProfileId = session?.user?.profile?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterProfileParams>({
    page: 1,
    limit: 20,
    orderBy: "createdAt",
    orderDirection: "desc",
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      ...filters,
      search: searchQuery || undefined,
    }),
    [filters, searchQuery]
  );

  const { data: profilesResponse, isLoading } = useProfiles(queryParams);
  const profiles = Array.isArray(profilesResponse)
    ? profilesResponse
    : profilesResponse?.data ?? [];
  const filteredProfiles = profiles.filter(
    (profile) => profile.id !== currentProfileId,
  );

  const handleViewProfile = (profileId: string) => {
    setSelectedUserId(profileId);
  };

  const handleStartChat = (profile: ProfileWithUser) => {
    if (onStartChat) {
      onStartChat(profile);
    } else {
      router.push(`/chat?profileId=${profile.id}`);
    }
  };

  const selectedProfile = filteredProfiles.find(
    (profile) => profile.id === selectedUserId,
  );

  const showProfile = selectedUserId && selectedProfile;

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {showProfile ? (
        <div className="md:hidden h-full">
          <UserProfile
            profile={selectedProfile}
            onStartChat={() => handleStartChat(selectedProfile)}
            onBack={() => setSelectedUserId(null)}
          />
        </div>
      ) : (
        <>
          <div className="p-4 space-y-3 border-b border-border bg-card">
            <h2 className="text-lg font-semibold">Buscar Usuários</h2>
            <div className="flex gap-2">
              <UserSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <UserSearchFilter
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <UsersList
              users={filteredProfiles}
              isLoading={isLoading}
              onViewProfile={handleViewProfile}
              onStartChat={handleStartChat}
            />
          </div>
        </>
      )}
    </div>
  );
}
