if (location.protocol === 'http:' && location.hostname !== 'localhost') {
  location.replace('https://' + location.hostname + location.pathname + location.search + location.hash);
}
