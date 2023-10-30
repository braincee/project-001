import axios from 'axios'
import Transcribe from './Transcribe'
import supabase from '../../../libs/supabase'

const ApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

function stringify(obj) {
  let cache = []
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
  cache = null // reset the cache
  return str
}

async function getVideoInfo(id) {
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

async function getCaptionsInfo(id) {
  const { data } = await supabase.from('caption').select().eq('videoId', id)
  return data[0]
}

const TranscribePage = async ({ params }) => {
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
