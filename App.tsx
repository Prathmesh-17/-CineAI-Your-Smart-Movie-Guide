import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SearchBar } from './components/SearchBar';
import { MovieDetails } from './components/MovieDetails';
import { searchMovie } from './services/gemini';
import { SearchState, Movie } from './types';
import { AlertCircle, Popcorn, Tv, TrendingUp } from 'lucide-react';

type View = 'search' | 'movies' | 'shows' | 'popular';

const PlaceholderView: React.FC<{ icon: React.ReactNode, title: string, subtitle: string }> = ({ icon, title, subtitle }) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-6 text-netflix shadow-2xl border border-white/5">
      {React.cloneElement(icon as React.ReactElement<any>, { className: "w-10 h-10" })}
    </div>
    <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
    <p className="text-gray-400 max-w-md mx-auto text-lg">{subtitle}</p>
    <button className="mt-8 px-8 py-3 bg-netflix text-white rounded font-medium hover:bg-red-700 transition-colors shadow-lg">
      Notify Me
    </button>
  </div>
);

const MovieSkeleton: React.FC = () => (
  <div className="animate-pulse pb-20 w-full">
    {/* Hero Skeleton */}
    <div className="relative w-full h-[70vh] md:h-[85vh] bg-dark-800 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-12 pt-24 flex flex-col md:flex-row gap-8 items-end">
        <div className="hidden md:block w-64 lg:w-72 aspect-[2/3] flex-shrink-0 rounded-lg bg-dark-700 border border-white/5" />
        <div className="flex-1 space-y-4 w-full">
          <div className="flex gap-3">
             <div className="h-6 w-12 bg-dark-700 rounded" />
             <div className="h-6 w-16 bg-dark-700 rounded" />
             <div className="h-6 w-24 bg-dark-700 rounded" />
          </div>
          <div className="h-16 w-3/4 bg-dark-700 rounded" />
          <div className="h-6 w-1/2 bg-dark-700 rounded" />
          <div className="space-y-2 pt-4">
             <div className="h-4 w-full bg-dark-700 rounded" />
             <div className="h-4 w-full bg-dark-700 rounded" />
             <div className="h-4 w-2/3 bg-dark-700 rounded" />
          </div>
        </div>
      </div>
    </div>
    
    {/* Grid Skeleton */}
    <div className="container mx-auto px-4 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-12">
         {/* Cast Skeleton */}
         <div className="space-y-6">
            <div className="h-8 w-32 bg-dark-700 rounded" />
            <div className="flex gap-4 overflow-hidden">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex-col gap-2 flex">
                    <div className="w-32 h-32 rounded-full bg-dark-700" />
                    <div className="h-4 w-20 mx-auto bg-dark-700 rounded" />
                 </div>
               ))}
            </div>
         </div>
         {/* Songs Skeleton */}
         <div className="space-y-6">
            <div className="h-8 w-40 bg-dark-700 rounded" />
            <div className="h-40 bg-dark-700 rounded-xl" />
         </div>
      </div>
      <div className="space-y-8">
         <div className="h-64 bg-dark-700 rounded-xl" />
         <div className="h-40 bg-dark-700 rounded-xl" />
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<View>('search');
  const [state, setState] = useState<SearchState>({
    query: '',
    data: null,
    loading: false,
    error: null,
    hasSearched: false,
  });

  const handleSearch = async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, query }));
    
    try {
      const data = await searchMovie(query);
      if (data) {
        setState(prev => ({ ...prev, loading: false, data, hasSearched: true }));
      } else {
        setState(prev => ({ ...prev, loading: false, data: null, hasSearched: true, error: "Movie not found. Please check the spelling or try another title." }));
      }
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "An error occurred while fetching movie details. Please try again later.",
        hasSearched: true 
      }));
    }
  };

  const handleNavigate = (newView: View) => {
    setView(newView);
    if (newView === 'search') {
      // Don't reset data, just show it if it exists
    }
  };

  const handleLogoClick = () => {
    setView('search');
    setState({
      query: '',
      data: null,
      loading: false,
      error: null,
      hasSearched: false,
    });
  };

  const renderContent = () => {
    if (view === 'movies') return <PlaceholderView icon={<Popcorn />} title="Movies Library" subtitle="Browse our extensive collection of movies. Feature coming soon." />;
    if (view === 'shows') return <PlaceholderView icon={<Tv />} title="TV Shows" subtitle="Explore top-rated television series. Feature coming soon." />;
    if (view === 'popular') return <PlaceholderView icon={<TrendingUp />} title="New & Popular" subtitle="See what's trending around the world. Feature coming soon." />;

    // Search View Logic
    if (state.loading) {
      return <MovieSkeleton />;
    }

    if (state.error) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center space-y-6 animate-fade-in">
           <div className="p-4 bg-red-900/20 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-500" />
           </div>
           <div>
             <h2 className="text-2xl font-bold mb-2">Oops!</h2>
             <p className="text-gray-400 max-w-md mx-auto">{state.error}</p>
           </div>
           <button 
             onClick={handleLogoClick}
             className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
           >
             Try Again
           </button>
        </div>
      );
    }

    if (state.data) {
      return <MovieDetails movie={state.data} />;
    }

    // Initial Landing State
    return (
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4">
         {/* Background Image with Overlay */}
         <div className="absolute inset-0 z-0 overflow-hidden">
           <img 
             src="https://picsum.photos/id/1002/2500/1600" 
             alt="Background" 
             className="w-full h-full object-cover opacity-20 blur-sm scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
         </div>

         <div className="relative z-10 w-full max-w-5xl text-center space-y-6 animate-fade-in">
           <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-netflix drop-shadow-2xl">
             CineAI
           </h1>
           <p className="text-2xl md:text-4xl font-semibold text-white drop-shadow-lg">
             Your Smart Movie Guide
           </p>
           <p className="text-lg md:text-xl text-gray-300 drop-shadow-md max-w-2xl mx-auto pt-2">
             Discover details, ratings, and where to watch instantly.
           </p>
           <div className="pt-8 w-full flex justify-center">
             <SearchBar onSearch={handleSearch} isLoading={state.loading} />
           </div>
         </div>
      </div>
    );
  };

  return (
    <Layout onNavigate={handleNavigate} currentView={view} onLogoClick={handleLogoClick}>
      {renderContent()}
    </Layout>
  );
};

export default App;