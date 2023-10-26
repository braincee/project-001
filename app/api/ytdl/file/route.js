import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import ytdl from 'ytdl-core'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)
console.log('directory-name 👉️', __dirname)

const generateFile = async ({ url, audioFormat, videoId }) => {
  const audioStream = ytdl(url, { format: audioFormat }).pipe(
    fs.createWriteStream(
      path.join(__dirname, `${videoId}.${audioFormat.container}`)
    )
  )
  const audioStreamPromise = new Promise((resolve, reject) => {
    audioStream.on('finish', resolve)
    audioStream.on('error', reject)
  })
  await audioStreamPromise

  const filePath = path.join(__dirname, `${videoId}.${audioFormat.container}`)

  const stats = fs.statSync(filePath)
  const fileSizeInBytes = stats.size
  const fileSizeInMegabytes = fileSizeInBytes / 1000000.0
  console.log('fileSizeInMegabytes ', fileSizeInMegabytes)
  if (fileSizeInMegabytes > 25) {
    throw new HttpError(413, 'File size is too large')
  }
  return filePath
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const filePath = searchParams.get('filePath')
  fs.unlinkSync(filePath)

  return Response.json({ response: 'Success' })
}

export async function POST(req) {
  const { url, audioFormat, videoId } = await req.json()
  const response = await generateFile({ url, audioFormat, videoId })

  return Response.json({ response })
}
