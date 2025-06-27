import React from 'react';

const MovieCard = ({ movie }) => {
  const {
    Title = 'N/A',
    Year = 'N/A',
    Genre = 'N/A',
    Plot = 'N/A',
    Poster = '',
    aiSummary = 'AI summary not available.',
  } = movie;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-fade-in">
      <div className="md:flex">
        {Poster !== 'N/A' && (
          <div className="md:w-1/3">
            <img 
              src={Poster} 
              alt={`Poster for ${Title}`} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        <div className="p-6 md:w-2/3 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{Title}</h2>
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <span>{Year}</span>
              <span className="mx-2">•</span>
              <span>{Genre}</span>
            </div>
            
            <p className="text-gray-300 mb-6">{Plot}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
            <h3 className="text-lg font-semibold mb-2 text-red-400">✨ AI Summary</h3>
            <p className="text-gray-200 italic">{aiSummary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;