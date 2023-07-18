import { countRepeatedWords, openai, ytCategoryIds } from './utils';
import * as cheerio from 'cheerio';
import Api from '../api';
import axios from 'axios';
import Error from 'next/error';


const ApiKey = 'AIzaSyC0ngoLu4ZJOOuaD2PnU6-TlSdIfk8gBFw';

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);
// console.log('directory-name 👉️', __dirname);

export const scrapeCaptionsAndSave = async ({ videoId }) => {
  try {
    const info = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${videoId}`);

    if (!info.data.items) return ( <Error statusCode={"404"} />);

    const title = info.data.items[0]?.snippet?.title;
    const thumbnail = info.data.items[0]?.snippet?.thumbnails?.default?.url;
    const channelId = info.data.items[0]?.snippet?.channelId;
    const channelTitle = info.data.items[0]?.snippet?.channelTitle;
    const defaultLanguage = info.data.items[0]?.snippet?.defaultLanguage?.includes('-')
      ? info.data.items[0]?.snippet?.defaultLanguage?.split('-')[0]
      : info.data.items[0]?.snippet?.defaultLanguage;
    const defaultAudioLanguage = info.data.items[0]?.snippet?.defaultAudioLanguage?.includes('-')
      ? info.data.items[0]?.snippet?.defaultAudioLanguage?.split('-')[0]
      : info.data.items[0]?.snippet?.defaultAudioLanguage;

    if (!channelId) return ( <Error statusCode={"404"} />);
    const captions = await Api.fetchSubtitles({ videoId, defaultLanguage, defaultAudioLanguage });

    if (!captions) return ( <Error statusCode={"404"} />);

    captions.forEach((caption, idx) => {
      const currentStart = Number(caption.start);
      const nextStart = Number(captions[idx + 1]?.start);
      if (nextStart === undefined) return;
      if (idx === 0) {
        caption.dur = String(nextStart);
      } else if (idx !== captions.length - 1) {
        caption.dur = String(nextStart - currentStart);
      }
    });

    let youTuber = await Api.getYouTuber(channelId);

    if (youTuber.length <= 0) {
      let data = {
        id: channelId,
        name: channelTitle || '',
      };
      youTuber = await Api.addYoutuber(data);
    }


    let data = {
      videoId,
      videoTitle: title || ' ',
      youTuberId: channelId,
      thumbnail: thumbnail,
      captionChunks: JSON.stringify(captions),
    };

    const caption = await Api.addCaption(data);

    return caption;

  } catch (error) {
    console.log('error >>> ', error);
    
  }
};

export const generateCaptionsAndSave = async ({ videoId, transcribeWithLyrics }) => {
  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const vidInfo = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${videoId}`);

    console.log('transcribeWithLyrics??? >>> ', transcribeWithLyrics);
    if (!vidInfo.data.items) return ( <Error statusCode={"404"} />);

    const description = vidInfo.data.items[0]?.snippet?.description;
    const categoryId = vidInfo.data.items[0]?.snippet?.categoryId; // https://gist.github.com/dgp/1b24bf2961521bd75d6c
    const title = vidInfo.data.items[0]?.snippet?.title;
    const thumbnail = vidInfo.data.items[0]?.snippet?.thumbnails?.default?.url;
    const channelId = vidInfo.data.items[0]?.snippet?.channelId;
    if (!channelId) return ( <Error statusCode={"404"} />);
    let channelTitle = vidInfo.data.items[0]?.snippet?.channelTitle;
    const defaultLanguage = vidInfo.data.items[0]?.snippet?.defaultLanguage?.includes('-')
      ? vidInfo.data.items[0]?.snippet?.defaultLanguage?.split('-')[0]
      : vidInfo.data.items[0]?.snippet?.defaultLanguage;
    const defaultAudioLanguage = vidInfo.data.items[0]?.snippet?.defaultAudioLanguage?.includes('-')
      ? vidInfo.data.items[0]?.snippet?.defaultAudioLanguage?.split('-')[0]
      : vidInfo.data.items[0]?.snippet?.defaultAudioLanguage;

    if (channelTitle?.includes(' - Topic')) {
      channelTitle = channelTitle.replace(' - Topic', '');
    }

    let captions;
    try {
      captions = await Api.fetchSubtitles({ videoId, defaultLanguage, defaultAudioLanguage });
    } catch (error) {
      console.log('error >>> ', error);
    }

    console.log('captions>> ', captions)


    if (captions) {
      const repeatedWords = countRepeatedWords(captions);
      // if youtube captions already exist, they tend to be more accurate than openai, so there's no need to generate.
      // but song captions often only contain the word 'music' or 'instrumental' repeated many times. In this case, we want to generate captions.
      // if (repeatedWords.length > 2) {
      //   return ( <Error statusCode={"404"} />);
      // }
    }

    let audioFormat = await Api.getAudioFormat({ videoId, categoryId });
    
    console.log('audioFormat ', audioFormat.data.response);

    const files = await Api.generateFile({ url, audioFormat: audioFormat.data.response, videoId });
    const file = files.data.response.file;
    const filePath = files.data.response.filePath;
    const model = 'whisper-1';
    const format = 'verbose_json'

    let lyrics = '';

    if (title && categoryId == '10' && transcribeWithLyrics) {
      console.log("lyrics");
      try {
        const song = await Api.getSong({ title, channelTitle});

        let songUrl = song.data.response.hits[0].result.url;
        let doesArtistMatchLyrics = song.data.response.hits[0].result.artist_names.includes(channelTitle);
        console.log('doesArtistMatchLyrics >>> ', doesArtistMatchLyrics);
        console.log('songUrl >>> ', songUrl);
        if (songUrl && doesArtistMatchLyrics) {
          const lyricsResponse = await axios({
            method: 'GET',
            url: `${songUrl}`,
          });

          const $ = cheerio.load(lyricsResponse.data);

          // recursive function to get the text of each child of the lyrics div
          const getText = (el) => {
            const text = [];
            $(el)
              .contents()
              .each((_, child) => {
                if (child.type === 'text') {
                  const chunk = $(child).text();
                  // remove double quotes from the string
                  const filteredChunk = chunk.replace(/"/g, '').trim();
                  text.push(filteredChunk);
                } else {
                  text.push(...getText(child));
                }
              });
            return text;
          };

          const lyricsDiv = $('[class^="Lyrics__Container"]');
          const text = getText(lyricsDiv);

          const filteredText1 = text.map((chunk) => chunk.trim());
          const filteredText2 = filteredText1.map((chunk) => chunk.replace(/“|”/g, ''));
          const filteredText3 = filteredText2.map((chunk) => chunk.replace(/\(|\)/g, ''));
          // remove brackets and words between brackets, e.g. [hook]
          const filteredText4 = filteredText3.map((chunk) => chunk.replace(/\[.*?\]/g, ''));
          const filteredText5 = filteredText4.filter((chunk) => chunk !== '');

          lyrics = filteredText5.join(' ');

          console.log('lyrics >>> ', lyrics);
        }
      } catch (error) {
        console.error('error >>> ', error);
      }
    }
    

    const category = categoryId ? ytCategoryIds[Number(categoryId)] : 'general';

    const descriptionShortened =
      description?.length && description.length > 1000 ? description?.slice(0, 1000) : description;

    let prompt = `Transcript type: ${category}. Title: "${title}" by ${channelTitle}. ${description && `Description: ${descriptionShortened}.`
      }`;

    console.log('\nprompt >>>\n', categoryId == '10' ? (lyrics.length ? lyrics : undefined) : prompt);
    console.log("test1");
    const resp = await openai.createTranscription(
      // @ts-ignore
      file,
      model,
      categoryId == '10' ? (lyrics.length ? lyrics : undefined) : prompt,
      format
    );

    Api.unlinkFilePath(filePath);


    if (!resp.data.segments) return ( <Error statusCode={"404"} />);

    const timestampedCaptions = resp.data.segments.map((segment) => {
      return {
        start: String(segment.start),
        dur: String(segment.end - segment.start),
        text: segment.text,
      };
    });

    let youTuber = await Api.getYouTuber(channelId);

    if (!youTuber) {
      let data = {
        id: channelId,
        name: channelTitle || ' ',
      };
      youTuber = await Api.addYoutuber(data);
    }

    let data = {
      videoId,
      videoTitle: title || ' ',
      youTuberId: channelId,
      thumbnail: thumbnail,
      captionChunks: JSON.stringify(timestampedCaptions),
      transcribedWithLyrics: transcribeWithLyrics,
    }

    const caption = await Api.updateCaption(data);
    return caption;

  } catch (error) {
    throw error;
  }
};
