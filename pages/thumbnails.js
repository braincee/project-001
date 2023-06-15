import { useEffect, useRef, useState } from 'react';
import ThumbnailsCard from '../components/ThumbnailsCard';
import { Button, Input } from '@nextui-org/react';
import Head from 'next/head';
import { FaUpload } from 'react-icons/fa';

const views = Math.floor(Math.random() * 1000000);

export default function ThumbnailsPage() {
  const [inputValue, setInputValue] = useState('');
  const [title, setTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const fileRef = useRef();

  const handleTitleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      const fileType = files[0]['type'];
      const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (validImageTypes.includes(fileType)) {
        setFileList([...fileList, files[0]]);
      } else {
        return;
      }
    }
  }

  const handleFileSelect = (e) => {
    let files = [...e.target.files];
    if (fileList.length >= 2) {
      return;
    } else if (files && files.length > 0) {
      const fileType = files[0]['type'];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (validImageTypes.includes(fileType)) {
        setFileList([...fileList, files[0]]);
      } else {
        return;
      }
    }
  }

  useEffect(() => {
    if (fileList.length > 0) {
      setIsDisabled(false);
    }
  }, [fileList])

  const handleAddTitle = () => {
    if (inputValue.trim() !== '') {
      setTitle(inputValue);
      setInputValue('');
    }
  };

  return (
    <>
      <Head>
        <title>YT Playlist Creator & Sharer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-4 mb-[50px] flex flex-col">
        <h1 className="text-center px-3 md:px-0 text-3xl">Thumbnails Page</h1>
        <section>
          <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
            <Input
              type="text"
              onChange={handleTitleChange}
              className="w-full md:w-3/5 text-2xl px-4 md:px-0 placeholder-slate-400"
              placeholder="Add title"
              aria-labelledby="none"
              value={inputValue}
            />
            <Button
              color="primary"
              className="text-white"
              size="xl"
              onPress={handleAddTitle}
              isDisabled={isDisabled}
            >
              Add
            </Button>
          </div>
        </section>
        <section className="mt-8 px-8">
          <h2 className="text-center text-2xl">Compare Thumbnails</h2>
          <div className="p-4 flex flex-col lg:flex-row lg:flex-wrap gap-10 items-center">
            <div
              className="flex justify-center items-center flex-col border-dashed border-2 border-[#c3c3c3] w-[300px] h-[200px]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <FaUpload size={30} color="blue" />
              <p className="p-4 text-center">Drop your files here or Select to upload</p>
              <Input
                type="file"
                aria-labelledby="none"
                onChange={handleFileSelect}
                ref={fileRef}
              />
            </div>
            <div className="flex gap-10 flex-col md:flex-row items-center">
              {fileList.length > 0 && fileList.map((file, index) => (
                <ThumbnailsCard
                  key={index}
                  title={title}
                  views={views}
                  thumbnailSrc={URL.createObjectURL(file)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
