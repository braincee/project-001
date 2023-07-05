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

  addNewPoll: async ({options, pollId}) => {
    const data  = await axios.post(('/api/create'), {
      options, pollId
    })
    return data;
  }
}

export default Api;