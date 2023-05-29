import { Image } from "@nextui-org/react";
import Link from "next/link";

export default function VideoCard({ url }) {
  return (
    <div className="video">
      <Link className="card-link" target="_blank" href={`https://youtube.com/embed/${url.id}`} />
      <div className="card flex gap-5">
        <Image src={`http://img.youtube.com/vi/${url.id}/sddefault.jpg`} />
        <div className='w-1/2'>
          <p className="font-bold text-[32px]">
            {url.title}
          </p>
          <p className="mt-2 text-[18px]">
            {url.description}
          </p>
        </div>
      </div>
    </div>
  )
}