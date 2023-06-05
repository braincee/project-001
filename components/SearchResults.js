import React from 'react';

const SearchResults = ({ videos }) => {
  return (
    <div className="max-w-3xl mx-auto">
      {videos.map((video) => (
        <div key={video.id} className="flex flex-col md:flex-row gap-4 items-center py-4 bg-white rounded-lg shadow-md">
          <div className="w-full md:w-1/2">
            <div className="video aspect-w-16 aspect-h-9">
              <iframe
                width="100%"
                height="100%"
                src={`https://youtube.com/embed/${video.id}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <h6 className="text-lg font-bold">{video.title}</h6>
            <p className="mt-2">{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
