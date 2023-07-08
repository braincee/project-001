
import { Spacer, Button, Spinner } from '@nextui-org/react';
import VoteCard from '@/components/VoteCard';
import { useEffect, useState } from 'react';
import Api from '@/libs/api';

export const getServerSideProps = async (context) => {
  const { id } = context.query;
  return { props: { id }}
}

export default function VotePage({ id }) {
  const [options, setOptions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [voteCount, setVoteCount] = useState({first: 0, second: 0})
  const [pickedOption, setPickedOption] = useState("");
  const [voted, setVoted] = useState(false);
  const [voteText, setVoteText] = useState("VOTE");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVoteCreation = async () => {
    if (pickedOption) {
      setLoading(true);
      await Api.addNewVote({pickedOption, pollId: id});
      const {data} = await Api.getVotes({pollId: id});
      setVotes([...data]);
      setVoted(true);
      setVoteText("VOTED");
      setDisabled(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    Api.getPoll({ id })
      .then((res) => {
        if (res.data) {
          const opts = JSON.parse(res.data[0].options);
          setOptions([...opts]);
        }
      });
    Api.getVotes({pollId: id})
      .then((res) => {
        if (res.data){
          setVotes(res.data);
        }
      }) 
  }, [id]);

  useEffect(() => {
    if (votes.length > 0 && !disabled && options.length > 0) {
      votes.forEach((vote) => {
        if (vote.picked_option == options[0].id) {
          setVoteCount((prevCount) => {
            let temp = Object.assign({}, prevCount);
            temp.first += 1;
            return temp;
          });
        } else if (vote.picked_option == options[1].id) {
          setVoteCount((prevCount) => {
            let temp = Object.assign({}, prevCount);
            temp.second += 1;
            return temp;
          });
        }
      });
    } else if (disabled && options.length > 0) {
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
  }, [votes.length, options.length]);

  console.log(pickedOption);

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
                votes={votes}
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
