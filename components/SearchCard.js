import { Image } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

const SearchCard = ({ video }) => {
  return (
    <div className="search-video max-w-[300px]">
      <Link className="video-link" target="_blank" href={"#"} />
      <div className="flex flex-col gap-4 py-4 bg-white rounded-lg shadow-md">
        <Image className="rounded-b-none w-[300px]" src={`http://img.youtube.com/vi/${video.id}/sddefault.jpg`} alt="Youtube Video"/>
        <div className="w-full px-3">
          <p className="text-lg font-bold">{video.title}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
