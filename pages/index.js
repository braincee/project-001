import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import { Input, Button, Spacer, Table, TableBody, TableRow, TableCell, TableHeader, TableColumn, Image } from '@nextui-org/react';
import { FaShareAlt, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import SearchCard from '@/components/SearchCard';
import SkeletonBuilder from '@/components/SkeletonBuilder';

// const ApiKey = 'AIzaSyCTv53RpplKzuvzTH6XY7VsGGAtnYA0oY4';
const ApiKey = 'AIzaSyC0ngoLu4ZJOOuaD2PnU6-TlSdIfk8gBFw';


export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [urlData, setUrlData] = useState([]);
  const [query, setQuery] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [isvalidated, setIsvalidated] = useState(true);
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
      updateUrlIds();
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
    if (duplicate) {
      setDuplicate(false);
    }
  }

  const handlePress = () => {
    setAddStatus("pressed");
  }

  const addToList = (videoId, title, description, channelTitle, publishedAt) => {
    if (urlData.find((url) => url.id === videoId)) {
      setDuplicate(true);
    } else {
      setUrlData([...urlData, {
        number: urlData.length + 1,
        id: videoId,
        title,
        description,
        channelTitle,
        publishedAt,
      }]);
      setNumber(number + 1);
    }
  }

  const deleteFromList = (videoId) => {
    setUrlData((items) =>  items.filter((item) => item.id !== videoId));
    setNumber(number - 1);
  }

  const truncate = (string, length) => {
    return string.length > length ? `${string.substr(0, length)}...` : string;
  }

  const updateUrlIds = async () => {
    setDuplicate(false); 
    if (isValidHttpUrl(inputValue)) {
      setIsvalidated(true);
    } else {
      setIsvalidated(false);
      return;
    }
    if (inputValue && isvalidated) {
      let videoId = inputValue.split('v=')[1];
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${ApiKey}`
      );
      const { title, description, channelTitle, publishedAt } = response.data.items[0].snippet;
        setUrlData([...urlData, {
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
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&key=${ApiKey}`
      );
      const videos = response.data.items.map((item) => {
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
            isDisabled={isDisabled}
            >Add
          </Button>
        </div>
        {!isvalidated ? (
          <span className="text-danger text-xl md:text-2xl px-6 mt-3">Invalid URL!</span>
        ): ""}
        {duplicate ? (
          <span className="text-danger text-xl md:text-2xl px-6 mt-3">Video has been added already!</span>
        ): ""}
         { !isLoading && showSearchResults &&
             <div className="flex md:flex-wrap md:flex-row flex-col mt-8 justify-center px-10 md:px-5 gap-4">
              {searchData.length > 0 && searchData.map((video, index) => (
                <>
                <SearchCard video={video} key={index} addToList={addToList} truncate={truncate} />
                <Spacer x={6} />
                </>
              ))
              }
            </div>
          }
          {isLoading && <SkeletonBuilder cards={5}/>}
          {!isLoading && urlData.length > 0 &&
          <Table
              aria-label="Example table with dynamic content"
              className="md:p-6 p-2 mx-3 md:mx-8 my-8 w-100"
          >
            <TableHeader>
              <TableColumn>No.</TableColumn>
              <TableColumn>Video</TableColumn>
              <TableColumn>Title</TableColumn>
              <TableColumn>Uploaded By</TableColumn>
              <TableColumn>Date Uploaded</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody items={urlData}>
              { (item) => (
                <TableRow key={item.id}>
                  <TableCell>{number}</TableCell>
                  <TableCell><Image width={300} radius="full" src={`http://img.youtube.com/vi/${item.id}/sddefault.jpg`} alt="Youtube Video"/></TableCell>
                  <TableCell>{decodeHTML(item.title)}</TableCell>
                  <TableCell>{decodeHTML(item.channelTitle)}</TableCell>
                  <TableCell>{item.publishedAt}</TableCell>
                  <TableCell>
                    <Button onPress={() => deleteFromList(item.id)} isIconOnly color="danger" aria-label="Remove">
                      <FaTrashAlt />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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