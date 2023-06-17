// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
const ApiKey = 'AIzaSyC0ngoLu4ZJOOuaD2PnU6-TlSdIfk8gBFw';


const fetchSearchVideos = async (query) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${query}&key=${ApiKey}`
    );
    return response;
  } catch (err) {
    console.error(err);
  }
}

export default async function handler(req, res) {
  const { query } = req.body;
  const { data, err } = await fetchSearchVideos(query);
  res.status(200).json({ response: data, err: err });
}