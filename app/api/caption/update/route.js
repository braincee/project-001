import supabase from '@/libs/supabase'

export async function POST(req) {
  const {
    captionData: {
      videoId,
      videoTitle,
      thumbnail,
      youTuberId,
      captionChunks,
      transcribedWithLyrics,
    },
  } = req.json()
  const { data, error } = await supabase.from('caption').upsert({
    videoId,
    videoTitle,
    thumbnail,
    youTuberId,
    captionChunks,
    transcribedWithLyrics,
  })

  return Response.json(data ?? error)
}
