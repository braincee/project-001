import supabase from "@/libs/supabase";

export default async function handler(req, res) {
  const { options } = req.body;
  const { data, error } = await supabase
    .from('votes')
    .insert({ options: JSON.stringify(options) })
  res.status(201).json(data ?? error);
}
