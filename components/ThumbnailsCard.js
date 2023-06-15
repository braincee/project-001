import { useState, useEffect } from 'react';
import { Card, Image } from '@nextui-org/react';

export default function ThumbnailsCard({ title, thumbnailSrc, isViewedEnabled }) {
  const [imageSrc, setImageSrc] = useState(thumbnailSrc);
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
    <Card className="w-full md:w-[400px] relative">
      <div className="flex justify-center items-center">
        <Image src={imageSrc} alt="Thumbnail" className="h-[200px]" onClick={handleThumbnailClick} />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-500">{views} views</p>
        {isViewedEnabled && (
          <div className="mt-2">
            <div className="relative h-1 bg-red-500 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-red-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-red-500 mt-1">{progress}% viewed</p>
          </div>
        )}
      </div>
    </Card>
  );
}
