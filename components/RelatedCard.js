import React from 'react';
import { Card, Progress } from '@nextui-org/react';
import { FaCheckCircle } from 'react-icons/fa';

const RelatedCard = ({ title, isViewedEnabled, imageSrc, progress, views }) => {

  return (
    <div className="flex flex-col md:max-w-[400px] md:min-h-[110px] min-h-[160px]">
      <Card className="hover:scale-95 h-full rounded-lg shadow-md w-full h-full">
        <div className="flex flex-row bg-black rounded-lg h-full w-full">
        <img src={imageSrc} alt="Thumbnail" className="h-[200px] w-full border rounded-xl" />
          <div className="flex flex-col items-start w-full p-4">
          {isViewedEnabled && (
              <Progress value={progress} color="danger" size="xs" className="absolute top-0 left-0" />
            )}
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
      </Card>
    </div>
  );
};

export default RelatedCard;
