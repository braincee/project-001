import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import { Input, Button, Image } from '@nextui-org/react';
import { ShareIcon } from '../components/ShareIcon';
import { useRouter } from 'next/router';
import { metadata } from '@/libs/metadata';
import VideoCard from '../components/VideoCard';
import SearchResults from '../components/SearchResults';

const ApiKey = 'AIzaSyDVbblloaQizpzCqRfDRHm_xrJzEfokEv8';


export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState();
  const [urlData, setUrlData] = useState([]);
  const [url, setURL] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [isvalidated, setIsvalidated] = useState(true);
  const [check, setCheck] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchData, setSearchData ] = useState([]);
  const router = useRouter();

  const fetchData = async (myUrl) => {
    try {
      const {
        data: { response, err },
      } = await axios.post("/api/metadata", {
        url: myUrl,
      });
      setResponse(response);
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    fetchData(url);
  }, [url]);

  useEffect(() => {
    const { metaTagsContent } = metadata(response);
    setTitle(metaTagsContent["title"] || metaTagsContent["og:title"]);
    setDescription(metaTagsContent["description"] || metaTagsContent["og:description"])
  }, [response]);


  const isValidHttpUrl = (string) => {
    try {
      const newUrl = new URL(string);
      return newUrl.protocol === 'https:' && (newUrl.host === 'www.youtube.com' || newUrl.host === 'youtube.com');
    } catch (err) {
      return false;
    }
  }

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setURL(e.target.value);
    searchVideos(e.target.value);
    setShowSearchResults(false);
  }

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedUrl = e.clipboardData.getData('text');
    setInputValue(pastedUrl);
    addUrlToList(pastedUrl);
  };

  const addUrlToList = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return;

    const duplicate = urlData.some((item) => item.id === videoId);
    if (duplicate) return;

    setUrlData((prevData) => [
      ...prevData,
      {
        id: videoId,
        url: url,
        title: '',
        description: '',
      },
    ]);

    setInputValue('');
  };

  const extractVideoId = (url) => {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    return videoId;
  };

  useEffect(() => {
    if (check == true) {
      let videoId = "";
      if (url) {
        videoId = url.split('v=')[1];
      }

      const newData = urlData.map((url) => {
        if (url.id == videoId) {
          url.title = title;
          url.description = description;
        }
        return url;
      });
      setUrlData(newData);
      setTitle('');
      setDescription('');
      setURL('');
      setResponse('')
      setDuplicate(false);
      setCheck(!check);
    }
  }, [check]);

  const updateUrlIds = () => {
    if (isValidHttpUrl(inputValue)) {
      setIsvalidated(true);
    } else {
      setIsvalidated(false);
      return;
    }
    setTimeout(() => {
      if (inputValue && isvalidated) {
        let videoId = inputValue.split('v=')[1];
        if (urlData.find((url) => url.id === videoId)) {
          setDuplicate(true);
        } else {
          setUrlData([...urlData, {
            id: videoId
          }]);
          setCheck(!check);
        }
      }
    }, 1000)
    setInputValue('');
  }

  const handleShare = () => {
    let lists = '';
    urlData.forEach((url, index) => {
      if (index + 1 === urlData.length) {
        lists = lists.concat(`${url.id}`)
      } else {
        lists = lists.concat(`${url.id},`)
      }
    });

    const stringTitle = urlData.map((url) => `${url.title}`).join(',');
    const stringDescription = urlData.map((url) => `${url.description}`).join(',');

    router.push({
      pathname: "/list",
      query: { list: lists, title: stringTitle, description: stringDescription }
    }, `/list/?list=${lists}`);
  }


  const searchVideos = async (query) => {
    if (!inputValue) return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&key=${ApiKey}`
      );
      const videos = response.data.items.map((item) => {
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
        };
      });
      setSearchData(videos);
      setShowSearchResults(true);
    } catch (err) {
      console.error(err);
    }
  };

  
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
            type="text"
            onChange={handleChange}
            onPaste={handlePaste}
            className="w-3/5 !placeholder:text-slate-400 placeholder:text-[20px]"
            placeholder="Add YouTube Url"
            aria-labelledby="none"
            value={inputValue}
          />
          {/* <Button color="primary" size="xl" onPress={updateUrlIds}>Add URL</Button> */}
          <Button color="success" className=" text-dark flex justify-between" size="xl" onPress={handleShare} endIcon={<ShareIcon />} >Share</Button>
        </div>
        {!isvalidated ? (
          <span className="text-danger text-[24px] px-[120px] mt-3">Invalid URL!</span>
        ): ""}
        {duplicate ? (
          <span className="text-danger text-[24px] px-[120px] mt-3">Video is already added!</span>
        ): ""}
          <div className="mt-[20px] px-[20px] lg:px-[100px] flex flex-col gap-[20px]">
            {urlData.length > 0 ? urlData.map((url, index) => (
              <VideoCard url={url} key={index} />
            )) : ''}
          </div>
          {showSearchResults && <SearchResults videos={searchData} />}
      </main>
    </>
  )
}
