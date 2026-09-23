// One pose owns idle motion, direct manipulation, momentum, and keyboard rotation.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const bookStage = document.getElementById('book-stage');
const volume = document.getElementById('display-volume');
const homePose = () => ({ x: 4, y: -26 });
let pose = homePose(), drawnPose = homePose();
let motionPaused = false, previewVisible = false, drag = null, tween = null;
let velocity = { x: 0, y: 0 }, frameId = 0, lastFrame = 0, idleTime = 0;
const clampPitch = x => Math.max(-65, Math.min(65, x));
function requestBookFrame() {
  if (!frameId && previewVisible && !document.hidden) frameId = requestAnimationFrame(drawBook);
}
function drawBook(now) {
  frameId = 0;
  const dt = Math.min(lastFrame ? (now - lastFrame) / 1000 : 1 / 60, .04);
  lastFrame = now;
  if (tween) {
    const t = Math.min(1, (now - tween.start) / 550), ease = 1 - (1 - t) ** 3;
    pose.x = tween.from.x + (tween.to.x - tween.from.x) * ease;
    pose.y = tween.from.y + (tween.to.y - tween.from.y) * ease;
    if (t === 1) tween = null;
  } else if (!drag && !reducedMotion.matches) {
    pose.x = clampPitch(pose.x + velocity.x * dt);
    pose.y += velocity.y * dt;
    const decay = Math.exp(-7 * dt);
    velocity.x *= decay; velocity.y *= decay;
    if (Math.abs(velocity.x) < .5) velocity.x = 0;
    if (Math.abs(velocity.y) < .5) velocity.y = 0;
  }
  const idle = !motionPaused && !reducedMotion.matches && !drag && !tween;
  if (idle) idleTime += dt;
  // Idle starts at zero offset, so grabbing/resuming never snaps the book.
  const sway = idle ? Math.sin(idleTime * .65) : 0;
  drawnPose = { x: pose.x + sway * 1.3, y: pose.y + sway * 3 };
  volume.style.transform = `rotateX(${drawnPose.x}deg) rotateY(${drawnPose.y}deg)`;
  if (idle || tween || velocity.x || velocity.y) requestBookFrame();
}
function holdPose() {
  pose = { ...drawnPose };
  tween = null; velocity = { x: 0, y: 0 }; idleTime = 0;
  motionPaused = true;
}
function endDrag(cancelled = false) {
  if (!drag) return;
  const pointerId = drag.id;
  if (cancelled || performance.now() - drag.lastTime > 100 || reducedMotion.matches) velocity = { x: 0, y: 0 };
  drag = null;
  bookStage.classList.remove('is-dragging');
  if (bookStage.hasPointerCapture(pointerId)) bookStage.releasePointerCapture(pointerId);
  requestBookFrame();
}
function moveBook(to) {
  holdPose();
  if (reducedMotion.matches) pose = to;
  else tween = { from: { ...pose }, to, start: performance.now() };
  requestBookFrame();
}
function showBookPreview(selected) {
  endDrag(true);
  cancelAnimationFrame(frameId); frameId = 0; lastFrame = 0;
  previewVisible = selected?.type === 'book';
  reader.classList.toggle('book-reading', previewVisible);
  document.getElementById('book-preview').hidden = !previewVisible;
  if (!previewVisible) return;
  const i = books.findIndex(b => b.id === selected.id);
  volume.style.setProperty('--color', selected.color);
  volume.style.setProperty('--foil', selected.foil);
  volume.innerHTML = volumeFaces(selected, i);
  pose = homePose(); drawnPose = { ...pose }; idleTime = 0;
  velocity = { x: 0, y: 0 }; tween = null;
  volume.style.transform = `rotateX(${pose.x}deg) rotateY(${pose.y}deg)`;
  requestBookFrame();
}
bookStage.addEventListener('pointerdown', e => {
  if (!e.isPrimary || e.button !== 0 || drag || !e.target.closest('#display-volume')) return;
  holdPose();
  drag = { id: e.pointerId, startX: e.clientX, startY: e.clientY, pose: { ...pose }, lastX: e.clientX, lastY: e.clientY, lastTime: performance.now() };
  bookStage.setPointerCapture(e.pointerId);
  bookStage.classList.add('is-dragging', 'is-pointer-focused');
  bookStage.focus({ preventScroll: true });
  e.preventDefault();
});
bookStage.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.id) return;
  const now = performance.now(), dt = Math.max(.008, (now - drag.lastTime) / 1000);
  const sensitivity = 200 / volume.offsetWidth;
  pose.y = drag.pose.y + (e.clientX - drag.startX) * sensitivity;
  pose.x = clampPitch(drag.pose.x - (e.clientY - drag.startY) * sensitivity * .6);
  velocity.y = Math.max(-240, Math.min(240, (e.clientX - drag.lastX) * sensitivity / dt));
  velocity.x = Math.max(-120, Math.min(120, -(e.clientY - drag.lastY) * sensitivity * .6 / dt));
  drag.lastX = e.clientX; drag.lastY = e.clientY; drag.lastTime = now;
  requestBookFrame();
});
bookStage.addEventListener('pointerup', e => { if (e.pointerId === drag?.id) endDrag(); });
bookStage.addEventListener('pointercancel', () => endDrag(true));
bookStage.addEventListener('lostpointercapture', () => endDrag(true));
bookStage.addEventListener('keydown', e => {
  bookStage.classList.remove('is-pointer-focused');
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'Escape'].includes(e.key)) return;
  e.preventDefault();
  endDrag(true);
  if (e.key === 'Home' || e.key === 'Escape') { moveBook(homePose()); return; }
  holdPose();
  if (e.key === 'ArrowLeft') pose.y -= 15;
  if (e.key === 'ArrowRight') pose.y += 15;
  if (e.key === 'ArrowUp') pose.x = clampPitch(pose.x + 10);
  if (e.key === 'ArrowDown') pose.x = clampPitch(pose.x - 10);
  requestBookFrame();
});
reducedMotion.addEventListener('change', () => { holdPose(); requestBookFrame(); });
document.addEventListener('visibilitychange', () => {
  endDrag(true); lastFrame = 0;
  if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
  else requestBookFrame();
});
window.addEventListener('blur', () => endDrag(true));
route();
