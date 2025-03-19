import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PlaylistSelector({ token, onSelectTrack }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!token) return;

    axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => setPlaylists(res.data.items));
  }, [token]);

  return (
    <div className="playlist-sidebar">
      <h2>Suas Playlists</h2>
      <ul>
        {playlists.map(playlist => (
          <li key={playlist.id} onClick={() => onSelectTrack(playlist.uri)}>
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}