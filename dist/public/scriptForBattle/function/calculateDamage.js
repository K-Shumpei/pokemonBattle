"use strict";
function calculateDamage(pokemon, target) {
    /*
    // ダメージ固定技の時
      if ( fixedDamage.includes(poke.myMove.name) ) {
        tgt.damage    = isDamageByFixedDamageMove(poke, tgt)
        tgt.effective = 1     // タイプ相性
        tgt.critical  = false // 急所
        return
    }
    */
    // 最終威力
    const power = getPower(pokemon, target);
    // 急所判定
    // getCritical(poke, tgt)
    // 攻撃と防御の実数値取得　
    // const param = getStatus(poke, tgt)
    // 最終攻撃
    //const attack = getAttack(poke, tgt, param.atk)
    // 最終防御
    //const defense = defenseCalculation(poke, tgt, param.def)
    // 最終ダメージ
    getDamage(pokemon, target, power);
}
function getPower(pokemon, target) {
    // 威力 = 基礎威力 * 威力補正 / 4096
    const move = pokemon.moveUsed;
    // 基礎威力
    let basicPower = move.power;
    if (move.name === 'きしかいせい' || move.name === 'じたばた') {
        const parameter = pokemon.status.remainingHP / pokemon.actualValue.hitPoint;
        if (parameter >= 0)
            basicPower = 200;
        if (parameter >= 2 / 48)
            basicPower = 150;
        if (parameter >= 5 / 48)
            basicPower = 100;
        if (parameter >= 10 / 48)
            basicPower = 80;
        if (parameter >= 17 / 48)
            basicPower = 40;
        if (parameter >= 33 / 48)
            basicPower = 20;
    }
    if (move.name === 'しおふき' || move.name === 'ふんか' || move.name === 'ドラゴンエナジー') {
        const base = Math.floor(150 * pokemon.status.remainingHP / pokemon.actualValue.hitPoint);
        basicPower = Math.max(base, 1);
    }
    if (move.name === 'しぼりとる' || move.name === 'にぎりつぶす') {
        const base = Math.floor(150 * target.status.remainingHP / target.actualValue.hitPoint);
        basicPower = Math.max(base, 1);
    }
    if (move.name === 'アシストパワー' || move.name === 'つけあがる') {
        let count = 0;
        for (const parameter of Object.keys(pokemon.rank)) {
            count += Math.max(pokemon.rank[parameter], 0);
        }
        basicPower = 20 * (count + 1);
    }
    if (move.name === 'おしおき') {
        let count = 0;
        for (const parameter of Object.keys(target.rank)) {
            count += Math.max(target.rank[parameter], 0);
        }
        const base = 20 * (count + 3);
        basicPower = Math.min(base, 200);
    }
    if (move.name === 'エレキボール') {
        const mySpeed = getSpeedValue(pokemon, 'c');
        const opponentSpeed = getSpeedValue(target, 'c');
        if (opponentSpeed === 0) {
            basicPower = 40;
        }
        const parameter = mySpeed / opponentSpeed;
        if (parameter >= 0)
            basicPower = 40;
        if (parameter >= 1)
            basicPower = 60;
        if (parameter >= 2)
            basicPower = 80;
        if (parameter >= 3)
            basicPower = 120;
        if (parameter >= 4)
            basicPower = 150;
    }
    if (move.name === 'ジャイロボール') {
        const mySpeed = getSpeedValue(pokemon, 'c');
        const opponentSpeed = getSpeedValue(target, 'c');
        if (mySpeed === 0) {
            basicPower = 1;
        }
        basicPower = Math.floor(25 * opponentSpeed / mySpeed) + 1;
    }
    if (move.name === 'おんがえし') {
        const base = Math.floor(pokemon.status.happiness * 10 / 25);
        basicPower = Math.max(base, 1);
    }
    if (move.name === 'やつあたり') {
        const base = Math.floor((255 - pokemon.status.happiness) * 10 / 25);
        basicPower = Math.max(base, 1);
    }
    if (move.name === 'きりふだ') {
        const parameter = pokemon.moveUsed.remainingPP;
        if (parameter === 0)
            basicPower = 200;
        if (parameter === 1)
            basicPower = 80;
        if (parameter === 2)
            basicPower = 60;
        if (parameter === 3)
            basicPower = 50;
        if (parameter >= 4)
            basicPower = 40;
    }
    if (move.name === 'くさむすび' || move.name === 'けたぐり') {
        const parameter = target.status.weight;
        if (parameter >= 0)
            basicPower = 20;
        if (parameter >= 10)
            basicPower = 40;
        if (parameter >= 25)
            basicPower = 60;
        if (parameter >= 50)
            basicPower = 80;
        if (parameter >= 100)
            basicPower = 100;
        if (parameter >= 120)
            basicPower = 120;
    }
    if (move.name === 'ヒートスタンプ' || move.name === 'ヘビーボンバー') {
        const parameter = target.status.weight / pokemon.status.weight;
        basicPower = 40;
        if (parameter <= 1 / 2)
            basicPower = 60;
        if (parameter <= 1 / 3)
            basicPower = 80;
        if (parameter <= 1 / 4)
            basicPower = 100;
        if (parameter <= 1 / 5)
            basicPower = 120;
    }
    if (move.name === 'きつけ') {
        if (target.status.statusAilment === 'まひ') {
            basicPower = 140;
        }
    }
    if (move.name === 'めざましビンタ') {
        if (target.status.statusAilment === 'ねむり') {
            basicPower = 140;
        }
    }
    if (move.name === 'たたりめ') {
        if (target.status.statusAilment !== null) {
            basicPower = 130;
        }
    }
    if (move.name === 'ウェザーボール') {
        if (isWeather(pokemon, 'にほんばれ'))
            basicPower = 100;
        if (isWeather(pokemon, 'あめ'))
            basicPower = 100;
        if (isWeather(pokemon, 'すなあらし'))
            basicPower = 100;
        if (isWeather(pokemon, 'あられ'))
            basicPower = 100;
    }
    if (move.name === 'だいちのはどう') {
        if (isGrounded(pokemon) === true) {
            if (fieldStatus.terrain.name === 'エレキフィールド')
                basicPower = 100;
            if (fieldStatus.terrain.name === 'グラスフィールド')
                basicPower = 100;
            if (fieldStatus.terrain.name === 'サイコフィールド')
                basicPower = 100;
            if (fieldStatus.terrain.name === 'ミストフィールド')
                basicPower = 100;
        }
    }
    if (move.name === 'ライジングボルト') {
        if (isGrounded(target) === true && fieldStatus.terrain.name === 'エレキフィールド') {
            basicPower = 140;
        }
    }
    if (move.name === 'かぜおこし' || move.name === 'たつまき') {
        ;
    }
    if (move.name === 'アクロバット') {
        if (pokemon.status.item === '') {
            basicPower = 110;
        }
    }
    if (move.name === 'しぜんのめぐみ') {
        ;
    }
    if (move.name === 'なげつける') {
        ;
    }
    if (move.name === 'アイスボール' || move.name === 'ころがる') {
        ;
    }
    if (move.name === 'エコーボイス') {
        ;
    }
    if (move.name === 'じだんだ') {
        ;
    }
    if (move.name === 'トリプルキック') {
        ;
    }
    if (move.name === 'トリプルアクセル') {
        ;
    }
    if (move.name === 'はきだす') {
        ;
    }
    if (move.name === 'りんしょう') {
    }
    if (move.name === 'れんぞくぎり') {
        ;
    }
    if (move.name === 'くさのちかい' || move.name === 'ほのおのちかい' || move.name === 'みずのちかい') {
        ;
    }
    if (move.name === 'エラがみ' || move.name === 'でんげきくちばし') {
        ;
    }
    if (move.name === 'おいうち') {
        ;
    }
    if (move.name === 'しっぺがえし') {
        ;
    }
    if (move.name === 'ダメおし') {
        ;
    }
    if (move.name === 'ゆきなだれ' || move.name === 'リベンジ') {
        ;
    }
    if (move.name === 'プレゼント') {
        const random = getRandom();
        if (random >= 0.0)
            basicPower = 40;
        if (random >= 0.4)
            basicPower = 80;
        if (random >= 0.7)
            basicPower = 120;
        if (random >= 0.8)
            basicPower = 0;
    }
    if (move.name === 'マグニチュード') {
        ;
    }
    if (move.name === 'みずしゅりけん') {
        ;
    }
    // 威力補正
    let correction = 4096;
    return basicPower;
}
function getDamage(pokemon, target, power) {
    target.damage.damage = power;
}
