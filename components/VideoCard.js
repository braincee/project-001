import { Image, Card } from "@nextui-org/react";
import Link from "next/link";

export default function VideoCard({ url }) {

  const decodeHTML = (code) => {
    let text = document.createElement("textarea");
    text.innerHTML = code;
    return text.value
  }

  return (
    <Card className="p-3 hover:scale-95">
      <Link target="_blank" href={`https://youtube.com/embed/${url.id}`} >
        <div className="flex gap-10 flex-col lg:flex-row">
          <Image src={`http://img.youtube.com/vi/${url.id}/sddefault.jpg`} alt="Youtube Video"/>
          <div className='lg:w-1/2'>
            <p className="font-bold text-[18px] w-full">
            {decodeHTML(url.title) }
            </p>
            <p className="mt-5 text-[16px]">
            {decodeHTML(url.description) }
            </p>
          </div>
        </div>
      </Link>
    </Card>
  )
}