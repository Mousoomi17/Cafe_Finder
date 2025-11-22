import React, { useState, useEffect, useRef } from 'react';
import { Coffee, Heart, RotateCcw, X, MapPin, Star, Clock } from 'lucide-react';

// --- CONFIGURATION ---
const GOOGLE_API_KEY = "AIzaSyDMHRI51feeefAw7YASxuw357t_zI8zpso"; 
const USE_MOCK_DATA = false; 

// --- MOCK DATA ---
const MOCK_CAFES = [
  { id: 1, name: "The Daily Grind", rating: 4.8, open_now: true, photo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Espresso Lab", rating: 4.5, open_now: true, photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Bean & Leaf", rating: 4.2, open_now: false, photo: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80" },
  { id: 4, name: "Morning Brew", rating: 4.9, open_now: true, photo: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80" },
  { id: 5, name: "Code & Coffee", rating: 5.0, open_now: true, photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" }
];

// 1. Swipeable Card Component
const SwipeableCard = ({ data, onSwipe, style, isTop }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    if (!isTop) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX || e.touches?.[0]?.clientX, y: e.clientY || e.touches?.[0]?.clientY };
    if (cardRef.current) cardRef.current.style.transition = 'none';
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !isTop || !cardRef.current) return;
    if (e.cancelable) e.preventDefault();
    
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const deltaX = clientX - startPos.current.x;
    const rotate = deltaX * 0.1;
    const opacity = 1 - Math.abs(deltaX) / 500;
    
    cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    cardRef.current.style.opacity = opacity;
  };

  const handlePointerUp = (e) => {
    if (!isDragging || !isTop || !cardRef.current) return;
    
    setIsDragging(false);
    
    const clientX = e.clientX || e.changedTouches?.[0]?.clientX;
    const deltaX = clientX - startPos.current.x;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      const direction = deltaX > 0 ? 'right' : 'left';
      const endX = direction === 'right' ? 1000 : -1000;
      
      cardRef.current.style.transition = 'all 0.5s ease-out';
      cardRef.current.style.transform = `translateX(${endX}px) rotate(${deltaX * 0.1}deg)`;
      cardRef.current.style.opacity = '0';
      
      setTimeout(() => {
        onSwipe(direction, data);
      }, 300);
    } else {
      cardRef.current.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      cardRef.current.style.transform = 'translate(0px, 0px) rotate(0deg)';
      cardRef.current.style.opacity = '1';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className={`absolute w-full h-full bg-white rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none ${isTop ? 'z-50' : ''}`}
      style={{ ...style, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', transform: style?.transform || 'translateZ(0)' }}
    >
      <div className="relative h-64 bg-gray-200 pointer-events-none">
        <img 
          src={data.photo} 
          alt={data.name}
          className="w-full h-full object-cover"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold drop-shadow-lg">{data.name}</h2>
        </div>
      </div>
      
      <div className="p-6 pointer-events-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
            <Star size={16} fill="currentColor" />
            <span>{data.rating}</span>
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${data.open_now ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <Clock size={16} />
            <span>{data.open_now ? 'Open Now' : 'Closed'}</span>
          </div>
        </div>
        
        <div className="space-y-2 text-gray-500 text-sm">
          <p className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Swipe right to save to your list</span>
          </p>
          <p className="flex items-center gap-2">
            <X size={16} />
            <span>Swipe left to skip</span>
          </p>
        </div>
      </div>

      {/* Overlay feedback hints */}
      {isDragging && isTop && (
        <>
          <div className="absolute top-8 right-8 border-4 border-green-500 text-green-500 font-bold text-3xl px-4 py-2 rounded-lg transform -rotate-12 opacity-0 transition-opacity duration-200 swipe-hint-right">
            LIKE
          </div>
          <div className="absolute top-8 left-8 border-4 border-red-500 text-red-500 font-bold text-3xl px-4 py-2 rounded-lg transform rotate-12 opacity-0 transition-opacity duration-200 swipe-hint-left">
            NOPE
          </div>
        </>
      )}
    </div>
  );
};

// 2. Saved List Component
const SavedList = ({ isOpen, onClose, items, onRemove }) => {
  const handleCafeClick = (cafe, e) => {
    if (e.target.closest('.remove-btn') || e.target.closest('.map-icon')) return;
    if (cafe.id) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${cafe.id}`, '_blank');
    } else {
      const searchQuery = encodeURIComponent(cafe.name);
      window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
    }
  };

  const handleMapClick = (cafe, e) => {
    e.stopPropagation();
    if (cafe.id) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${cafe.id}`, '_blank');
    } else {
      const searchQuery = encodeURIComponent(cafe.name);
      window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-50 z-[60] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Your Favorites</h2>
            <p className="text-sm text-gray-500 mt-1">{items.length} saved {items.length === 1 ? 'cafe' : 'cafes'}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white rounded-full hover:bg-gray-100 shadow-lg transition-all hover:scale-110">
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 px-2">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <div className="bg-white p-8 rounded-full shadow-lg mb-4 mx-auto w-fit">
                <Heart size={48} className="opacity-50" />
              </div>
              <p className="text-lg font-semibold">No cafes saved yet</p>
              <p className="text-sm mt-2">Start swiping to build your list!</p>
            </div>
          ) : (
            items.map((cafe) => (
              <div 
                key={cafe.id} 
                onClick={(e) => handleCafeClick(cafe, e)}
                className="group relative flex items-center gap-4 p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-[1.02] hover:border-purple-200"
              >
                <img src={cafe.photo} alt={cafe.name} className="w-20 h-20 rounded-xl object-cover bg-gray-200 flex-shrink-0 shadow-md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate text-lg">{cafe.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                      <Star size={12} fill="currentColor" className="mr-1" />
                      {cafe.rating}
                    </div>
                    <button
                      onClick={(e) => handleMapClick(cafe, e)}
                      className="map-icon flex items-center bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold hover:bg-blue-200 transition-colors"
                    >
                      <MapPin size={12} className="mr-1" />
                      Map
                    </button>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(cafe.id);
                  }}
                  className="remove-btn p-2 bg-red-50 rounded-full hover:bg-red-100 transition-all hover:scale-110 shadow-md"
                >
                  <X size={20} className="text-red-500" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Main App Component
const App = () => {
  const [cafes, setCafes] = useState([]);
  const [savedCafes, setSavedCafes] = useState(() => {
    const local = localStorage.getItem('savedCafes');
    return local ? JSON.parse(local) : [];
  });
  const [showSaved, setShowSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize Data
  useEffect(() => {
    loadCafes();
  }, []);

  const loadCafes = async () => {
    setLoading(true);
    if (USE_MOCK_DATA) {
      setTimeout(() => {
        setCafes([...MOCK_CAFES]);
        setLoading(false);
      }, 800);
    } else {
      await fetchNearbyCafes();
      setLoading(false);
    }
  };

  // Helper to format raw API results into our Card format
  const formatCafes = (results) => {
    return results.map(place => ({
      id: place.place_id,
      name: place.name,
      rating: place.rating,
      open_now: place.opening_hours?.open_now,
      // We still build the photo URL on client side because it works inside <img> tags
      photo: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : "https://via.placeholder.com/400x300?text=No+Image"
    }));
  };

  // Robust Fetch Logic: Vercel API -> CORS Proxy -> Mock Data
  const fetchCafesAtLocation = async (lat, lng) => {
    // 1. Try Vercel / Internal API
    try {
      const response = await fetch(`/api/cafes?lat=${lat}&lng=${lng}`);
      // Check if response is JSON (HTML 404s can cause crashes)
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.indexOf("application/json") !== -1) {
         const data = await response.json();
         if (data.results) {
             setCafes(formatCafes(data.results));
             return; 
         }
      } else {
        throw new Error("API route not available or didn't return JSON");
      }
    } catch (err) {
      console.warn("Backend API failed (expected if running locally/preview), trying proxy...", err.message);
    }

    // 2. Try CORS Proxy (Fallback for local dev)
    try {
       const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${GOOGLE_API_KEY}`;
       const proxyUrl = "https://cors-anywhere.herokuapp.com/";
       const response = await fetch(proxyUrl + endpoint);
       
       if (response.ok) {
          const data = await response.json();
          if (data.results) {
              setCafes(formatCafes(data.results));
              return;
          }
       }
    } catch (err) {
       console.warn("Proxy failed, falling back to mock data.", err.message);
    }

    // 3. Fallback to Mock Data (Safe net)
    console.log("Using Mock Data as fallback");
    setCafes([...MOCK_CAFES]);
  };

  const fetchNearbyCafes = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
    const now = Date.now();

    // Cache for 10 minutes
    if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
      await fetchCafesAtLocation(cache.lat, cache.lng);
    } else {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          localStorage.setItem('cachedLocation', JSON.stringify({ lat, lng, timestamp: now }));
          await fetchCafesAtLocation(lat, lng);
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          alert("Location access denied or unavailable. Loading demo data.");
          setCafes([...MOCK_CAFES]);
        }
      );
    }
  };

  const handleSwipe = (direction, cafe) => {
    setCafes(prev => prev.filter(c => c.id !== cafe.id));

    if (direction === 'right') {
      if (!savedCafes.some(c => c.id === cafe.id)) {
        const newSaved = [...savedCafes, cafe];
        setSavedCafes(newSaved);
        localStorage.setItem('savedCafes', JSON.stringify(newSaved));
      }
    }
  };

  const handleRemoveFavorite = (cafeId) => {
    const newSaved = savedCafes.filter(c => c.id !== cafeId);
    setSavedCafes(newSaved);
    localStorage.setItem('savedCafes', JSON.stringify(newSaved));
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col overflow-hidden font-sans text-gray-800">
      
      {/* Header */}
      <header className="pt-8 pb-4 text-center z-10 px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg">
            <Coffee className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Cafe Finder</h1>
        </div>
        <p className="text-gray-500 text-sm font-medium">Find your next brew ☕</p>
      </header>

      {/* Main Card Stack Area */}
      <main className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden ${showSaved ? 'hidden' : ''}`}>
        <div className="relative w-full max-w-sm h-[450px] sm:h-[480px] px-4 mb-4">
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          )}

          {!loading && cafes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-0 animate-fade-in p-8">
              <div className="bg-white p-6 rounded-full shadow-md mb-4">
                <Coffee size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No more cafes!</h3>
              <p className="text-gray-500 mb-6">You've viewed all nearby locations.</p>
              <button 
                onClick={loadCafes}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold shadow-lg hover:bg-blue-600 transition-colors"
              >
                <RotateCcw size={18} />
                Start Over
              </button>
            </div>
          )}

          {/* Render Stack */}
          {cafes.map((cafe, index) => {
            if (index > cafes.length - 3) return null; 
            
            return (
              <SwipeableCard 
                key={cafe.id} 
                data={cafe} 
                onSwipe={handleSwipe}
                isTop={index === 0} 
                style={{ 
                  zIndex: 100 - index,
                  transform: `scale(${1 - index * 0.05}) translateY(${index * 15}px)`,
                  opacity: index > 2 ? 0 : 1 
                }}
              />
            );
          })}
        </div>
      </main>

      {/* Control Bar */}
      <div className={`pb-safe pb-6 sm:pb-8 px-4 w-full max-w-sm mx-auto z-50 ${showSaved ? 'hidden' : ''}`}>
        <div className="flex justify-between items-center bg-white rounded-3xl shadow-xl p-2 sm:p-3 border border-gray-100">
          <button 
            onClick={loadCafes}
            className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 hover:scale-110 active:scale-95 transition-transform shadow-lg"
          >
            <RotateCcw size={20} className="sm:w-[22px] sm:h-[22px]" />
          </button>
          
          <button 
            onClick={() => {
                if(cafes.length > 0) handleSwipe('left', cafes[0]);
            }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-400 to-red-500 text-white hover:scale-110 active:scale-95 transition-transform shadow-lg"
          >
            <X size={24} className="sm:w-[28px] sm:h-[28px]" />
          </button>

          <button 
             onClick={() => {
                if(cafes.length > 0) handleSwipe('right', cafes[0]);
            }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 text-white hover:scale-110 active:scale-95 transition-transform shadow-lg"
          >
            <Heart size={24} className="sm:w-[28px] sm:h-[28px]" fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setShowSaved(true)}
            className="relative p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white hover:scale-110 active:scale-95 transition-transform shadow-lg"
          >
            <Star size={20} className="sm:w-[22px] sm:h-[22px]" fill={savedCafes.length > 0 ? "currentColor" : "none"} />
            {savedCafes.length > 0 && (
              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>

      {/* Saved List Overlay */}
      <SavedList 
        isOpen={showSaved} 
        onClose={() => setShowSaved(false)} 
        items={savedCafes}
        onRemove={handleRemoveFavorite}
      />

      {/* Global Style overrides */}
      <style>{`
        .swipe-hint-right, .swipe-hint-left { opacity: 0; }
      `}</style>
    </div>
  );
};

export default App;
