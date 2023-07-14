import supabase from "@/libs/supabase";

export default async function handler(req, res) {
  const { name, id } = req.body.youtuberData;
  const { data, error } = await supabase
    .from('youtuber')
    .insert({ name, id })
  res.status(201).json(data ?? error);
}
