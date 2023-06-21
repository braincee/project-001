import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { Input, Button, Spacer, CircularProgress } from '@nextui-org/react';
import { FaShareAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import SearchCard from '../components/SearchCard';
import SkeletonBuilder from '../components/SkeletonBuilder';
import getSearchVideos from '@/libs/search';
import getVideo from '@/libs/video';
import VideoCard from '@/components/VideoCard';
import TableBuilder from '@/components/TableBuilder';

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [urlData, setUrlData] = useState([]);
  const [query, setQuery] = useState("");
  const [isvalid, setIsvalid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchData, setSearchData ] = useState([]);
  const [addStatus, setAddStatus] = useState(""); 
  const [isDisabled, setIsDisabled] = useState(true);
  const [number, setNumber] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (addStatus == "pressed") {
      setIsLoading(true);
    }
  }, [addStatus]);

  useEffect(() => {
    if (addStatus == "pressed") {
      addToListFromInput();
      setIsLoading(false);
      setAddStatus("");
      setIsDisabled(true);
    }
  }, [addStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchVideos();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!inputValue) {      
      setTimeout(() => {
        setShowSearchResults(false);
      }, 1000);
    }
  }, [inputValue]);

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
    try {
      new URL(e.target.value);
      if (isValidHttpUrl(e.target.value)) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
        setQuery(e.target.value);
      }
    } catch {
      setQuery(e.target.value);
    }
  }

  const handlePress = () => {
    setAddStatus("pressed");
  }

  const addToListFromSearch = (videoId, title, description, channelTitle, publishedAt) => {
    setUrlData((prevUrlData) => {
      const newItem = {
        number: number + 1,
        id: videoId,
        title,
        description,
        channelTitle,
        publishedAt,
      };
      return [...prevUrlData, newItem];
    });
    setNumber((prevNumber) => prevNumber + 1);
  };

  const deleteFromList = (index) => {
    setUrlData((items) => {
     const newItems = items.filter((item) => item.number != index);
     setNumber(newItems.length);
     return newItems;
    });
    setUrlData((items) => {
      const newItems = items.map((item, index) => {
        return {
          ...item,
          number: index + 1
        }
      });
      return newItems;
    });
  };
  
  const truncate = (string, length) => {
    return string.length > length ? `${string.substr(0, length)}...` : string;
  }

  const addToListFromInput = async () => {
    if (isValidHttpUrl(inputValue)) {
      setIsvalid(true);
    } else {
      setIsvalid(false);
      return;
    }
    if (inputValue && isvalid) {
      let videoId = inputValue.split('v=')[1];
      const { data: { response } } = await getVideo(videoId);
      const { title, description, channelTitle, publishedAt } = response.items[0].snippet;
        setUrlData([...urlData, {
          number: number + 1,
          id: videoId,
          title,
          description,
          channelTitle,
          publishedAt: new Date(publishedAt).toUTCString(),
        }]);
        setNumber(number + 1);
    }
    setInputValue('')
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
    const stringChannelTitle = urlData.map((url) => `${url.channelTitle}`).join(',');
    const stringPublishedAt = urlData.map((url) => `${new Date(url.publishedAt).toDateString()}`).join(',');

    router.push({
      pathname: "/list",
      query: { 
        list: lists,
        title: stringTitle,
        description: stringDescription,
        channelTitle: stringChannelTitle,
        publishedAt: stringPublishedAt,
      }
    }, `/list/?list=${lists}`);
  }
  const searchVideos = async () => {
    if (!query) return;
    try {
      setIsLoading(true);
      const { data: { response } } = await getSearchVideos(query);
      const videos = response.items.map((item) => {
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          channelTitle: item.snippet.channelTitle,
          publishedAt: new Date(item.snippet.publishedAt).toUTCString(),
        };
      });
      setSearchData(videos);
      setShowSearchResults(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const decodeHTML = (code) => {
    let text = document.createElement("textarea");
    text.innerHTML = code;
    return text.value
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
      <h1 className="text-center px-3 md:px-0 text-3xl">YT Playlist Creator and Sharer</h1>
        <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
          <Input
            type="text"
            onChange={handleChange}
            className="w-full md:w-3/5 text-2xl px-4 md:px-0 placeholder-slate-400"
            placeholder="Add YouTube Url"
            aria-labelledby="none"
            value={inputValue}
            endContent={
              isLoading &&
              <CircularProgress aria-label="Loading..." />
            }
          />
          <Button 
            color="primary"
            className="text-white"
            size="xl"
            onPress={handlePress}
            isDisabled={isDisabled}
            >Add
          </Button>
        </div>
        {!isvalid ? (
          <span className="text-danger text-xl md:text-2xl px-6 mt-3">Invalid URL!</span>
        ): ""}
        { !isLoading && showSearchResults &&
          <div className="flex md:flex-wrap md:flex-row flex-col mt-8 justify-center px-10 md:px-5 gap-4">
            {searchData.length > 0 && searchData.map((video, index) => (
              <>
              <SearchCard video={video} key={index} addToList={addToListFromSearch} truncate={truncate} />
              <Spacer x={6} />
              </>
            ))
            }
          </div>
        }
          
          {isLoading && <SkeletonBuilder cards={5}/>}
          {!isLoading && urlData.length > 0 &&
          <>
            <TableBuilder urlData={urlData} decodeHTML={decodeHTML} deleteFromList={deleteFromList} />
          <div className="flex flex-col gap-3 p-2 my-8 md:hidden">
            { urlData.map((item) => (
              <VideoCard key={item.number} item={item} decodeHTML={decodeHTML} deleteFromList={deleteFromList} />
            ))}
          </div>
          </>
          }
          <div className="flex justify-center mt-16">
            { urlData.length > 0 &&
              <Button color="success" className=" text-dark" size="lg" onPress={handleShare} endIcon={<FaShareAlt />} >Share</Button>
            }
          </div>
      </main>
    </>
  )
}