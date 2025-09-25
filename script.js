/* script.js
   - countdown menuju 2025-09-28 08:00 WIB (Asia/Jakarta)
   - pengaturan musik (autoplay jika diizinkan, tombol play/pause + mute)
*/

(function(){
  // Helper: current time in Asia/Jakarta as Date object
  function nowJakarta(){
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  }

  // Start of today (Jakarta) 00:00
  const now = nowJakarta();
  const startOfTodayStr = new Intl.DateTimeFormat('sv', { timeZone: 'Asia/Jakarta', year:'numeric', month:'2-digit', day:'2-digit' }).format(now);
  const startOfToday = new Date(startOfTodayStr + 'T00:00:00+07:00');

  // Target: 28 Sep 2025 08:00 WIB
  const target = new Date('2025-09-28T08:00:00+07:00');

  // Elements
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-minutes');
  const elSecs = document.getElementById('cd-seconds');
  const elPercent = document.getElementById('cd-percent');
  const elProgress = document.getElementById('cd-progress');
  const elTotalHours = document.getElementById('cd-total-hours');
  const elHrsDec = document.getElementById('cd-hrs-dec');

  // total ms from startOfToday to target (dipakai untuk progress)
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

  function updateCountdown(){
    const now = nowJakarta();
    const remainingMs = Math.max(0, target - now);
    const dhms = msToDhms(remainingMs);

    if(elDays) elDays.textContent = dhms.days;
    if(elHours) elHours.textContent = pad(dhms.hours);
    if(elMins) elMins.textContent = pad(dhms.minutes);
    if(elSecs) elSecs.textContent = pad(dhms.seconds);

    if(elHrsDec) elHrsDec.textContent = (remainingMs / 3600000).toFixed(2);

    // progress: elapsed from startOfToday to now relative to totalMs
    const elapsedMs = Math.max(0, Math.min(totalMs, now - startOfToday));
    const pct = totalMs > 0 ? Math.round((elapsedMs / totalMs) * 100) : 100;
    if(elPercent) elPercent.textContent = pct + '%';
    if(elProgress) { elProgress.style.width = pct + '%'; elProgress.setAttribute('aria-valuenow', pct); }

    if(now >= target){
      if(elDays) elDays.textContent = '0';
      if(elHours) elHours.textContent = '00';
      if(elMins) elMins.textContent = '00';
      if(elSecs) elSecs.textContent = '00';
      if(elHrsDec) elHrsDec.textContent = '0.00';
      if(elPercent) elPercent.textContent = '100%';
      if(elProgress) { elProgress.style.width = '100%'; elProgress.style.background = 'linear-gradient(90deg,#16a34a,#059669)'; }
    }
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 250);
  window.addEventListener('beforeunload', ()=> clearInterval(timer));
})();

/* Musik: play/pause, mute/unmute */
(function(){
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('musicToggle');
  const muteBtn = document.getElementById('musicMute');
  const status = document.getElementById('musicStatus');

  if(!audio || !btn || !muteBtn) return;

  audio.volume = 0.5;
  audio.preload = 'auto';

  // coba autoplay (akan gagal di beberapa browser sampai interaksi)
  audio.play().then(()=> {
    btn.textContent = '⏸';
    btn.setAttribute('aria-pressed','true');
    status.textContent = 'Musik diputar';
  }).catch(()=> {
    btn.textContent = '⏵︎';
    btn.setAttribute('aria-pressed','false');
    status.textContent = 'Klik play untuk memutar musik';
  });

  btn.addEventListener('click', ()=>{
    if(audio.paused){
      audio.play().then(()=> {
        btn.textContent = '⏸';
        btn.setAttribute('aria-pressed','true');
        status.textContent = 'Musik diputar';
      }).catch(()=> { status.textContent = 'Tidak dapat memutar otomatis'; });
    } else {
      audio.pause();
      btn.textContent = '⏵︎';
      btn.setAttribute('aria-pressed','false');
      status.textContent = 'Musik dijeda';
    }
  });

  muteBtn.addEventListener('click', ()=>{
    audio.muted = !audio.muted;
    if(audio.muted){
      muteBtn.textContent = '🔇';
      muteBtn.setAttribute('aria-pressed','true');
      status.textContent = 'Suara dimute';
    } else {
      muteBtn.textContent = '🔈';
      muteBtn.setAttribute('aria-pressed','false');
      status.textContent = audio.paused ? 'Musik dijeda' : 'Musik diputar';
    }
  });

  audio.addEventListener('play', ()=> {
    btn.textContent = '⏸';
    btn.setAttribute('aria-pressed','true');
    status.textContent = 'Musik diputar';
  });
  audio.addEventListener('pause', ()=> {
    btn.textContent = '⏵︎';
    btn.setAttribute('aria-pressed','false');
    status.textContent = 'Musik dijeda';
  });

  // keyboard accessibility
  btn.addEventListener('keyup', (e)=> { if(e.key === 'Enter' || e.key === ' ') btn.click(); });
  muteBtn.addEventListener('keyup', (e)=> { if(e.key === 'Enter' || e.key === ' ') muteBtn.click(); });
})();
