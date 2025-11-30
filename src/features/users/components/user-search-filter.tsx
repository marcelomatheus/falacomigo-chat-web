"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FilterProfileParams } from "../interface/profile.interface";
import { UserSearchFilterProps } from "../interface/component-props.interface";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGE_OPTIONS, LEVEL_OPTIONS } from "../constants";

export function UserSearchFilter({
  filters,
  onFiltersChange,
  className,
}: UserSearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setShowFilters(false);
  };

  const handleReset = () => {
    const resetFilters: FilterProfileParams = {
      page: 1,
      limit: 10,
      orderBy: "createdAt",
      orderDirection: "desc",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFiltersCount = [
    localFilters.learningLang,
    localFilters.learningLevel,
    localFilters.knownLanguages,
  ].filter(Boolean).length;

  const toggleLanguage = (lang: string) => {
    const current = localFilters.knownLanguages?.split(",") || [];
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    setLocalFilters({
      ...localFilters,
      knownLanguages: updated.length > 0 ? updated.join(",") : undefined,
    });
  };

  const selectedLanguages = localFilters.knownLanguages?.split(",") || [];

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        className="h-12 relative"
        onClick={() => setShowFilters(!showFilters)}
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <Badge
            variant="default"
            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {showFilters && (
        <div className="absolute top-full mt-2 right-0 z-50 w-80 p-4 bg-card border border-border rounded-lg shadow-lg space-y-4">
          <div className="space-y-2">
            <Label htmlFor="learningLang">Idioma que está aprendendo</Label>
            <select
              id="learningLang"
              value={localFilters.learningLang || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  learningLang: e.target.value || undefined,
                })
              }
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="">Todos os idiomas</option>
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningLevel">Nível de aprendizado</Label>
            <select
              id="learningLevel"
              value={localFilters.learningLevel || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  learningLevel: e.target.value || undefined,
                })
              }
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="">Todos os níveis</option>
              {LEVEL_OPTIONS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Idiomas que conhece</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <Badge
                  key={lang.value}
                  variant={
                    selectedLanguages.includes(lang.value)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer text-xs"
                  onClick={() => toggleLanguage(lang.value)}
                >
                  {lang.label}
                  {selectedLanguages.includes(lang.value) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Limpar
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Aplicar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}