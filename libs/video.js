import axios from "axios";

const getVideo = async (videoId) => {
    const data = await axios.post('/api/video', {
        videoId
      }
    );
    return data;
};

export default getVideo;
