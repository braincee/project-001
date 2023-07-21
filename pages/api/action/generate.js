const API_KEY = process.env.GOOGLE_API_KEY;

const getVidInfo = async ({ videoId }) => {
  const vidInfo = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${API_KEY}&id=${videoId}`);
  return vidInfo;
}

export default async function handler(req, res) {
  const { videoId } = req.query;
  const response = await getVidInfo({ videoId });
  res.status(200).json({ response: response });
}