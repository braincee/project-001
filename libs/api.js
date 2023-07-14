import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import supabase from "./supabase";

const Api = {
  getSearchVideos: async (query) => {
    const data = await axios.post('/api/search', {
      query
    }
    );
    return data;
  },

  getVideo: async (videoId) => {
    const data = await axios.post('/api/video', {
      videoId
    }
    );
    return data;
  },

  addToPollsStorage: async (file) => {
    const filename = `${uuidv4()}.${file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)}`;
    await supabase.storage
      .from("polls")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });
    return filename;
  },

  getFilePublicURL: async (filename) => {
    const { data } = await supabase.storage
      .from('polls')
      .getPublicUrl(filename);
    return data;
  },

  addNewPoll: async ({ options, pollId }) => {
    const data = await axios.post(('/api/create'), {
      options, pollId
    })
    return data;
  },

  addNewVote: async ({ pickedOption, pollId }) => {
    const { data } = await axios.post(('/api/vote'), {
      pickedOption, pollId,
    })
    return data;
  },

  getVotes: async ({ pollId }) => {
    const data = await axios.get(('/api/vote'), {
      params: { pollId },
    })
    return data;
  },

  getYouTubers: async () => {
    const data = await axios.get('/api/youtuber/all');
    return data;
  },

  getCaptions: async () => {
    const data = await axios.get('/api/caption/all');
    return data;
  },

  addYoutuber: async (youtuberData) => {
    const { data } = await axios.post(('/api/youtuber/add'), {
      youtuberData
    })
    return data;
  },

  addCaption: async (captionData) => {
    const { data } = await axios.post(('/api/caption/add'), {
      captionData
    })
    return data;
  },

  getYouTuber: async (channelId) => {
    const { data } = await axios.get(('/api/youtuber/single'), {
      params: { channelId },
    })
    return data;
  },

  getCaption: async ({ id }) => {
    const data = await axios.get(('/api/caption/single'), {
      params: { id },
    })
    return data;
  },

  updateCaption: async (captionData) => {
    const { data } = await axios.post(('/api/caption/update'), {
      captionData
    })
    return data;
  },

  fetchSubtitles: async ({ videoId, defaultLanguage, defaultAudioLanguage }) => {
    const {data} = await axios.post('/api/subtitle', {
      videoId, defaultLanguage, defaultAudioLanguage,
    });
    return data.response;
  }
}

export default Api;