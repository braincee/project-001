import { getSubtitles } from "youtube-captions-scraper";

const fetchSubtitles = async ({ videoId, defaultLanguage, defaultAudioLanguage }) => {
  try {
    const response = await getSubtitles({
      videoID: videoId,
      lang: defaultLanguage || defaultAudioLanguage || 'en',
    });
    return response;
  } catch (err) {
    console.error(err);
  }
}

export default async function handler(req, res) {
  const { videoId, defaultLanguage, defaultAudioLanguage } = req.body;
  const response = await fetchSubtitles({ videoId, defaultLanguage, defaultAudioLanguage });
  res.status(200).json({ response: response});
}