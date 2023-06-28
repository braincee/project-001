import supabase from "../supabase"

export const getYoutuber = async (channeelId) => {
  const { data, error } = await supabase
  .from('YouTuber')
  .select()
  .eq('id', channeelId)
  .single();

  if (error) throw error;
  return data;
}

export const createYoutuber = async (data) => {
  const { data, error } = await supabase
  .from('YouTuber')
  .insert(data)
  if (error) throw error;
  console.log(data);
}

export const createCaption = async (data) => {
  const { data, error } = await supabase
  .from('Caption')
  .insert(data)
  if (error) throw error;
  console.log(data);
}