import { useEffect, useState } from 'react'

export default function VoteCard({
  options,
  index,
  setPickedOption,
  votesLength,
  voteCount,
  voted,
}) {
  const [voteSection, setVoteSection] = useState()

  const handleVoteChange = (e) => {
    setPickedOption(e.target.value)
  }

  const RadioInput = () => {
    return (
      <>
        <input
          type='radio'
          id='vote-option'
          name='vote-option'
          onChange={handleVoteChange}
          className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
          value={options[index].id}
          aria-label='vote options'
        />
        <label
          htmlFor='vote-option'
          className='ml-2 text-lg font-medium text-gray-900 dark:text-gray-300'
        >
          Vote
        </label>
      </>
    )
  }

  useEffect(() => {
    setVoteSection(RadioInput())
  }, [])

  useEffect(() => {
    if (voted) {
      if (index == 0) {
        const firstVotes = Math.round((voteCount.first / votesLength) * 100)
        setVoteSection(`${firstVotes}% Voted`)
      } else if (index == 1) {
        const secondVotes = Math.round((voteCount.second / votesLength) * 100)
        setVoteSection(`${secondVotes}% Voted`)
      }
    }
  }, [voted, voteCount, votesLength, index])

  return (
    <div className='border-2 border-blue-400 rounded-lg'>
      <div className='md:w-[300px] shadow-lg rounded-lg p-4'>
        <div className='relative'>
          <img
            src={options[index].image_url}
            alt='Thumbnail'
            className='w-full h-45 h-[200px] rounded-lg object-cover'
          />
        </div>
        <div className='flex justify-center items-center mt-10 text-lg'>
          {voteSection}
        </div>
      </div>
    </div>
  )
}
