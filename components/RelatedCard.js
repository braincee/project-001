import React from 'react';
import { Card, Progress } from '@nextui-org/react';
import { FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';

const RelatedCard = ({ index, title, isViewedEnabled, imageList, setImageList, progress, views }) => {

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
    <div className="flex flex-col md:max-w-[400px] w-full max-h-[94px]">
          <div className="flex flex-row h-full w-full">
            <div className="flex justify-start items-center min-w-[168px] me-2">
              { imageList[index] ?
                <div className='flex flex-col w-full'>
                  {isViewedEnabled && (
                    <Progress value={progress} color="danger" size="xs" className="" />
                  )}
                  <img src={imageList[index]} alt="Thumbnail" className=" h-[94px] w-[168px] rounded-xl border" onClick={handleThumbnailClick} />
                </div>
              :
                <div
                  className="flex flex-col h-[94px] w-full items-center justify-start w-[168px] bg-[#d0d7de] rounded-xl"
                  onClick={handleThumbnailClick}
                >
                  <FaCloudUploadAlt className="flex w-full mt-1" size={30} color="gray" />
                  <p className="px-3 py-1 text-center text-[gray]">Tap to select an image</p>
                </div>
              }
            </div>
            <div className="flex items-start w-full">             
              <div>
                <h3 className="text-lg font-bold">{ title ? truncate(title, 30) : "Video Title"}</h3>
                <h3 className="text-gray-400 flex items-center">
                  Stephen A.
                  <span className="ps-2"><FaCheckCircle className="min-w-[14px] h-[14px]" /></span>
                </h3>
                <p className="text-gray-400">{views > 0 ? views + "views": "no views"} </p>
                {isViewedEnabled && (
                  <div className="mt-2">
                    <p className="text-xs text-red-500 mt-1">{progress}% viewed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
    </div>
  );
};

export default RelatedCard;
