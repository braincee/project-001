import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { BiUserVoice } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import { FaTwitter, FaGithub } from 'react-icons/fa';
import { Input, Spacer, Spinner, Dropdown, DropdownMenu, div, DropdownTrigger, Switch } from '@nextui-org/react';
import { getCaptions, getRepeatedWords, getVideoInfo } from '@/libs/server/queries';
import { scrapeCaptionsAndSave } from '@/libs/server/action';
import YouTubePlayer from '@/components/YouTubePlayer';
import { useRouter } from 'next/router';
import AnimatedCounter from '@/components/AnimatedCounter';

const DrinkingGame = () => {
  const [videoId, setVideoId] = useState('');
  const [ascOrder, setAscOrder] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [isFetchingRptWrds, setIsFetchingRptWrds] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isFetchingRptWrdsAgain, setIsFetchingRptWrdsAgain] = useState(false);
  const [captions, setCaptions] = useState(null);
  const [repeatedWords, setRepeatedWords] = useState(null);
  const [areCaptionsSaved, setAreCaptionsSaved] = useState(false);
  const [dbCaptions, setDbCaptions] = useState(null);
  const [counter, setCounter] = useState(0);
  const [videoInfo, setVideoInfo] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true)
  const [poo, setPoo] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const inputRef = useRef(null);
  const selectRef = useRef(null)

  const router = useRouter();

  const handleYoutubeUrlChange = (e) => {
    const str = e.target.value;
    // regex for youtube urls with v=VIDEO_ID
    const regex = /(?:\?v=)([a-zA-Z0-9_-]{11})/;
    const match = str.match(regex);
    // regex for mobile youtube urls, e.g. https://youtu.be/XTqMAoSPn8I
    const mobileRegex = /(?:\.be\/)([a-zA-Z0-9_-]{11})/;
    const mobileMatch = str.match(mobileRegex);
    if (match) {
      setVideoId(match[1]);
    } else if (mobileMatch) {
      setVideoId(mobileMatch[1]);
    } else {
      // toast.error(
      //   'Please enter a valid YouTube URL -- e.g. https://www.youtube.com/watch?v=Gs069dndIYk',
      //   {
      //     id: 'youtube-url-error',
      //   }
      // );
    }
  };

  const handleWordSelect = (e) => {
    setSelectedWord(e.target.value);
  };

  useEffect(() => {
    if (videoId && areCaptionsSaved) {
      getRepeatedWords({ id: videoId })
        .then((res) => {
          setRepeatedWords(res);
          setIsDisabled(false);
          setIsFetched(true);
        });
    }
  }, [videoId, areCaptionsSaved]);

  useEffect(() => {
    if (videoId && selectedWord) {
      getCaptions({ id: videoId, chosenWord: selectedWord })
        .then((res) => {
          setDbCaptions(res);
          setIsFetched(true);
        })
    }
  }, [videoId, selectedWord]);

  useEffect(() => {
    if (videoId && areCaptionsSaved) {
      getVideoInfo({ id: videoId })
        .then((res) => {
          setVideoInfo(res);
        })
    }
  }, [videoId, areCaptionsSaved]);

  useEffect(() => {
    if (isFetched && repeatedWords && dbCaptions) {
      setCaptions(dbCaptions);
      setAreCaptionsSaved(true);
    }
  }, [repeatedWords, dbCaptions]);

  useEffect(() => {
    if (router.query?.v) {
      const videoId = router.query?.v;
      if (videoId) {
        setVideoId(videoId);
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (repeatedWords) {
      setIsFetchingRptWrds(false);
    }
    const fetchCaptions = async () => {
      try {
        if (!isFetchingRptWrdsAgain && videoId && !repeatedWords) {
          await scrapeCaptionsAndSave({ videoId });
          setAreCaptionsSaved(true);
        }
      } catch (error) {
        console.error(error);
        setIsFetchingRptWrds(false);
        document.getElementById('transcribe')?.focus();
      }
    }
    fetchCaptions();
  }, [repeatedWords, videoId]);


  useEffect(() => {
    if (videoId && router.query?.v !== videoId) {
      router.push(`/drinking-game?v=${videoId}`)
      setCounter(0);
      setCaptions(null);
      setSelectedWord('');
      if (!repeatedWords) {
        setIsFetchingRptWrds(true);
      } else {
        setIsFetchingRptWrds(false);
      }
    }
  }, [videoId]);

  useEffect(() => {
    if (selectedWord) {
      router.push(`/drinking-game/?v=${videoId}&w=${selectedWord}`)
    }
  }, [selectedWord]);

  useEffect(() => {
    if (isFetched && repeatedWords) {
      const wordParam = router.query?.w;
      if (wordParam && !selectedWord) {
        const wordExists = repeatedWords.find(([word, number]) => word === wordParam);

        if (wordExists) {
          setSelectedWord(wordParam);
        }
      }
    }
  }, [isFetched, repeatedWords]);

  const handleDropdownClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <>
      <Head>
        <title>YT Playlist Creator & Sharer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className='flex flex-col mx-auto w-[96%] md:w-[60%]'>
          <p className="text-center px-3 my-2 italic text-blue-400 font-2xl tracking-widest">Drinking Game</p>
          <div className='border border-gray-200 rounded-lg p-4'>
            <div className='flex flex-col border rounded-b-none items-center border-gray-200 rounded-lg md:gap-3 p-2 md:flex-row'>
              <div className="mb-1">
                <Input
                  ref={inputRef}
                  size='sm'
                  onChange={handleYoutubeUrlChange}
                  className="border border-gray-300 rounded w-full"
                  placeholder='youtube.com/watch?v=iZ30YqKehSM'
                  aria-labelledby="Youtube url"
                />
              </div>
              <div className="flex gap-1">
                <div className="min-w-[250px] flex justify-center items center">
                  {isFetchingRptWrds && <Spinner />}
                  {!isFetchingRptWrds && (
                    <select
                      ref={selectRef}
                      id="selectedWord"
                      value={selectedWord}
                      onChange={handleWordSelect}
                      className="border border-gray-300 rounded px-4 py-2 after:pe-4"
                      placeholder="Select a highly occuring word"
                      disabled={isDisabled}
                    >
                      <option value="">Select a highly occuring word</option>
                      {repeatedWords && !ascOrder
                        ? repeatedWords?.map(([word, number]) => (
                          <option key={word} value={word}>
                            {word}
                          </option>
                        ))
                        : repeatedWords
                          ?.map(([word, number]) => (
                            <option key={word} value={word}>
                              {word}
                            </option>
                          ))
                          .reverse()}
                    </select>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <div className="rounded-lg border border-gray-300 p-1">
                    <BiUserVoice size={25} onClick={() => {
                      router.push(`/transcribe/${videoId}`)
                    }} className='hover:cursor-pointer' />
                  </div>
                  <div className="rounded-lg border border-gray-300 p-1 ml-2">
                    <FiSettings size={25} onClick={() => {
                      setShowOptions(!showOptions)
                    }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-between w-full border border-t-0 rounded-b-lg p-2">
              {showOptions && (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span>Order words from most to least frequent</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Toast notifications</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Turn off glass sound</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>💩?</span>
                    <Switch />
                  </div>
                </div>
              )}
            </div>
            <div
              className="border border-gray-200 w-[100%] h-[300px] mt-2 aspect-video bg-black"
              onClick={() => {
                if (!videoId) {
                  inputRef.current?.focus();
                } else if (videoId && !selectedWord) {
                  selectRef.current?.focus();
                }
              }}
            >
              {videoId && !repeatedWords &&
                <div className="h-full flex justify-center items-center">
                  <Spinner />
                </div>
              }
              {videoId && repeatedWords && (
                <YouTubePlayer
                  setCounter={setCounter}
                  captions={captions}
                  chosenWord={selectedWord}
                  videoId={videoId}
                  selectRef={selectRef}
                />
              )}
            </div>
          </div>
          <div className="mt-4 text-2xl flex">
            <p>{counter > 0 ? counter : ''}</p>
            <AnimatedCounter
              counter={counter}
              emoji={!poo ? '🥃' : videoInfo?.youTuberId === 'UCbRP3c757lWg9M-U7TyEkXA' ? '🥸' : '💩'}
            />
          </div>
          <div className="border-b border-gray-200 mt-10"></div>
          <div className="flex justify-end items-center mt-10 gap-2">
            <FaTwitter size={25} />
            <FaGithub size={25} />
          </div>
        </div>
      </main>

    </>

  );
};

export default DrinkingGame;
