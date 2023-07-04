import supabase from "./supabase";

const youtuber = 
    {
        id: "M2vORz0xUWo",
        name: "Chinese Movies",
        url: "https://www.youtube.com/watch?v=M2vORz0xUWo"
    };

const caption = 
    {
        videoId: "M2vORz0xUWo",
        videoTitle: "Cinema Movies",
        thumbnail: "http://img.youtube.com/vi/${video.id}/sddefault.jpg",
        youTuberId: youtuber.id,
        captionChunks: "This is a caption"
    };

export async function addYoutuber() {
    const { data, error } = await supabase
    .from('YouTuber')
    .insert(youtuber)

    console.log(data ?? error)
}

export async function addCaption() {
    const { data, error } = await supabase
    .from('Caption')
    .insert(caption)

    console.log(data ?? error)
}
