import axios from "axios";
import Api from "../api";
import { countRepeatedWords } from "./utils";
const ApiKey = 'AIzaSyC0ngoLu4ZJOOuaD2PnU6-TlSdIfk8gBFw';

export const getVideoInfo =  async ({ id }) => {
  let info = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${id}`);

  if (!info.data.items) throw new HttpError(404, 'Video not found');

  const title = info.data.items[0]?.snippet?.title;
  const thumbnail = info.data.items[0]?.snippet?.thumbnails?.default?.url;
  const youTuberId = info.data.items[0]?.snippet?.channelId;

  return {
    thumbnail: thumbnail,
    videoTitle: title,
    youTuberId: youTuberId || '',
  };
}

export const getCaptionsInfo = async ({ id }) => {
  return await Api.getCaption({id});
}

export const getRepeatedWords = async ({ id }) => {
  const caption = await Api.getCaption({id});

  const captions = caption?.captionChunks || [];

  const cleanedCaptions = captions.map((caption) => {
    const text = caption.text.split(/\s+/).map((word) => {
      return word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .trim()
        .toLowerCase()
    }).join(' ');

    return {
      ...caption,
      text: text
    };
  })

  return countRepeatedWords(cleanedCaptions);
}

export const getCaptions = async ({ id, chosenWord }) => {
  const caption = await Api.getCaption({ id });

  let captions = caption?.captionChunks || [];

  const cleanedCaptions = captions.map((caption) => {
    // split the text into an array of words and remove any punctuation
    const text = caption.text
      .split(/\s+/)
      .map((word) => {
        return word
          .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
          .replace(/(\r\n|\n|\r)/gm, ' ')
          .trim()
          .toLowerCase();
      })
      .join(' ');

    return {
      ...caption,
      text: text,
    };
  });

  const filteredCaptions = cleanedCaptions.filter((caption) => {
    const regex = new RegExp('\\b' + chosenWord.toLowerCase() + '\\b', 'gi');
    const wordCount = (caption.text.match(regex) || []).length;
    return wordCount > 0;
  });

  return filteredCaptions;
}