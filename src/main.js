/* ============================================================
   Imaan & Aziz — envelope sequence + countdown
   ============================================================ */

/* ---------- config ---------- */

// The wedding, in SAST (+02:00).
const WEDDING = '2026-12-19T18:30:00+02:00';

// Animation beats, in milliseconds from the tap.
// These must stay in step with the transition durations in style.css.
const LAYER_SWAP = 500;   // flap has swung back — drop it behind the note
const HANDOVER   = 2500;  // note hands over to the details page


/* ---------- elements ---------- */

const body     = document.body;
const envelope = document.getElementById('envelope');
const flap     = document.getElementById('flap');
const card     = document.getElementById('card');
const details  = document.getElementById('details');
const replay   = document.getElementById('replay');

// Every setTimeout gets stored so Replay can cancel them mid-sequence.
let timers = [];


/* ---------- the opening sequence ---------- */

function openEnvelope() {
  // Guard against a second tap re-triggering everything.
  if (body.classList.contains('is-open')) return;

  // Everything the CSS needs for the flap, seal, crest and intro
  // hangs off this one class.
  body.classList.add('is-open');

  // The flap rotates past 90 degrees, so it ends up behind the envelope.
  // Once it's back there, the rising note has to pass in front of it.
  // z-index can't be transitioned, so it's swapped at the right moment.
  timers.push(setTimeout(() => {
    flap.classList.add('flap-lowered');
    card.classList.add('card-lifted');
  }, LAYER_SWAP));

  // The note fades out as the full details page fades in — the two
  // overlap, so it reads as one continuous move rather than a cut.
  timers.push(setTimeout(() => {
    card.classList.add('card-out');
    body.classList.add('show-details', 'is-gone');
  }, HANDOVER));
}


/* ---------- reset (development only) ---------- */

function reset() {
  timers.forEach(clearTimeout);
  timers = [];

  body.classList.remove('is-open', 'show-details', 'is-gone');
  flap.classList.remove('flap-lowered');
  card.classList.remove('card-lifted', 'card-out');
  details.scrollTop = 0;
}


/* ---------- countdown ---------- */

const target = new Date(WEDDING).getTime();

const out = {
  d: document.getElementById('d'),
  h: document.getElementById('h'),
  m: document.getElementById('m'),
  s: document.getElementById('s')
};

const pad = n => String(n).padStart(2, '0');

function tick() {
  // Never go negative — after the wedding it simply sits at zero.
  let left = Math.max(0, target - Date.now());

  const DAY = 86400000, HOUR = 3600000, MINUTE = 60000;

  const days = Math.floor(left / DAY);        left -= days * DAY;
  const hours = Math.floor(left / HOUR);      left -= hours * HOUR;
  const minutes = Math.floor(left / MINUTE);  left -= minutes * MINUTE;
  const seconds = Math.floor(left / 1000);

  out.d.textContent = days;
  out.h.textContent = pad(hours);
  out.m.textContent = pad(minutes);
  out.s.textContent = pad(seconds);
}


/* ---------- wiring ---------- */

envelope.addEventListener('click', openEnvelope);
replay.addEventListener('click', reset);

tick();
setInterval(tick, 1000);