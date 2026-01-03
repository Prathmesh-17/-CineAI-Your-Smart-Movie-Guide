import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple in-memory cache to store movie results
const movieCache = new Map<string, Movie>();

export const searchMovie = async (query: string): Promise<Movie | null> => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check cache first
  if (movieCache.has(normalizedQuery)) {
    console.log("Serving from cache:", normalizedQuery);
    return movieCache.get(normalizedQuery)!;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a dedicated movie data assistant.
      Target Movie: "${query}"

      DATA STRATEGY:
      1. VISUALS (Source: TMDB - The Movie Database):
         - Search specifically for this movie on TMDB.
         - POSTER: Find the official high-resolution poster path (e.g., /path_to_image.jpg).
         - CAST: Get the full cast list. For the top 8 actors, find their specific profile image path.
         - Do NOT use OMDb or IMDb for images. ONLY TMDB.

      2. METADATA (Source: OMDb / IMDb):
         - Fetch the Plot, Director, Producer, Release Date, Budget, Box Office, Runtime, and Ratings.

      3. OUTPUT CONSTRUCTION:
         - Construct full URLs for TMDB images:
           - Poster: "https://image.tmdb.org/t/p/original" + poster_path
           - Cast: "https://image.tmdb.org/t/p/w500" + profile_path
         - If a cast member has no image on TMDB, leave the imageUrl empty.
         - Return valid JSON.

      `,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            year: { type: Type.STRING },
            posterUrl: { type: Type.STRING, description: "Full TMDB poster URL (https://image.tmdb.org/t/p/original/...)" },
            tagline: { type: Type.STRING },
            description: { type: Type.STRING },
            cast: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  imageUrl: { type: Type.STRING, description: "Full TMDB profile URL (https://image.tmdb.org/t/p/w500/...)" },
                  character: { type: Type.STRING }
                }
              }
            },
            director: { type: Type.STRING },
            producer: { type: Type.STRING },
            releaseDate: { type: Type.STRING },
            budget: { type: Type.STRING },
            boxOffice: { type: Type.STRING },
            songs: { type: Type.ARRAY, items: { type: Type.STRING } },
            ratings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  value: { type: Type.STRING }
                }
              }
            },
            streamingPlatforms: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            genre: { type: Type.ARRAY, items: { type: Type.STRING } },
            duration: { type: Type.STRING }
          },
          required: ["title", "year", "description", "cast", "posterUrl"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    try {
      const data = JSON.parse(text);
      if (!data.title) return null;
      
      // Robust URL Fixer: Ensure TMDB URLs are correct if the model returned partial paths
      const fixTmdbUrl = (url: string | undefined | null, type: 'poster' | 'profile') => {
        if (!url || url === "N/A" || url.trim() === "") return "";
        if (url.startsWith("http")) return url;
        
        // Remove leading slash if present
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        
        if (type === 'poster') return `https://image.tmdb.org/t/p/original/${cleanPath}`;
        if (type === 'profile') return `https://image.tmdb.org/t/p/w500/${cleanPath}`;
        return url;
      };

      data.posterUrl = fixTmdbUrl(data.posterUrl, 'poster');
      
      if (data.cast) {
        data.cast.forEach((actor: any) => {
           actor.imageUrl = fixTmdbUrl(actor.imageUrl, 'profile');
        });
      }

      // Cache the valid result
      movieCache.set(normalizedQuery, data as Movie);
      
      return data as Movie;
    } catch (e) {
      console.error("Failed to parse JSON", e);
      return null;
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch movie data.");
  }
};