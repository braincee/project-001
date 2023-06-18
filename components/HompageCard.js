import React from 'react';
import { Avatar, Card, Image, Progress } from "@nextui-org/react";
import { FaCheckCircle } from 'react-icons/fa';

const HomepageCard = ({ title, isViewedEnabled, imageSrc, progress, views }) => {

  return (
    <div className="flex flex-col md:max-w-[340px] md:min-h-[280px] min-h-[320px]">
      <Card className="hover:scale-95 h-full w-full">
        <div className="flex flex-col gap-4 bg-black rounded-lg shadow-md h-full w-full">
          <img src={imageSrc} alt="Thumbnail" className="h-[200px] w-full border rounded-xl" />
          <div className="w-full p-3">
            {isViewedEnabled && (
              <Progress value={progress} color="danger" size="xs" className="absolute top-0 left-0" />
            )}
            <div className="flex flex-col items-center">
              <Avatar className="me-[12px] min-w-[36px] h-[36px]" />
            </div>
            <div className='pe-[24px]'>
              <h3 className="text-lg font-bold">{title}</h3>
              <h3 className="text-lg text-gray-500 flex items-center">
                Uploaded by Stephen
                <span className="ps-1"><FaCheckCircle className="min-w-[14px] h-[14px]" /></span>
              </h3>
              <p className="text-gray-500">{views} views</p>
              {isViewedEnabled && (
                <div className="mt-2">

                  <p className="text-xs text-red-500 mt-1">{progress}% viewed</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </Card >
      </div >
    );
};

export default HomepageCard;