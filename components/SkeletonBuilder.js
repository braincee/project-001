import { Card, Spacer } from '@nextui-org/react';
import React from 'react';

const SkeletonBuilder = ({ cards }) => {
  return (
    <div className="flex md:flex-wrap md:flex-row flex-col mt-8 justify-center px-10 md:px-5 gap-4">
      { Array(cards).fill(0).map((item, i) => (
        <>
        <div className="md:max-w-[230px] md:min-h-[280px] min-h-[320px]" key={i}>
          <Card className="hover:scale-95 h-full" disabled>
            <div className="flex flex-col gap-4 bg-black rounded-lg shadow-md h-full">
              <div className="md:w-[300px] md:min-h-[220px] min-h-[360px] bg-gray-300 animate-pulse"></div>         
              <div className="w-full p-3">
                <div className="w-full h-12 bg-gray-300 animate-pulse"></div> 
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

export default SkeletonBuilder;
