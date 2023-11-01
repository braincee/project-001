import axios from 'axios'
import { db } from '@/db/drizzle'
import Transcribe from '@/components/Transcribe'
import { env } from '@/env.mjs'

const ApiKey = env.NEXT_PUBLIC_GOOGLE_API_KEY

function stringify(obj: any) {
  let cache: any[] = []
  let str = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return
      }
      // Store value in our collection
      cache.push(value)
    }
    return value
  })
  cache = [] // reset the cache
  return str
}

async function getVideoInfo(id: string) {
  let info = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${id}`
  )
  info = JSON.parse(stringify(info))

  const title = info.data.items[0]?.snippet?.title
  const thumbnail = info.data.items[0]?.snippet?.thumbnails?.default?.url
  const youTuberId = info.data.items[0]?.snippet?.channelId

  const videoInfo = {
    thumbnail: thumbnail,
    videoTitle: title,
    youTuberId: youTuberId || '',
  }

  return videoInfo
}

async function getCaptionsInfo(id: string) {
  const caption = await db.query.caption.findMany({
    where: (caption, { eq }) => eq(caption.videoId, id),
  })
  return caption && caption[0]
}

const TranscribePage = async ({ params }: { params: { id: string } }) => {
  const { id } = params
  const videoInfo = await getVideoInfo(id)
  const captionsInfo = await getCaptionsInfo(id)
  return (
    <section>
      <Transcribe
        videoId={id}
        videoInfo={videoInfo}
        captionsInfo={captionsInfo}
      />
    </section>
  )
}

export default TranscribePage
