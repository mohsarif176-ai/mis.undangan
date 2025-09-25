// script.js
// - Autoplay musik (jika browser izinkan) + play/pause + mute
// - Countdown menuju 2025-09-28 08:00 WIB (Asia/Jakarta)

(function(){
  // ---------------- MUSIC
  const audio = document.getElementById('bg-music');
  // tombol mungkin hanya ada di mail.html
  const playBtn = document.getElementById('musicToggle');
  const muteBtn = document.getElementById('musicMute');
  const statusEl = document.getElementById('musicStatus');

  if(audio){
    audio.volume = 0.5;
    audio.preload = 'auto';

    // coba autoplay
    audio.play().then(() => {
      if(playBtn) playBtn.textContent = '⏸';
      if(statusEl) statusEl.textContent = 'Musik diputar';
    }).catch(() => {
      if(playBtn) playBtn.textContent = '⏵︎';
      if(statusEl) statusEl.textContent = 'Klik play untuk memutar musik';
    });

    // event jika tombol ada
    if(playBtn){
      playBtn.addEventListener('click', () => {
        if(audio.paused){
          audio.play().then(()=> { playBtn.textContent='⏸'; if(statusEl) statusEl.textContent='Musik diputar'; }).catch(()=> { if(statusEl) statusEl.textContent='Gagal memutar'; });
        } else {
          audio.pause();
          playBtn.textContent='⏵︎';
          if(statusEl) statusEl.textContent='Musik dijeda';
        }
      });
    }

    if(muteBtn){
      muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        if(audio.muted){
          muteBtn.textContent = '🔇';
          if(statusEl) statusEl.textContent = 'Suara dimute';
        } else {
          muteBtn.textContent = '🔈';
          if(statusEl) statusEl.textContent = audio.paused ? 'Musik dijeda' : 'Musik diputar';
        }
      });
    }

    audio.addEventListener('play', ()=> { if(playBtn) playBtn.textContent='⏸'; if(statusEl) statusEl.textContent='Musik diputar'; });
    audio.addEventListener('pause', ()=> { if(playBtn) playBtn.textContent='⏵︎'; if(statusEl) statusEl.textContent='Musik dijeda'; });
  }

  // ---------------- COUNTDOWN (hanya jika elemen ada)
  function nowJakarta(){
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  }

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const cdPercent = document.getElementById('cd-percent');
  const cdProgress = document.getElementById('cd-progress');
  const cdTotalHours = document.getElementById('cd-total-hours');
  const cdHrsDec = document.getElementById('cd-hrs-dec');

  // target: 28 Sep 2025 08:00 WIB (UTC+7)
  const target = new Date('2025-09-28T08:00:00+07:00');

  // start-of-today in Jakarta (for progress baseline)
  const now0 = nowJakarta();
  const startOfTodayStr = new Intl.DateTimeFormat('sv', { timeZone: 'Asia/Jakarta', year:'numeric', month:'2-digit', day:'2-digit' }).format(now0);
  const startOfToday = new Date(startOfTodayStr + 'T00:00:00+07:00');

  const totalMs = Math.max(0, target - startOfToday);
  if(cdTotalHours) cdTotalHours.textContent = (totalMs / 3600000).toFixed(2);

  function pad(n){ return String(n).padStart(2,'0'); }
  function msToDhms(ms){
    ms = Math.max(0, Math.floor(ms));
    const s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return { days, hours, minutes, seconds, totalSeconds: s };
  }

  function updateCountdown(){
    const now = nowJakarta();
    const remainingMs = Math.max(0, target - now);
    const d = msToDhms(remainingMs);

    if(cdDays) cdDays.textContent = d.days;
    if(cdHours) cdHours.textContent = pad(d.hours);
    if(cdMinutes) cdMinutes.textContent = pad(d.minutes);
    if(cdSeconds) cdSeconds.textContent = pad(d.seconds);
    if(cdHrsDec) cdHrsDec.textContent = (remainingMs / 3600000).toFixed(2);

    const elapsed = Math.max(0, Math.min(totalMs, now - startOfToday));
    const pct = totalMs > 0 ? Math.round((elapsed / totalMs) * 100) : 100;
    if(cdPercent) cdPercent.textContent = pct + '%';
    if(cdProgress) { cdProgress.style.width = pct + '%'; cdProgress.setAttribute('aria-valuenow', pct); }

    if(now >= target){
      if(cdDays) cdDays.textContent='0';
      if(cdHours) cdHours.textContent='00';
      if(cdMinutes) cdMinutes.textContent='00';
      if(cdSeconds) cdSeconds.textContent='00';
      if(cdHrsDec) cdHrsDec.textContent='0.00';
      if(cdPercent) cdPercent.textContent='100%';
      if(cdProgress) { cdProgress.style.width='100%'; cdProgress.style.background='linear-gradient(90deg,#16a34a,#059669)'; }
    }
  }

  if(cdDays) { updateCountdown(); setInterval(updateCountdown, 250); }

})();
