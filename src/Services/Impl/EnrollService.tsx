import type { enroll, EnrollResponse, enrollVerify } from "../Interfaces/EnrollInterface";

const API_LINK = "https://aeroid-be.onrender.com/api";

const enrollAPI = {
  enroll: async (passager: enroll): Promise<EnrollResponse> => {
    try {
      const formData = new FormData();
      formData.append("photo", passager.photo, "poza_pasager.jpg");
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

  enrollVerify: async (passager: enrollVerify): Promise<any> => {
    try {
      const queryParams = new URLSearchParams({
          name: passager.name,
          flight: passager.flight
      }).toString();

      const response: Response = await fetch(`${API_LINK}/flight-info?${queryParams}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Sorry something went wrong");
      }

      const data = await response.json();
      return data;
    } catch (e: any) {
      console.log("Network/Parse Error:", e);
      throw new Error(e.message || "Failed to contact server");
    }
  },

};


export default enrollAPI;
