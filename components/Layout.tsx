import React from 'react';
import { Film, Home, Tv, TrendingUp, Grid } from 'lucide-react';

type View = 'search' | 'movies' | 'shows' | 'popular';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: View) => void;
  currentView: View;
  onLogoClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentView, onLogoClick }) => {
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'search', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'movies', label: 'Movies', icon: <Film className="w-4 h-4" /> },
    { id: 'shows', label: 'TV Shows', icon: <Tv className="w-4 h-4" /> },
    { id: 'popular', label: 'New & Popular', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-gray-100 font-sans selection:bg-red-500 selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onLogoClick} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group text-left"
          >
            <Film className="w-9 h-9 text-netflix" />
            <div className="flex flex-col items-start -space-y-1">
              <span className="text-2xl font-bold tracking-tight text-netflix">CineAI</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase group-hover:text-gray-200 transition-colors">Your Smart Movie Guide</span>
            </div>
          </button>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 transition-colors ${
                  currentView === item.id 
                    ? 'text-white font-bold' 
                    : 'hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-xs font-bold cursor-pointer hover:ring-2 ring-white">
            AI
          </div>
        </div>
      </header>
      
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-black/95 backdrop-blur border-t border-white/10 z-50">
        <div className="flex justify-around items-center p-3">
           {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 text-[10px] ${
                  currentView === item.id ? 'text-white' : 'text-gray-500'
                }`}
              >
                {React.cloneElement(item.icon as React.ReactElement<any>, { 
                  className: `w-5 h-5 ${currentView === item.id ? 'text-netflix' : ''}` 
                })}
                <span>{item.label}</span>
              </button>
            ))}
        </div>
      </div>

      <footer className="bg-black py-12 border-t border-white/10 text-gray-500 text-sm mb-16 md:mb-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <p className="text-center font-medium text-gray-400">CineAI — Your Smart Movie Guide</p>
            <p className="text-center text-xs opacity-60">Powered by Google Gemini</p>
            <div className="flex justify-center gap-6 mt-2">
               <span>Privacy</span>
               <span>Terms</span>
               <span>Help Center</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};