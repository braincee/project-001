import React, { useState } from 'react';
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
    <div className='flex flex-col mx-auto w-[42%]'>
     <div className='border border-gray-200 rounded-lg p-4'>
        <div className="flex justify-center items-center gap-3">
      <div className='flex flex-row border border-gray-200 rounded-lg gap-3 px-4'>
      <div className="my-3">
        <input
          type="text"
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={handleYoutubeUrlChange}
          className="border border-gray-300 rounded px-4 py-2"
          placeholder='youtube.com/watch?v=iZ30YqKehSM'
        />
      </div>
      <div className="my-3">
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
      <div className="mx-auto rounded-lg border border-gray-200 my-2 w-[100%] h-[400px] p-4">
    </div>
  </div>
     <div className="border-b border-gray-200 mt-10"></div>
     <div className="flex justify-end items-center mt-10 gap-2">
        <FaTwitter size={25}/>
        <FaGithub size={25} />
     </div>
    </div>
  );
};

export default DrinkingGame;
