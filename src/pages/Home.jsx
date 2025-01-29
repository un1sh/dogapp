import DogCard from "../components/DogCard";
import "../css/Home.css";
import { useState, useEffect } from "react";
import { getBreeds } from "../services/api";
import { Bars } from "react-loader-spinner";
import findMostMatchingBreed from "../utils";
import stringSimilarity from "string-similarity-js";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const [breeds, setBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const breeds = await getBreeds();
        console.log(breeds);
        setBreeds(breeds);
      } catch (err) {
        console.log(err);
        setError("Failed");
      } finally {
        setIsLoading(false);
      }
    };
    loadBreeds();
    
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };
  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for dogs..."
          className="search-input"
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {isLoading && (
        <>
          <Bars
            height="100"
            width="100"
            radius="9"
            color="white"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
        </>
      )}
      <div className="dogs-grid">
        {(searchQuery.length == 0 || searchQuery.length > 2) && (breeds.map((breed) => {
          return (
            (searchQuery.length == 0 ||
              stringSimilarity(breed.name, searchQuery) > 0.3) && (
              <DogCard dog={breed} key={breed.id} />
            )
          );
        }))}
      </div>
    </div>
  );
}

export default Home;
