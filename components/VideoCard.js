import { Image } from "@nextui-org/react";
import Link from "next/link";

export default function VideoCard({ url }) {

  const decodeHTML = (code) => {
    let text = document.createElement("textarea");
    text.innerHTML = code;
    return text.value
  }

  return (
    <div className="video">
      <Link className="card-link" target="_blank" href={`https://youtube.com/embed/${url.id}`} />
      <div className="card flex gap-5">
        <Image src={`http://img.youtube.com/vi/${url.id}/sddefault.jpg`} alt="youtube"/>
        <div className='w-1/2'>
          <p className="font-bold text-[32px]">
            {decodeHTML(url.title) }
          </p>
          <p className="mt-5 text-[20px]">
          {decodeHTML(url.description) }
          </p>
        </div>
      </div>
    </div>
  )
}