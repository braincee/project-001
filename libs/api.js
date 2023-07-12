import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import supabase from "./supabase";
import { select } from "cheerio-select";

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
    const response = await fetch('/api/youtuber/all');
    const results = await response.json();
    return results;
  },

  getCaptions: async () => {
    const response = await fetch('/api/caption/all');
    const results = await response.json();
    return results
  },

  addYoutuber: async (youtuberData) => {
    const JSONData = JSON.stringify(youtuberData);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONData,
    }
    const response = await fetch('/api/youtuber/add', options);
    const results = await response.json()
    return results;
  },

  addCaption: async (captionData) => {
    const JSONData = JSON.stringify(captionData);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONData,
    }
    const response = await fetch('/api/youtuber/add', options);
    const results = await response.json()
    return results;
  },

  getYouTuber: async (channelId) => {
    const response = await fetch(`/api/youtuber/${channelId}`);
    const results = await response.json();
    return results;
  },

  getCaption: async ({videoId}) => {
    const response = await fetch(`/api/caption/${videoId}`);
    const results = await response.json();
    return results;
  },

  updateCaption: async (captionData) => {
    const JSONData = JSON.stringify(captionData);
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONData,
    }
    const response = await fetch('/api/captions/update', options);
    const results = await response.json()
    return results;
  }


}

export default Api;