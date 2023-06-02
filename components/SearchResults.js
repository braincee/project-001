import React from 'react';

const SearchResults = ({ videos }) => {
  return (
    <div className="grid gap-4">
      {videos.map((video) => (
        <div key={video.id}>
          <h6 className="text-lg font-bold">{video.title}</h6>
          <div className="relative aspect-w-16 aspect-h-9">
          <div className="video">
            <iframe width="100%" 
                    height="100%" 
              src={`https://youtube.com/embed/${video.id}`} 
              title="YouTube video player" 
              allow="accelerometer; autoplay; 
              clipboard-write; 
              encrypted-media; 
              gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
          <p className="mt-2">{video.description}</p>
        </div>
        </div>
      ))}
    </div>

  );
};

export default SearchResults;
