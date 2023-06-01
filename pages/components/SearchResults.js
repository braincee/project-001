import React from 'react';
import { Image } from '@nextui-org/react';

const SearchResults = ({ videos }) => {
  return (
    <div className="mt-[20px] px-[20px] lg:px-[100px] flex flex-col gap-[20px]">
      {videos.length > 0 &&
        videos.map((video, index) => (
          <div key={index}>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <Image src={`https://i.ytimg.com/vi/${video.id}/default.jpg`} alt="Video Thumbnail" width={320} height={180} />
          </div>
        ))}
    </div>
  );
};

export default SearchResults;
