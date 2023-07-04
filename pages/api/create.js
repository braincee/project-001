import supabase from "@/libs/supabase";

export default async function handler(req, res) {
  const { options } = req.body;
  console.log("request" + req.body);
  const { data, error } = await supabase
    .from('polls')
    .insert({ id: options.id, options: JSON.stringify(options.options) })
  res.status(201).json(data ?? error);
}
