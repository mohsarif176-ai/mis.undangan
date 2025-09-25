// script.js
// Halaman landing sederhana: menambahkan sedikit aksesibilitas keyboard
document.addEventListener('DOMContentLoaded', function(){
  // keyboard: tekan Enter/Space saat fokus pada tombol link -> navigasi
  const enterBtn = document.querySelector('.enter-btn');
  if(!enterBtn) return;

  enterBtn.setAttribute('role','button');
  enterBtn.setAttribute('tabindex','0');

  enterBtn.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
      // default link click behavior
      enterBtn.click();
      e.preventDefault();
    }
  });
});
