// Tipos para SidebarFilters.astro

export interface SidebarFiltersProps {
  query: string;
  selectedCategory: string;
  selectedTags: string[];
  categories: string[];
  tags: string[];
  onFilterChange: (filters: SidebarFilterValues) => void;
  onClear: () => void;
}

export interface SidebarFilterValues {
  query: string;
  category: string;
  tags: string[];
}
