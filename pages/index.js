import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { Input, Button } from '@nextui-org/react';
import { ShareIcon } from './components/ShareIcon';
import { useRouter } from 'next/router';

export default function Home() {
  const [urlId, setUrlId] = useState("");
  const [urlIds, setUrlIds] = useState([]);
  const [isvalidated, setIsvalidated] = useState(true);
  const router = useRouter();

  const isValidHttpUrl = (string) => { 
    try {
      const newUrl = new URL(string);
      return newUrl.protocol === 'https:' && newUrl.host === 'www.youtube.com' ;
    } catch (err) {
      return false;
    }
  }

  const handleUrlInput = (e) => {   
    if (isValidHttpUrl(e.target.value)) {
      setUrlId(e.target.value);  
      setIsvalidated(true); 
    } else {
      setIsvalidated(false);
    }
  }

  const updateurlIds = () => {
    if (urlId !== '' && isvalidated) {
      let video_id = urlId.split('v=')[1];   
      setUrlIds([...urlIds, video_id]);
    }
    setUrlId('');
  }

  const handleShare = () => {
    let lists = '';
    urlIds.forEach((url, index) => {
      if (index + 1 === urlIds.length) {
        lists = lists.concat(`${url}`)
      } else {
        lists = lists.concat(`${url},`)
      }
    });
    
    router.push(`/list/?list=${lists}`);
  }

  return (
    <>
      <Head>
        <title>YT Playlist Creator & Sharer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-4 mb-[50px] flex flex-col">
        <h1 className="text-center text-[30px]">YT Playlist Creator and Sharer</h1>
        <div className="flex justify-center items-center mt-[50px] gap-4 min-h-auto">
          <Input  
            onChange={handleUrlInput}
            className="w-3/5 !placeholder:text-slate-400 placeholder:text-[20px]" 
            placeholder="Add YouTube Url"
            aria-labelledby="none"
            value={urlId}
          />
          <Button className="w-1/5 bg-sky-500/100 text-white" size="xl" onPress={updateurlIds}>Add URL</Button>
          <Button color="success" className=" text-dark flex justify-between" size="xl" onPress={handleShare} endIcon={<ShareIcon />} >Share</Button>
        </div>
        { isvalidated === false ? (
          <span className="text-danger text-[24px] px-[120px]">Invalid URL</span>
        ) : ""}
        <div className="mt-[20px] px-[120px] flex flex-col gap-[20px]">
          { urlIds.length > 0 ? urlIds.map((url) => (
            <div key={url}>
              <div className="video">
                  <iframe width="100%" height="100%" src={`https://youtube.com/embed/${url}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
          )): ''}
        </div>
      </main>
    </>
  )
}
