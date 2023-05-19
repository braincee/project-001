import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function List() {
  const router = useRouter();
  const [urlIds, setUrlIds] = useState([]);

  useEffect(() => {
    let ids = router.query.list.split(",");
    setUrlIds([...ids])
  }, []);

  return (
    <>
      <Head>
        <title>YT Playlist Creator & Sharer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-4 mb-[50px] flex flex-col">
        <div className="mt-[20px] px-[120px] flex flex-col gap-[20px]">
          { urlIds.length > 0 ? urlIds.map((url) => (
            <div key={url}>
                <div className="video">
                  <Link className="iframe-link" target="_blank" href={`https://youtube.com/embed/${url}`}></Link>
                  <iframe width="100%" height="100%" src={`https://youtube.com/embed/${url}`} title="YouTube video player" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            </div>
          )): ''}
        </div>
      </main>
    </>
  );
}