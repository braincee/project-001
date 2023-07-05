import supabase from "../../../lib/supabase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, url } = req.body;
        const { data, error } = await supabase
            .from('YouTuber')
            .insert({ name, url })
        res.status(201).json(data ?? error);
    }
}
