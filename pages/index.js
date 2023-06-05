import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import { Input, Button, Spacer } from '@nextui-org/react';
import { ShareIcon } from '../components/ShareIcon';
import { useRouter } from 'next/router';
import { metadata } from '@/libs/metadata';
import VideoCard from '../components/VideoCard';
import SearchCard from '../components/SearchCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const ApiKey = 'AIzaSyC0ngoLu4ZJOOuaD2PnU6-TlSdIfk8gBFw';


export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState();
  const [urlData, setUrlData] = useState([]);
  const [url, setURL] = useState("");
  const [query, setQuery] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [isvalidated, setIsvalidated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchData, setSearchData ] = useState([]);
  const [addStatus, setAddStatus] = useState(""); 
  const [addDisabled, setAddDisabled] = useState(true); 

  const router = useRouter();

  const fetchData = async (myUrl) => {
    try {
      const {
        data: { response, err },
      } = await axios.post('/api/metadata', {
        url: myUrl,
      });
      setResponse(response);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (url && addStatus == "pressed") {
      fetchData(url);
      setIsLoading(true);
    }
  }, [url, addStatus]);

  useEffect(() => {
    const { metaTagsContent } = metadata(response);
    setTitle(metaTagsContent["title"] || metaTagsContent["og:title"]);
    setDescription(metaTagsContent["description"] || metaTagsContent["og:description"])
  }, [response]);

  useEffect(() => {
    if (addStatus == "pressed" && (title && description)) {
      updateUrlIds();
      setIsLoading(false);
      setAddStatus("");
      setAddDisabled(true);
    }
  }, [title, description, addStatus]);

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
      setURL(e.target.value);
      setAddDisabled(false);
    } catch {
      setQuery(e.target.value);
    }
    if (duplicate) {
      setDuplicate(false);
    }
  }

  const handlePress = () => {
    console.log("yes");
    setAddStatus("pressed");
  }

  const updateUrlIds = () => {
    setDuplicate(false); 
    if (isValidHttpUrl(inputValue)) {
      setIsvalidated(true);
    } else {
      setIsvalidated(false);
      return;
    }
    if (inputValue && isvalidated) {
      let videoId = inputValue.split('v=')[1];
      if (urlData.find((url) => url.id === videoId)) {
        setDuplicate(true);
      } else {
        setUrlData([...urlData, {
          id: videoId,
          title,
          description
        }]);
      }
    }
    setInputValue('')
    setTitle('');
    setDescription('');
    setURL('');
    setResponse('') 
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


  const searchVideos = async () => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&key=${ApiKey}`
      );
      const videos = response.data.items.map((item) => {
        return {
          id: item.id.videoId,
          title: item.snippet.title
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
        <h1 className="text-center text-3xl md:text-5xl">YT Playlist Creator and Sharer</h1>
        <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
          <Input
            type="text"
            onChange={handleChange}
            className="w-full md:w-3/5 text-xl placeholder-slate-400"
            placeholder="Add YouTube Url"
            aria-labelledby="none"
            value={inputValue}
          />
          <Button 
            color="primary"
            className="text-white"
            size="xl"
            onPress={handlePress}
            isDisabled={addDisabled}
            >Add
          </Button>
        </div>
        {!isvalidated ? (
          <span className="text-danger text-xl md:text-2xl px-6 mt-3">Invalid URL!</span>
        ): ""}
        {duplicate ? (
          <span className="text-danger text-xl md:text-2xl px-6 mt-3">Video has been added already!</span>
        ): ""}
       
          { showSearchResults &&
             <div className="flex flex-wrap mt-8 justify-center p-5 ">
              { searchData.length > 0 && searchData.map((video, index) => (
                <>
                <SearchCard video={video} key={index}/>
                <Spacer x={6} y={4} />
                </>
              ))
              }
            </div>
          }
          <div className="mt-8 px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40 flex flex-col gap-8">
            { urlData.length > 0 && urlData.map((url, index) => (
              <VideoCard url={url} key={index} />
            ))}
            {isLoading && <LoadingSpinner />}
          </div>
          <div className="flex justify-center">
            { urlData.length > 0 &&
              <Button color="success" className="mt-4 text-dark" size="xl" onPress={handleShare} endIcon={<ShareIcon />} >Share</Button>
            }
          </div>
      </main>
    </>
  )
}
