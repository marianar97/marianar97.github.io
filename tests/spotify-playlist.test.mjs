import test from "node:test";
import assert from "node:assert/strict";
import { SpotifyPlaylistPlayback } from "../lib/spotify-playlist.ts";
import { getSpotifyPlaylistUri, parsePlaylist } from "../scripts/sync-portrait-playlist.mjs";

const tracks = [
  { uri: "spotify:track:3sK8wGT43QFpWrvNQsrQya", title: "DtMF", artist: "Bad Bunny", duration: 237117 },
  { uri: "spotify:track:4w6Wpq1KWk485krowaqUIV", title: "Viajando Por El Mundo", artist: "KAROL G, Manu Chao", duration: 268075 },
  { uri: "spotify:track:4tXR895KKljrC2VptgyEhJ", title: "La Gota Fria", artist: "Carlos Vives", duration: 215493 },
];

function setup(t) {
  const calls = [];
  const listeners = {};
  const controller = {
    resume() { calls.push("resume"); },
    pause() { calls.push("pause"); },
    destroy() { calls.push("destroy"); },
    loadEntity(uri) { calls.push(uri); },
    loadUri(uri) { calls.push(uri); },
    addListener(name, listener) { listeners[name] = listener; },
  };
  const player = new SpotifyPlaylistPlayback(tracks, () => {});
  t.after(() => player.destroy());
  const update = (overrides = {}) => listeners.playback_update({ data: {
    playingURI: player.track.uri, isPaused: false, isBuffering: false,
    position: 1000, duration: player.track.duration, ...overrides,
  } });
  return { player, controller, listeners, calls, update };
}

test("preserves a skip and play request made before Spotify creates the iframe", t => {
  const { player, controller, listeners, calls, update } = setup(t);
  player.start();
  player.next();
  player.connect(controller, tracks[0].uri);
  assert.equal(player.track.title, "Viajando Por El Mundo");
  assert.equal(player.state.starting, true);
  assert.deepEqual(calls, [tracks[1].uri]);
  listeners.ready();
  assert.equal(calls.at(-1), "resume");
  update();
  assert.equal(player.state.playing, true);
  assert.equal(player.state.starting, false);
});

test("rapid skips keep the latest selection and discard an old song's events", t => {
  const { player, controller, listeners, calls, update } = setup(t);
  player.connect(controller, tracks[0].uri);
  listeners.ready();
  player.next();
  player.next();
  update({ playingURI: tracks[1].uri, position: 8000 });
  assert.equal(player.track.title, "La Gota Fria");
  assert.equal(player.state.position, 0);
  assert.equal(player.state.playing, false);
  assert.equal(calls.at(-1), tracks[2].uri);
  listeners.ready();
  update({ position: 1500 });
  assert.equal(player.state.position, 1500);
});

test("previous and next wrap correctly at the ends of the playlist", t => {
  const { player } = setup(t);
  player.previous();
  assert.equal(player.track.uri, tracks[2].uri);
  player.next();
  assert.equal(player.track.uri, tracks[0].uri);
  player.next();
  player.previous();
  assert.equal(player.track.uri, tracks[0].uri);
});

test("a song that fails to load can still be skipped", t => {
  const { player, controller, calls } = setup(t);
  player.connect(controller, tracks[0].uri);
  player.fail();
  player.next();
  assert.equal(player.state.unavailable, false);
  assert.equal(player.state.starting, true);
  assert.equal(calls.at(-1), tracks[1].uri);
});

test("a pause during loading cancels the pending start, including late playback", t => {
  const { player, controller, listeners, calls, update } = setup(t);
  player.connect(controller, tracks[0].uri);
  player.next();
  player.pause();
  listeners.ready();
  assert.ok(!calls.includes("resume"));
  update();
  assert.equal(calls.at(-1), "pause");
  assert.equal(player.state.playing, false);
});

