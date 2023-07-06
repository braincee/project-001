import { useEffect, useState } from 'react';

export default function VoteCard({ options, index, setPickedOption, votes, voteCount, voted }) {
  const [voteSection, setVoteSection] = useState();

  const handleVoteChange = (e) => {
    setPickedOption(e.target.value);
  };

  const RadioInput = () => {
    return (
      <>
        <input
          type="radio"
          id="vote-option"
          name="vote-option"
          onChange={handleVoteChange}
          className="mr-2"
          value={options[index].id}
          aria-label=""
        />
        <label htmlFor="vote-option" className="text-sm font-semibold">
          Vote
        </label>
      </>
    )
  }

  useEffect(() => {
    setVoteSection(RadioInput());
  }, []);

  useEffect(() => {
    if (voted) {
      if (index == 0) {
        const firstVotes = Math.round((voteCount.first / votes.length) * 100);
        setVoteSection(`${firstVotes}% Voted`)
      } else if (index == 1) {
        const secondVotes = Math.round((voteCount.second / votes.length) * 100);
        setVoteSection(`${secondVotes}% Voted`)
      }
    }
  }, [voted, voteCount, votes])

  return (
    <div className='border-2 border-blue-400 rounded-lg'>
      <div className="w-[300px] shadow-lg rounded-lg p-4">
        <div className="relative">
          <img src={options[index].image_url} alt="Thumbnail" className="w-full h-45 h-[200px] rounded-lg object-cover" />
        </div>
        <div className="flex justify-center items-center mt-10 text-2xl">
          {voteSection}
        </div>
      </div>
    </div>
  );
}
