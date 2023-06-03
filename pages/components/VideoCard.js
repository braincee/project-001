import { Image } from "@nextui-org/react";
import Link from "next/link";

export default function VideoCard({ url }) {
  const decodeHTML = (code) => {
    let text = document.createElement("textarea");
    text.innerHTML = code;
    return text.value;
  };

  return (
    <div className="max-w-70 mx-auto bg-white rounded-lg p-6">
      <Link className="card-link" target="_blank" href={`https://youtube.com/embed/${url.id}`} />
      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-1/3">
          <Image src={`http://img.youtube.com/vi/${url.id}/sddefault.jpg`} alt="youtube" />
        </div>
        <div className="w-full md:w-2/3">
          <h6 className="text-lg font-bold">{decodeHTML(url.title)}</h6>
          <p className="mt-2 text-gray-600">{decodeHTML(url.description)}</p>
        </div>
      </div>
    </div>
  );
}
