import type { enroll, EnrollResponse, enrollVerify } from "../Interfaces/EnrollInterface";

const API_LINK = "https://aeroid-be.onrender.com/api";

const enrollAPI = {
  enroll: async (passager: enroll): Promise<EnrollResponse> => {
    try {
      const formData = new FormData();
      formData.append("photo", passager.photo, "poza_pasager.jpg");
      formData.append("name", passager.name);
      formData.append("flight", passager.flight);

      console.log(`Sending POST request to: ${API_LINK}/enroll`);
      const response: Response = await fetch(`${API_LINK}/enroll`, {
        method: "POST",
        body: formData,
      });
      
      console.log("API Response Status (enroll):", response.status, response.statusText);

      if (!response.ok) {
        const errText = await response.text();
        console.error("API Error Body (enroll):", errText);
        throw new Error(errText || "Sorry something went wrong");
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

      console.log(`Sending GET request to: ${API_LINK}/flight-info?${queryParams}`);
      const response: Response = await fetch(`${API_LINK}/flight-info?${queryParams}`, {
        method: "GET",
      });
      
      console.log("API Response Status (enrollVerify):", response.status, response.statusText);

      if (!response.ok) {
        const errText = await response.text();
        console.error("API Error Body (enrollVerify):", errText);
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
