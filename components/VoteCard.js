import { useState } from 'react';

export default function VoteCard({ imageUrl }) {
  const [vote, setVote] = useState(false);

  const handleVoteChange = () => {
    setVote(!vote);
  };

  return (
   
        <div className='border border-blue-700 rounded-lg'>
             <div className="w-[300px] shadow-lg rounded-lg p-4">
            <div className="relative">
            <img src={imageUrl} alt="Thumbnail" className="w-full h-45 rounded-lg object-cover" />
        </div>
        <div className="flex justify-center items-center mt-10 text-2xl">
            <input
            type="radio"
            id="vote-option"
            name="vote-option"
            checked={vote}
            onChange={handleVoteChange}
            className="mr-2"
            />
            <label htmlFor="vote-option" className="text-sm font-semibold">
            Vote
            </label>
        </div>
      </div>
    </div>
  );
}
