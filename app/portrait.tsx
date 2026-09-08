"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { FaSpotify } from "react-icons/fa";
import { usePortraitAudio } from "./use-portrait-audio";

const description = "Illustrated Medellín skyline surrounded by green hills, tropical leaves, and white flowers.";

const animationQuery = "(min-width: 768px)";

function subscribeToViewport(onChange: () => void) {
  const viewport = window.matchMedia(animationQuery);
  viewport.addEventListener("change", onChange);
  return () => viewport.removeEventListener("change", onChange);
}

function getAnimationEnabled() {
  return window.matchMedia(animationQuery).matches;
}

function getServerAnimationEnabled() {
  return false;
}

export default function Portrait() {
  const [unavailable, setUnavailable] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipId = useId();
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltipVisible || !tooltip) return;
    const { width, height } = tooltip.getBoundingClientRect();
    const margin = 8;
    const offset = 12;
    const left = Math.max(margin, Math.min(anchor.x - width / 2, window.innerWidth - width - margin));
    const above = anchor.y - height - offset >= margin;
    const top = above ? anchor.y - height - offset : anchor.y + offset;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(margin, Math.min(top, window.innerHeight - height - margin))}px`;
    tooltip.style.visibility = "visible";
  }, [anchor, tooltipVisible]);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (tooltipTimer.current !== null) clearTimeout(tooltipTimer.current);
  }, []);

  function showTooltip() {
    if (tooltipTimer.current !== null) clearTimeout(tooltipTimer.current);
    setTooltipVisible(true);
    tooltipTimer.current = setTimeout(() => {
      setTooltipVisible(false);
      tooltipTimer.current = null;
    }, 2000);
  }

  function hideTooltip() {
    if (tooltipTimer.current !== null) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = null;
    setTooltipVisible(false);
  }

  const animationEnabled = useSyncExternalStore(
    subscribeToViewport,
    getAnimationEnabled,
    getServerAnimationEnabled,
  );
  const {
    hostRef: musicHostRef,
    playing: musicPlaying,
    unavailable: musicUnavailable,
    start: startMusic,
    pause: pauseMusic,
    toggle: toggleMusic,
  } = usePortraitAudio(animationEnabled && !unavailable);

  function play(video: HTMLVideoElement) {
    // Leaving before playback starts can abort play(); keep the portrait visible.
    void video.play().catch(() => {});
  }

  return (
    <figure
      className="home-portrait anim d2"
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        setAnchor({ x: event.clientX, y: event.clientY });
        showTooltip();
      }}
      onPointerMove={(event) => {
        if (tooltipVisible && event.pointerType !== "touch") {
          setAnchor({ x: event.clientX, y: event.clientY });
        }
      }}
      onPointerLeave={hideTooltip}
      onFocus={(event) => {
        if (!event.target.classList.contains("portrait-media")) return;
        const bounds = event.target.getBoundingClientRect();
        setAnchor({ x: bounds.left + bounds.width / 2, y: bounds.top });
        showTooltip();
      }}
      onBlur={hideTooltip}
      onKeyDown={(event) => { if (event.key === "Escape") hideTooltip(); }}
    >
      {unavailable || !animationEnabled ? (
        <Image src="/images/medellin-poster-video.png" alt={description} aria-describedby={tooltipVisible ? tooltipId : undefined} width={544} height={720} unoptimized className="portrait-media" />
      ) : (
        <video
          className="portrait-media"
          width={544}
          height={720}
          poster="/images/medellin-poster-video.png"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${description} Play or pause music.`}
          role="button"
          aria-pressed={musicPlaying}
          aria-describedby={tooltipVisible ? tooltipId : undefined}
          tabIndex={0}
          onMouseEnter={(event) => {
            play(event.currentTarget);
            startMusic();
          }}
          onMouseLeave={(event) => {
            event.currentTarget.pause();
            pauseMusic();
          }}
          onFocus={(event) => {
            play(event.currentTarget);
            if (event.currentTarget.matches(":focus-visible")) startMusic();
          }}
          onBlur={(event) => {
            event.currentTarget.pause();
            pauseMusic();
          }}
          onClick={toggleMusic}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!event.repeat) toggleMusic();
            }
          }}
          onError={() => setUnavailable(true)}
        >
          <source src="/images/medellin-portrait.mp4" type="video/mp4" />
          <a href="/images/medellin-portrait.gif">View the Medellín portrait</a>
        </video>
      )}
      {animationEnabled && !unavailable && (
        <>
          <a
            className="portrait-spotify-link social-icon"
            href="https://open.spotify.com/playlist/1C71rB32iP5hL6anUEoi3D"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Spotify playlist (opens in a new tab)"
            title="Listen on Spotify"
            onPointerEnter={hideTooltip}
            onFocus={hideTooltip}
          >
            <FaSpotify size={20} aria-hidden="true" />
          </a>
          <div ref={musicHostRef} className="portrait-audio" aria-hidden="true" inert />
        </>
      )}
      {tooltipVisible && createPortal(
        <span ref={tooltipRef} id={tooltipId} role="tooltip" className="portrait-tooltip">
          Medellin, Colombia
          {musicUnavailable && " · Music unavailable"}
        </span>,
        document.body,
      )}
    </figure>
  );
}
