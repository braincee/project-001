import { useState, useEffect } from 'react';
import { Avatar, Progress } from '@nextui-org/react';
import { FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';

export default function ThumbnailsCard({ title, isViewedEnabled }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [views, setViews] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleThumbnailClick = () => {
    // Trigger the file input click event
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/png,image/jpg';
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImageSrc(URL.createObjectURL(selectedFile));
    }
  };

  const getRandomProgress = () => {
    return Math.floor(Math.random() * 100);
  };

  useEffect(() => {
    if (isViewedEnabled) {
      setViews(Math.floor(Math.random() * 100));
      setProgress(getRandomProgress());
    } else {
      setViews(0);
      setProgress(0);
    }
  }, [isViewedEnabled]);

  return (
    <div className="w-full md:w-[400px] relative">
        { imageSrc ?
          <>
          <div className="flex justify-center items-center w-full">
            <img src={imageSrc} alt="Thumbnail" className="h-[200px] w-full border rounded-xl" onClick={handleThumbnailClick} />
          </div>
          <div className="py-2 flex relative">
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
        </>
        :
        <div
          className="flex flex-col h-[200px] items-center justify-center w-full bg-[#d0d7de]"
          onClick={handleThumbnailClick}
        >
          <FaCloudUploadAlt className="flex w-full h-1/2" size={30} color="gray" />
          <p className="p-3 text-center text-[gray]">Tap to select an image</p>
        </div>
        }
      
        
      
    </div>
  );
}
