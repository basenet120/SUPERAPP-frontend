import { createContext, useContext, useState, type ReactNode } from 'react';

interface EquipmentFilterContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: { id: string; name: string }[];
  setCategories: (categories: { id: string; name: string }[]) => void;
}

const EquipmentFilterContext = createContext<EquipmentFilterContextType | undefined>(undefined);

export function EquipmentFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  return (
    <EquipmentFilterContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        categories,
        setCategories,
      }}
    >
      {children}
    </EquipmentFilterContext.Provider>
  );
}

export function useEquipmentFilter() {
  const context = useContext(EquipmentFilterContext);
  if (context === undefined) {
    throw new Error('useEquipmentFilter must be used within EquipmentFilterProvider');
  }
  return context;
}
