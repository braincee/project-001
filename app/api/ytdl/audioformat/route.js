import ytdl from 'ytdl-core'

const getAudioFormat = async ({ videoId, categoryId }) => {
  console.log('audio')
  let info = await ytdl.getInfo(videoId)
  let filteredFormat = ytdl.filterFormats(info.formats, 'audioonly')
  let audioFormat = ytdl.chooseFormat(filteredFormat, {
    quality: categoryId === '10' ? 'highestaudio' : 'lowestaudio',
  })
  return audioFormat
}

export async function POST(req) {
  const { videoId, categoryId } = await req.json()
  const response = await getAudioFormat({ videoId, categoryId })

  return Response.json({ response })
}
