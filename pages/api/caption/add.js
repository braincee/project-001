import supabase from "@/libs/supabase";

export default async function handler(req, res) {
  const { videoId, videoTitle, thumbnail, youTuberId, captionChunks, transcribedWithLyrics } = req.body.captionData;
  const { data, error } = await supabase
    .from('caption')
    .insert({ videoId, videoTitle, thumbnail, youTuberId, captionChunks, transcribedWithLyrics })
  res.status(201).json(data ?? error);
}
