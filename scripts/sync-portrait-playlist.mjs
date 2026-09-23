import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function getSpotifyPlaylistUri(url) {
  const id = url.trim().match(/^https:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?playlist\/([A-Za-z0-9]{22})\/?(?:[?#].*)?$/)?.[1];
  return id ? `spotify:playlist:${id}` : null;
}

export function parsePlaylist(html, url) {
  const uri = getSpotifyPlaylistUri(url);
  const match = html.match(/<script\b(?=[^>]*\bid=["']__NEXT_DATA__["'])[^>]*>([\s\S]*?)<\/script>/);
  if (!uri || !match) throw new Error("The public Spotify playlist data is unavailable.");
  const entity = JSON.parse(match[1])?.props?.pageProps?.state?.data?.entity;
  if (entity?.uri !== uri || !Array.isArray(entity.trackList)) throw new Error("Spotify returned a different playlist.");
  // Store public display metadata only; the embed page also contains transient
  // session data which must never be copied into the site's assets.
  const tracks = entity.trackList
    .filter(track => track.isPlayable !== false && /^spotify:track:[A-Za-z0-9]{22}$/.test(track.uri)
      && typeof track.title === "string" && typeof track.subtitle === "string")
    .map(track => ({
      uri: track.uri, title: track.title, artist: track.subtitle.replaceAll("\u00a0", " "),
      duration: Number.isFinite(track.duration) && track.duration > 0 ? track.duration : 0,
    }));
  if (!tracks.length) throw new Error("The playlist has no publicly playable tracks.");
  return {
    url: `https://open.spotify.com/playlist/${uri.split(":")[2]}`,
    uri, title: entity.title ?? entity.name ?? "My playlist", owner: entity.subtitle ?? "Spotify", tracks,
  };
}

async function main() {
  const file = new URL("../lib/portrait-playlist.json", import.meta.url);
  const saved = JSON.parse(await readFile(file, "utf8"));
  const url = process.argv[2] || saved.url;
  const uri = getSpotifyPlaylistUri(url);
  if (!uri) throw new Error("Use an open.spotify.com/playlist/… URL.");
  try {
    const response = await fetch(`https://open.spotify.com/embed/playlist/${uri.split(":")[2]}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`Spotify returned HTTP ${response.status}.`);
    const playlist = parsePlaylist(await response.text(), url);
    if (JSON.stringify(saved) !== JSON.stringify(playlist)) {
      await writeFile(file, `${JSON.stringify(playlist, null, 2)}\n`);
    }
    console.log(`Spotify playlist: ${playlist.tracks.length} songs ready.`);
  } catch (error) {
    if (uri !== saved.uri || !saved.tracks?.length) throw error;
    console.warn(`Spotify refresh unavailable; using the saved ${saved.tracks.length}-song playlist. ${error.message}`);
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
