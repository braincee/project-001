import supabase from "../../../libs/supabase";

export default async function handler(req, res) {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Caption')
        .select()
        .where({ id });
    res.status(200).json(data ?? error);
}
