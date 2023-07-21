const API_KEY = process.env.GOOGLE_API_KEY;

const getInfo = async ({ videoId }) => {
  const info = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${API_KEY}&id=${videoId}`);
  return info;
}

export default async function handler(req, res) {
  const { videoId } = req.query;
  const response = await getInfo({ videoId });
  res.status(200).json({ response: response });
}