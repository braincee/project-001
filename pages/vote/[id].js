import { useRouter } from 'next/router';

import { Spacer, Button } from '@nextui-org/react';
import VoteCard from '@/components/VoteCard';
import { useEffect, useState } from 'react';
import Api from '@/libs/api';

export default function VotePage() {
  const router = useRouter();
  const [options, setOptions] = useState([]);
  const { imageUrl, id } = router.query;
  const [pickedOption, setPickedOption] = useState()

  const handleVoteCreation = async () => {
    const vote = await Api.addNewVote({pickedOption, pollId: id});
    console.log(vote);
  }

  useEffect(() => {
    Api.getPoll(id)
    .then((res) => {
      if (res.data) {
        const opts = JSON.parse(res?.data[0].options);
        setOptions([...opts]);
      }
    });    
  }, [id]);

  const imageUrls = Array.isArray(imageUrl) ? imageUrl : [imageUrl];

  return (
    <div className="py-5">
      <h1 className="text-center px-3 md:px-0 text-3xl">Vote for your favorite Thumbnail</h1>
      <section className="mt-8 md:pl-20 lg:pl-32 pl-5 w-full">
        <div className="flex md:flex-row flex-col px-3 md:px-0 md:gap-3 gap-5 lg:gap-10">
          {options.map((imageUrl, index) => (
            <>
              <VoteCard
                imageUrl={imageUrl}
                options={options}
                index={index}
                setPickedOption={setPickedOption}
              />
              <Spacer x={3} />
            </>
          ))}
        </div>
        <Spacer y={10} />
        <div className="flex justify-center">
          <Button
            className='px-10 py-4 rounded-md bg-gray-100 text-2xl text-black'
            onPress={handleVoteCreation}
          >
            Vote
          </Button>
        </div>
      </section>
    </div>
  );
}
