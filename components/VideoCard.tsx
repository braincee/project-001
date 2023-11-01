import { Avatar, Button, Card } from '@nextui-org/react'
import { FaTrashAlt } from 'react-icons/fa'

interface VideoCardProps {
  item: {
    id: string
    title: string
    channelTitle: string
    number: number
    publishedAt: string
  }
  decodeHTML: (value: string) => string
  deleteFromList: (value: number) => void
  isEditing: boolean
}

const VideoCard = (props: VideoCardProps) => {
  const { item, decodeHTML, deleteFromList, isEditing } = props
  return (
    <Card className='flex flex-row gap-2 px-2 py-3 w-full items-center'>
      <Avatar
        isBordered
        radius='xl'
        color='primary'
        className='min-w-[50px] h-[50px]'
        src={`http://img.youtube.com/vi/${item.id}/sddefault.jpg`}
        alt='Youtube Video'
      />
      <div className='flex flex-col gap-2'>
        <h3 className='pr-3 pl-2'>{decodeHTML(item.title.toUpperCase())}</h3>
        <h4 className='pr-3 pl-2'>
          Uploaded by {decodeHTML(item.channelTitle.toUpperCase())} on{' '}
          {item.publishedAt.toUpperCase()}
        </h4>
      </div>
      {isEditing && (
        <Button
          className='float-right px-3'
          onPress={() => deleteFromList(item.number)}
          isIconOnly
          color='danger'
          aria-label='Remove'
        >
          <FaTrashAlt />
        </Button>
      )}
    </Card>
  )
}

export default VideoCard
