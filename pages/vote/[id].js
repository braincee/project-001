
import { Spacer, Button } from '@nextui-org/react';
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
  const [pickedOption, setPickedOption] = useState();
  const [voted, setVoted] = useState(false);
  const [voteText, setVoteText] = useState("VOTE");
  const [disabled, setDisabled] = useState(false);
  const [option, setOption] = useState();

  const handleVoteCreation = async () => {
    if (pickedOption) {
      await Api.addNewVote({pickedOption, pollId: id});
      const {data} = await Api.getVotes({pollId: id});
      setVotes([...data]);
      setVoted(true);
      setVoteText("VOTED");
      setDisabled(true);
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
            setOption(vote.picked_option)
            return temp;
          });
        } else if (vote.picked_option == options[1].id) {
          setVoteCount((prevCount) => {
            let temp = Object.assign({}, prevCount);
            temp.second += 1;
            setOption(vote.picked_option)
            return temp;
          });
        }
      });
    } else if (disabled) {
      if (option == options[0].id) {
        setVoteCount((prevCount) => {
          let temp = Object.assign({}, prevCount);
          temp.first += 1;
          return temp;
        });
      } else if (option == options[1].id) {
        setVoteCount((prevCount) => {
          let temp = Object.assign({}, prevCount);
          temp.second += 1;
          return temp;
        });
      }
    }
  }, [votes.length]);

  return (
    <div className="py-5">
      <h1 className="text-center px-3 md:px-0 text-3xl">Vote for your favorite Thumbnail</h1>
      <section className="mt-8 md:pl-20 lg:pl-32 pl-5 w-full">
        <div className="flex md:flex-row flex-col px-3 md:px-0 md:gap-8 gap-10 lg:gap-16">
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
            className='px-10 py-4 rounded-md bg-gray-100 text-2xl text-black'
            onPress={handleVoteCreation}
            isDisabled={disabled}
          >
            {voteText}
          </Button>
        </div>
      </section>
    </div>
  );
}
