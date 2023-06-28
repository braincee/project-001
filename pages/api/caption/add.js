import supabase from "../../../lib/supabase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { videoId, videoTitle, thumbnail, youTuberId, captionChunks, transcribedWithLyrics } = req.body;
        const { data, error } = await supabase
            .from('Caption')
            .insert({ videoId, videoTitle, thumbnail, youTuberId, captionChunks, transcribedWithLyrics })
        res.status(201).json(data ?? error);
    }
}
