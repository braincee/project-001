'use client'

import { Spacer, Button, Spinner } from '@nextui-org/react'
import VoteCard from '../../../components/VoteCard'
import { useState } from 'react'
import { addNewVote } from '../../../libs/api'

export default function Vote({ id, options, allVotes, initialVoteCount }) {
  const { data } = allVotes
  const [votesLength, setVotesLength] = useState(data.length)
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [pickedOption, setPickedOption] = useState('')
  const [voted, setVoted] = useState(false)
  const [voteText, setVoteText] = useState('VOTE')
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleVoteCreation = async () => {
    if (pickedOption) {
      setLoading(true)
      await addNewVote({ pickedOption, pollId: id })
      setVotesLength(data.length + 1)
      setVoted(true)
      setVoteText('VOTED')
      setDisabled(true)
      setLoading(false)
      if (pickedOption == options[0].id) {
        setVoteCount((prevCount) => {
          let temp = Object.assign({}, prevCount)
          temp.first += 1
          return temp
        })
      } else if (pickedOption == options[1].id) {
        setVoteCount((prevCount) => {
          let temp = Object.assign({}, prevCount)
          temp.second += 1
          return temp
        })
      }
    }
  }

  return (
    <div className='py-5'>
      <h1 className='text-center px-3 md:px-0 text-3xl'>
        Vote for your favorite Thumbnail
      </h1>
      <section className='mt-8 w-full'>
        <div className='flex md:flex-row flex-col justify-center px-10 md:px-0 gap-10 md:gap-16'>
          {options.map((imageUrl, index) => (
            <VoteCard
              key={index}
              imageUrl={imageUrl}
              options={options}
              index={index}
              votesLength={votesLength}
              setPickedOption={setPickedOption}
              voteCount={voteCount}
              voted={voted}
            />
          ))}
        </div>
        <Spacer y={10} />
        <div className='flex justify-center'>
          <Button
            onPress={handleVoteCreation}
            isDisabled={disabled}
            color='primary'
            variant='bordered'
          >
            {loading && <Spinner size='sm' />}
            {voteText}
          </Button>
        </div>
      </section>
    </div>
  )
}
