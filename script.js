// script.js
//  - coba autoplay background music (bisa diblokir browser sampai interaksi)
//  - play/pause + mute/unmute
//  - countdown ke 2025-09-28 08:00 WIB (Asia/Jakarta)

(function(){
  // ---------- MUSIC ----------
  const audio = document.getElementById('bg-music'); // may exist on both pages
  const playBtn = document.getElementById('musicToggle'); // exists on mail.html
  const muteBtn = document.getElementById('musicMute');   // EXISTS? optional (we used id musicMute earlier)
  const statusEl = document.getElementById('musicStatus');

  if(audio){
    audio.volume = 0.5;
    audio.preload = 'auto';

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

    audio.addEventListener('play', function(){ if(playBtn) { playBtn.textContent='⏸'; playBtn.setAttribute('aria-pressed','true'); } if(statusEl) statusEl.textContent='Musik diputar'; });
    audio.addEventListener('pause', function(){ if(playBtn) { playBtn.textContent='⏵︎'; playBtn.setAttribute('aria-pressed','false'); } if(statusEl) statusEl.textContent='Musik dijeda'; });
  }

  // ---------- COUNTDOWN ----------
  // all countdown DOM elements may not exist on landing page, so check
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-minutes');
  const elSecs = document.getElementById('cd-seconds');
  const elPercent = document.getElementById('cd-percent');
  const elProgress = document.getElementById('cd-progress');
  const elTotalHours = document.getElementById('cd-total-hours');
  const elHrsDec = document.getElementById('cd-hrs-dec');

  if(elDays || elHours || elMins || elSecs){
    // Helper: current time in Jakarta
    function nowJakarta(){ return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })); }

    // target date/time (WIB)
    const target = new Date('2025-09-28T08:00:00+07:00');

    // start of today in Jakarta (00:00)
    const now = nowJakarta();
    const startOfTodayStr = new Intl.DateTimeFormat('sv', { timeZone: 'Asia/Jakarta', year:'numeric', month:'2-digit', day:'2-digit' }).format(now);
    const startOfToday = new Date(startOfTodayStr + 'T00:00:00+07:00');

    const totalMs = Math.max(0, target - startOfToday);
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

    function update(){
      const now = nowJakarta();
      const remainingMs = Math.max(0, target - now);
      const dhms = msToDhms(remainingMs);

      if(elDays) elDays.textContent = dhms.days;
      if(elHours) elHours.textContent = pad(dhms.hours);
      if(elMins) elMins.textContent = pad(dhms.minutes);
      if(elSecs) elSecs.textContent = pad(dhms.seconds);
      if(elHrsDec) elHrsDec.textContent = (remainingMs / 3600000).toFixed(2);

      const elapsedMs = Math.max(0, Math.min(totalMs, now - startOfToday));
      const pct = totalMs > 0 ? Math.round((elapsedMs / totalMs) * 100) : 100;
      if(elPercent) elPercent.textContent = pct + '%';
      if(elProgress) { elProgress.style.width = pct + '%'; elProgress.setAttribute('aria-valuenow', pct); }

      if(now >= target){
        if(elDays) elDays.textContent='0';
        if(elHours) elHours.textContent='00';
        if(elMins) elMins.textContent='00';
        if(elSecs) elSecs.textContent='00';
        if(elHrsDec) elHrsDec.textContent='0.00';
        if(elPercent) elPercent.textContent='100%';
        if(elProgress) { elProgress.style.width='100%'; elProgress.style.background = 'linear-gradient(90deg,#16a34a,#059669)'; }
      }
    }

    update();
    const timer = setInterval(update, 250);
    window.addEventListener('beforeunload', ()=> clearInterval(timer));
  }

})();
