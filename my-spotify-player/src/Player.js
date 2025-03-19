import { useEffect, useState } from 'react';
import { PlayArrow, Pause, SkipNext, SkipPrevious } from '@mui/icons-material';

export default function Player({ token }) {
  const [player, setPlayer] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Meu Player Pessoal',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Device ID:', device_id);
      });

      player.addListener('player_state_changed', state => {
        if (state) setCurrentTrack(state.track_window.current_track);
      });

      player.connect();
      setPlayer(player);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
      document.body.removeChild(script);
    };
  }, [token]);

  const togglePlay = () => {
    player.togglePlay();
  };

  return (
    <div className="player-container">
      {currentTrack && (
        <div className="track-info">
          <img src={currentTrack.album.images[0].url} alt="Album" />
          <h3>{currentTrack.name}</h3>
          <p>{currentTrack.artists[0].name}</p>
        </div>
      )}
      <div className="controls">
        <button onClick={() => player.previousTrack()}><SkipPrevious /></button>
        <button onClick={togglePlay}>
          {player?.paused ? <PlayArrow /> : <Pause />}
        </button>
        <button onClick={() => player.nextTrack()}><SkipNext /></button>
      </div>
    </div>
  );
}