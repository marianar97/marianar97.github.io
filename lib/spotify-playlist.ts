export type PlaylistTrack = {
  uri: string;
  title: string;
  artist: string;
  duration: number;
};

export type PlaybackEvent = {
  data: {
    playingURI?: string;
    isPaused: boolean;
    isBuffering: boolean;
    position: number;
    duration: number;
  };
};

export interface SpotifyController {
  resume(): void;
  pause(): void;
  destroy(): void;
  loadEntity?(uri: string): void;
  loadUri(uri: string): void;
  addListener(event: "ready", listener: () => void): void;
  addListener(event: "playback_update", listener: (event: PlaybackEvent) => void): void;
}

export type PlaylistState = {
  index: number;
  ready: boolean;
  playing: boolean;
  starting: boolean;
  stalled: boolean;
  unavailable: boolean;
  position: number;
  duration: number;
};

export function initialPlaylistState(track: PlaylistTrack): PlaylistState {
  return {
    index: 0, ready: false, playing: false, starting: false, stalled: false,
    unavailable: false, position: 0, duration: track.duration,
  };
}

// The embed often reports ~30s first (a preview clip). Keep the catalog length
// so the player does not treat that clip as the whole song.
const PREVIEW_LIMIT_MS = 35_000;

export function playbackDuration(reported: number, catalog: number) {
  if (!Number.isFinite(reported) || reported <= 0) return catalog;
  if (catalog > PREVIEW_LIMIT_MS && reported <= PREVIEW_LIMIT_MS) return catalog;
  return reported;
}

// The iframe API has no skip commands. Load adjacent playlist tracks using its
// supported content-loading method, and keep late events from changing the UI.
export class SpotifyPlaylistPlayback {
  state: PlaylistState;
  private tracks: readonly PlaylistTrack[];
  private onChange: (state: PlaylistState) => void;
  private controller: SpotifyController | null = null;
  private disposed = false;
  private wantsPlayback = false;
  private hasPlayed = false;
  private readyTimer: ReturnType<typeof setTimeout> | undefined;
  private startTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(tracks: readonly PlaylistTrack[], onChange: (state: PlaylistState) => void) {
    if (!tracks.length) throw new Error("The playlist has no playable songs.");
    this.tracks = tracks;
    this.onChange = onChange;
    this.state = initialPlaylistState(tracks[0]);
    this.waitForReady();
  }

  get track() { return this.tracks[this.state.index]; }

  private update(changes: Partial<PlaylistState>) {
    if (this.disposed) return;
    this.state = { ...this.state, ...changes };
    this.onChange(this.state);
  }

  private waitForReady() {
    clearTimeout(this.readyTimer);
    this.readyTimer = setTimeout(() => {
      if (!this.state.ready) this.fail();
    }, 20000);
  }

  private waitForPlayback() {
    clearTimeout(this.startTimer);
    this.startTimer = setTimeout(() => {
      if (this.wantsPlayback && !this.state.playing) {
        this.update({ starting: false, stalled: true });
      }
    }, 10000);
  }

  connect(controller: SpotifyController, loadedUri: string) {
    if (this.disposed) {
      controller.destroy();
      return;
    }
    this.controller = controller;
    controller.addListener("ready", () => {
      if (this.disposed) return;
      clearTimeout(this.readyTimer);
      this.update({ ready: true, unavailable: false });
      if (this.wantsPlayback) this.start();
    });
    controller.addListener("playback_update", (event) => this.onPlayback(event));
    // A visitor may have skipped while the first iframe was being created.
    if (loadedUri !== this.track.uri) this.loadSelectedTrack();
  }

  private onPlayback({ data }: PlaybackEvent) {
    if (this.disposed || (data.playingURI && data.playingURI !== this.track.uri)) return;
    if (!this.wantsPlayback && !data.isPaused) {
      this.controller?.pause();
      return;
    }
    const duration = playbackDuration(data.duration, this.track.duration || this.state.duration);
    const position = Number.isFinite(data.position) ? Math.max(0, Math.min(data.position, duration)) : this.state.position;
    const ended = this.wantsPlayback && this.hasPlayed && data.isPaused && !data.isBuffering
      && duration > 0 && position >= duration - 500;
    const playing = !data.isPaused && !data.isBuffering;
    if (playing) {
      this.hasPlayed = true;
      clearTimeout(this.startTimer);
    }
    this.update({
      playing, position, duration,
      ...(playing ? { starting: false, stalled: false, unavailable: false } : {}),
    });
    if (ended) {
      if (this.state.index < this.tracks.length - 1) this.next();
      else this.pause();
    }
  }

  start() {
    if (this.disposed) return;
    this.wantsPlayback = true;
    this.update({ starting: !this.state.playing, stalled: false });
    this.waitForPlayback();
    if (this.state.ready) {
      try { this.controller?.resume(); } catch { this.fail(); }
    }
  }

  pause() {
    if (this.disposed) return;
    this.wantsPlayback = false;
    clearTimeout(this.startTimer);
    this.update({ playing: false, starting: false, stalled: false });
    if (this.state.ready) this.controller?.pause();
  }

  toggle() {
    if (this.state.playing) this.pause();
    else this.start();
  }

  previous() { this.skip(-1); }
  next() { this.skip(1); }

  private skip(direction: number) {
    if (this.disposed || this.tracks.length < 2) return;
    if (this.state.ready) this.controller?.pause();
    const index = (this.state.index + direction + this.tracks.length) % this.tracks.length;
    this.wantsPlayback = true;
    this.hasPlayed = false;
    this.update({
      index, position: 0, duration: this.tracks[index].duration, ready: false,
      playing: false, starting: true, stalled: false, unavailable: false,
    });
    this.waitForReady();
    this.waitForPlayback();
    this.loadSelectedTrack();
  }

  private loadSelectedTrack() {
    if (!this.controller) return;
    try {
      if (this.controller.loadEntity) this.controller.loadEntity(this.track.uri);
      else this.controller.loadUri(this.track.uri);
    } catch { this.fail(); }
  }

  fail() {
    clearTimeout(this.startTimer);
    this.update({ unavailable: true, starting: false, playing: false });
  }

  destroy() {
    this.disposed = true;
    this.wantsPlayback = false;
    clearTimeout(this.readyTimer);
    clearTimeout(this.startTimer);
    this.controller?.destroy();
    this.controller = null;
  }
}
