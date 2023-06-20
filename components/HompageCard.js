import React from 'react';
import { Avatar, Progress } from "@nextui-org/react";
import { FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';

const HomepageCard = ({ index, title, isViewedEnabled, imageList, setImageList, progress, views }) => {

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
          <div className="flex justify-center items-center w-full">
            { imageList[index] ?
              <div className='flex flex-col w-full'>
                {isViewedEnabled && (
                  <Progress value={progress} color="danger" size="xs" className="" />
                )}
                <img src={imageList[index]} alt="Thumbnail" className="h-[200px] w-full border rounded-xl" onClick={handleThumbnailClick} />
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
            <div className='pe-[24px]'>
              <h3 className="text-lg font-bold">{ title ? truncate(title, 30) : "Video Title"}</h3>
              <ul className="flex flex-wrap gap-2 text-gray-500 text-[16px]">
                <li className="flex items-center">
                  Uploaded by Stephen
                  <span className="ps-1"><FaCheckCircle className="min-w-[14px] h-[14px]" /></span>
                </li>
                <li>{views > 0 ? views + "views": "no views"} </li>
                <li className="">1 hour ago</li>
              </ul>
                  
                {isViewedEnabled && (
                  <div className="mt-2">                
                    <p className="text-xs text-red-500 mt-1">{progress}% viewed</p>
                  </div>
                )}
              
              
            </div>
          </div>
    </div>
    );
};

export default HomepageCard;