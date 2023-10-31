'use client'

import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { BiUserVoice } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'
import { Input, Spinner, Switch, Tooltip } from '@nextui-org/react'
import {
  getCaptions,
  getRepeatedWords,
  getVideoInfo,
  scrapeCaptionsAndSave,
} from '@/server/api'
import { useParams, useRouter } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'
import YouTubePlayer from '@/components/YouTubePlayer'
import AnimatedCounter from '@/components/AnimatedCounter'

const DrinkingGame = () => {
  const [videoId, setVideoId] = useState<string>('')
  const [ascOrder, setAscOrder] = useState<boolean>(false)
  const [selectedWord, setSelectedWord] = useState<string>('')
  const [isFetchingRptWrds, setIsFetchingRptWrds] = useState<boolean>(false)
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [captions, setCaptions] = useState<any[]>([])
  const [repeatedWords, setRepeatedWords] = useState<any[]>([])
  const [areCaptionsSaved, setAreCaptionsSaved] = useState<boolean>(false)
  const [dbCaptions, setDbCaptions] = useState<any[]>([null])
  const [counter, setCounter] = useState(0)
  const [videoInfo, setVideoInfo] = useState<any>(null)
  const [isDisabled, setIsDisabled] = useState(true)
  const [poo, setPoo] = useState<boolean>(false)
  const [showOptions, setShowOptions] = useState<boolean>(false)
  const [showToast, setShowToast] = useState<boolean>(false)
  const [isClinkSound, setIsClinkSound] = useState<boolean>(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  const router = useRouter()
  const params = useParams()

  console.log(areCaptionsSaved)

  const handleYoutubeUrlChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement
    const str = target.value
    // regex for youtube urls with v=VIDEO_ID
    const regex = /(?:\?v=)([a-zA-Z0-9_-]{11})/
    const match = str.match(regex)
    // regex for mobile youtube urls, e.g. https://youtu.be/XTqMAoSPn8I
    const mobileRegex = /(?:\.be\/)([a-zA-Z0-9_-]{11})/
    const mobileMatch = str.match(mobileRegex)
    if (match) {
      setVideoId(match[1])
    } else if (mobileMatch) {
      setVideoId(mobileMatch[1])
    } else {
      ;<Toaster />
      toast.error(
        'Please enter a valid YouTube URL -- e.g. https://www.youtube.com/watch?v=Gs069dndIYk',
        {
          id: 'youtube-url-error',
        }
      )
    }
  }

  const handleWordSelect = (e: FormEvent) => {
    const target = e.target as HTMLInputElement
    setSelectedWord(target.value)
  }

  useEffect(() => {
    if (videoId && areCaptionsSaved) {
      getRepeatedWords({ id: videoId }).then((res) => {
        if (res) {
          setRepeatedWords(res)
          setIsDisabled(false)
          setIsFetched(true)
        }
      })
    }
  }, [videoId, areCaptionsSaved])

  useEffect(() => {
    if (videoId && selectedWord) {
      getCaptions({ id: videoId, chosenWord: selectedWord }).then((res) => {
        setDbCaptions(res)
        setIsFetched(true)
      })
    }
  }, [videoId, selectedWord])

  useEffect(() => {
    if (videoId && areCaptionsSaved) {
      getVideoInfo({ id: videoId }).then((res) => {
        if (res) {
          setVideoInfo(res)
        }
      })
    }
  }, [videoId, areCaptionsSaved])

  useEffect(() => {
    if (isFetched && repeatedWords && dbCaptions) {
      setCaptions(dbCaptions)
      setAreCaptionsSaved(true)
    }
  }, [repeatedWords, dbCaptions, isFetched])

  useEffect(() => {
    if (params.v) {
      const videoId = params.v as string
      if (videoId) {
        setVideoId(videoId)
      }
    }
  }, [params])

  useEffect(() => {
    if (repeatedWords) {
      setIsFetchingRptWrds(false)
    }
    const fetchCaptions = async () => {
      try {
        if (!isFetched && videoId && !repeatedWords) {
          await scrapeCaptionsAndSave({ videoId })
          setAreCaptionsSaved(true)
        }
      } catch (error) {
        console.error(error)
        setIsFetchingRptWrds(false)
        document.getElementById('transcribe')?.focus()
      }
    }
    fetchCaptions()
  }, [repeatedWords, videoId, isFetched])

  useEffect(() => {
    if (videoId && params?.v !== videoId) {
      router.push(`/drinking-game?v=${videoId}`)
      setCounter(0)
      setCaptions([])
      setSelectedWord('')
      if (!repeatedWords) {
        setIsFetchingRptWrds(true)
      } else {
        setIsFetchingRptWrds(false)
      }
    }
  }, [videoId, repeatedWords, router])

  useEffect(() => {
    if (selectedWord) {
      router.push(`/drinking-game/?v=${videoId}&w=${selectedWord}`)
    }
  }, [selectedWord, videoId, router])

  useEffect(() => {
    if (isFetched && repeatedWords) {
      const wordParam = params?.w as string
      if (wordParam && !selectedWord) {
        const wordExists = repeatedWords.find(
          ([word, number]) => word === wordParam
        )

        if (wordExists) {
          setSelectedWord(wordParam)
        }
      }
    }
  }, [isFetched, repeatedWords, params, selectedWord])

  return (
    <>
      <div className='flex flex-col md:px-24 md:mx-16 xl:px-40 xl:mx-40 px-5'>
        <div className='border border-gray-200 rounded-lg p-4'>
          <div
            className={`flex flex-col border ${
              showOptions ? 'rounded-b-none' : ''
            } items-center border-gray-200 rounded-lg gap-4 p-2 sm:flex-row`}
          >
            <div className='w-full'>
              <Input
                ref={inputRef}
                onChange={handleYoutubeUrlChange}
                size='sm'
                className='border border-gray-300 rounded'
                placeholder='https://www.youtube.com/watch?v=SqcY0GlETPk'
                aria-labelledby='url'
              />
            </div>
            <div className='flex gap-4 w-full'>
              <div className='flex justify-center items-center w-full'>
                {isFetchingRptWrds && <Spinner />}
                {!isFetchingRptWrds && (
                  <select
                    ref={selectRef}
                    id='selectedWord'
                    value={selectedWord}
                    onChange={handleWordSelect}
                    className='border border-gray-300 rounded px-2 py-3 text-black w-full'
                    placeholder='Select a highly occuring word'
                    disabled={isDisabled}
                  >
                    <option value=''>Select a highly occuring word</option>
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
              <div
                className={`flex items-center justify-center gap-3 ${
                  isDisabled ? 'pointer-events-none opacity-70' : ''
                }`}
              >
                <Tooltip
                  content="If captions don't exist, you can generate them using OpenAI's Whisper API"
                  placement='bottom'
                  radius='md'
                >
                  <div className='rounded-lg border border-gray-300 p-1'>
                    <BiUserVoice
                      size={35}
                      onClick={() => {
                        router.push(`/transcribe/${videoId}`)
                      }}
                      className='hover:cursor-pointer'
                    />
                  </div>
                </Tooltip>
                <div className='rounded-lg border border-gray-300 p-1 ml-2'>
                  <FiSettings
                    size={35}
                    onClick={() => {
                      setShowOptions(!showOptions)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {showOptions && (
            <div className='flex items-center gap-4 justify-between w-full border border-t-0 rounded-b-lg p-2'>
              <div className='w-full flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <span>Order words from most to least frequent</span>
                  <Switch
                    defaultChecked={!ascOrder}
                    onChange={() => setAscOrder((ascOrder) => !ascOrder)}
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <span>Show Toast notifications</span>
                  <Switch
                    defaultChecked={showToast}
                    onChange={() => setShowToast((showToast) => !showToast)}
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <span>Turn off glass sound</span>
                  <Switch
                    defaultChecked={!isClinkSound}
                    onChange={() => setIsClinkSound((clink) => !clink)}
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <span>💩?</span>
                  <Switch
                    defaultChecked={poo}
                    onChange={() => setPoo((poo) => !poo)}
                  />
                </div>
              </div>
            </div>
          )}
          <div
            className='border border-gray-200 w-full mt-2 aspect-video'
            onClick={() => {
              if (!videoId) {
                inputRef.current?.focus()
              } else if (videoId && !selectedWord) {
                selectRef.current?.focus()
              }
            }}
          >
            {videoId && !repeatedWords && (
              <div className='h-full flex justify-center items-center'>
                <Spinner />
              </div>
            )}
            {videoId && repeatedWords && (
              <YouTubePlayer
                setCounter={setCounter}
                captions={captions}
                chosenWord={selectedWord}
                videoId={videoId}
                showToast={showToast}
                isClinkSound={isClinkSound}
              />
            )}
          </div>
        </div>
        <div className='mt-4 text-2xl flex'>
          {/* <p>{counter > 0 ? counter : ''}</p> */}
          <AnimatedCounter
            counter={counter}
            emoji={
              !poo
                ? '🥃'
                : videoInfo?.youTuberId === 'UCbRP3c757lWg9M-U7TyEkXA'
                ? '🥸'
                : '💩'
            }
          />
        </div>
      </div>
    </>
  )
}

export default DrinkingGame
