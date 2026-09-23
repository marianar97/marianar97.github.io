'use client';

import { useEffect, useRef } from 'react';
import type { Book as BookData } from '@/lib/thinking-space';
import Book, { bookStyle } from './book';
import styles from './book.module.css';

type Pose = { x: number; y: number };
type Drag = { id: number; startX: number; startY: number; pose: Pose; lastX: number; lastY: number; lastTime: number };
const homePose = (): Pose => ({ x: 4, y: -26 });
const clampPitch = (x: number) => Math.max(-65, Math.min(65, x));

export default function BookPreview({ book }: { book: BookData }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current, volume = volumeRef.current;
    if (!stage || !volume) return;
    const controller = new AbortController(), options = { signal: controller.signal };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let pose = homePose(), drawn = homePose(), velocity: Pose = { x: 0, y: 0 };
    let drag: Drag | null = null;
    let tween: { from: Pose; to: Pose; start: number } | null = null;
    let paused = false, frame = 0, lastFrame = 0, idleTime = 0, disposed = false;

    function requestFrame() {
      if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function draw(now: number) {
      frame = 0;
      const dt = Math.min(lastFrame ? (now - lastFrame) / 1000 : 1 / 60, .04);
      lastFrame = now;
      if (tween) {
        const t = Math.min(1, (now - tween.start) / 550), ease = 1 - (1 - t) ** 3;
        pose = { x: tween.from.x + (tween.to.x - tween.from.x) * ease, y: tween.from.y + (tween.to.y - tween.from.y) * ease };
        if (t === 1) tween = null;
      } else if (!drag && !reduced.matches) {
        pose.x = clampPitch(pose.x + velocity.x * dt); pose.y += velocity.y * dt;
        const decay = Math.exp(-7 * dt);
        velocity.x *= decay; velocity.y *= decay;
        if (Math.abs(velocity.x) < .5) velocity.x = 0;
        if (Math.abs(velocity.y) < .5) velocity.y = 0;
      }
      const idle = !paused && !reduced.matches && !drag && !tween;
      if (idle) idleTime += dt;
      const sway = idle ? Math.sin(idleTime * .65) : 0;
      drawn = { x: pose.x + sway * 1.3, y: pose.y + sway * 3 };
      volume!.style.transform = `rotateX(${drawn.x}deg) rotateY(${drawn.y}deg)`;
      if (idle || tween || velocity.x || velocity.y) requestFrame();
    }
    function hold() {
      pose = { ...drawn }; tween = null; velocity = { x: 0, y: 0 }; idleTime = 0; paused = true;
    }
    function endDrag(cancelled = false) {
      if (!drag) return;
      const id = drag.id;
      if (cancelled || performance.now() - drag.lastTime > 100 || reduced.matches) velocity = { x: 0, y: 0 };
      drag = null; stage!.classList.remove(styles.dragging);
      if (stage!.hasPointerCapture(id)) stage!.releasePointerCapture(id);
      requestFrame();
    }
    stage.addEventListener('pointerdown', e => {
      if (!e.isPrimary || e.button !== 0 || drag || !volume.contains(e.target as Node)) return;
      hold();
      drag = { id: e.pointerId, startX: e.clientX, startY: e.clientY, pose: { ...pose }, lastX: e.clientX, lastY: e.clientY, lastTime: performance.now() };
      stage.setPointerCapture(e.pointerId);
      stage.classList.add(styles.dragging, styles.pointerFocused);
      stage.focus({ preventScroll: true }); e.preventDefault();
    }, options);
    stage.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const now = performance.now(), dt = Math.max(.008, (now - drag.lastTime) / 1000), sensitivity = 200 / volume.offsetWidth;
      pose.y = drag.pose.y + (e.clientX - drag.startX) * sensitivity;
      pose.x = clampPitch(drag.pose.x - (e.clientY - drag.startY) * sensitivity * .6);
      velocity.y = Math.max(-240, Math.min(240, (e.clientX - drag.lastX) * sensitivity / dt));
      velocity.x = Math.max(-120, Math.min(120, -(e.clientY - drag.lastY) * sensitivity * .6 / dt));
      drag.lastX = e.clientX; drag.lastY = e.clientY; drag.lastTime = now;
      requestFrame();
    }, options);
    stage.addEventListener('pointerup', e => { if (e.pointerId === drag?.id) endDrag(); }, options);
    stage.addEventListener('pointercancel', () => endDrag(true), options);
    stage.addEventListener('lostpointercapture', () => endDrag(true), options);
    stage.addEventListener('keydown', e => {
      stage.classList.remove(styles.pointerFocused);
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'Escape'].includes(e.key)) return;
      e.preventDefault(); endDrag(true); hold();
      if (e.key === 'Home' || e.key === 'Escape') {
        if (reduced.matches) pose = homePose();
        else tween = { from: { ...pose }, to: homePose(), start: performance.now() };
      }
      if (e.key === 'ArrowLeft') pose.y -= 15;
      if (e.key === 'ArrowRight') pose.y += 15;
      if (e.key === 'ArrowUp') pose.x = clampPitch(pose.x + 10);
      if (e.key === 'ArrowDown') pose.x = clampPitch(pose.x - 10);
      requestFrame();
    }, options);
    reduced.addEventListener('change', () => { hold(); requestFrame(); }, options);
    document.addEventListener('visibilitychange', () => {
      endDrag(true); lastFrame = 0;
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else requestFrame();
    }, options);
    window.addEventListener('blur', () => endDrag(true), options);
    requestFrame();
    return () => {
      disposed = true; controller.abort(); endDrag(true); cancelAnimationFrame(frame);
    };
  }, []);

  return <aside className="min-w-0" aria-label="Book preview">
    <div ref={stageRef} className={`${styles.stage} relative flex h-[390px] items-center justify-center focus:outline-none max-[1100px]:h-[345px] max-[850px]:h-[330px] max-[600px]:h-[333px]`} tabIndex={0} role="group" aria-label="3D book. Drag to rotate, or use arrow keys. Press Home to reset.">
      <div className={styles.shadow} aria-hidden="true" />
      <div ref={volumeRef} className={`${styles.volume} ${styles.interactiveVolume}`} style={bookStyle(book)} aria-hidden="true"><Book book={book} /></div>
    </div>
  </aside>;
}
