"use client";

import { useEffect, useRef, useState } from "react";

// Change only this URL when choosing a song; Spotify share links work too.
//const song_url = "https://open.spotify.com/track/3sK8wGT43QFpWrvNQsrQya?si=d4ce417a98d2408a"
const song_url = 'https://open.spotify.com/track/4w6Wpq1KWk485krowaqUIV'


export function getSpotifyTrackUri(url: string): string | null {
  const trackId = url.trim().match(
    /^https:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([A-Za-z0-9]{22})\/?(?:[?#].*)?$/,
  )?.[1];
  return trackId ? `spotify:track:${trackId}` : null;
}

const song_uri = 'spotify:track:3sK8wGT43QFpWrvNQsrQya'
// const song_uri = getSpotifyTrackUri(song_url)

type PlaybackEvent = { data: { isPaused: boolean } };

interface SpotifyController {
  resume(): void;
  pause(): void;
  togglePlay(): void;
  destroy(): void;
  addListener(event: "ready", listener: () => void): void;
  addListener(event: "playback_update", listener: (event: PlaybackEvent) => void): void;
}

interface SpotifyApi {
  createController(
    element: HTMLElement,
    options: { uri: string; width: number; height: number },
    callback: (controller: SpotifyController) => void,
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyApi) => void;
  }
}

let apiPromise: Promise<SpotifyApi> | undefined;

function loadSpotifyApi() {
  if (!apiPromise) {
    apiPromise = new Promise<SpotifyApi>((resolve, reject) => {
      window.onSpotifyIframeApiReady = resolve;
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      script.onerror = () => {
        apiPromise = undefined;
        script.remove();
        reject(new Error("Spotify could not load."));
      };
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

export function usePortraitAudio(enabled: boolean) {
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const readyRef = useRef(false);
  const wantsPlayback = useRef(false);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!enabled || !host || !song_uri) return;
    let disposed = false;
    let controller: SpotifyController | null = null;

    void loadSpotifyApi().then((api) => {
      if (disposed) return;
      setPlaying(false);
      // Spotify replaces this child; React retains ownership of the outer host.
      const mount = document.createElement("div");
      host.appendChild(mount);
      api.createController(mount, {
        uri: song_uri,
        width: 352,
        height: 152,
      }, (createdController) => {
        if (disposed) {
          createdController.destroy();
          return;
        }
        controller = createdController;
        controllerRef.current = controller;
        const iframe = host.querySelector("iframe");
        if (iframe) {
          iframe.tabIndex = -1;
          iframe.title = "Portrait music on Spotify";
        }
        controller.addListener("ready", () => {
          if (disposed) return;
          readyRef.current = true;
          setUnavailable(false);
          if (wantsPlayback.current) createdController.resume();
        });
        controller.addListener("playback_update", ({ data }) => {
          if (disposed) return;
          // A delayed start must not outlive a leave or a pause request.
          if (!wantsPlayback.current && !data.isPaused) {
            createdController.pause();
            return;
          }
          playingRef.current = !data.isPaused;
          setPlaying(!data.isPaused);
        });
      });
    }).catch(() => {
      if (!disposed) setUnavailable(true);
    });

    return () => {
      disposed = true;
      wantsPlayback.current = false;
      playingRef.current = false;
      readyRef.current = false;
      controllerRef.current = null;
      controller?.destroy();
      host.replaceChildren();
    };
  }, [enabled]);

  function start() {
    if (!enabled || !song_uri) return;
    wantsPlayback.current = true;
    if (readyRef.current) controllerRef.current?.resume();
  }

  function pause() {
    wantsPlayback.current = false;
    if (readyRef.current) controllerRef.current?.pause();
  }

  function toggle() {
    if (!enabled || !song_uri) return;
    if (!readyRef.current) {
      wantsPlayback.current = !wantsPlayback.current;
      return;
    }
    // Spotify knows whether autoplay succeeded; a blocked hover can start on click.
    wantsPlayback.current = !playingRef.current;
    controllerRef.current?.togglePlay();
  }

  return { hostRef, playing: enabled && playing, unavailable: unavailable || !song_uri, start, pause, toggle };
}
