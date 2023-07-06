import supabase from "@/libs/supabase";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { pollId } = req.query;
    const { data, error } = await supabase
      .from('votes')
      .select()
      .eq('poll', pollId);
    res.status(200).json(data ?? error);
  } else if (req.method === "POST") {
    const { pickedOption, pollId } = req.body;
    const { data, error } = await supabase
      .from('votes')
      .insert({ id: uuidv4(), picked_option: pickedOption, poll: pollId })
    res.status(201).json(data ?? error);
  }
}
