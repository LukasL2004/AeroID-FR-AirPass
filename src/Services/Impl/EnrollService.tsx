import type { enroll, EnrollResponse } from "../Interfaces/EnrollInterface";

const API_LINK = "http://localhost:8080/api";

const enrollAPI = {
  enroll: async (passager: enroll): Promise<EnrollResponse> => {
    try {
      const formData = new FormData();
      formData.append("photo", passager.photo);
      formData.append("name", passager.name);
      formData.append("flight", passager.flight);

      const response: Response = await fetch(`${API_LINK}/enroll`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Sorry something went wrong");
      }

      const data: EnrollResponse = await response.json();
      return data;
    } catch (e) {
      console.log(e);
      throw new Error("The error is: " + e);
    }
  },
};
export default enrollAPI;
