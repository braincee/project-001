
import { Spacer, Button, Spinner } from '@nextui-org/react';
import VoteCard from '@/components/VoteCard';
import { useState } from 'react';
import Api from '@/libs/api';
import supabase from '@/libs/supabase';

export const getServerSideProps = async (context) => {
  const { id } = context.query;
  const poll  = await supabase
    .from('polls')
    .select()
    .eq('id', id);
  let options;

  if (poll.data) {
    options = JSON.parse(poll.data[0].options);
  }
  
  const allVotes = await supabase
    .from('votes')
    .select()
    .eq('poll', id);

  let initialVoteCount = {
    first: 0,
    second: 0,
  }

  if ((allVotes.data && allVotes.data.length > 0) && (options && options.length > 0)) {
    allVotes.data.forEach((vote) => {
      if (vote.picked_option == options[0].id) {
        let temp = Object.assign({}, initialVoteCount);
        temp.first += 1; 
        initialVoteCount = temp;
      } else if (vote.picked_option == options[1].id) {
        let temp = Object.assign({}, initialVoteCount);
        temp.second += 1; 
        initialVoteCount = temp;
      }
    });
  }
  return { props: { id , options, allVotes, initialVoteCount }}
}

export default function VotePage({ id, options, allVotes, initialVoteCount }) {
  const { data } = allVotes;
  const [votesLength, setVotesLength] = useState(data.length);
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [pickedOption, setPickedOption] = useState("");
  const [voted, setVoted] = useState(false);
  const [voteText, setVoteText] = useState("VOTE");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVoteCreation = async () => {
    if (pickedOption) {
      setLoading(true);
      await Api.addNewVote({pickedOption, pollId: id});
      setVotesLength(data.length + 1);
      setVoted(true);
      setVoteText("VOTED");
      setDisabled(true);
      setLoading(false);
      if (pickedOption == options[0].id) {
        setVoteCount((prevCount) => {
          let temp = Object.assign({}, prevCount);
          temp.first += 1;
          return temp;
        });
      } else if (pickedOption == options[1].id) {
        setVoteCount((prevCount) => {
          let temp = Object.assign({}, prevCount);
          temp.second += 1;
          return temp;
        });
      }
    }
  }

  return (
    <div className="py-5">
      <h1 className="text-center px-3 md:px-0 text-3xl">Vote for your favorite Thumbnail</h1>
      <section className="mt-8 w-full">
        <div className="flex md:flex-row flex-col justify-center px-10 md:px-0 gap-10 md:gap-16">
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
        <div className="flex justify-center">
          <Button
            onPress={handleVoteCreation}
            isDisabled={disabled}
            color='primary'
            variant='bordered'
          >
            { loading &&
              <Spinner size='sm'/>
            }
            {voteText}
          </Button>
        </div>
      </section>
    </div>
  );
}
