"use strict";
const pokemonTextList = ['Abomasnow', 'Abra', 'Absol', 'Accelgor', 'Aegislash Shield', 'Aerodactyl', 'Aggron', 'Aipom', 'Alakazam', 'Alcremie', 'Alomomola', 'Altaria', 'Amaura', 'Ambipom', 'Amoonguss', 'Ampharos', 'Annihilape', 'Anorith', 'Appletun', 'Applin', 'Araquanid', 'Arbok', 'Arboliva', 'Arcanine', 'Arceus', 'Archen', 'Archeops', 'Arctibax', 'Arctovish', 'Arctozolt', 'Ariados', 'Armaldo', 'Armarouge', 'Aromatisse', 'Aron', 'Arrokuda', 'Articuno', 'Audino', 'Aurorus', 'Avalugg', 'Axew', 'Azelf', 'Azumarill', 'Azurill', 'Bagon', 'Baltoy', 'Banette', 'Barbaracle', 'Barboach', 'Barraskewda', 'Basculegion Male', 'Basculin Red Striped', 'Bastiodon', 'Baxcalibur', 'Bayleef', 'Beartic', 'Beautifly', 'Beedrill', 'Beheeyem', 'Beldum', 'Bellibolt', 'Bellossom', 'Bellsprout', 'Bergmite', 'Bewear', 'Bibarel', 'Bidoof', 'Binacle', 'Bisharp', 'Blacephalon', 'Blastoise', 'Blaziken', 'Blipbug', 'Blissey', 'Blitzle', 'Boldore', 'Boltund', 'Bombirdier', 'Bonsly', 'Bouffalant', 'Bounsweet', 'Braixen', 'Brambleghast', 'Bramblin', 'Braviary', 'Breloom', 'Brionne', 'Bronzong', 'Bronzor', 'Brute Bonnet', 'Bruxish', 'Budew', 'Buizel', 'Bulbasaur', 'Buneary', 'Bunnelby', 'Burmy', 'Butterfree', 'Buzzwole', 'Cacnea', 'Cacturne', 'Calyrex', 'Camerupt', 'Capsakid', 'Carbink', 'Carkol', 'Carnivine', 'Carracosta', 'Carvanha', 'Cascoon', 'Castform', 'Caterpie', 'Celebi', 'Celesteela', 'Centiskorch', 'Ceruledge', 'Cetitan', 'Cetoddle', 'Chandelure', 'Chansey', 'Charcadet', 'Charizard', 'Charjabug', 'Charmander', 'Charmeleon', 'Chatot', 'Cherrim', 'Cherubi', 'Chesnaught', 'Chespin', 'Chewtle', 'Chi Yu', 'Chien Pao', 'Chikorita', 'Chimchar', 'Chimecho', 'Chinchou', 'Chingling', 'Cinccino', 'Cinderace', 'Clamperl', 'Clauncher', 'Clawitzer', 'Claydol', 'Clefable', 'Clefairy', 'Cleffa', 'Clobbopus', 'Clodsire', 'Cloyster', 'Coalossal', 'Cobalion', 'Cofagrigus', 'Combee', 'Combusken', 'Comfey', 'Conkeldurr', 'Copperajah', 'Corphish', 'Corsola', 'Corviknight', 'Corvisquire', 'Cosmoem', 'Cosmog', 'Cottonee', 'Crabominable', 'Crabrawler', 'Cradily', 'Cramorant', 'Cranidos', 'Crawdaunt', 'Cresselia', 'Croagunk', 'Crobat', 'Crocalor', 'Croconaw', 'Crustle', 'Cryogonal', 'Cubchoo', 'Cubone', 'Cufant', 'Cursola', 'Cutiefly', 'Cyclizar', 'Cyndaquil', 'Dachsbun', 'Darkrai', 'Darmanitan Standard', 'Dartrix', 'Darumaka', 'Decidueye', 'Dedenne', 'Deerling', 'Deino', 'Delcatty', 'Delibird', 'Delphox', 'Deoxys Normal', 'Dewgong', 'Dewott', 'Dewpider', 'Dhelmise', 'Dialga', 'Diancie', 'Diggersby', 'Diglett', 'Ditto', 'Dodrio', 'Doduo', 'Dolliv', 'Dondozo', 'Donphan', 'Dottler', 'Doublade', 'Dracovish', 'Dracozolt', 'Dragalge', 'Dragapult', 'Dragonair', 'Dragonite', 'Drakloak', 'Drampa', 'Drapion', 'Dratini', 'Drednaw', 'Dreepy', 'Drifblim', 'Drifloon', 'Drilbur', 'Drizzile', 'Drowzee', 'Druddigon', 'Dubwool', 'Ducklett', 'Dudunsparce', 'Dugtrio', 'Dunsparce', 'Duosion', 'Duraludon', 'Durant', 'Dusclops', 'Dusknoir', 'Duskull', 'Dustox', 'Dwebble', 'Eelektrik', 'Eelektross', 'Eevee', 'Eiscue Ice', 'Ekans', 'Eldegoss', 'Electabuzz', 'Electivire', 'Electrike', 'Electrode', 'Elekid', 'Elgyem', 'Emboar', 'Emolga', 'Empoleon', 'Enamorus Incarnate', 'Entei', 'Escavalier', 'Espathra', 'Espeon', 'Espurr', 'Eternatus', 'Excadrill', 'Exeggcute', 'Exeggutor', 'Exploud', 'Falinks', 'Farfetchd', 'Farigiraf', 'Fearow', 'Feebas', 'Fennekin', 'Feraligatr', 'Ferroseed', 'Ferrothorn', 'Fidough', 'Finizen', 'Finneon', 'Flaaffy', 'Flabebe', 'Flamigo', 'Flapple', 'Flareon', 'Fletchinder', 'Fletchling', 'Flittle', 'Floatzel', 'Floette', 'Floragato', 'Florges', 'Flutter Mane', 'Flygon', 'Fomantis', 'Foongus', 'Forretress', 'Fraxure', 'Frigibax', 'Frillish', 'Froakie', 'Frogadier', 'Froslass', 'Frosmoth', 'Fuecoco', 'Furfrou', 'Furret', 'Gabite', 'Gallade', 'Galvantula', 'Garbodor', 'Garchomp', 'Gardevoir', 'Garganacl', 'Gastly', 'Gastrodon', 'Genesect', 'Gengar', 'Geodude', 'Gholdengo', 'Gible', 'Gigalith', 'Gimmighoul', 'Girafarig', 'Giratina Altered', 'Glaceon', 'Glalie', 'Glameow', 'Glastrier', 'Gligar', 'Glimmet', 'Glimmora', 'Gliscor', 'Gloom', 'Gogoat', 'Golbat', 'Goldeen', 'Golduck', 'Golem', 'Golett', 'Golisopod', 'Golurk', 'Goodra', 'Goomy', 'Gorebyss', 'Gossifleur', 'Gothita', 'Gothitelle', 'Gothorita', 'Gourgeist Average', 'Grafaiai', 'Granbull', 'Grapploct', 'Graveler', 'Great Tusk', 'Greavard', 'Greedent', 'Greninja', 'Grimer', 'Grimmsnarl', 'Grookey', 'Grotle', 'Groudon', 'Grovyle', 'Growlithe', 'Grubbin', 'Grumpig', 'Gulpin', 'Gumshoos', 'Gurdurr', 'Guzzlord', 'Gyarados', 'Hakamo O', 'Happiny', 'Hariyama', 'Hatenna', 'Hatterene', 'Hattrem', 'Haunter', 'Hawlucha', 'Haxorus', 'Heatmor', 'Heatran', 'Heliolisk', 'Helioptile', 'Heracross', 'Herdier', 'Hippopotas', 'Hippowdon', 'Hitmonchan', 'Hitmonlee', 'Hitmontop', 'Ho Oh', 'Honchkrow', 'Honedge', 'Hoopa', 'Hoothoot', 'Hoppip', 'Horsea', 'Houndoom', 'Houndour', 'Houndstone', 'Huntail', 'Hydreigon', 'Hypno', 'Igglybuff', 'Illumise', 'Impidimp', 'Incineroar', 'Indeedee Male', 'Infernape', 'Inkay', 'Inteleon', 'Iron Bundle', 'Iron Hands', 'Iron Jugulis', 'Iron Leaves', 'Iron Moth', 'Iron Thorns', 'Iron Treads', 'Iron Valiant', 'Ivysaur', 'Jangmo O', 'Jellicent', 'Jigglypuff', 'Jirachi', 'Jolteon', 'Joltik', 'Jumpluff', 'Jynx', 'Kabuto', 'Kabutops', 'Kadabra', 'Kakuna', 'Kangaskhan', 'Karrablast', 'Kartana', 'Kecleon', 'Keldeo Ordinary', 'Kilowattrel', 'Kingambit', 'Kingdra', 'Kingler', 'Kirlia', 'Klang', 'Klawf', 'Kleavor', 'Klefki', 'Klink', 'Klinklang', 'Koffing', 'Komala', 'Kommo O', 'Koraidon', 'Krabby', 'Kricketot', 'Kricketune', 'Krokorok', 'Krookodile', 'Kubfu', 'Kyogre', 'Kyurem', 'Lairon', 'Lampent', 'Landorus Incarnate', 'Lanturn', 'Lapras', 'Larvesta', 'Larvitar', 'Latias', 'Latios', 'Leafeon', 'Leavanny', 'Lechonk', 'Ledian', 'Ledyba', 'Lickilicky', 'Lickitung', 'Liepard', 'Lileep', 'Lilligant', 'Lillipup', 'Linoone', 'Litleo', 'Litten', 'Litwick', 'Lokix', 'Lombre', 'Lopunny', 'Lotad', 'Loudred', 'Lucario', 'Ludicolo', 'Lugia', 'Lumineon', 'Lunala', 'Lunatone', 'Lurantis', 'Luvdisc', 'Luxio', 'Luxray', 'Lycanroc Midday', 'Mabosstiff', 'Machamp', 'Machoke', 'Machop', 'Magby', 'Magcargo', 'Magearna', 'Magikarp', 'Magmar', 'Magmortar', 'Magnemite', 'Magneton', 'Magnezone', 'Makuhita', 'Malamar', 'Mamoswine', 'Manaphy', 'Mandibuzz', 'Manectric', 'Mankey', 'Mantine', 'Mantyke', 'Maractus', 'Mareanie', 'Mareep', 'Marill', 'Marowak', 'Marshadow', 'Marshtomp', 'Maschiff', 'Masquerain', 'Maushold', 'Mawile', 'Medicham', 'Meditite', 'Meganium', 'Melmetal', 'Meloetta Aria', 'Meltan', 'Meowscarada', 'Meowstic Male', 'Meowth', 'Mesprit', 'Metagross', 'Metang', 'Metapod', 'Mew', 'Mewtwo', 'Mienfoo', 'Mienshao', 'Mightyena', 'Milcery', 'Milotic', 'Miltank', 'Mime Jr', 'Mimikyu Disguised', 'Minccino', 'Minior Red Meteor', 'Minun', 'Miraidon', 'Misdreavus', 'Mismagius', 'Moltres', 'Monferno', 'Morelull', 'Morgrem', 'Morpeko Full Belly', 'Mothim', 'Mr Mime', 'Mr Rime', 'Mudbray', 'Mudkip', 'Mudsdale', 'Muk', 'Munchlax', 'Munna', 'Murkrow', 'Musharna', 'Nacli', 'Naclstack', 'Naganadel', 'Natu', 'Necrozma', 'Nickit', 'Nidoking', 'Nidoqueen', 'Nidoran F', 'Nidoran M', 'Nidorina', 'Nidorino', 'Nihilego', 'Nincada', 'Ninetales', 'Ninjask', 'Noctowl', 'Noibat', 'Noivern', 'Nosepass', 'Numel', 'Nuzleaf', 'Nymble', 'Obstagoon', 'Octillery', 'Oddish', 'Oinkologne', 'Omanyte', 'Omastar', 'Onix', 'Oranguru', 'Orbeetle', 'Oricorio Baile', 'Orthworm', 'Oshawott', 'Overqwil', 'Pachirisu', 'Palafin', 'Palkia', 'Palossand', 'Palpitoad', 'Pancham', 'Pangoro', 'Panpour', 'Pansage', 'Pansear', 'Paras', 'Parasect', 'Passimian', 'Patrat', 'Pawmi', 'Pawmo', 'Pawmot', 'Pawniard', 'Pelipper', 'Perrserker', 'Persian', 'Petilil', 'Phanpy', 'Phantump', 'Pheromosa', 'Phione', 'Pichu', 'Pidgeot', 'Pidgeotto', 'Pidgey', 'Pidove', 'Pignite', 'Pikachu', 'Pikipek', 'Piloswine', 'Pincurchin', 'Pineco', 'Pinsir', 'Piplup', 'Plusle', 'Poipole', 'Politoed', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Polteageist', 'Ponyta', 'Poochyena', 'Popplio', 'Porygon', 'Porygon Z', 'Porygon2', 'Primarina', 'Primeape', 'Prinplup', 'Probopass', 'Psyduck', 'Pumpkaboo Average', 'Pupitar', 'Purrloin', 'Purugly', 'Pyroar', 'Pyukumuku', 'Quagsire', 'Quaquaval', 'Quaxly', 'Quaxwell', 'Quilava', 'Quilladin', 'Qwilfish', 'Raboot', 'Rabsca', 'Raichu', 'Raikou', 'Ralts', 'Rampardos', 'Rapidash', 'Raticate', 'Rattata', 'Rayquaza', 'Regice', 'Regidrago', 'Regieleki', 'Regigigas', 'Regirock', 'Registeel', 'Relicanth', 'Rellor', 'Remoraid', 'Reshiram', 'Reuniclus', 'Revavroom', 'Rhydon', 'Rhyhorn', 'Rhyperior', 'Ribombee', 'Rillaboom', 'Riolu', 'Roaring Moon', 'Rockruff', 'Roggenrola', 'Rolycoly', 'Rookidee', 'Roselia', 'Roserade', 'Rotom', 'Rowlet', 'Rufflet', 'Runerigus', 'Sableye', 'Salamence', 'Salandit', 'Salazzle', 'Samurott', 'Sandaconda', 'Sandile', 'Sandshrew', 'Sandslash', 'Sandy Shocks', 'Sandygast', 'Sawk', 'Sawsbuck', 'Scatterbug', 'Sceptile', 'Scizor', 'Scolipede', 'Scorbunny', 'Scovillain', 'Scrafty', 'Scraggy', 'Scream Tail', 'Scyther', 'Seadra', 'Seaking', 'Sealeo', 'Seedot', 'Seel', 'Seismitoad', 'Sentret', 'Serperior', 'Servine', 'Seviper', 'Sewaddle', 'Sharpedo', 'Shaymin Land', 'Shedinja', 'Shelgon', 'Shellder', 'Shellos', 'Shelmet', 'Shieldon', 'Shiftry', 'Shiinotic', 'Shinx', 'Shroodle', 'Shroomish', 'Shuckle', 'Shuppet', 'Sigilyph', 'Silcoon', 'Silicobra', 'Silvally', 'Simipour', 'Simisage', 'Simisear', 'Sinistea', 'Sirfetchd', 'Sizzlipede', 'Skarmory', 'Skeledirge', 'Skiddo', 'Skiploom', 'Skitty', 'Skorupi', 'Skrelp', 'Skuntank', 'Skwovet', 'Slaking', 'Slakoth', 'Sliggoo', 'Slither Wing', 'Slowbro', 'Slowking', 'Slowpoke', 'Slugma', 'Slurpuff', 'Smeargle', 'Smoliv', 'Smoochum', 'Sneasel', 'Sneasler', 'Snivy', 'Snom', 'Snorlax', 'Snorunt', 'Snover', 'Snubbull', 'Sobble', 'Solgaleo', 'Solosis', 'Solrock', 'Spearow', 'Spectrier', 'Spewpa', 'Spheal', 'Spidops', 'Spinarak', 'Spinda', 'Spiritomb', 'Spoink', 'Sprigatito', 'Spritzee', 'Squawkabilly', 'Squirtle', 'Stakataka', 'Stantler', 'Staraptor', 'Staravia', 'Starly', 'Starmie', 'Staryu', 'Steelix', 'Steenee', 'Stonjourner', 'Stoutland', 'Stufful', 'Stunfisk', 'Stunky', 'Sudowoodo', 'Suicune', 'Sunflora', 'Sunkern', 'Surskit', 'Swablu', 'Swadloon', 'Swalot', 'Swampert', 'Swanna', 'Swellow', 'Swinub', 'Swirlix', 'Swoobat', 'Sylveon', 'Tadbulb', 'Taillow', 'Talonflame', 'Tandemaus', 'Tangela', 'Tangrowth', 'Tapu Bulu', 'Tapu Fini', 'Tapu Koko', 'Tapu Lele', 'Tarountula', 'Tatsugiri', 'Tauros', 'Teddiursa', 'Tentacool', 'Tentacruel', 'Tepig', 'Terrakion', 'Thievul', 'Throh', 'Thundurus Incarnate', 'Thwackey', 'Timburr', 'Ting Lu', 'Tinkatink', 'Tinkaton', 'Tinkatuff', 'Tirtouga', 'Toedscool', 'Toedscruel', 'Togedemaru', 'Togekiss', 'Togepi', 'Togetic', 'Torchic', 'Torkoal', 'Tornadus Incarnate', 'Torracat', 'Torterra', 'Totodile', 'Toucannon', 'Toxapex', 'Toxel', 'Toxicroak', 'Toxtricity Amped', 'Tranquill', 'Trapinch', 'Treecko', 'Trevenant', 'Tropius', 'Trubbish', 'Trumbeak', 'Tsareena', 'Turtonator', 'Turtwig', 'Tympole', 'Tynamo', 'Type Null', 'Typhlosion', 'Tyranitar', 'Tyrantrum', 'Tyrogue', 'Tyrunt', 'Umbreon', 'Unfezant', 'Unown', 'Ursaluna', 'Ursaring', 'Urshifu Single Strike', 'Uxie', 'Vanillish', 'Vanillite', 'Vanilluxe', 'Vaporeon', 'Varoom', 'Veluza', 'Venipede', 'Venomoth', 'Venonat', 'Venusaur', 'Vespiquen', 'Vibrava', 'Victini', 'Victreebel', 'Vigoroth', 'Vikavolt', 'Vileplume', 'Virizion', 'Vivillon', 'Volbeat', 'Volcanion', 'Volcarona', 'Voltorb', 'Vullaby', 'Vulpix', 'Wailmer', 'Wailord', 'Walking Wake', 'Walrein', 'Wartortle', 'Watchog', 'Wattrel', 'Weavile', 'Weedle', 'Weepinbell', 'Weezing', 'Whimsicott', 'Whirlipede', 'Whiscash', 'Whismur', 'Wigglytuff', 'Wiglett', 'Wimpod', 'Wingull', 'Wishiwashi Solo', 'Wo Chien', 'Wobbuffet', 'Woobat', 'Wooloo', 'Wooper', 'Wormadam Plant', 'Wugtrio', 'Wurmple', 'Wynaut', 'Wyrdeer', 'Xatu', 'Xerneas', 'Xurkitree', 'Yamask', 'Yamper', 'Yanma', 'Yanmega', 'Yungoos', 'Yveltal', 'Zacian', 'Zamazenta', 'Zangoose', 'Zapdos', 'Zarude', 'Zebstrika', 'Zekrom', 'Zeraora', 'Zigzagoon', 'Zoroark', 'Zorua', 'Zubat', 'Zweilous', 'Zygarde 50'];
