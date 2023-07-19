import { openai } from "@/libs/server/utils";
import fs from 'fs';

const createTranscription = async ({ filePath, model, categoryId, format, lyrics, prompt }) => {
  const file = fs.createReadStream(filePath);
  console.log(filePath, file);
  const resp = await openai.createTranscription(
    file,
    model,
    categoryId == '10' ? (lyrics.length > 0 ? lyrics : undefined) : prompt,
    format
  );

  return resp;
}

export default async function handler(req, res) {
  const { filePath, model, categoryId, format, lyrics, prompt } = req.body;
  const response = await createTranscription({ filePath, model, categoryId, format, lyrics, prompt })
  res.status(200).json({ response: response });
}
