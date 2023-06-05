import Head from "next/head";
import VideoCard from "../../components/VideoCard";

export const getServerSideProps = (context) => {
  const { list } = context.query;
  const title = context.query.title ? context.query.title : '';
  const description = context.query.description ? context.query.description : '';
  const urlData = []; 

  if (list.indexOf(",") > -1) {
    let ids = list.split(",");
    let titles = title && title.split(",");
    let descriptions = description && description.split(",");
    ids.map((id, index) => {
      urlData.push({
        id: ids[index],
        title: titles && titles[index],
        description: descriptions && descriptions[index]
      })
    });
  } else {
    urlData.push({
      id: list,
      title,
      description
    })
  }
  return { props: { urlData } };
}

export default function List({ urlData }) {

  return (
    <>
      <Head>
        <title>YT Playlist Creator & Sharer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="mt-4 mb-[50px] flex flex-col">
        <div className="mt-[20px] px-[120px] flex flex-col gap-[20px]">
          {urlData.length > 0 ? urlData.map((url, index) => (
            <VideoCard key={index} url={url} />
          )) : ''}
        </div>
      </main>
    </>
  );
}