

if ( false ) {

  const array = ['mega-punch', 'pay-day', 'thunder-punch', 'slam', 'double-kick', 'mega-kick', 'headbutt', 'body-slam', 'take-down', 'double-edge', 'tail-whip', 'growl', 'surf', 'submission', 'counter', 'seismic-toss', 'strength', 'thunder-shock', 'thunderbolt', 'thunder-wave', 'thunder', 'dig', 'toxic', 'agility', 'quick-attack', 'rage', 'mimic', 'double-team', 'defense-curl', 'light-screen', 'reflect', 'bide', 'swift', 'skull-bash', 'flash', 'rest', 'substitute', 'thief', 'snore', 'curse', 'reversal', 'protect', 'sweet-kiss', 'mud-slap', 'zap-cannon', 'detect', 'endure', 'charm', 'rollout', 'swagger', 'spark', 'attract', 'sleep-talk', 'return', 'frustration', 'dynamic-punch', 'encore', 'iron-tail', 'hidden-power', 'rain-dance', 'rock-smash', 'uproar', 'facade', 'focus-punch', 'helping-hand', 'brick-break', 'knock-off', 'secret-power', 'fake-tears', 'signal-beam', 'covet', 'volt-tackle', 'calm-mind', 'shock-wave', 'natural-gift', 'feint', 'fling', 'magnet-rise', 'nasty-plot', 'discharge', 'captivate', 'grass-knot', 'charge-beam', 'electro-ball', 'round', 'echoed-voice', 'volt-switch', 'electroweb', 'wild-charge', 'disarming-voice', 'draining-kiss', 'play-rough', 'play-nice', 'confide', 'eerie-impulse', 'electric-terrain', 'nuzzle', 'laser-focus', 'rising-voltage', 'tera-blast', 'trailblaze']

  const collator = new Intl.Collator("ja");
  array.sort(collator.compare);

  for ( const item of array ) {
    console.log("'" + item + "',")
  }
}


if ( false ) {

  /*
  for ( const move of moveMaster ) {

    const moveRecord = {
      id: 0,
      nameEN: '',
      nameJA: '',
      contact: false;
      charge: false;
      recharge: false;
      protect: false;
      reflectable: false;
      snatch: false;
      mirror: false;
      punch: false;
      sound: false;
      gravity: false;
      defrost: false;
      distance: false;
      heal: false;
      authentic: false;
      powder: false;
      bite: false;
      pulse: false;
      ballistics: false;
      mental: false;
      nonSkyBattle: false;
      dance: false;
    }

    moveRecord.id = move.id;
    moveRecord.nameEN = move.nameEN;
    moveRecord.nameJA = move.nameJA;

    for ( const flag of moveFlag ) {
      if ( move.id === flag.moveID ) {
        if ( flag.moveFlagID === 1 ) moveRecord.contact = true;
        if ( flag.moveFlagID === 2 ) moveRecord.charge = true;
        if ( flag.moveFlagID === 3 ) moveRecord.recharge = true;
        if ( flag.moveFlagID === 4 ) moveRecord.protect = true;
        if ( flag.moveFlagID === 5 ) moveRecord.reflectable = true;
        if ( flag.moveFlagID === 6 ) moveRecord.snatch = true;
        if ( flag.moveFlagID === 7 ) moveRecord.mirror = true;
        if ( flag.moveFlagID === 8 ) moveRecord.punch = true;
        if ( flag.moveFlagID === 9 ) moveRecord.sound = true;
        if ( flag.moveFlagID === 10 ) moveRecord.gravity = true;
        if ( flag.moveFlagID === 11 ) moveRecord.defrost = true;
        if ( flag.moveFlagID === 12 ) moveRecord.distance = true;
        if ( flag.moveFlagID === 13 ) moveRecord.heal = true;
        if ( flag.moveFlagID === 14 ) moveRecord.authentic = true;
        if ( flag.moveFlagID === 15 ) moveRecord.powder = true;
        if ( flag.moveFlagID === 16 ) moveRecord.bite = true;
        if ( flag.moveFlagID === 17 ) moveRecord.pulse = true;
        if ( flag.moveFlagID === 18 ) moveRecord.ballistics = true;
        if ( flag.moveFlagID === 19 ) moveRecord.mental = true;
        if ( flag.moveFlagID === 20 ) moveRecord.nonSkyBattle = true;
        if ( flag.moveFlagID === 21 ) moveRecord.dance = true;
      }
    }

    console.log(moveRecord)
  }
  */
}




