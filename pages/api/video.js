import axios from "axios";
const ApiKey = 'AIzaSyC0ngoLu4ZJOOuaD2PnU6-TlSdIfk8gBFw';


const getVideo = async (videoId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${ApiKey}`
    );
    return response;
  } catch (err) {
    console.error(err);
  }
}

export default async function handler(req, res) {
  const { videoId } = req.body;
  const { data, err } = await getVideo(videoId);
  res.status(200).json({ response: data, err: err });
}