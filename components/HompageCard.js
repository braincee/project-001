import React, { useEffect } from 'react';
import { Avatar, Progress } from "@nextui-org/react";
import { FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';


const HomepageCard = ({ index, title, channel, isViewedEnabled, isNewBadgeEnabled, imageList, setImageList, progress, views, files, setFiles }) => {

  const truncate = (string, length) => {
    return string.length > length ? `${string.substr(0, length)}...` : string;
  }

  const handleThumbnailClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.ariaLabel = 'Upload image';
    fileInput.accept = 'image/jpeg,image/png,image/jpg';
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (imageList[index] !== undefined) {
        setImageList((prevImageList) => {      
          const items = prevImageList.map((item, i) => {
            if (index === i) {
              return URL.createObjectURL(selectedFile);
            } else {
              return item;
            }
          });
          return items;
        }
        );
        setFiles((prevFiles) => {      
          const items = prevFiles.map((item, i) => {
            if (index === i) {
              return selectedFile
            } else {
              return item;
            }
          });
          return items;
        }
        );
      } else {
        setImageList([...imageList, URL.createObjectURL(selectedFile)]);
        setFiles([...files, selectedFile ])
      }
    }
    
  };
  
  return (
    <div className="w-full md:w-[calc(100%/2-1.5rem)] max-w-[360px]">
          <div className="w-full hover:cursor-pointer">
            { imageList[index] ?
              <div className='w-full relative max-h-[200px]'>
                <img src={imageList[index]} alt="Thumbnail" className="h-[200px] rounded-lg w-full border" onClick={handleThumbnailClick} />   
                {isViewedEnabled && (
                  <Progress 
                    value={progress}
                    size="lg"
                    radius="none"
                    className="progress-bar absolute bottom-0 left-0 h-[5px] px-[1px]"
                  />
              )}            
              </div>
            :
              <div
                className="flex flex-col h-[200px] items-center justify-center w-full bg-[#d0d7de] rounded-xl"
                onClick={handleThumbnailClick}
              >
                <FaCloudUploadAlt className="flex w-full h-1/2" size={30} color="gray" />
                <p className="p-3 text-center text-[gray]">Tap to select an image</p>
              </div>
            }

          </div>
          <div className="py-2 flex">
            <div className="flex flex-col items-center">
              <Avatar className="me-[12px] min-w-[36px] h-[36px]" />
            </div>
            <div className='pe-[24px] w-full'>
              <h3 className="text-[16px] font-medium">{ title ? truncate(title, 40) : "Video Title"}</h3>
              {channel &&
                <li className="flex items-center text-gray-500 text-[14px]">
                  { truncate(channel, 30)}
                  <span className="ps-1"><FaCheckCircle className="min-w-[14px] h-[14px]" /></span>
                </li>
              }            
              <ul className="flex flex-wrap gap-2 text-gray-500 text-[14px] font-normal">
                <li>{imageList[index] ? views + " views": "no views"} </li>
                {imageList[index] &&
                  <ul className="list-disc pl-4">
                    <li className="before:p-0"> 1 hour ago</li>
                  </ul>
                }
              </ul>
                {isNewBadgeEnabled && (           
                  <span className="text-[#606060] bg-[#0000000d] px-[4px] py-[2px] text-[12px] font-medium rounded-[4px]">New</span>
                )}                
            </div>
          </div>
    </div>
    );
};

export default HomepageCard;
