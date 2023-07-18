import ytdl from "ytdl-core";

const getAudioFormat = async ({ videoId }) => {
  let info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`, {
    requestOptions: {
      headers: {
        cookie: process.env.YOUTUBE_COOKIE, // https://github.com/fent/node-ytdl-core/blob/master/example/cookies.js
      },
    },
  });
  let filteredFormat = ytdl.filterFormats(info.formats, 'audioonly');
  let audioFormat = ytdl.chooseFormat(filteredFormat, {
    quality: categoryId === '10' ? 'highestaudio' : 'lowestaudio',
  });

  return audioFormat;
}

export default async function handler(req, res) {
  const { videoId } = req.body;
  const response = await getAudioFormat({ videoId })
  res.status(200).json({ response: response });
}