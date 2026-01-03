import React from 'react';
import { Movie } from '../types';
import { Star, Calendar, DollarSign, Music, MonitorPlay, Users, User, ImageOff, Film } from 'lucide-react';

interface MovieDetailsProps {
  movie: Movie;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const getPlatformColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('netflix')) return 'bg-red-600';
    if (p.includes('prime')) return 'bg-blue-500';
    if (p.includes('hulu')) return 'bg-green-500';
    if (p.includes('disney')) return 'bg-blue-900';
    if (p.includes('hbo') || p.includes('max')) return 'bg-purple-700';
    return 'bg-gray-700';
  };

  // We rely on the data service to provide valid URLs. 
  // If the URL is empty or fails, the onError handler will show the fallback UI.
  // We do NOT hide the container based on string checks alone unless it's strictly empty.
  const hasPosterUrl = !!movie.posterUrl;

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero / Backdrop Section */}
      <div className="relative w-full h-[70vh] md:h-[85vh] bg-dark-900 overflow-hidden">
        {/* Backdrop Image */}
        {hasPosterUrl ? (
          <div className="absolute inset-0">
             <img 
              src={movie.posterUrl} 
              alt="Backdrop" 
              className="w-full h-full object-cover blur-xl scale-110 opacity-30"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-50" />
        )}
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-12 pt-24 flex flex-col md:flex-row gap-8 items-end z-10">
          
          {/* Main Poster Card */}
          <div className="hidden md:block w-64 lg:w-72 aspect-[2/3] flex-shrink-0 rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-white/10 bg-dark-800 relative group">
            {hasPosterUrl ? (
              <>
                 <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const sibling = e.currentTarget.nextElementSibling;
                      if(sibling) (sibling as HTMLElement).style.display = 'flex';
                    }}
                  />
                  {/* Fallback hidden by default, shown on error */}
                  <div className="hidden absolute inset-0 bg-dark-800 flex-col items-center justify-center text-gray-500 p-4 text-center fallback-content z-10">
                    <Film className="w-12 h-12 mb-2 opacity-30" />
                    <span className="text-xs uppercase tracking-widest font-bold">Image Unavailable</span>
                  </div>
              </>
            ) : (
              <div className="w-full h-full bg-dark-800 flex flex-col items-center justify-center text-gray-500 p-4 text-center border border-white/5">
                 <Film className="w-16 h-16 mb-4 text-netflix opacity-20" />
                 <span className="text-lg font-bold text-gray-400">{movie.title}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 md:mb-4">
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
               <span className="text-white px-2 py-0.5 border border-white/30 rounded text-xs">HD</span>
               <span>{movie.year}</span>
               {movie.duration && (
                 <>
                   <span className="w-1 h-1 bg-gray-500 rounded-full"/>
                   <span>{movie.duration}</span>
                 </>
               )}
               {movie.genre && (
                 <>
                   <span className="w-1 h-1 bg-gray-500 rounded-full"/>
                   <span className="text-netflix">{movie.genre.slice(0, 3).join(' • ')}</span>
                 </>
               )}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
              {movie.title}
            </h1>
            
            {movie.tagline && (
              <p className="text-xl text-gray-300 italic font-light drop-shadow-md">"{movie.tagline}"</p>
            )}

             <p className="text-gray-300 text-lg leading-relaxed max-w-3xl pt-4 line-clamp-4 hover:line-clamp-none transition-all drop-shadow-sm">
              {movie.description}
            </p>

            <div className="flex items-center gap-6 pt-4 text-sm text-gray-400">
                {movie.director && (
                  <div>
                    <span className="block text-gray-500 text-xs uppercase mb-1">Director</span>
                    <span className="text-white font-medium">{movie.director}</span>
                  </div>
                )}
                {movie.producer && (
                  <div>
                    <span className="block text-gray-500 text-xs uppercase mb-1">Producers</span>
                    <span className="text-white font-medium">{movie.producer}</span>
                  </div>
                )}
            </div>

          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Users className="text-netflix" /> Top Cast
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {movie.cast.map((actor, idx) => {
                  const hasActorImage = !!actor.imageUrl;
                  
                  return (
                    <div key={idx} className="flex-shrink-0 w-32 group relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-netflix transition-all bg-dark-800 shadow-lg relative">
                        {hasActorImage ? (
                            <>
                              <img 
                                src={actor.imageUrl} 
                                alt={actor.name}
                                className="w-full h-full object-cover transition-opacity duration-300"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const sib = e.currentTarget.nextElementSibling;
                                  if(sib) (sib as HTMLElement).style.display = 'flex';
                                }}
                              />
                              <div className="hidden absolute inset-0 bg-dark-800 items-center justify-center text-gray-500 fallback-content">
                                <User className="w-12 h-12 opacity-50" />
                              </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-dark-800 text-gray-500">
                                <User className="w-12 h-12 opacity-50" />
                            </div>
                        )}
                      </div>
                      <p className="text-center text-sm font-bold text-gray-200 group-hover:text-white leading-tight line-clamp-2 px-1">{actor.name}</p>
                      {actor.character && (
                          <p className="text-center text-xs text-gray-500 mt-1 line-clamp-1">{actor.character}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Songs */}
          {movie.songs && movie.songs.length > 0 && (
            <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Music className="text-netflix" /> Soundtrack
              </h2>
              <div className="bg-dark-800 rounded-xl p-6 border border-white/5 shadow-inner">
                <ul className="space-y-3">
                  {movie.songs.map((song, idx) => (
                    <li key={idx} className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded transition-colors cursor-default">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm font-mono w-6 text-right">{idx + 1}</span>
                        <span>{song}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Availability */}
          <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <MonitorPlay className="text-netflix" /> Streaming Availability
            </h2>
            {movie.streamingPlatforms.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {movie.streamingPlatforms.map((platform, idx) => (
                  <div 
                    key={idx}
                    className={`${getPlatformColor(platform)} px-6 py-3 rounded-lg font-bold text-white shadow-lg transform hover:scale-105 transition-transform cursor-default flex items-center gap-2`}
                  >
                    <span>{platform}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Streaming availability information is currently unavailable.</p>
            )}
          </section>

        </div>

        {/* Right Column: Stats & Ratings */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          
          {/* Mobile Poster Fallback */}
          <div className="md:hidden rounded-lg overflow-hidden shadow-2xl border border-white/10 mx-auto w-48 mb-6 bg-dark-800 aspect-[2/3] relative">
             {hasPosterUrl ? (
               <img 
                 src={movie.posterUrl} 
                 alt={movie.title} 
                 className="w-full h-full object-cover"
                 onError={(e) => {
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-dark-800 text-gray-500 border border-white/10"><svg class="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg></div>';
                 }}
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-dark-800 text-gray-500">
                  <Film className="w-12 h-12" />
               </div>
             )}
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-white/5 space-y-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Stats</h3>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-gray-500 text-xs uppercase">Release Date</p>
                <p className="font-medium">{movie.releaseDate || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="text-gray-500 text-xs uppercase">Budget</p>
                <p className="font-medium">{movie.budget || 'N/A'}</p>
              </div>
            </div>

             <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-yellow-500 mt-1" />
              <div>
                <p className="text-gray-500 text-xs uppercase">Box Office</p>
                <p className="font-medium">{movie.boxOffice || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-white/5 shadow-md">
             <h3 className="text-xl font-semibold mb-6 text-gray-200">Ratings</h3>
             <div className="space-y-4">
               {movie.ratings.map((rating, idx) => (
                 <div key={idx} className="flex items-center justify-between">
                   <span className="text-gray-400 font-medium text-sm">{rating.source}</span>
                   <div className="flex items-center gap-2">
                     <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                     <span className="font-bold text-white">{rating.value}</span>
                   </div>
                 </div>
               ))}
               {movie.ratings.length === 0 && <p className="text-gray-500 text-sm italic">No ratings found.</p>}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};