import { useState, useEffect } from 'react';
import Auth from './Auth';
import Player from './Player';
import PlaylistSelector from './PlaylistSelector';

const token = 'BQCJfv8EJ3I8BpyEULKzx3wVd63mlQYsVlbNJ9nj8tbgh9hYI6ciusxIBejNXLikt4bX5HQfKZ3lPpvztQsLnowVZ6XOra_Fp9hNFG6HJxF5In4DLiIM0AXoeIyX-Hfz5IN8U0gd2sm6BTJL8rdMJZwwHIIu2dSOhkrC3U8c2iU1LDil204x1IVLaM963Rwwa6ls6gwqFQiVTlrq0jSixUCOSojkUuHAPkZ6YNzvZy3EBi9OPpytJKILnPrF1Tg0ldsEVsGtisAafVRU2WDE5PwMFeNmUfqlzecnjrmiplAGRYHNn56O1NIqM1fd';

async function fetchWebApi(endpoint, method, body) {
  try {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : null
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

async function getTopTracks() {
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

export default function App() {
  const [topTracks, setTopTracks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const tracks = await getTopTracks();
        setTopTracks(tracks);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="app">
      <Auth />
      <div>
        <h2>Top Tracks</h2>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <ul>
            {topTracks.map(track => (
              <li key={track.id}>
                {track.name} by {track.artists.map(artist => artist.name).join(', ')}
              </li>
            ))}
          </ul>
        )}
      </div>
      <PlaylistSelector token={token} onSelectTrack={(uri) => {/* Implemente a reprodução */}} />
      <Player token={token} />
    </div>
  );
}