import axios from "axios";

const accessToken = 'OrJgfWy-nICcqnTRtbHCgwmdmmmwq4e3xqEqA5yO0uzDchKdzdmswUfaEeYYnDIi';

const getSong = async ({ title, channelTitle}) => {
  const song = await axios.get(
    `https://api.genius.com/search?q=${encodeURIComponent(
      title + ' ' + channelTitle
    )}&access_token=${accessToken}`
  );
  return song;
}
export default async function handler(req, res) {
  const { title, channelTitle } = req.body;
  const response = await getSong({ title, channelTitle })
  res.status(200).json({ response: response });
}