"use client";

import { FiPause, FiPlay, FiSkipBack, FiSkipForward } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa";
import { portraitPlaylistUrl } from "@/lib/portrait-music";
import type { PlaylistTrack } from "@/lib/spotify-playlist";
import styles from "./portrait-player.module.css";

type PortraitPlayerProps = {
  ready: boolean;
  playing: boolean;
  starting: boolean;
  stalled: boolean;
  unavailable: boolean;
  position: number;
  duration: number;
  track: PlaylistTrack;
  canSkip: boolean;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function timestamp(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function PortraitPlayer({
  ready, playing, starting, stalled, unavailable, position, duration, track, canSkip,
  onToggle, onPrevious, onNext,
}: PortraitPlayerProps) {
  const progress = duration > 0 ? Math.min(position, duration) : 0;
  const status = unavailable ? "Listen on Spotify" : stalled ? "Try play again, or open Spotify"
    : starting ? "Starting the music…" : !ready ? "Connecting to Spotify…"
      : playing ? "Now playing" : position > 0 ? "Paused" : "A little music for your visit";
  const showStatus = unavailable || stalled || starting || !ready;
  const trackUrl = `https://open.spotify.com/track/${track.uri.split(":")[2]}`;

  return (
    <section className={styles.player} aria-label="Portrait music player">
      <div className={styles.row}>
        <button type="button" className={styles.play} onClick={onToggle} disabled={unavailable}
          aria-label={playing ? "Pause music" : "Play music"} title={playing ? "Pause" : "Play"}>
          {playing ? <FiPause size={22} aria-hidden="true" /> : <FiPlay size={22} aria-hidden="true" />}
        </button>
        <div className={styles.track}>
          <a href={trackUrl} target="_blank" rel="noopener noreferrer" aria-label={`${track.title} on Spotify (opens in a new tab)`} title={track.title}>
            {track.title}
          </a>
          <span title={track.artist}>{track.artist}</span>
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={onPrevious} disabled={!canSkip}
            aria-label="Previous song" title="Previous song">
            <FiSkipBack size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={onNext} disabled={!canSkip}
            aria-label="Next song" title="Next song">
            <FiSkipForward size={17} aria-hidden="true" />
          </button>
          <a href={portraitPlaylistUrl} target="_blank" rel="noopener noreferrer"
            aria-label="Open Spotify playlist (opens in a new tab)" title="My Spotify playlist">
            <FaSpotify size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className={styles.timeline}>
        <span aria-hidden="true">{timestamp(progress)}</span>
        <progress className={styles.progress} value={progress} max={duration || 1}
          aria-label="Song progress" aria-valuetext={duration > 0 ? `${timestamp(progress)} of ${timestamp(duration)}` : "Waiting for Spotify"} />
        <span aria-hidden="true">{duration > 0 ? timestamp(duration) : "—:—"}</span>
      </div>
      <p className={showStatus ? styles.status : styles.srOnly} role="status">
        {starting && !unavailable && <span className={styles.loading} aria-hidden="true" />}
        {status}
      </p>
    </section>
  );
}
