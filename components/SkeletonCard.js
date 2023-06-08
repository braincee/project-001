import { Card } from '@nextui-org/react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonCard = ({ cards }) => {
  return (
    Array(cards).fill(0).map((item, i) => 
    <div className="search-video max-w-[300px]" key={i}>
    <Card className="video-link hover:scale-95" disabled>
      <div className="search-card flex flex-col gap-4 py-4 bg-black rounded-lg shadow-md">
        <div className="w-full h-[169px] bg-gray-300 animate-pulse"></div>
        <Skeleton />
        <div className="w-full px-3">
          <div className="w-full h-4 bg-gray-300 animate-pulse"></div> 
        </div>
      </div>
    </Card>
  </div>
    ));
};

export default SkeletonCard;
