import { useState } from "react";
import supabase from "@/libs/supabase";
import { Badge, Button, Card, Code, Divider, Image, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/router";
import { generateCaptionsAndSave } from "@/libs/api";
import TranscribePageModal from "@/components/TranscribePageModal";
import axios from "axios";

const ApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

export const getServerSideProps = async (context) => {
  const { id } = context.query;

  let info = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${ApiKey}&id=${id}`);
  info = JSON.parse(stringify(info));

  const title = info.data.items[0]?.snippet?.title;
  const thumbnail = info.data.items[0]?.snippet?.thumbnails?.default?.url;
  const youTuberId = info.data.items[0]?.snippet?.channelId;

  const videoInfo = {
    thumbnail: thumbnail,
    videoTitle: title,
    youTuberId: youTuberId || '',
  }
  const { data } = await supabase
    .from('caption')
    .select()
    .eq('videoId', id );

  return { props: { videoId: id, videoInfo, captionsInfo: data[0] }}
}

const TranscribePage = ({ videoId, videoInfo, captionsInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleTranscribe = async () => {
    if (!videoId) return;

    try {
      setIsLoading(true);
      let transcribeWithLyrics;
      if (!captionsInfo) {
        transcribeWithLyrics = false;
      } else {
        transcribeWithLyrics = captionsInfo?.transcribedWithLyrics ? false : true;
      }
      
      await generateCaptionsAndSave({ videoId, transcribeWithLyrics });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleOpen = () => {
    if (captionsInfo) {
      onOpen();
    } else {
      handleTranscribe();
    }
  }

  return (
    <>
      <div className='flex flex-col mx-auto w-[96%] md:w-[60%]'>
        <h1 className="text-center text-blue-400 my-2 italic text-xl tracking-widest">
          Transcribe {videoInfo?.videoTitle || 'this video'} w/ OpenAI&apos;s Whisper 🗣{' '}
        </h1>
        <Card className='border border-gray-200 rounded-lg p-4 bg-[#001e3203] min-h-[350px]'>
          {videoInfo?.thumbnail && (
            <div className="flex justify-center">
              <Image src={videoInfo?.thumbnail} className="rounded-none" alt="Video Thumbnail"/>
            </div>
          )}
          <Divider className="my-3" />
          <div className="border border-gray-200 rounded-lg p-4 h-full flex flex-col gap-3">
            <div className="border border-gray-200 rounded-lg p-4 bg-[#001e320d]">
              <h3 className="text-md">
                <span className="text-[#22543d] font-bold rounded-[2px] bg-[#c6f6d5] p-1 text-[12px]">INFO:</span> If the first attempt at transcribing doesn&apos;t give a desirable
                result, come back and <Code>Retry Transcription</Code>. We will apply different settings to increase
                the likelihood of a good result.
              </h3>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-[#001e320d]">
            <h3 className="text-md">
              <span className="text-[#1a202c] font-bold rounded-[2px] bg-[#edf2f7] p-1 text-[12px]">TIP:</span> If you&apos;re having trouble transcribing a song, use a video that has a clean, concise
              title. Try to avoid verbose titles, e.g. &apos;Levels (Official Visualizer) (Remix)&apos; and videos from
              third-party accounts.
            </h3>
            </div>
          </div>
        </Card>
        <div className="flex justify-between mt-3">
          <Button className="bg-[#001e3206] border" onPress={() => router.push(`/drinking-game/?v=${videoId}`)}>Go Back</Button>
          <Button className="bg-[#001e3206] border" onPress={handleOpen}>
            {captionsInfo ? 'Retry Transcription 🗣' : 'Transcribe Audio 🗣'}
          </Button>
          <TranscribePageModal onClose={onClose} isOpen={isOpen} handleTranscribe={handleTranscribe} />
        </div>
      </div>
    </>
  )  
}

export default TranscribePage;