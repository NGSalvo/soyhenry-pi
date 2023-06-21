import { temperamentURL } from "@utils";

export const TemperamentService = {
  getTemperaments: async function () {
    const response = await fetch(temperamentURL)
    return await response.json()
  }
}