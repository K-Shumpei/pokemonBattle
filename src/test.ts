

if ( true ) {

  const array = ['mega-punch', 'pay-day', 'thunder-punch', 'slam', 'double-kick', 'mega-kick', 'headbutt', 'body-slam', 'take-down', 'double-edge', 'tail-whip', 'growl', 'surf', 'submission', 'counter', 'seismic-toss', 'strength', 'thunder-shock', 'thunderbolt', 'thunder-wave', 'thunder', 'dig', 'toxic', 'agility', 'quick-attack', 'rage', 'mimic', 'double-team', 'defense-curl', 'light-screen', 'reflect', 'bide', 'swift', 'skull-bash', 'flash', 'rest', 'substitute', 'thief', 'snore', 'curse', 'reversal', 'protect', 'sweet-kiss', 'mud-slap', 'zap-cannon', 'detect', 'endure', 'charm', 'rollout', 'swagger', 'spark', 'attract', 'sleep-talk', 'return', 'frustration', 'dynamic-punch', 'encore', 'iron-tail', 'hidden-power', 'rain-dance', 'rock-smash', 'uproar', 'facade', 'focus-punch', 'helping-hand', 'brick-break', 'knock-off', 'secret-power', 'fake-tears', 'signal-beam', 'covet', 'volt-tackle', 'calm-mind', 'shock-wave', 'natural-gift', 'feint', 'fling', 'magnet-rise', 'nasty-plot', 'discharge', 'captivate', 'grass-knot', 'charge-beam', 'electro-ball', 'round', 'echoed-voice', 'volt-switch', 'electroweb', 'wild-charge', 'disarming-voice', 'draining-kiss', 'play-rough', 'play-nice', 'confide', 'eerie-impulse', 'electric-terrain', 'nuzzle', 'laser-focus', 'rising-voltage', 'tera-blast', 'trailblaze']

  const collator = new Intl.Collator("ja");
  array.sort(collator.compare);

  for ( const item of array ) {
    console.log("'" + item + "',")
  }
}


