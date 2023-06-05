import { Image } from '@nextui-org/react';
import { Card } from '@nextui-org/react';
import React from 'react';

const SearchCard = ({ video, addToList }) => {

  return (
    <div className="search-video max-w-[300px]">
      <Card className="video-link" isPressable onPress={() => addToList(video.id, video.title, video.description)} >
        <div className="search-card flex flex-col gap-4 py-4 bg-white rounded-lg shadow-md">
          <Image className="rounded-b-none w-[300px]" src={`http://img.youtube.com/vi/${video.id}/sddefault.jpg`} alt="Youtube Video"/>
          <div className="w-full px-3">
            <p className="text-lg font-bold">{video.title}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchCard;
