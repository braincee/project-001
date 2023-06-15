import { useState } from 'react';
import { Card, Image, Button, Input } from '@nextui-org/react';

export default function ThumbnailsCard({ title, views, thumbnailSrc }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleThumbnailClick = () => {
    // Trigger the file input click event
    const fileInput = document.getElementById(`fileInput_${title}`);
    fileInput.click();
  };

  return (
    <Card className="w-full md:w-[400px]">
      <div className="flex justify-center items-center">
        {file ? (
          <Image src={URL.createObjectURL(file)} alt="Thumbnail" className="h-[200px]" onClick={handleThumbnailClick} />
        ) : (
          <Image src={thumbnailSrc} alt="Thumbnail" className="h-[200px]" onClick={handleThumbnailClick} />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-500">{ Math.floor(Math.random() * 10 ) + views} views</p>
        <div className="mt-4">
          <Input
            id={`fileInput_${title}`}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </Card>
  );
}
