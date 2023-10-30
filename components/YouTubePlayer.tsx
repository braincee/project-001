import { Card } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import YouTube from 'react-youtube'
import { toast } from 'react-hot-toast'
// import clinkSound from '@/public/clink.mp3';

// const clink = new Audio(clinkSound);
// clink.volume = 0.75;

interface YouTubePlayerProps {
  setCounter: (value: any) => void
  isClinkSound: boolean
  captions: any[]
  chosenWord: string
  videoId: string
  showToast: boolean
}

const YouTubePlayer = (props: YouTubePlayerProps) => {
  const { setCounter, isClinkSound, captions, chosenWord, videoId, showToast } =
    props
  const [currentTime, setCurrentTime] = useState(0)
  const [prevCaption, setPrevCaption] = useState('')
  const [youtubePlayer, setYoutubePlayer] = useState(null)
  const [getTime, setGetTime] = useState<any>()

  useEffect(() => {
    return () => {
      if (getTime) {
        clearInterval(getTime)
      }
    }
  }, [youtubePlayer, getTime])

  useEffect(() => {
    if (captions) {
      const caption = captions.find((caption) => {
        const startTime = Number(caption.start)
        return currentTime >= startTime && currentTime <= startTime + 1
      })
      console.log('caption >>>', caption)
      if (caption) {
        if (JSON.stringify(caption) !== prevCaption) {
          const captionTextArray = caption.text.split(' ')
          const timePerWord =
            (Number(caption.dur) * 1000) / captionTextArray.length
          const indexes = captionTextArray.forEach(
            (word: string, index: number) => {
              const regex = new RegExp(
                '\\b' + chosenWord.toLowerCase().trim() + '\\b',
                'gi'
              )
              if (word.toLowerCase().trim().match(regex)) {
                const timeDelay = timePerWord * index
                setTimeout(() => {
                  setCounter((prevCount: number) => prevCount + 1)
                  if (showToast) {
                    toast.success(`They said ${chosenWord} 🍻!`, {
                      duration: 2000,
                    })
                  }
                }, timeDelay)
                // setTimeout(() => {
                //   if (isClinkSound) {
                //     if (clink.paused) {
                //       clink.currentTime = 0;
                //       clink.play();
                //     } else {
                //       clink.currentTime = 0;
                //     }
                //   }
                // }, timeDelay + 300);
              }
            }
          )

          setPrevCaption(JSON.stringify(caption))
        }
      }
    }
  }, [currentTime, captions, chosenWord, prevCaption])

  const onPlayerReady = (event: any) => {
    setYoutubePlayer(event.target)

    const getTime = setInterval(() => {
      const currentTime = event.target.getCurrentTime()
      setCurrentTime(currentTime)
    }, 1000)

    setGetTime(getTime)
    event.target.pauseVideo()
  }

  const onStateChange = (event: any) => {}

  useEffect(() => {
    const iframe = document.getElementById('yt-player')
    if (iframe) {
      if (videoId && !chosenWord) {
        iframe.style.pointerEvents = 'none'
        iframe.style.opacity = '0.7'
      } else {
        iframe.style.pointerEvents = 'all'
        iframe.style.opacity = '1'
      }
    }
  })

  const opts = {
    height: '360',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  }

  return (
    <Card className='h-full !rounded-none !border-0'>
      <YouTube
        className='!border-0'
        id='yt-player'
        videoId={videoId}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onStateChange}
      />
    </Card>
  )
}

export default YouTubePlayer
