import { useState } from 'react';
import { Card, Image } from '@nextui-org/react';

export default function ThumbnailsCard({ title, thumbnailSrc }) {
  const [imageSrc, setImageSrc] = useState(thumbnailSrc);

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

  return (
    <Card className="w-full md:w-[400px]">
      <div className="flex justify-center items-center">
        <Image src={imageSrc} alt="Thumbnail" className="h-[200px]" onClick={handleThumbnailClick} />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-500">{Math.floor(Math.random() * 10)} views</p>
      </div>
    </Card>
  );
}
