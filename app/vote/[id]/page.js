import supabase from '@/libs/supabase'
import Vote from './Vote'

async function getAllVotes(id) {
  const allVotes = await supabase.from('votes').select().eq('poll', id)

  return allVotes
}

async function getOptions(id) {
  const poll = await supabase.from('polls').select().eq('id', id)
  let options

  if (poll.data) {
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

const VotePage = async ({ id, options, allVotes, initialVoteCount }) => {
  const { id } = useParams()
  const allVotes = await getAllVotes(id)
  const options = await getOptions(id)
  const initialVoteCount = await getInitialVoteCount()
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
