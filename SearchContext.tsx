import React, { createContext, useContext, useState } from "react";

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    results: any[];
    setResults: React.Dispatch<React.SetStateAction<any[]>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, results, setResults }}>
            {children}
        </SearchContext.Provider>
    );
};

// ✅ Custom Hook to Use Context
export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};
