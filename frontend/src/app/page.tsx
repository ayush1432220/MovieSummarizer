"use client"; 
import { useState } from 'react';
import MovieCard from '../components/MovieCard'; 

interface MovieData {
  Title: string;
  Year: string;
  Genre: string;
  Plot: string;
  Poster: string;
  aiSummary: string;
}

export default function Home() {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Please enter a movie title.');
      return;
    }

    setLoading(true);
    setError(null);
    setMovie(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setMovie(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <main className="w-full max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-red-600">Movie AI</h1>
        <p className="text-center text-gray-400 mb-8">Search for a movie to get details and an AI-generated summary.</p>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Inception"
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-red-900 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}
        
        {loading && (
           <div className="text-center">
             <p className="text-lg">Fetching movie data, please wait...</p>
           </div>
        )}

        {movie && <MovieCard movie={movie} />}
      </main>
    </div>
  );
}