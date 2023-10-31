'use server'

import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import supabase from '@/libs/supabase'
import { countRepeatedWords, ytCategoryIds } from '@/libs/utils'
import * as cheerio from 'cheerio'
import { env } from '@/env.mjs'
import { db } from '@/db/drizzle'
import { caption, polls, votes, youtuber } from '@/db/schema'
import ytdl from 'ytdl-core'
import { eq } from 'drizzle-orm'
//@ts-ignore
import { getSubtitles } from 'youtube-captions-scraper'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ApiKey = env.GOOGLE_API_KEY

interface createTranscriptionProps {
  filePath: string
  model: string
  categoryId: string
  format: string
  lyrics: string
  prompt: string
}

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

export const getSearchVideos = async (query: string) => {
  const fetchSearchVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&key=${ApiKey}`
      )
      return response
    } catch (err) {
      console.error(err)
    }
  }

  const response = await fetchSearchVideos()
  if (response?.data) {
    return response.data
  }
}

export const getVideo = async (videoId: string) => {
  const myVideo = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${ApiKey}`
      )
      return response
    } catch (err) {
      console.error(err)
    }
  }
  const response = await myVideo()
  if (response?.data) {
    return response.data
  }
}

export const addToPollsStorage = async (file: File) => {
  const filename = `${uuidv4()}.${file.name.substring(
    file.name.lastIndexOf('.') + 1,
    file.name.length
  )}`
  await supabase.storage.from('polls').upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  })
  return filename
}

export const getFilePublicURL = async (filename: string) => {
  const { data } = await supabase.storage.from('polls').getPublicUrl(filename)
  return data
}

export const addNewPoll = async ({
  options,
  pollId,
}: {
  options: any[]
  pollId: string
}) => {
  const date = new Date()
  const response = await db.insert(polls).values({
    id: pollId,
    options: JSON.stringify(options),
    createdAt: date,
  })
  return response
}

export const addNewVote = async ({
  pickedOption,
  pollId,
}: {
  pickedOption: string
  pollId: string
}) => {
  const date = new Date()

  const response = await db.insert(votes).values({
    id: uuidv4(),
    picked_option: pickedOption,
    poll: pollId,
    createdAt: date,
  })
  return response
}

export const getVotes = async ({ pollId }: { pollId: string }) => {
  const response = await db.query.votes.findMany({
    where: (vote, { eq }) => eq(vote.poll, pollId),
  })
  return response
}

export const getYouTubers = async () => {
  const response = await db.query.youtuber.findMany()
  return response
}

export const addYoutuber = async (youtuberData: {
  id: string
  name: string
}) => {
  const { name, id } = youtuberData
  const date = new Date()
  const response = await db
    .insert(youtuber)
    .values({ name, id, createdAt: date })
  return response
}

export const addCaption = async (captionData: {
  videoId: string
  videoTitle: string
  youTuberId: string
  thumbnail: string
  captionChunks: string
  transcribedWithLyrics?: string
}) => {
  const {
    videoId,
    videoTitle,
    thumbnail,
    youTuberId,
    captionChunks,
    transcribedWithLyrics,
  } = captionData
  const date = new Date()
  const response = await db.insert(caption).values({
    videoId,
    videoTitle,
    thumbnail,
    youTuberId,
    captionChunks,
    transcribedWithLyrics,
    createdAt: date,
  })
  return response
}

export const getYouTuber = async (channelId: string) => {
  const response = await db.query.youtuber.findMany({
    where: (youtuber, { eq }) => eq(youtuber.id, channelId),
  })

  return response
}

export const getCaption = async ({ id }: { id: string }) => {
  const response = await db.query.caption.findMany({
    where: (caption, { eq }) => eq(caption.videoId, id),
  })
  return response
}

export const updateCaption = async (captionData: {
  videoId: string
  videoTitle: string
  youTuberId: string
  thumbnail: string
  captionChunks: string
  transcribedWithLyrics?: string
}) => {
  const {
    videoId,
    videoTitle,
    thumbnail,
    youTuberId,
    captionChunks,
    transcribedWithLyrics,
  } = captionData
  const response = await db
    .update(caption)
    .set({
      videoTitle,
      thumbnail,
      youTuberId,
      captionChunks,
      transcribedWithLyrics,
    })
    .where(eq(caption.videoId, videoId))
  return response
}

