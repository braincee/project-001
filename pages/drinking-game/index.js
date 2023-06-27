import React, { useState } from 'react';
import Head from 'next/head';
import { BiUserVoice } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import { FaTwitter, FaGithub } from 'react-icons/fa';


const DrinkingGame = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedWord, setSelectedWord] = useState('');

  const handleYoutubeUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
  };

  const handleWordSelect = (e) => {
    setSelectedWord(e.target.value);
  };

  return (
    <>
    <Head>
    <title>YT Playlist Creator & Sharer</title>
    <meta name="description" content="Generated by create next app" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
   <main>
   <div className='flex flex-col mx-auto w-[96%] md:w-[42%]'>
    <p className="text-center px-3 my-2 italic text-blue-400 font-2xl tracking-widest">Drinking Game</p>
     <div className='border border-gray-200 rounded-lg p-4'>
        <div className="flex justify-center items-center gap-3">
      <div className='flex flex-col border border-gray-200 rounded-lg md:gap-3 p-2 md:flex-row'>
      <div className="mb-1">
        <input
          type="text"
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={handleYoutubeUrlChange}
          className="border border-gray-300 rounded px-4 py-2 w-full"
          placeholder='youtube.com/watch?v=iZ30YqKehSM'
        />
      </div>
     <div className="flex flex-row gap-1">
      <div className="">
        <select
          id="selectedWord"
          value={selectedWord}
          onChange={handleWordSelect}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="" disabled hidden>Select a highly occurred word</option>
          <option value="word1">Word 1</option>
          <option value="word2">Word 2</option>
          <option value="word3">Word 3</option>
        </select>
      </div>
      <div className="flex items-center justify-center">
        <div className="rounded-lg border border-gray-300 p-1">
          <BiUserVoice size={25} />
        </div>
        <div className="rounded-lg border border-gray-300 p-1 ml-2">
          <FiSettings size={25} />
        </div>
      </div>
      </div>
      
    </div>
      </div>
      <div className="mx-auto rounded-lg border border-gray-200 my-2 w-[100%] h-[300px] p-4">
    </div>
  </div>
     <div className="border-b border-gray-200 mt-10"></div>
     <div className="flex justify-end items-center mt-10 gap-2">
        <FaTwitter size={25}/>
        <FaGithub size={25} />
     </div>
    </div>
   </main>
   
  </>
    
  );
};

export default DrinkingGame;
