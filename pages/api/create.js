import supabase from "@/libs/supabase";

export default async function handler(req, res) {
  const { options, pollId } = req.body;
  const { data, error } = await supabase
    .from('polls')
    .insert({ id: pollId,  options: JSON.stringify(options) })
  res.status(201).json(data ?? error);
}
