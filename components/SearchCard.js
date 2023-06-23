import React from 'react';
import { Card, Image, Avatar } from '@nextui-org/react';
import { FaCheckCircle } from 'react-icons/fa';


const SearchCard = ({ video, addToList, truncate }) => {
  const decodeHTML = (code) => {
    let text = document.createElement("textarea");
    text.innerHTML = code;
    return text.value
  }

  return (
    <div className="md:max-w-[230px] md:min-h-[280px] min-h-[320px]">
      <Card className="hover:scale-95 h-full w-full" isPressable onPress={() => addToList(video.id, video.title, video.description, video.channelTitle, video.publishedAt)} >
        <div className="flex flex-col gap-4 bg-black rounded-lg shadow-md h-full w-full">
          <Image className="rounded-b-none bg-blue-400 w-full md:w-[300px] min-h-[360px] md:min-h-full" src={`http://img.youtube.com/vi/${video.id}/sddefault.jpg`} alt="Youtube Video"/>
          <div className="flex flex-row w-full p-3">
            <div>
            <Avatar className="me-[8px] min-w-[36px] h-[36px] border" src={`http://img.youtube.com/vi/${video.id}/sddefault.jpg`}/>
            </div>
          <div>
          <ul>
            <li className="md:text-sm text-xl text-left text-gray-200">{decodeHTML(truncate(video.title, 20)) }</li>
            <li className="flex items-center text-gray-500 text-[14px]">
              {truncate(video.channelTitle, 15)}
              <span className="ps-1"><FaCheckCircle className="min-w-[14px] h-[14px]" /></span>
            </li>
            <li className='text-gray-200 md:text-sm text-left'>0 views. 1 hour ago</li>
          </ul>
          </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchCard;
