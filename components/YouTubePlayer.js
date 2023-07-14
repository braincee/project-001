import { Card } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

const YouTubePlayer = ({
  setCounter,
  isClinkSound,
  captions,
  chosenWord,
  videoId,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [prevCaption, setPrevCaption] = useState('');
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  const [getTime, setGetTime] = useState();

  useEffect(() => {
    return () => {
      if (getTime) {
        clearInterval(getTime);
      }
    };
  }, [youtubePlayer, getTime]);

  useEffect(() => {
    if (captions) {
      const caption = captions.find((caption) => {
        const startTime = Number(caption.start);
        return currentTime >= startTime && currentTime <= startTime + 1;
      });
      console.log('caption >>>', caption);
      if (caption) {
        if (JSON.stringify(caption) !== prevCaption) {
          const captionTextArray = caption.text.split(' ');
          const timePerWord = (Number(caption.dur) * 1000) / captionTextArray.length;
          const indexes = captionTextArray.forEach((word, index) => {
            const regex = new RegExp('\\b' + chosenWord.toLowerCase().trim() + '\\b', 'gi');
            if (word.toLowerCase().trim().match(regex)) {
              const timeDelay = timePerWord * index;
              setTimeout(() => {
                setCounter((counter) => counter + 1);
              }, timeDelay);
              setTimeout(() => {
                if (isClinkSound) {
                  if (clink.paused) {
                    clink.currentTime = 0;
                    clink.play();
                  } else {
                    clink.currentTime = 0;
                  }
                }
              }, timeDelay + 300);
            }
          });

          setPrevCaption(JSON.stringify(caption));
        }
      }
    }
  }, [currentTime, captions]);

  const onPlayerReady = (event) => {
    setYoutubePlayer(event.target);

    const getTime = setInterval(() => {
      const currentTime = event.target.getCurrentTime();
      setCurrentTime(currentTime);
    }, 1000);

    setGetTime(getTime);
    event.target.pauseVideo();
  };

  console.log(captions);

  const onStateChange = (event) => {};

  const opts = {
    height: '360',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  return (
    <Card className="h-full">
      <YouTube id="yt-player" videoId={videoId} opts={opts} onReady={onPlayerReady} onStateChange={onStateChange}/>
    </Card>
  )
}

export default YouTubePlayer;