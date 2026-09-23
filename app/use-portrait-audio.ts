"use client";

import { useEffect, useRef, useState } from "react";
import { portraitPlaylist } from "@/lib/portrait-music";
import {
  initialPlaylistState, SpotifyPlaylistPlayback, type SpotifyController,
} from "@/lib/spotify-playlist";

export const SPOTIFY_IFRAME_API_URL = "https://open.spotify.com/embed/iframe-api/v1";

interface SpotifyApi {
  createController(
    element: HTMLElement,
    options: { width: number; height: number; uri?: string },
    callback: (controller: SpotifyController) => void,
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyApi) => void;
    __portraitSpotifyApi?: Promise<SpotifyApi>;
  }
}

function loadSpotifyApi() {
  // Keep the single initialization across development hot reloads, too.
  if (!window.__portraitSpotifyApi) {
    window.__portraitSpotifyApi = new Promise<SpotifyApi>((resolve, reject) => {
      window.onSpotifyIframeApiReady = resolve;
      const script = document.createElement("script");
      script.src = SPOTIFY_IFRAME_API_URL;
      script.async = true;
      script.onerror = () => {
        window.__portraitSpotifyApi = undefined;
        script.remove();
        reject(new Error("Spotify could not load."));
      };
      document.head.appendChild(script);
    });
  }
  return window.__portraitSpotifyApi;
}

export function usePortraitAudio(enabled: boolean) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playbackRef = useRef<SpotifyPlaylistPlayback | null>(null);
  const [state, setState] = useState(() => initialPlaylistState(portraitPlaylist.tracks[0]));

  useEffect(() => {
    const host = hostRef.current;
    if (!enabled || !host) return;
    let active = true;
    const playback = new SpotifyPlaylistPlayback(portraitPlaylist.tracks, setState);
    playbackRef.current = playback;

    void loadSpotifyApi().then((api) => {
      if (!active) return;
      // Preserve any play/skip requests made while the API was loading.
      setState(playback.state);
      const mount = document.createElement("div");
      host.appendChild(mount);
      api.createController(mount, { width: 352, height: 152, uri: playback.track.uri }, (controller) => {
        if (!active) {
          controller.destroy();
          return;
        }
        const iframe = host.querySelector("iframe");
        if (iframe) {
          // Spotify defaults to lazy loading. This player is intentionally
          // hidden, so request it now instead of waiting for it to be visible.
          iframe.loading = "eager";
          iframe.tabIndex = -1;
          iframe.title = "Portrait playlist on Spotify";
          // Without encrypted-media the embed only streams a ~30s preview.
          const allow = new Set(
            (iframe.getAttribute("allow") ?? "").split(";").map((token) => token.trim()).filter(Boolean),
          );
          allow.add("encrypted-media");
          allow.add("autoplay");
          iframe.setAttribute("allow", [...allow].join("; "));
        }
        // Preserve eager loading and attach listeners before navigating the iframe.
        const selectedUri = playback.track.uri;
        playback.connect(controller, selectedUri);
        controller.loadUri(selectedUri);
      });
    }).catch(() => {
      if (active) playback.fail();
    });

    return () => {
      active = false;
      playbackRef.current = null;
      playback.destroy();
      host.replaceChildren();
    };
  }, [enabled]);

  return {
    hostRef,
    track: portraitPlaylist.tracks[state.index] ?? portraitPlaylist.tracks[0],
    canSkip: enabled && portraitPlaylist.tracks.length > 1,
    ready: enabled && state.ready,
    playing: enabled && state.playing,
    starting: enabled && state.starting,
    stalled: enabled && state.stalled,
    unavailable: state.unavailable,
    position: state.position,
    duration: state.duration,
    start: () => playbackRef.current?.start(),
    pause: () => playbackRef.current?.pause(),
    toggle: () => playbackRef.current?.toggle(),
    previous: () => playbackRef.current?.previous(),
    next: () => playbackRef.current?.next(),
  };
}
