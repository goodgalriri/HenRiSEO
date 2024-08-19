import axios from 'axios';

export const fetchSeoData = async (url) => {
  try {
    const response = await axios.get(`/api/seo?site=${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching SEO data:", error);
  }
};
