import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import supabase from './supabase'
import { countRepeatedWords, ytCategoryIds } from './utils'

export const getSearchVideos = async (query) => {
  const data = await axios.post('/api/search', {
    query,
  })
  return data
}

export const getVideo = async (videoId) => {
  const data = await axios.post('/api/video', {
    videoId,
  })
  return data
}

export const addToPollsStorage = async (file) => {
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

export const getFilePublicURL = async (filename) => {
  const { data } = await supabase.storage.from('polls').getPublicUrl(filename)
  return data
}

export const addNewPoll = async ({ options, pollId }) => {
  const data = await axios.post('/api/create', {
    options,
    pollId,
  })
  return data
}

export const addNewVote = async ({ pickedOption, pollId }) => {
  const { data } = await axios.post('/api/vote', {
    pickedOption,
    pollId,
  })
  return data
}

export const getVotes = async ({ pollId }) => {
  const data = await axios.get('/api/vote', {
    params: { pollId },
  })
  return data
}

export const getYouTubers = async () => {
  const data = await axios.get('/api/youtuber/all')
  return data
}

export const addYoutuber = async (youtuberData) => {
  const { data } = await axios.post('/api/youtuber/add', {
    youtuberData,
  })
  return data
}

export const addCaption = async (captionData) => {
  const { data } = await axios.post('/api/caption/add', {
    captionData,
  })
  return data
}

export const getYouTuber = async (channelId) => {
  const { data } = await axios.get('/api/youtuber/single', {
    params: { channelId },
  })
  return data
}

export const getCaption = async ({ id }) => {
  const { data } = await axios.get('/api/caption/single', {
    params: { id },
  })
  return data
}

export const updateCaption = async (captionData) => {
  const { data } = await axios.post('/api/caption/update', {
    captionData,
  })
  return data
}

export const fetchSubtitles = async ({
  videoId,
  defaultLanguage,
  defaultAudioLanguage,
}) => {
  const { data } = await axios.post('/api/subtitle', {
    videoId,
    defaultLanguage,
    defaultAudioLanguage,
  })
  return data.response
}

export const getAudioFormat = async ({ videoId, categoryId }) => {
  const audioFormat = await axios.post('/api/ytdl/audioformat', {
    videoId,
    categoryId,
  })
  return audioFormat
}

export const generateFile = async ({ url, audioFormat, videoId }) => {
  const file = await axios.post('/api/ytdl/file', {
    url,
    audioFormat,
    videoId,
  })
  return file
}

export const unlinkFilePath = async ({ filePath }) => {
  const fp = await axios.get('/api/ytdl/file', {
    params: { filePath },
  })
  return fp
}

export const getSong = async ({ title, channelTitle }) => {
  const song = await axios.post('/api/apigenius', {
    title,
    channelTitle,
  })
  return song
}

export const createTranscription = async ({
  filePath,
  model,
  categoryId,
  format,
  lyrics,
  prompt,
}) => {
  const resp = await axios.post('/api/openai', {
    filePath,
    model,
    categoryId,
    format,
    lyrics,
    prompt,
  })
  return resp
}

export const scrapeCaptionsAndSave = async ({ videoId }) => {
  try {
    const {
      data: { response: res },
    } = await axios.get('/api/action/info', {
      params: { videoId },
    })
    const info = JSON.parse(res)

    if (!info.data.items) return <Error statusCode={'404'} />

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

    if (!channelId) return <Error statusCode={'404'} />
    const captions = await fetchSubtitles({
      videoId,
      defaultLanguage,
      defaultAudioLanguage,
    })

    if (!captions) return <Error statusCode={'404'} />

    captions.forEach((caption, idx) => {
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

    const caption = await addCaption(data)

    // return caption
  } catch (error) {
    throw error
  }
}

export const generateCaptionsAndSave = async ({
  videoId,
  transcribeWithLyrics,
}) => {
  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`
    const {
      data: { response: res },
    } = await axios.get('/api/action/info', {
      params: { videoId },
    })
    const vidInfo = JSON.parse(res)

    if (!vidInfo.data.items) return <Error statusCode={'404'} />
    const description = vidInfo.data.items[0]?.snippet?.description
    const categoryId = vidInfo.data.items[0]?.snippet?.categoryId // https://gist.github.com/dgp/1b24bf2961521bd75d6c
    const title = vidInfo.data.items[0]?.snippet?.title
    const thumbnail = vidInfo.data.items[0]?.snippet?.thumbnails?.default?.url
    const channelId = vidInfo.data.items[0]?.snippet?.channelId
    if (!channelId) return <Error statusCode={'404'} />
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

    if (captions) {
      const repeatedWords = countRepeatedWords(captions)
      // if youtube captions already exist, they tend to be more accurate than openai, so there's no need to generate.
      // but song captions often only contain the word 'music' or 'instrumental' repeated many times. In this case, we want to generate captions.
      if (repeatedWords.length > 2) {
        return <Error statusCode={'404'} />
      }
    }

    let audioFormat = await getAudioFormat({ videoId, categoryId })

    const files = await generateFile({
      url,
      audioFormat: audioFormat.data.response,
      videoId,
    })
    const filePath = files.data.response
    const model = 'whisper-1'
    const format = 'verbose_json'

    let lyrics = ''

    if (title && categoryId == '10' && transcribeWithLyrics) {
      try {
        const song = await getSong({ title, channelTitle })

        let songUrl = song.data.response.hits[0].result.url
        let doesArtistMatchLyrics =
          song.data.response.hits[0].result.artist_names.includes(channelTitle)

        if (songUrl && doesArtistMatchLyrics) {
          const lyricsResponse = await axios({
            method: 'GET',
            url: `${songUrl}`,
          })

          const $ = cheerio.load(lyricsResponse.data)

          // recursive function to get the text of each child of the lyrics div
          const getText = (el) => {
            const text = []
            $(el)
              .contents()
              .each((_, child) => {
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
    const resp = await createTranscription({
      filePath,
      model,
      categoryId,
      format,
      lyrics,
      prompt,
    })

    unlinkFilePath(filePath)

    if (!resp.data.segments) return <Error statusCode={'404'} />

    const timestampedCaptions = resp.data.segments.map((segment) => {
      return {
        start: String(segment.start),
        dur: String(segment.end - segment.start),
        text: segment.text,
      }
    })

    let youTuber = await getYouTuber(channelId)

    if (!youTuber) {
      let data = {
        id: channelId,
        name: channelTitle || ' ',
      }
      youTuber = await addYoutuber(data)
    }

    let data = {
      videoId,
      videoTitle: title || ' ',
      youTuberId: channelId,
      thumbnail: thumbnail,
      captionChunks: JSON.stringify(timestampedCaptions),
      transcribedWithLyrics: transcribeWithLyrics,
    }

    const caption = await updateCaption(data)
    return caption
  } catch (error) {
    throw error
  }
}

export const getVideoInfo = async ({ id }) => {
  const {
    data: { response: res },
  } = await axios.get('/api/action/info', {
    params: { videoId: id },
  })
  let info = JSON.parse(res)

  if (!info.data.items) throw new HttpError(404, 'Video not found')

  const title = info.data.items[0]?.snippet?.title
  const thumbnail = info.data.items[0]?.snippet?.thumbnails?.default?.url
  const youTuberId = info.data.items[0]?.snippet?.channelId

  return {
    thumbnail: thumbnail,
    videoTitle: title,
    youTuberId: youTuberId || '',
  }
}

export const getCaptionsInfo = async ({ id }) => {
  return await getCaption({ id })
}

export const getRepeatedWords = async ({ id }) => {
  const caption = await getCaption({ id })

  if (caption.length > 0) {
    const captions = JSON.parse(caption[0]?.captionChunks) || []

    const cleanedCaptions = captions.map((caption) => {
      const text = caption.text
        .split(/\s+/)
        .map((word) => {
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

export const getCaptions = async ({ id, chosenWord }) => {
  const caption = await getCaption({ id })

  let captions = JSON.parse(caption[0]?.captionChunks) || []

  const cleanedCaptions = captions.map((caption) => {
    // split the text into an array of words and remove any punctuation
    const text = caption.text
      .split(/\s+/)
      .map((word) => {
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

  const filteredCaptions = cleanedCaptions.filter((caption) => {
    const regex = new RegExp('\\b' + chosenWord.toLowerCase() + '\\b', 'gi')
    const wordCount = (caption.text.match(regex) || []).length
    return wordCount > 0
  })

  return filteredCaptions
}
