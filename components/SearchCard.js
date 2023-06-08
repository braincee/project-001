import { Image } from '@nextui-org/react';
import { Card } from '@nextui-org/react';
import React from 'react';

const SearchCard = ({ video, addToList }) => {

  return (
    <div className="max-w-[300px]">
      <Card className="hover:scale-95" isPressable onPress={() => addToList(video.id, video.title, video.description)} >
        <div className="flex flex-col gap-4 bg-black rounded-lg shadow-md">
          <Image className="rounded-b-none bg-blue-400 w-[300px]" src={`http://img.youtube.com/vi/${video.id}/sddefault.jpg`} alt="Youtube Video"/>
          <div className="w-full p-3">
            <p className="text-sm text-gray-200">{video.title}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchCard;
