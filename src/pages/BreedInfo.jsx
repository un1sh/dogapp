import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/BreedInfo.css"
const API_KEY =
  "live_ztLFQPVjdtVvs2CjFTIT76odZ1L3tgCRxXvALtqM1PohWbUpvVmSg8oqtW1VUTBd";
const BASE_URL = "https://api.thedogapi.com/v1";

function BreedInfo() {
  const [breed, setBreed] = useState([]);
  const { name } = useParams();

  useEffect(() => {
    const loadBreed = async () => {
      try {
        const response = await fetch(
          `https://api.thedogapi.com/v1/breeds/search?q=${name}`
        )
        const data = await response.json()
        setBreed(data);
        console.log(data);
        
      } catch (error) {
        console.error(error);
      }
    };
    loadBreed()
    console.log(breed)
  }, [name]);
  
  return <>
    <h1>{name}</h1>
    {breed.map((item)=>(
    <div key={item.id}>
        <div className="image-container"> 
            <img  className="breed-info-image" src={`https://cdn2.thedogapi.com/images/${item.reference_image_id}.jpg`} alt={item.name} />
        </div>
        <div className="info-container">
        {item.description && <p className="description">{item.description}</p>}
        <p className="info"><strong>Bred For:</strong> {item.bred_for}</p>
        <p className="info"><strong>Height:</strong> {item.height.metric} cm</p>
        <p className="info"><strong>Weight:</strong> {item.weight.metric} kgs</p>
        <p className="info"><strong>Breed Group:</strong> {item.breed_group}</p>
        <p className="info"><strong>Lifespan:</strong> {item.life_span}</p>
        <p className="info"><strong>Temperament:</strong> {item.temperament}</p>
      </div>
    </div>
    
    ))}
    </>

}

export default BreedInfo;
