import fs, { ReadStream } from 'fs'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

interface createTranscriptionProps {
  filePath: string
  model: string
  categoryId: string
  format: string
  lyrics: string
  prompt: string
}

const createTranscription = async (props: createTranscriptionProps) => {
  const { filePath, model, categoryId, format, lyrics, prompt } = props
  const file = fs.createReadStream(filePath)
  const resp = await openai.createTranscription(
    // @ts-ignore
    file,
    model,
    categoryId == '10' ? (lyrics.length > 0 ? lyrics : undefined) : prompt,
    format
  )

  return resp
}

export async function POST(req: Request) {
  const { filePath, model, categoryId, format, lyrics, prompt } =
    await req.json()
  const response = await createTranscription({
    filePath,
    model,
    categoryId,
    format,
    lyrics,
    prompt,
  })

  return Response.json({ response: response })
}
