import supabase from "../../../libs/supabase";

export default async function handler(req, res) {
    const { channelId } = req.params;
    const { data, error } = await supabase
        .from('YouTuber')
        .select()
        .eq('id', channelId);
    res.status(200).json(data ?? error);
}
