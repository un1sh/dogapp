const API_KEY = "live_ztLFQPVjdtVvs2CjFTIT76odZ1L3tgCRxXvALtqM1PohWbUpvVmSg8oqtW1VUTBd";
const BASE_URL = "https://api.thedogapi.com/v1"

export const getBreeds = async () => {
    const response = await fetch(`${BASE_URL}/breeds?api_key=${API_KEY}`);
    const data = await response.json()
    return data
}

export const getBreed = async (name) => {
    const response = await fetch(`${BASE_URL}/breeds/search?q=${name}?api_key=${API_KEY}`);
    const data = await response.json()
    return data
}

