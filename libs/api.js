import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import supabase from "./supabase";

  export const getSearchVideos = async (query) => {
    const data = await axios.post('/api/search', {
      query
    }
    );
    return data;
  }

  export const getVideo = async (videoId) => {
    const data = await axios.post('/api/video', {
      videoId
    }
    );
    return data;
  }

  export const addToPollsStorage = async (file) => {
    const filename = `${uuidv4()}.${file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)}`;
    await supabase.storage
      .from("polls")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });
    return filename;
  }

  export const getFilePublicURL = async (filename) => {
    const { data } = await supabase.storage
      .from('polls')
      .getPublicUrl(filename);
    return data;
  }

  export const addNewPoll = async ({ options, pollId }) => {
    const data = await axios.post(('/api/create'), {
      options, pollId
    })
    return data;
  }

  export const addNewVote = async ({ pickedOption, pollId }) => {
    const { data } = await axios.post(('/api/vote'), {
      pickedOption, pollId,
    })
    return data;
  }

  export const getVotes = async ({ pollId }) => {
    const data = await axios.get(('/api/vote'), {
      params: { pollId },
    })
    return data;
  }

  export const getYouTubers = async () => {
    const data = await axios.get('/api/youtuber/all');
    return data;
  }

  export const getCaptions = async () => {
    const { data } = await axios.get('/api/caption/all');
    return data;
  }

  export const addYoutuber = async (youtuberData) => {
    const { data } = await axios.post(('/api/youtuber/add'), {
      youtuberData
    })
    return data;
  }

  export const addCaption = async (captionData) => {
    const { data } = await axios.post(('/api/caption/add'), {
      captionData
    })
    return data;
  }

  export const getYouTuber = async (channelId) => {
    const { data } = await axios.get(('/api/youtuber/single'), {
      params: { channelId },
    })
    return data;
  }

  export const getCaption = async ({ id }) => {
    const { data } = await axios.get(('/api/caption/single'), {
      params: { id },
    })
    return data;
  }

  export const updateCaption = async (captionData) => {
    const { data } = await axios.post(('/api/caption/update'), {
      captionData
    })
    return data;
  }

  export const fetchSubtitles = async ({ videoId, defaultLanguage, defaultAudioLanguage }) => {
    const {data} = await axios.post('/api/subtitle', {
      videoId, defaultLanguage, defaultAudioLanguage,
    });
    return data.response;
  }

  export const getAudioFormat = async ({ videoId, categoryId }) => {
    const audioFormat = await axios.post('/api/ytdl/audioformat', {
      videoId, categoryId
    });
    return audioFormat;
  }

  export const generateFile = async ({ url, audioFormat, videoId }) => {
    const file = await axios.post('/api/ytdl/file', {
      url, audioFormat, videoId
    });
    return file;
  }

  export const unlinkFilePath = async ({ filePath }) => {
    const fp = await axios.get(('/api/ytdl/file'), {
      params: {filePath}
    });
    return fp;
  }

  export const getSong = async ({ title, channelTitle}) => {
    const song = await axios.post('/api/apigenius', {
      title, channelTitle,
    })
    return song;
  }

  export const createTranscription = async ({ filePath, model, categoryId, format, lyrics, prompt }) => {
    const resp = await axios.post('/api/openai', {
      filePath, model, categoryId, format, lyrics, prompt,
    });
    return resp;
  }