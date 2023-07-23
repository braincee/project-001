import ytdl from "ytdl-core";

const getAudioFormat = async ({ videoId, categoryId }) => {
  console.log("audio");
  let info = await ytdl.getInfo(videoId);
  let filteredFormat = ytdl.filterFormats(info.formats, 'audioonly');
  let audioFormat = ytdl.chooseFormat(filteredFormat, {
    quality: categoryId === '10' ? 'highestaudio' : 'lowestaudio',
  });
  return audioFormat;
}

export default async function handler(req, res) {
  const { videoId, categoryId } = req.body;
  const response = await getAudioFormat({ videoId, categoryId })
  res.status(200).json({ response: response });
}