export const fetchSubtitles = async ({
  videoId,
  defaultLanguage,
  defaultAudioLanguage,
}: {
  videoId: string
  defaultLanguage: string
  defaultAudioLanguage?: string
}) => {
  const fetchSubtitles = async () => {
    try {
      const response = await getSubtitles({
        videoID: videoId,
        lang: defaultLanguage || 'en',
      })
      return response
    } catch (err) {
      console.error(err)
    }
  }
  const response = await fetchSubtitles()
  return response
}

export const getAudioFormat = async ({
  videoId,
  categoryId,
}: {
  videoId: string
  categoryId: string
}) => {
  const myAudioFormat = async () => {
    let info = await ytdl.getInfo(videoId)
    let filteredFormat = ytdl.filterFormats(info.formats, 'audioonly')
    let audioFormat = ytdl.chooseFormat(filteredFormat, {
      quality: categoryId === '10' ? 'highestaudio' : 'lowestaudio',
    })
    return audioFormat
  }

  const audioFormat = await myAudioFormat()
  return audioFormat
}

export const generateFile = async ({
  url,
  audioFormat,
  videoId,
}: {
  url: string
  audioFormat: any
  videoId: string
}) => {
  const myFile = async () => {
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
      throw new Error('File size is too large')
    }
    return filePath
  }
  const filePath = await myFile()
  if (filePath) {
    return filePath
  }
}

export const getSong = async ({
  title,
  channelTitle,
}: {
  title: string
  channelTitle: string
}) => {
  const mySong = async () => {
    const song = await axios.get(
      `https://api.genius.com/search?q=${encodeURIComponent(
        title + ' ' + channelTitle
      )}&access_token=${env.GENIUS_API_KEY}`
    )
    return song
  }
  const response = await mySong()
  if (response?.data) {
    return response.data
  }
}

