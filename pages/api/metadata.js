// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

async function fetchAPI(url) {
  try {
    const { data } = await axios.get(url);
    return { data };
  } catch (err) {
    return { err };
  }
}

export default async function handler(req, res) {
  const { url } = req.body;
  const { data, err } = await fetchAPI(url);

  res.status(200).json({ response: data, err: err });
}
