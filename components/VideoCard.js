import React from "react";
import { Avatar, Button, Card } from "@nextui-org/react";
import { FaTrashAlt } from "react-icons/fa";

const VideoCard = ({ item, decodeHTML, deleteFromList }) => {
  return (
      <Card className="flex flex-row gap-2 px-2 py-3 w-full items-center bg-black text-white">
        <Avatar isBordered radius="xl" color="primary" className="min-w-[50px] h-[50px]" src={`http://img.youtube.com/vi/${item.id}/sddefault.jpg`} alt="Youtube Video" />
        <div className="flex flex-col gap-2">
          <h3 className="pr-3 pl-2">{decodeHTML(item.title.toUpperCase())}</h3>
          <h4 className="pr-3 pl-2">Uploaded by {decodeHTML(item.channelTitle.toUpperCase())} on {item.publishedAt.toUpperCase()}</h4>
        </div>
        <Button className="float-right px-3" onPress={() => deleteFromList(item.number)} isIconOnly color="danger" aria-label="Remove">
          <FaTrashAlt />
        </Button>
      </Card>
  )
}

export default VideoCard;