export const createTranscription = async (props: createTranscriptionProps) => {
  const { filePath, model, categoryId, format, lyrics, prompt } = props

  const myTranscription = async () => {
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

  const response = await myTranscription()
  return response
}

export const scrapeCaptionsAndSave = async ({
  videoId,
}: {
  videoId: string
}) => {
  try {
    let info = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${videoId}`
    )

    info = JSON.parse(stringify(info))

    if (!info.data.items) return Error('Info Data not available')

    const title = info.data.items[0]?.snippet?.title
    const thumbnail = info.data.items[0]?.snippet?.thumbnails?.default?.url
    const channelId = info.data.items[0]?.snippet?.channelId
    const channelTitle = info.data.items[0]?.snippet?.channelTitle
    const defaultLanguage =
      info.data.items[0]?.snippet?.defaultLanguage?.includes('-')
        ? info.data.items[0]?.snippet?.defaultLanguage?.split('-')[0]
        : info.data.items[0]?.snippet?.defaultLanguage
    const defaultAudioLanguage =
      info.data.items[0]?.snippet?.defaultAudioLanguage?.includes('-')
        ? info.data.items[0]?.snippet?.defaultAudioLanguage?.split('-')[0]
        : info.data.items[0]?.snippet?.defaultAudioLanguage

    if (!channelId) return Error('Channel ID not available')
    const captions = await fetchSubtitles({
      videoId,
      defaultLanguage,
      defaultAudioLanguage,
    })

    if (!captions) return Error('Captions not available')

    captions.forEach((caption: any, idx: number) => {
      const currentStart = Number(caption.start)
      const nextStart = Number(captions[idx + 1]?.start)
      if (nextStart === undefined) return
      if (idx === 0) {
        caption.dur = String(nextStart)
      } else if (idx !== captions.length - 1) {
        caption.dur = String(nextStart - currentStart)
      }
    })

    let youTuber = await getYouTuber(channelId)

    if (youTuber.length <= 0) {
      let data = {
        id: channelId,
        name: channelTitle || '',
      }
      youTuber = await addYoutuber(data)
    }

    let data = {
      videoId,
      videoTitle: title || ' ',
      youTuberId: channelId,
      thumbnail: thumbnail,
      captionChunks: JSON.stringify(captions),
    }

    const myCaption = await getCaption({ id: videoId })
    if (myCaption.length > 0) {
      return myCaption
    }

    const caption = await addCaption(data)
    return caption
  } catch (error) {
    throw error
  }
}

export const generateCaptionsAndSave = async ({
  videoId,
  transcribeWithLyrics,
}: {
  videoId: string
  transcribeWithLyrics: boolean
}) => {
  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`
    let vidInfo = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${videoId}`
    )
    vidInfo = JSON.parse(stringify(vidInfo))

    if (!vidInfo.data.items) return Error('Video Info Data not available')
    const description = vidInfo.data.items[0]?.snippet?.description
    const categoryId = vidInfo.data.items[0]?.snippet?.categoryId // https://gist.github.com/dgp/1b24bf2961521bd75d6c
    const title = vidInfo.data.items[0]?.snippet?.title
    const thumbnail = vidInfo.data.items[0]?.snippet?.thumbnails?.default?.url
    const channelId = vidInfo.data.items[0]?.snippet?.channelId
    if (!channelId) return Error('Channel ID not available')
    let channelTitle = vidInfo.data.items[0]?.snippet?.channelTitle
    const defaultLanguage =
      vidInfo.data.items[0]?.snippet?.defaultLanguage?.includes('-')
        ? vidInfo.data.items[0]?.snippet?.defaultLanguage?.split('-')[0]
        : vidInfo.data.items[0]?.snippet?.defaultLanguage
    const defaultAudioLanguage =
      vidInfo.data.items[0]?.snippet?.defaultAudioLanguage?.includes('-')
        ? vidInfo.data.items[0]?.snippet?.defaultAudioLanguage?.split('-')[0]
        : vidInfo.data.items[0]?.snippet?.defaultAudioLanguage

    if (channelTitle?.includes(' - Topic')) {
      channelTitle = channelTitle.replace(' - Topic', '')
    }

    let captions
    try {
      captions = await fetchSubtitles({
        videoId,
        defaultLanguage,
        defaultAudioLanguage,
      })
    } catch (error) {
      console.log('error >>> ', error)
    }
    console.log('captions>> ', captions)

    // if (captions) {
    //   const repeatedWords = countRepeatedWords(captions)
    //   // if youtube captions already exist, they tend to be more accurate than openai, so there's no need to generate.
    //   // but song captions often only contain the word 'music' or 'instrumental' repeated many times. In this case, we want to generate captions.
    //   if (repeatedWords.length > 2) {
    //     return
    //   }
    // }

    let audioFormat = await getAudioFormat({ videoId, categoryId })

    const files = await generateFile({
      url,
      audioFormat: audioFormat,
      videoId,
    })
    const filePath = files as string
    const model = 'whisper-1'
    const format = 'verbose_json'

    let lyrics = ''

    if (title && categoryId == '10' && transcribeWithLyrics) {
      try {
        const song = await getSong({ title, channelTitle })

        let songUrl = song.hits[0].result.url
        let doesArtistMatchLyrics =
          song.data.response.hits[0].result.artist_names.includes(channelTitle)

        if (songUrl && doesArtistMatchLyrics) {
          const lyricsResponse = await axios({
            method: 'GET',
            url: `${songUrl}`,
          })

          const $ = cheerio.load(lyricsResponse.data)

          // recursive function to get the text of each child of the lyrics div
          const getText = (el: any) => {
            const text: string[] = []
            $(el)
              .contents()
              .each((_, child: any) => {
                if (child.type === 'text') {
                  const chunk = $(child).text()
                  // remove double quotes from the string
                  const filteredChunk = chunk.replace(/"/g, '').trim()
                  text.push(filteredChunk)
                } else {
                  text.push(...getText(child))
                }
              })
            return text
          }

          const lyricsDiv = $('[class^="Lyrics__Container"]')
          const text = getText(lyricsDiv)

          const filteredText1 = text.map((chunk) => chunk.trim())
          const filteredText2 = filteredText1.map((chunk) =>
            chunk.replace(/“|”/g, '')
          )
          const filteredText3 = filteredText2.map((chunk) =>
            chunk.replace(/\(|\)/g, '')
          )
          // remove brackets and words between brackets, e.g. [hook]
          const filteredText4 = filteredText3.map((chunk) =>
            chunk.replace(/\[.*?\]/g, '')
          )
          const filteredText5 = filteredText4.filter((chunk) => chunk !== '')

          lyrics = filteredText5.join(' ')
        }
      } catch (error) {
        console.error('error >>> ', error)
      }
    }
    const category = categoryId ? ytCategoryIds[Number(categoryId)] : 'general'

    const descriptionShortened =
      description?.length && description.length > 1000
        ? description?.slice(0, 1000)
        : description

    let prompt = `Transcript type: ${category}. Title: "${title}" by ${channelTitle}. ${
      description && `Description: ${descriptionShortened}.`
    }`

    console.log(
      '\nprompt >>>\n',
      categoryId == '10' ? (lyrics.length ? lyrics : undefined) : prompt
    )
    // let resp = await createTranscription({
    //   filePath,
    //   model,
    //   categoryId,
    //   format,
    //   lyrics,
    //   prompt,
    // })

    // resp = JSON.parse(stringify(resp))

    fs.unlinkSync(filePath)

    // const timestampedCaptions = resp.data.segments.map((segment: any) => {
    //   return {
    //     start: String(segment.start),
    //     dur: String(segment.end - segment.start),
    //     text: segment.text,
    //   }
    // })

    // let youTuber = await getYouTuber(channelId)

    // if (!youTuber) {
    //   let data = {
    //     id: channelId,
    //     name: channelTitle || ' ',
    //   }
    //   youTuber = await addYoutuber(data)
    // }

    // let data = {
    //   videoId,
    //   videoTitle: title || ' ',
    //   youTuberId: channelId,
    //   thumbnail: thumbnail,
    //   captionChunks: JSON.stringify(timestampedCaptions),
    //   transcribedWithLyrics: transcribeWithLyrics.toString(),
    // }

    // const caption = await updateCaption(data)
    // return caption
  } catch (error) {
    throw error
  }
}

export const getVideoInfo = async ({ id }: { id: string }) => {
  let info = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${id}`
  )
  info = JSON.parse(stringify(info))

  if (!info.data.items) return Error('Info Data not available')

  const title = info.data.items[0]?.snippet?.title
  const thumbnail = info.data.items[0]?.snippet?.thumbnails?.default?.url
  const youTuberId = info.data.items[0]?.snippet?.channelId

  return {
    thumbnail: thumbnail,
    videoTitle: title,
    youTuberId: youTuberId || '',
  }
}

export const getCaptionsInfo = async ({ id }: { id: string }) => {
  return await getCaption({ id })
}

export const getRepeatedWords = async ({ id }: { id: string }) => {
  const caption = await getCaption({ id })

  if (caption.length > 0) {
    const captions = JSON.parse(caption[0]?.captionChunks) || []

    const cleanedCaptions = captions.map((caption: any) => {
      const text = caption.text
        .split(/\s+/)
        .map((word: any) => {
          return word
            .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
            .replace(/(\r\n|\n|\r)/gm, ' ')
            .trim()
            .toLowerCase()
        })
        .join(' ')

      return {
        ...caption,
        text: text,
      }
    })

    return countRepeatedWords(cleanedCaptions)
  }
}

export const getCaptions = async ({
  id,
  chosenWord,
}: {
  id: string
  chosenWord: string
}) => {
  const caption = await getCaption({ id })

  let captions = JSON.parse(caption[0]?.captionChunks) || []

  const cleanedCaptions = captions.map((caption: any) => {
    // split the text into an array of words and remove any punctuation
    const text = caption.text
      .split(/\s+/)
      .map((word: any) => {
        return word
          .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
          .replace(/(\r\n|\n|\r)/gm, ' ')
          .trim()
          .toLowerCase()
      })
      .join(' ')

    return {
      ...caption,
      text: text,
    }
  })

  const filteredCaptions = cleanedCaptions.filter((caption: any) => {
    const regex = new RegExp('\\b' + chosenWord.toLowerCase() + '\\b', 'gi')
    const wordCount = (caption.text.match(regex) || []).length
    return wordCount > 0
  })

  return filteredCaptions
}
