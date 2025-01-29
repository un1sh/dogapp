import { stringSimilarity } from "string-similarity-js";

function findMostMatchingBreed(inputWord, breeds) {
  // Sanitize input word and make it case-insensitive
  let highestScore = 0;
  let bestMatch = null;
  breeds.forEach((breed) => {
    // Find matches for the input word in the phrase
    const score = stringSimilarity(breed.name, inputWord);

    // Update the best match if the score is higher
    if (score > highestScore) {
      highestScore = score;
      bestMatch = breed;
    }
  });

  return bestMatch || "No matching phrase found";
}

export default findMostMatchingBreed;
