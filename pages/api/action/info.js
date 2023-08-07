import axios from "axios";

const ApiKey = process.env.GOOGLE_API_KEY;

const getInfo = async ({ videoId }) => {
  const info = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${videoId}`);
  return info;
}

function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

export default async function handler(req, res) {
  const { videoId } = req.query;
  const response = await getInfo({ videoId });
  res.status(200).json({ response: stringify(response) });
}