import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Spacer, Switch } from '@nextui-org/react';
import Head from 'next/head';
import HomepageCard from '@/components/HompageCard';
import RelatedCard from '@/components/RelatedCard';
import numbro from 'numbro';
import Api from '@/libs/api';
import { v4 as uuidv4 } from "uuid";

export default function ThumbnailsPage() {
  const [titleValue, setTitleValue] = useState('');
  const [channelName, setChannelName] = useState('');
  const [imageList, setImageList] = useState([]);
  const [isViewedEnabled, setIsViewedEnabled] = useState(false);
  const [isNewBadgeEnabled, SetIsNewBadgeEnabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [views, setViews] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [files, setFiles] = useState([]);
  const router = useRouter();

  const handleTitleChange = (e) => {
    setTitleValue(e.target.value);
  };

  const handleNameChange = (e) => {
    setChannelName(e.target.value);
  }

  const handleViewedToggle = () => {
    setIsViewedEnabled(!isViewedEnabled);

    if (!isViewedEnabled) {
      const randomProgress = Math.floor(Math.random() * 100);
      setProgress(randomProgress);
    }
  };

  const handleNewBadgeToggle = () => {
    SetIsNewBadgeEnabled(!isNewBadgeEnabled);
  }

  const handlePollCreation = async () => {
    const options = [];
    const pollId = uuidv4();
    for (let i = 0; i < files.length; i++) {
      const pollName = await Api.addToPollsStorage(files[i]);
      const url = await Api.getFilePublicURL(pollName);
      options.push({id: uuidv4(), image_url: url.publicUrl});
    }
    await Api.addNewPoll({options, pollId});

    const imageUrls = options.map((option) => option.image_url);
    router.push({
      pathname: `/vote/${pollId}`,
    });
  }

  useEffect(() => {
    if (imageList.length == 1) {
      setViews(Math.floor(Math.random() * 10000));
    }
    if (imageList.length < 2) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [imageList.length]);

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
          <div className="flex flex-col justify-center items-center mt-8 gap-4 w-full">
            <Input
              type="text"
              onChange={handleTitleChange}
              className="w-full md:w-3/5 text-2xl px-4 md:px-0 placeholder-slate-400"
              placeholder="Enter a video title"
              aria-labelledby="Title"
              value={titleValue}
            />
            <Input
              type="text"
              onChange={handleNameChange}
              className="w-full md:w-3/5 text-2xl px-4 md:px-0 placeholder-slate-400"
              placeholder="Enter a channel name"
              aria-labelledby="Channel name"
              value={channelName}
            />
            <div className="flex justify-between w-full md:w-3/5 px-4 md:px-0">
              <p>Viewed</p>
              <Switch
                checked={isViewedEnabled}
                onChange={handleViewedToggle}
                color="primary"
                size="xl"
              /> 
            </div>
            <div className="flex justify-between w-full md:w-3/5 px-4 md:px-0">
              <p>Toggle new badge</p>
              <Switch
                checked={isNewBadgeEnabled}
                onChange={handleNewBadgeToggle}
                color="primary"
                size="xl"
              />
            </div>
            <div>
              <Button
                color="primary"
                variant="bordered"
                onPress={handlePollCreation}
                isDisabled={disabled}
              >
                Create Vote
              </Button>
            </div>
          </div>
        </section>
        <section className="mt-8 md:pl-20 lg:pl-32 pl-5 w-full">
            <p className='my-4 font-2xl text-[30px] md:mr-[550px] tracking-widest italic'>HOMEPAGE</p>
            <div className="flex md:flex-row flex-col px-3 md:px-0 md:gap-3 gap-5 lg:gap-10">
              { Array.apply(null, Array(2)).map((_, index) => (
                <>
                <HomepageCard
                  key={index}
                  index={index}
                  title={titleValue}
                  channel={channelName}
                  isViewedEnabled={isViewedEnabled}
                  isNewBadgeEnabled={isNewBadgeEnabled}
                  imageList={imageList}
                  setImageList={setImageList}
                  progress={progress}
                  views={numbro(views * (index + 1)).format({
                    spaceSeparated: false,
                    average: true,
                  })}
                  setViews={setViews}
                  setFiles={setFiles}
                  files={files}
                />
                  <Spacer x={3} />
                </>
              ))
              }
            </div>
            <Spacer y={10} />
            <p className='my-4 font-2xl text-[30px] md:mr-[600px] tracking-widest italic'>RELATED</p>
            <div className="flex md:flex-row flex-col px-3 md:px-0 gap-6">
              { Array.apply(null, Array(2)).map((_, index) => (
                <>
                <RelatedCard
                  key={index}
                  index={index}
                  title={titleValue}
                  channel={channelName}
                  isViewedEnabled={isViewedEnabled}
                  isNewBadgeEnabled={isNewBadgeEnabled}
                  imageList={imageList}
                  setImageList={setImageList}
                  progress={progress}
                  views={numbro(views * (index + 1)).format({
                    spaceSeparated: false,
                    average: true,
                  })}
                  setFiles={setFiles}
                  files={files}
                />
                <Spacer x={3} />
                </>
              ))
              }
          </div>
        </section>
      </main>
    </>
  );
}
