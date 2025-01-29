import "../css/DogCard.css";
import { Link } from "react-router-dom";
import { useAuth } from "../components/auth";
import axios from "axios";
import { useState } from "react";
import { useBreedContext } from "../contexts/BreedContext";

function DogCard({ dog }) {
  const { user } = useAuth(); // Get the logged-in user's data
  const {isFavorite, addToFavorites, removeFromFavorites} = useBreedContext()
  const favorite = isFavorite(dog.id)
  // Handle the favorite button click
  function onFavoriteClick(e) {
    e.preventDefault()
    if (favorite) removeFromFavorites(dog.id)
    else addToFavorites(dog)

    if (user) {
      // Send a request to the backend to store this in the database
      axios.post("http://localhost:3000/favorite", {
        username: user.data.username, // Send the username
        email: user.data.email, // Send the email
        breed: dog.name, // Send the breed name
      })
      .then((response) => {
        console.log("Dog favorited successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error favoriting dog:", error);
      });
    } else {
      console.log("User not logged in");
    }
  }

  return (
    <div className="dog-card">
      
        <div className="dog-poster">
          
          <img src={dog.image.url} alt={dog.title} />
          
          <div className="dog-overlay">
            <button
              className={`favorite-btn ${favorite ? "active" : ""}`}
              onClick={onFavoriteClick}
            >
              ♥
            </button>
          </div>
        </div>
        <Link to={`/${dog.name}`} key = {dog.id}>
        <div className="dog-info">
          <h3>{dog.name}</h3>
          <p>{dog.bred_for}</p>
        </div>
        </Link>
    </div>
  );
}

export default DogCard;
