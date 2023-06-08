import { Card, Spacer } from '@nextui-org/react';
import React from 'react';

const SkeletonCard = ({ cards }) => {
  return (
    <div className="flex flex-wrap mt-8 justify-center gap-4">
      { Array(cards).fill(0).map((item, i) => (
        <>
        <div className="max-w-[300px]" key={i}>
          <Card className="hover:scale-95" disabled>
            <div className="flex flex-col gap-4 bg-black rounded-lg shadow-md">
              <div className="w-[300px] h-[220px] bg-gray-300 animate-pulse"></div>         
              <div className="w-full p-3">
                <div className="w-full h-6 bg-gray-300 animate-pulse"></div> 
              </div>
            </div>
          </Card>
        </div>
        <Spacer x={6} />
        </>
      )) };
    </div>
  );
};

export default SkeletonCard;
