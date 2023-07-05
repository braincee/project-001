import supabase from "../../../libs/supabase";

export default async function handler(req, res) {
    const { data, error } = await supabase
        .from('YouTuber')
        .select();
    res.status(200).json(data ?? error);
}