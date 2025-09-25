// script.js
// - Coba autoplay background music (browser mungkin blokir sampai ada interaksi)
// - Tombol Play/Pause dan Mute/Unmute
// - Countdown ke 2025-09-28 08:00 WIB (Asia/Jakarta)

(function(){
  // ---------- MUSIC ----------
  const audio = document.getElementById('bg-music');
  const playBtn = document.getElementById('musicToggle');
  const muteBtn = document.getElementById('musicMute');
  const statusEl = document.getElementById('musicStatus');

  if(audio){
    audio.volume = 0.5;
    audio.preload = 'auto';

    // Coba autoplay
    audio.play().then(()=> {
      if(playBtn) { playBtn.textContent = '⏸'; playBtn.setAttribute('aria-pressed','true'); }
      if(statusEl) statusEl.textContent = 'Musik diputar';
    }).catch(()=> {
      if(playBtn) { playBtn.textContent = '⏵︎'; playBtn.setAttribute('aria-pressed','false'); }
      if(statusEl) statusEl.textContent = 'Klik play untuk memutar musik';
    });

    if(playBtn){
      playBtn.addEventListener('click', function(){
        if(audio.paused){
          audio.play().then(()=> {
            playBtn.textContent = '⏸';
            playBtn.setAttribute('aria-pressed','true');
            if(statusEl) statusEl.textContent = 'Musik diputar';
          }).catch(()=> {
            if(statusEl) statusEl.textContent = 'Gagal memutar otomatis';
          });
        } else {
          audio.pause();
          playBtn.textContent = '⏵︎';
          playBtn.setAttribute('aria-pressed','false');
          if(statusEl) statusEl.textContent = 'Musik dijeda';
        }
      });
    }

    if(muteBtn){
      muteBtn.addEventListener('click', function(){
        audio.muted = !audio.muted;
        muteBtn.textContent = audio.muted ? '🔇' : '🔈';
        if(statusEl) statusEl.textContent = audio.muted ? 'Suara dimute' : (audio.paused ? 'Musik dijeda' : 'Musik diputar');
      });
    }

    audio.addEventListener('play', ()=> { if(playBtn) playBtn.textContent='⏸'; if(statusEl) statusEl.textContent='Musik diputar'; });
    audio.addEventListener('pause', ()=> { if(playBtn) playBtn.textContent='⏵︎'; if(statusEl) statusEl.textContent='Musik dijeda'; });
  }

  // ---------- COUNTDOWN ----------
  const elDays = document.getElementById('cd-days');
  if(elDays){
    function nowJakarta(){ return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })); }

    const target = new Date('2025-09-28T08:00:00+07:00');

    const now = nowJakarta();
    const startOfTodayStr = new Intl.DateTimeFormat('sv', { timeZone:'Asia/Jakarta', year:'numeric', month:'2-digit', day:'2-digit' }).format(now);
    const startOfToday = new Date(startOfTodayStr + 'T00:00:00+07:00');

    const totalMs = Math.max(0, target - startOfToday);
    const elTotalHours = document.getElementById('cd-total-hours');
    if(elTotalHours) elTotalHours.textContent = (totalMs / 3600000).toFixed(2);

    function pad(n){ return String(n).padStart(2,'0'); }
    function msToDhms(ms){
      ms = Math.max(0, Math.floor(ms));
      const s = Math.floor(ms/1000);
      const days = Math.floor(s / 86400);
      const hours = Math.floor((s % 86400) / 3600);
      const minutes = Math.floor((s % 3600) / 60);
      const seconds = s % 60;
      return { days, hours, minutes, seconds, totalSeconds: s };
    }

    function updateCountdown(){
      const now = nowJakarta();
      const remainingMs = Math.max(0, target - now);
      const dhms = msToDhms(remainingMs);

      document.getElementById('cd-days').textContent = dhms.days;
      document.getElementById('cd-hours').textContent = pad(dhms.hours);
      document.getElementById('cd-minutes').textContent = pad(dhms.minutes);
      document.getElementById('cd-seconds').textContent = pad(dhms.seconds);

      const elHrsDec = document.getElementById('cd-hrs-dec');
      if(elHrsDec) elHrsDec.textContent = (remainingMs / 3600000).toFixed(2);

      const elapsedMs = Math.max(0, Math.min(totalMs, now - startOfToday));
      const pct = totalMs > 0 ? Math.round((elapsedMs / totalMs) * 100) : 100;
      const elPercent = document.getElementById('cd-percent');
      const elProgress = document.getElementById('cd-progress');
      if(elPercent) elPercent.textContent = pct + '%';
      if(elProgress) { elProgress.style.width = pct + '%'; elProgress.setAttribute('aria-valuenow', pct); }

      if(now >= target){
        document.getElementById('cd-days').textContent='0';
        document.getElementById('cd-hours').textContent='00';
        document.getElementById('cd-minutes').textContent='00';
        document.getElementById('cd-seconds').textContent='00';
        if(elHrsDec) elHrsDec.textContent='0.00';
        if(elPercent) elPercent.textContent='100%';
        if(elProgress) { elProgress.style.width='100%'; elProgress.style.background='linear-gradient(90deg,#16a34a,#059669)'; }
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 250);
  }
})();
