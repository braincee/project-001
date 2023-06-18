import React from 'react';
import { Card, Progress } from '@nextui-org/react';
import { FaCheckCircle } from 'react-icons/fa';

const RelatedCard = ({ title, isViewedEnabled, imageSrc, progress, views }) => {

  const truncate = (string, length) => {
    return string.length > length ? `${string.substr(0, length)}...` : string;
  }

  return (
    <div className="flex flex-col md:max-w-[400px] w-full max-h-[170px]">
      <Card className="hover:scale-95 rounded-none shadow-md w-full h-full">
        <div className="flex flex-row bg-black h-full w-full p-2">
          <div className="flex flex-col">
            <img src={imageSrc} alt="Thumbnail" className="w-[200px] min-w-2/5 h-[140px] rounded-xl border" />
            {isViewedEnabled && (
              <Progress value={progress} color="danger" size="xs" />
            )}
            </div>
          <div className="flex items-start w-full px-2 w-3/5">
            
            <div >
              <h3 className="text-lg text-white font-bold">{truncate(title, 30)}</h3>
              <h3 className="text-gray-400 flex items-center">
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
      </Card>
    </div>
  );
};

export default RelatedCard;
