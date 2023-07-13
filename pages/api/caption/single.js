import supabase from "@/libs/supabase";

export default async function handler(req, res) {
    const { id } = req.query;
    const { data, error } = await supabase
        .from('Caption')
        .select()
        .eq('videoId', id );
    res.status(200).json(data ?? error);
}
