import { Image } from '@nextui-org/react';
import { Card } from '@nextui-org/react';
import React from 'react';

const SearchCard = ({ video, addToList }) => {

  return (
    <div className="search-video max-w-[300px]">
      <Card className="video-link hover:scale-95" isPressable onPress={() => addToList(video.id, video.title, video.description)} >
        <div className="search-card flex flex-col gap-4 py-4 bg-black rounded-lg shadow-md">
          <Image className="rounded-b-none bg-blue-400 w-[300px]" src={`http://img.youtube.com/vi/${video.id}/sddefault.jpg`} alt="Youtube Video"/>
          <div className="w-full px-3">
            <p className="text-sm text-gray-200">{video.title}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchCard;
