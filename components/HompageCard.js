import React, { useEffect } from 'react';
import { Avatar, Card, Progress } from "@nextui-org/react";
import { FaCheckCircle } from 'react-icons/fa';

const HomepageCard = ({ title, isViewedEnabled, imageSrc, progress, views }) => {

  const truncate = (string, length) => {
    return string.length > length ? `${string.substr(0, length)}...` : string;
  }
  
  return (
    <div className="flex flex-col w-full md:w-[350px] md:min-h-[280px] min-h-[320px]">
      <Card className="hover:scale-95 h-full w-full">
        <div className="flex flex-col bg-black rounded-lg shadow-md h-full w-full p-2">
          <img src={imageSrc} alt="Thumbnail" className="h-[200px] w-full border rounded-xl" />
          <div className="w-full py-2">
            {isViewedEnabled && (
              <Progress value={progress} color="danger" size="xs" className="absolute top-0 left-0" />
            )}
            <div className="flex">
              <div className="flex flex-col items-center">
                <Avatar className="me-[12px] min-w-[36px] h-[36px]" />
              </div>
              <div className='pe-[24px]'>
                <h3 className="text-lg text-white font-bold">{truncate(title, 30)}</h3>
                <h3 className="text-lg text-gray-400 flex items-center">
                  Stephen A.
                  <span className="ps-2"><FaCheckCircle className="min-w-[14px] h-[14px]" /></span>
                </h3>
                <p className="text-gray-400">{views} views</p>
                {isViewedEnabled && (
                  <div className="mt-2">

                    <p className="text-xs text-red-500 mt-1">{progress}% viewed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </Card >
      </div >
    );
};

export default HomepageCard;