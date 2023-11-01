import Vote from '@/components/Vote'
import { db } from '@/db/drizzle'

async function getAllVotes(id: string) {
  const allVotes = await db.query.votes.findMany({
    where: (vote, { eq }) => eq(vote.poll, id),
  })
  return { data: allVotes }
}

async function getOptions(id: string) {
  const poll: any[] = await db.query.polls.findMany({
    where: (poll, { eq }) => eq(poll.id, id),
  })

  let options
  if (poll.length > 0) {
    options = JSON.parse(poll[0].options)
  } else {
    options = {}
  }

  return options
}

async function getInitialVoteCount({
  allVotes,
  options,
}: {
  allVotes: { data: any[] }
  options: any[]
}) {
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

const VotePage = async ({ params }: { params: { id: string } }) => {
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
