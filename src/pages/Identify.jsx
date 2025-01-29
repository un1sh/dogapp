import { useState } from "react";
import "../css/Home.css";
import findMostMatchingBreed from "../utils";
import DogCard from "../components/DogCard";
import { getBreeds } from "../services/api";
import { Bars } from "react-loader-spinner";

function Identify() {
  const [predictedBreed, setPredictedBreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(false);

  function handleFile(event) {
    setFile(event.target.files[0]);
  }
  function handleUpload(event) {
    setPredictedBreed(false);
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData();
    formData.append("imagefile", file);
    fetch("http://localhost:3000/identify", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(async (result) => {
        console.log("success", result);
        if (result.predicted_breed == null && result.predicted_conf == null) {
          setPredictedBreed(null);
          setIsLoading(false);
          return;
        }
        const breeds = await getBreeds();
        const matchingBreed = findMostMatchingBreed(
          result.predicted_breed,
          breeds
        );
        setIsLoading(false);
        setPredictedBreed([matchingBreed, result.predicted_conf]);
      })
      .catch((error) => {
        console.error("error:", error);
        setIsLoading(false);
      });
  }
  return (
    <>
      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          name="file"
          accept="image/jpeg, image/png"
          onChange={handleFile}
        />
        <div className="button-container">
          <button type="submit" className="upload-button">
            Upload
          </button>
        </div>
      </form>

      {isLoading && (
        <>
          <h1 className="main-header">Predicting ...</h1>
          <Bars
            height="80"
            width="80"
            radius="9"
            color="white"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
        </>
      )}
      {predictedBreed && <h1 className="main-header">Predicted Breed</h1>}
      {predictedBreed && (
        <DogCard dog={predictedBreed[0]} key={predictedBreed[0].id} />
      )}

      {predictedBreed == null ? (
        <h1 className="confidence-score">No Dog Detected</h1>
      ) : (
        ""
      )}
    </>
  );
}
export default Identify;
