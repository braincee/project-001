import supabase from '@/libs/supabase'

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const {
      videoId,
      videoTitle,
      thumbnail,
      youTuberId,
      captionChunks,
      transcribedWithLyrics,
    } = req.body.captionData
    const { data, error } = await supabase
      .from('caption')
      .upsert({
        videoId,
        videoTitle,
        thumbnail,
        youTuberId,
        captionChunks,
        transcribedWithLyrics,
      })
    res.status(201).json(data ?? error)
  }
}
