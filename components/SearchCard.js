import React from 'react';
import { Card, Image } from '@nextui-org/react';


const SearchCard = ({ video, addToList, truncate }) => {
  const decodeHTML = (code) => {
    let text = document.createElement("textarea");
    text.innerHTML = code;
    return text.value
  }

  return (
    <div className="flex flex-col md:max-w-[230px] md:min-h-[280px] min-h-[320px]">
      <Card className="hover:scale-95 h-full w-full" isPressable onPress={() => addToList(video.id, video.title, video.description, video.channelTitle, video.publishedAt)} >
        <div className="flex flex-col gap-4 bg-black rounded-lg shadow-md h-full w-full">
          <Image className="rounded-b-none bg-blue-400 w-full md:w-[300px] min-h-[360px] md:min-h-full" src={`http://img.youtube.com/vi/${video.id}/sddefault.jpg`} alt="Youtube Video"/>
          <div className="w-full p-3">
            <p className="md:text-lg text-xl text-left text-gray-200">{decodeHTML(truncate(video.title, 40)) }</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchCard;