test("advances once on completion, but a manual pause near the end does not skip", t => {
  const { player, controller, listeners, update } = setup(t);
  player.connect(controller, tracks[0].uri);
  listeners.ready();
  player.start();
  update({ position: tracks[0].duration - 300 });
  update({ isPaused: true, position: tracks[0].duration });
  assert.equal(player.state.index, 1);
  update({ playingURI: tracks[0].uri, isPaused: true, position: tracks[0].duration });
  assert.equal(player.state.index, 1);
  listeners.ready();
  update({ position: tracks[1].duration - 100 });
  player.pause();
  update({ isPaused: true, position: tracks[1].duration });
  assert.equal(player.state.index, 1);
});

test("keeps the catalog song length when Spotify reports a 30s preview", t => {
  const { player, controller, listeners, update } = setup(t);
  player.connect(controller, tracks[0].uri);
  listeners.ready();
  player.start();
  update({ position: 1000, duration: 30000 });
  assert.equal(player.state.duration, tracks[0].duration);
  update({ isPaused: true, position: 30000, duration: 30000 });
  assert.equal(player.state.index, 0);
  assert.equal(player.state.duration, tracks[0].duration);
});

test("stops after the last song finishes at catalog length", t => {
  const { player, controller, listeners, update } = setup(t);
  player.previous();
  player.connect(controller, tracks[2].uri);
  listeners.ready();
  update({ position: tracks[2].duration - 300, duration: tracks[2].duration });
  update({ isPaused: true, position: tracks[2].duration, duration: tracks[2].duration });
  assert.equal(player.state.index, 2);
  assert.equal(player.state.playing, false);
  assert.equal(player.state.starting, false);
  assert.equal(player.state.duration, tracks[2].duration);
});

test("supports older iframe API versions and disposes late controllers", t => {
  const { player, controller, calls } = setup(t);
  delete controller.loadEntity;
  player.connect(controller, tracks[0].uri);
  player.next();
  assert.equal(calls.at(-1), tracks[1].uri);
  player.destroy();
  player.connect(controller, tracks[1].uri);
  assert.equal(calls.at(-1), "destroy");
});

test("reports stalled playback and recovers when Spotify eventually starts", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { player, controller, listeners, update } = setup(t);
  player.connect(controller, tracks[0].uri);
  listeners.ready();
  player.start();
  t.mock.timers.tick(10000);
  assert.equal(player.state.stalled, true);
  assert.equal(player.state.starting, false);
  update();
  assert.equal(player.state.stalled, false);
  assert.equal(player.state.playing, true);
});

test("parses Spotify playlist share URLs and rejects unrelated URLs", () => {
  const uri = "spotify:playlist:1C71rB32iP5hL6anUEoi3D";
  assert.equal(getSpotifyPlaylistUri(" https://open.spotify.com/intl-es/playlist/1C71rB32iP5hL6anUEoi3D?si=test "), uri);
  assert.equal(getSpotifyPlaylistUri("https://example.com/playlist/1C71rB32iP5hL6anUEoi3D"), null);
  assert.equal(getSpotifyPlaylistUri("https://open.spotify.com/track/3sK8wGT43QFpWrvNQsrQya"), null);
});

test("playlist sync copies only public track metadata and verifies the playlist", () => {
  const url = "https://open.spotify.com/playlist/1C71rB32iP5hL6anUEoi3D";
  const data = { props: { pageProps: { state: {
    data: { entity: { uri: getSpotifyPlaylistUri(url), title: "DtMF", subtitle: "Mariana", trackList: [
      { ...tracks[0], subtitle: "Bad Bunny", isPlayable: true, unrelatedSessionField: "discard-me" },
      { ...tracks[1], subtitle: "KAROL G", isPlayable: false },
    ] } },
    settings: { session: { unused: "never-copy-this" } },
  } } } };
  const html = `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(data)}</script>`;
  const playlist = parsePlaylist(html, url);
  assert.deepEqual(playlist.tracks, [tracks[0]]);
  assert.ok(!JSON.stringify(playlist).includes("discard-me"));
  assert.ok(!JSON.stringify(playlist).includes("never-copy-this"));
  assert.throws(() => parsePlaylist(html, "https://open.spotify.com/playlist/3sK8wGT43QFpWrvNQsrQya"));
  assert.throws(() => parsePlaylist("<html>Unavailable</html>", url));
});
