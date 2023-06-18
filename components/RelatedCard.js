import React from 'react';
import { Card, Image } from '@nextui-org/react';

const RelatedCard = ({ video, addToList, truncate }) => {
  const decodeHTML = (code) => {
    let text = document.createElement('textarea');
    text.innerHTML = code;
    return text.value;
  };

  return (
    <div className="flex flex-col md:max-w-[400px] md:min-h-[110px] min-h-[160px]">
      <Card className="hover:scale-95 rounded-lg shadow-md w-full h-full" isPressable onPress={() => addToList(video.id, video.title, video.description, video.channelTitle, video.publishedAt)}>
        <div className="flex flex-row bg-black rounded-lg h-full w-full">
          <Image className="w-[200px] min-h-full rounded-l-lg" src={`http://img.youtube.com/vi/${video.id}/sddefault.jpg`} alt="Youtube Video"/>
          <div className="flex flex-col items-start w-full p-4">
            <p className="text-xl text-gray-200 text-start">{decodeHTML(truncate(video.title, 40))}</p>
            <p className="text-sm text-gray-500 mt-2 text-start">{video.channelTitle}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RelatedCard;
