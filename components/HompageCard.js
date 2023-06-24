import React from 'react';
import { Avatar, Progress } from "@nextui-org/react";
import { FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';

const HomepageCard = ({ index, title, isViewedEnabled, isNewBadgeEnabled, imageList, setImageList, progress, views }) => {

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
      if (imageList.length >= 2) {
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
      } else {
        setImageList([...imageList, URL.createObjectURL(selectedFile)]);
      }
    }
  };
  
  return (
    <div className="w-full md:w-[calc(100%/2-1.5rem)] max-w-[360px]">
          <div className="w-full">
            { imageList[index] ?
              <div className='w-full relative max-h-[200px]'>
                <img src={imageList[index]} alt="Thumbnail" className="h-[200px] rounded-lg w-full border" onClick={handleThumbnailClick} />   
                {isViewedEnabled && (
                <Progress value={progress} color="danger" size="xs" className="absolute bottom-0 left-0 rounded-b-lg h-1 px-[2px]" />
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
              <h3 className="text-[16px] font-medium">{ title ? truncate(title, 50) : "Video Title"}</h3>
              <li className="flex items-center text-gray-500 text-[14px]">
                Stephen A.
                <span className="ps-1"><FaCheckCircle className="min-w-[14px] h-[14px]" /></span>
              </li>
              <ul className="flex flex-wrap gap-2 text-gray-500 text-[14px] font-normal">
                <li>{views !== 0 && imageList[index] ? views + " views": "no views"} </li>
                {imageList[index] &&
                  <ul className="list-disc pl-4">
                    <li className="before:p-0"> 1 hour ago</li>
                  </ul>
                }
              </ul>
                {isNewBadgeEnabled && (           
                  <span className="text-slate-400 bg-slate-600 px-1 py-[2px] text-[12px] font-medium">New</span>
                )}                
                {isViewedEnabled && (
                  <div>                
                    <p className="text-xs text-red-500 mt-1">{progress}% viewed</p>
                  </div>
                )}
              
              
            </div>
          </div>
    </div>
    );
};

export default HomepageCard;