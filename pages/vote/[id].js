import { useRouter } from 'next/router';

import { Spacer, Button } from '@nextui-org/react';
import VoteCard from '@/components/VoteCard';

export default function VotePage1() {
  const router = useRouter();
  const { imageUrl } = router.query;

  const imageUrls = Array.isArray(imageUrl) ? imageUrl : [imageUrl];

  return (
    <>
      <h1 className="text-center px-3 md:px-0 text-3xl">Vote for your favorite Thumbnail</h1>
      <section className="mt-8 md:pl-20 lg:pl-32 pl-5 w-full">
        <div className="flex md:flex-row flex-col px-3 md:px-0 md:gap-3 gap-5 lg:gap-10">
          {imageUrls.map((imageUrl, index) => (
            <>
              <VoteCard
                imageUrl={imageUrl}
              />
              <Spacer x={3} />
            </>
          ))}
        </div>
        <Spacer y={10} />
        <div className="flex justify-center">
          <Button className='px-10 py-4 rounded-md bg-gray-100 text-2xl text-black'>
            Vote
          </Button>
        </div>
      </section>
    </>
  );
}
