import {
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableColumn,
  Avatar,
} from '@nextui-org/react'
import { FaTrashAlt } from 'react-icons/fa'
import dayjs from 'dayjs'

interface TableBuilderProps {
  urlData: any[]
  decodeHTML: (value: string) => string
  deleteFromList?: (value: number) => void
  action: boolean
}

const TableBuilder = (props: TableBuilderProps) => {
  const { urlData, decodeHTML, deleteFromList, action } = props

  const formatDate = (date: Date) => {
    return dayjs(date).format('MMMM DD, YYYY')
  }

  return (
    <Table
      aria-label='Selected videos list'
      className='p-8 mx-8 my-8 w-100 hidden md:flex p-auto'
    >
      {action && deleteFromList ? (
        <TableHeader>
          <TableColumn>No.</TableColumn>
          <TableColumn>Video</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Uploaded By</TableColumn>
          <TableColumn>Date Uploaded</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
      ) : (
        <TableHeader>
          <TableColumn>No.</TableColumn>
          <TableColumn>Video</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Uploaded By</TableColumn>
          <TableColumn>Date Uploaded</TableColumn>
        </TableHeader>
      )}
      {action && deleteFromList ? (
        <TableBody items={urlData}>
          {(item) => (
            <TableRow key={item.number}>
              <TableCell>{item.number}</TableCell>
              <TableCell>
                <Avatar
                  isBordered
                  radius='xl'
                  size='xl'
                  color='primary'
                  src={`http://img.youtube.com/vi/${item.id}/sddefault.jpg`}
                  alt='Youtube Video'
                />
              </TableCell>
              <TableCell>{decodeHTML(item.title.toUpperCase())}</TableCell>
              <TableCell>
                {decodeHTML(item.channelTitle.toUpperCase())}
              </TableCell>
              <TableCell>
                {formatDate(item.publishedAt).toUpperCase()}
              </TableCell>
              <TableCell>
                <Button
                  onPress={() => deleteFromList(item.number)}
                  isIconOnly
                  color='danger'
                  aria-label='Remove'
                >
                  <FaTrashAlt />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      ) : (
        <TableBody items={urlData}>
          {(item) => (
            <TableRow key={item.number}>
              <TableCell>{item.number}</TableCell>
              <TableCell>
                <Avatar
                  isBordered
                  radius='xl'
                  size='xl'
                  color='primary'
                  src={`http://img.youtube.com/vi/${item.id}/sddefault.jpg`}
                  alt='Youtube Video'
                />
              </TableCell>
              <TableCell>{decodeHTML(item.title.toUpperCase())}</TableCell>
              <TableCell>
                {decodeHTML(item.channelTitle.toUpperCase())}
              </TableCell>
              <TableCell>
                {formatDate(item.publishedAt).toUpperCase()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      )}
    </Table>
  )
}

export default TableBuilder
