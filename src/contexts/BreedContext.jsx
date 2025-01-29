import { createContext, useState, useContext, useEffect } from "react";

const BreedContext = createContext();

export const useBreedContext = () => useContext(BreedContext);

export const BreedProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavs = localStorage.getItem("favorites");

    if (storedFavs) setFavorites(JSON.parse(storedFavs));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (breed) => {
    setFavorites((prev) => [...prev, breed]);
  };
  const removeFromFavorites = (breedId) => {
    setFavorites((prev) => prev.filter(breed => breed.id !== breedId));
  };

  const isFavorite = (breedId) => {
    return favorites.some((breed) => breed.id === breedId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
  return (
    <BreedContext.Provider value={value}>{children}</BreedContext.Provider>
  );
};
