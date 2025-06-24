document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('info-list');
  const add = (label, value) => {
    const li = document.createElement('li');
    li.textContent = `${label}: ${value}`;
    list.appendChild(li);
  };

  add('User Agent', navigator.userAgent);
  add('Platform', navigator.platform || 'N/A');
  add('Browser Language', navigator.language);
  add('Languages', navigator.languages ? navigator.languages.join(', ') : 'N/A');
  add('Cookies Enabled', navigator.cookieEnabled);
  add('Do Not Track', navigator.doNotTrack || 'N/A');
  add('Hardware Threads', navigator.hardwareConcurrency || 'N/A');
  add('Device Memory', navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'N/A');
  add('Screen Resolution', `${screen.width}x${screen.height}`);
  add('Color Depth', screen.colorDepth);
  add('Pixel Ratio', window.devicePixelRatio);
  add('Window Size', `${window.innerWidth}x${window.innerHeight}`);
  add('Orientation', screen.orientation ? screen.orientation.type : 'N/A');
  add('Time Zone', Intl.DateTimeFormat().resolvedOptions().timeZone);
  add('Local Time', new Date().toString());
  add('Referrer', document.referrer || 'N/A');
  add('URL', location.href);
  add('Geolocation Supported', navigator.geolocation ? 'Yes' : 'No');

  try {
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => add('IP Address', d.ip))
      .catch(() => add('IP Address', 'Unavailable'));
  } catch (e) {
    add('IP Address', 'Unavailable');
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  add('Device Type', isMobile ? 'Mobile' : 'Desktop');
});
