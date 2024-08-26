import axios from 'axios';

export const fetchSeoData = async (url) => {
  try {
    console.log("Requesting SEO data for URL:", url);  // Debugging line
    const response = await axios.get(`/api/seo?site=${url}`);
    console.log("Full response:", response);  // Debugging line
    return response.data;
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    // You can either return null, an error object, or rethrow the error
    return null;  // or return error.response.data if you want to pass the error back
  }
};
