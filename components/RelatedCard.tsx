import React from 'react'
import { Progress } from '@nextui-org/react'
import { FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa'

interface RelatedCardProps {
  index: number
  title: string
  channel: string
  isViewedEnabled: boolean
  isNewBadgeEnabled: boolean
  imageList: any[]
  setImageList: (value: any) => void
  progress: number
  views: string
  files: any[]
  setFiles: (value: any) => void
}

const RelatedCard = (props: RelatedCardProps) => {
  const {
    index,
    title,
    channel,
    isViewedEnabled,
    isNewBadgeEnabled,
    imageList,
    setImageList,
    progress,
    views,
    files,
    setFiles,
  } = props

  const truncate = (item: string, length: number) => {
    return item.length > length ? `${item.substr(0, length)}...` : item
  }

  const handleThumbnailClick = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.ariaLabel = 'Upload image'
    fileInput.accept = 'image/jpeg,image/png,image/jpg'
    fileInput.onchange = handleFileChange
    fileInput.click()
  }

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (imageList[index] !== undefined) {
        setImageList((prevImageList: any[]) => {
          const items = prevImageList.map((item, i) => {
            if (index === i) {
              return URL.createObjectURL(selectedFile)
            } else {
              return item
            }
          })
          return items
        })
        setFiles((prevFiles: any[]) => {
          const items = prevFiles.map((item, i) => {
            if (index === i) {
              return selectedFile
            } else {
              return item
            }
          })
          return items
        })
      } else {
        setImageList([...imageList, URL.createObjectURL(selectedFile)])
        setFiles([...files, selectedFile])
      }
    }
  }

  return (
    <div className='flex flex-col md:max-w-[400px] h-full'>
      <div className='flex flex-row h-full w-full'>
        <div className='flex justify-start min-w-[168px] me-2 hover:cursor-pointer'>
          {imageList[index] ? (
            <div className='w-full relative max-h-[94px]'>
              <img
                src={imageList[index]}
                alt='Thumbnail'
                className=' h-[94px] w-[168px] rounded-lg border'
                onClick={handleThumbnailClick}
              />
              {isViewedEnabled && (
                <Progress
                  value={progress}
                  color='danger'
                  size='xs'
                  className='absolute bottom-0 left-0 rounded-b-lg h-1 px-[2px]'
                />
              )}
            </div>
          ) : (
            <div
              className='flex flex-col h-[94px] w-full items-center justify-start bg-[#d0d7de] rounded-xl'
              onClick={handleThumbnailClick}
            >
              <FaCloudUploadAlt
                className='flex w-full mt-1'
                size={30}
                color='gray'
              />
              <p className='px-3 py-1 text-center text-[gray]'>
                Tap to select an image
              </p>
            </div>
          )}
        </div>
        <div className='flex items-start justify-start w-full text-[14px]'>
          <div>
            <h3 className='text-[16px] font-medium'>
              {title ? truncate(title, 40) : 'Video Title'}
            </h3>
            {channel && (
              <li className='flex items-center text-gray-500 text-[14px]'>
                {truncate(channel, 30)}
                <span className='ps-1'>
                  <FaCheckCircle className='min-w-[14px] h-[14px]' />
                </span>
              </li>
            )}
            <ul className='flex flex-wrap gap-2 text-gray-500 text-[14px] font-normal'>
              <li>{imageList[index] ? views + ' views' : 'no views'} </li>
              {imageList[index] && (
                <ul className='list-disc pl-4'>
                  <li className='before:p-0'> 1 hour ago</li>
                </ul>
              )}
            </ul>
            {isNewBadgeEnabled && (
              <span className='text-[#606060] bg-[#0000000d] px-[4px] py-[2px] text-[12px] font-medium rounded-[4px]'>
                New
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RelatedCard
