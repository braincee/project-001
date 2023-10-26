import { useParams } from 'next/navigation'
import supabase from '../../../libs/supabase'
import Vote from './Vote'
import { db } from '../../../libs/drizzle/db'

async function getAllVotes(id) {
  const allVotes = await db.query.votes.findMany({
    where: (vote, { eq }) => eq(vote.poll, id),
  })
  return { data: allVotes }
}

async function getOptions(id) {
  const poll = await supabase.from('polls').select().eq('id', id)
  let options
  if (poll.data.length > 0) {
    options = JSON.parse(poll.data[0].options)
  } else {
    options = {}
  }
  return options
}

async function getInitialVoteCount({ allVotes, options }) {
  let initialVoteCount = {
    first: 0,
    second: 0,
  }

  if (
    allVotes.data &&
    allVotes.data.length > 0 &&
    options &&
    options.length > 0
  ) {
    allVotes.data.forEach((vote) => {
      if (vote.picked_option == options[0].id) {
        let temp = Object.assign({}, initialVoteCount)
        temp.first += 1
        initialVoteCount = temp
      } else if (vote.picked_option == options[1].id) {
        let temp = Object.assign({}, initialVoteCount)
        temp.second += 1
        initialVoteCount = temp
      }
    })
  }
  return initialVoteCount
}

const VotePage = async ({ params }) => {
  const { id } = params
  const allVotes = await getAllVotes(id)
  const options = await getOptions(id)
  const initialVoteCount = await getInitialVoteCount({ allVotes, options })
  return (
    <section>
      <Vote
        id={id}
        options={options}
        allVotes={allVotes}
        initialVoteCount={initialVoteCount}
      />
    </section>
  )
}

export default VotePage
