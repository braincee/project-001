import supabase from "../../../lib/supabase";

export default async function handler(req, res) {
    const { data, error } = await supabase
        .from('Caption')
        .select();
    res.status(200).json(data ?? error);
}