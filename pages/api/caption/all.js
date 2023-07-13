import supabase from "@/libs/supabase";

export default async function handler(req, res) {
    const test = req.params;
    console.log("test", test);
    const { data, error } = await supabase
        .from('Caption')
        .select();
    res.status(200).json(data ?? error);
}