import { Card, Image } from "@nextui-org/react";
import { FaCloudUploadAlt } from 'react-icons/fa';

const ThumbnailsCard = ({ title, views, thumbnailSrc }) => {
  return (
    <Card>
      {thumbnailSrc ? (
        <Image src={thumbnailSrc} alt="Thumbnail" />
      ) : (
        <div className="flex justify-center items-center w-full h-full bg-gray-200">
          <FaCloudUploadAlt size={40} color="gray" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-500">{views} views</p>
      </div>
    </Card>
  );
};

export default ThumbnailsCard;
