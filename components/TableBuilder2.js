import { Table, TableBody, TableRow, TableCell, TableHeader, TableColumn, Avatar } from '@nextui-org/react';
import dayjs from 'dayjs';


const TableBuilder2 = ({ urlData, decodeHTML }) => {

  const formatDate = (date) => {
    return dayjs(date).format('MMMM DD, YYYY');
  };

  return (
    <Table
      aria-label="Selected videos list"
      className="p-8 mx-8 my-8 w-100 hidden md:flex p-auto"
    >
      <TableHeader>
        <TableColumn>No.</TableColumn>
        <TableColumn>Video</TableColumn>
        <TableColumn>Title</TableColumn>
        <TableColumn>Uploaded By</TableColumn>
        <TableColumn>Date Uploaded</TableColumn>
      </TableHeader>
      <TableBody items={urlData}>
        {(item) => (
          <TableRow key={item.number}>
            <TableCell>{item.number}</TableCell>
            <TableCell><Avatar isBordered radius="xl" size="xl" color="primary" src={`http://img.youtube.com/vi/${item.id}/sddefault.jpg`} alt="Youtube Video" /></TableCell>
            <TableCell>{decodeHTML(item.title.toUpperCase())}</TableCell>
            <TableCell>{decodeHTML(item.channelTitle.toUpperCase())}</TableCell>
            <TableCell>{formatDate(item.publishedAt).toUpperCase()}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table> 
  )
}

export default TableBuilder2;