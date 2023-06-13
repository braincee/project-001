import axios from "axios";

const getSearchVideos = async (query) => {
    const data = await axios.post('/api/search', {
        query
      }
    );
    return data;
};

export default getSearchVideos;
