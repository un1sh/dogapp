import "../css/Favorites.css";
import { useBreedContext } from "../contexts/BreedContext";
import DogCard from "../components/DogCard";

function Favorites() {
  const { favorites } = useBreedContext();

  if (favorites) {
    return (

      <div> 
        <h2>Your Favorites</h2>
        <div className="dogs-grid">
          {favorites.map((breed) => (
            <DogCard dog={breed} key={breed.id} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="favorites-empty">
      <h2>No favorites yet</h2>
      <p>Start adding your favorite breeds and they will appear here</p>
    </div>
  );
}
export default Favorites;
