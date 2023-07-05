import supabase from "@/libs/supabase";
import { v4 as uuidv4 } from "uuid";


export default async function handler(req, res) {
  const { options } = req.body;
  const { data, error } = await supabase
    .from('polls')
    .insert({ id: uuidv4(),  options: JSON.stringify(options) })
  res.status(201).json(data ?? error);
}
