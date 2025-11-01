// NeonPolis Game Data

export interface Character {
  id: string;
  name: string;
  tagline: string;
  maxLife: number;
  image: string;
  ability: {
    id: string;
    name: string;
    timing: string;
    description: string;
  };
}

export interface ShopCard {
  id: string;
  type: 'KEEP' | 'DISCARD';
  cost: number;
  nameEn: string;
  nameEl: string;
  effectEn: string;
  effectEl: string;
  timing: string;
}

export const characters: Character[] = [
  {
    id: 'nimbus_gibbon',
    name: 'Nimbus Gibbon',
    tagline: 'Mist over matter.',
    maxLife: 10,
    image: 'nimbus_gibbon.png',
    ability: {
      id: 'misty_grapple',
      name: 'Misty Grapple',
      timing: 'after_final_roll',
      description: 'After your final roll, you may copy one die face to another die.'
    }
  },
  {
    id: 'ion_wyrm',
    name: 'Ion Wyrm',
    tagline: 'Ride the surge.',
    maxLife: 10,
    image: 'ion_wyrm.png',
    ability: {
      id: 'overcharge',
      name: 'Overcharge',
      timing: 'next_time_gain_energy',
      description: 'The next time you gain Energy this turn, gain +1 additional Energy.'
    }
  },
  {
    id: 'basalt_colossus',
    name: 'Basalt Colossus',
    tagline: 'Mountains do not kneel.',
    maxLife: 10,
    image: 'basalt_colossus.png',
    ability: {
      id: 'stoneplate',
      name: 'Stoneplate',
      timing: 'next_time_take_damage',
      description: 'The next time you would take damage, reduce it by 1 (minimum 0).'
    }
  },
  {
    id: 'abyss_leviathan',
    name: 'Abyss Leviathan',
    tagline: 'The tide obeys me.',
    maxLife: 10,
    image: 'abyss_leviathan.png',
    ability: {
      id: 'undertow',
      name: 'Undertow',
      timing: 'resolve_hearts_on_your_turn',
      description: 'Once per turn, when resolving Hearts on your turn, you may convert any unused Hearts into Energy (1 Heart → 1 Energy).'
    }
  },
  {
    id: 'starblade_mantis',
    name: 'Starblade Mantis',
    tagline: 'A cut above fate.',
    maxLife: 10,
    image: 'starblade_mantis.png',
    ability: {
      id: 'precision_cut',
      name: 'Precision Cut',
      timing: 'on_deal_damage',
      description: 'When you deal damage and you kept ≥1 Heart this turn, deal +1. (1/round)'
    }
  },
  {
    id: 'quantum_terrapin',
    name: 'Quantum Terrapin',
    tagline: 'Save now, swap later.',
    maxLife: 10,
    image: 'quantum_terrapin.png',
    ability: {
      id: 'time_bank',
      name: 'Time Bank',
      timing: 'end_of_turn_store',
      description: 'End of turn: store 1 kept die (max 1). Later, swap before rerolls, then discard. (1/round)'
    }
  },
  {
    id: 'prismfang_cobra',
    name: 'Prismfang Cobra',
    tagline: 'Your power, now mine.',
    maxLife: 10,
    image: 'prismfang_cobra.png',
    ability: {
      id: 'venom_siphon',
      name: 'Venom Siphon',
      timing: 'next_time_deal_damage',
      description: 'The next time you deal damage to a player, they lose 1 Energy.'
    }
  },
  {
    id: 'halo_cyclops',
    name: 'Halo Cyclops',
    tagline: 'Balance the beam.',
    maxLife: 10,
    image: 'halo_cyclops.png',
    ability: {
      id: 'convertive_gaze',
      name: 'Convertive Gaze',
      timing: 'resolve_phase',
      description: 'Once per turn during resolve phase: Convert 1 Energy ↔ 1 HP (respecting max HP).'
    }
  }
];

export const shopCards: ShopCard[] = [
  // KEEP cards
  { id: 'K001', type: 'KEEP', cost: 3, nameEl: 'Συλλέκτης Ενέργειας', nameEn: 'Energy Collector', effectEl: 'Στην αρχή του γύρου σου: +1 ⚡.', effectEn: 'Start of your turn: +1 ⚡.', timing: 'START_OF_TURN' },
  { id: 'K002', type: 'KEEP', cost: 4, nameEl: 'Συσσωρευτής Πλάσματος', nameEn: 'Plasma Accumulator', effectEl: 'Όταν κερδίζεις ≥2 ⚡ από ζάρια: +1 ⚡.', effectEn: 'Whenever you gain ≥2 ⚡ from dice: gain +1 ⚡.', timing: 'PASSIVE' },
  { id: 'K003', type: 'KEEP', cost: 3, nameEl: 'Μαύρη Αγορά', nameEn: 'Black Market', effectEl: '1×/γύρο: πλήρωσε 1 HP → δες 3 κορυφαίες κάρτες Market, αγόρασε 1 με -1⚡ (ελάχιστο 0).', effectEn: 'Once/turn: pay 1 HP → look at the top 3 Market cards, buy 1 with -1⚡ (min 0).', timing: 'ACTIVE_ONCE_PER_TURN' },
  { id: 'K004', type: 'KEEP', cost: 2, nameEl: 'Αποθήκη Φορτίου', nameEn: 'Charge Depot', effectEl: 'Δεν χάνεις ⚡ από υπερχείλιση ή εφέ.', effectEn: 'You do not lose ⚡ from overflow or effects.', timing: 'PASSIVE' },
  { id: 'K005', type: 'KEEP', cost: 5, nameEl: 'Παλμός Λεπίδων', nameEn: 'Blade Pulse', effectEl: 'Αν είσαι στον Πυρήνα, τα ⚔️ σου κάνουν +1 συνολική ζημιά.', effectEn: 'While in Center, your ⚔️ deal +1 total damage.', timing: 'PASSIVE' },
  { id: 'K006', type: 'KEEP', cost: 4, nameEl: 'Σεισμικός Βηματισμός', nameEn: 'Seismic Stride', effectEl: 'Όταν μπαίνεις στον Πυρήνα: όλοι οι άλλοι -1 HP.', effectEn: 'When you enter the Center: all others lose 1 HP.', timing: 'ON_ENTER_CENTER' },
  { id: 'K007', type: 'KEEP', cost: 3, nameEl: 'Εκτεινόμενα Άκρα', nameEn: 'Extending Limbs', effectEl: 'Εκτός Πυρήνα και ρίχνεις ≥2 ⚔️: +1 επιπλέον ζημιά στον ένοικο.', effectEn: 'If outside and you roll ≥2 ⚔️: deal +1 extra damage to the Center occupant.', timing: 'PASSIVE' },
  { id: 'K008', type: 'KEEP', cost: 4, nameEl: 'Θωράκιση Αντήχησης', nameEn: 'Echo Shielding', effectEl: 'Όταν θα έπαιρνες 3+ ζημιά από μία επίλυση: -1 (ελάχιστο 1).', effectEn: 'When you would take 3+ damage from a single resolution: reduce by 1 (min 1).', timing: 'PASSIVE' },
  { id: 'K009', type: 'KEEP', cost: 5, nameEl: 'Αναγεννητικός Ιστός', nameEn: 'Regenerative Tissue', effectEl: 'Τέλος γύρου: αν δεν έλυσες ❤️, +1 HP.', effectEn: 'End of turn: if you resolved no ❤️ this turn, heal +1.', timing: 'END_OF_TURN' },
  { id: 'K010', type: 'KEEP', cost: 3, nameEl: 'Ιατρική Μονάδα Πεδίου', nameEn: 'Field Med Unit', effectEl: 'Μπορείς να θεραπεύεσαι με ❤️ και μέσα στον Πυρήνα (μέγιστο +1/γύρο από ζάρια).', effectEn: 'You may heal from ❤️ while in Center (max +1/turn from dice).', timing: 'PASSIVE' },
  { id: 'K011', type: 'KEEP', cost: 2, nameEl: 'Αντισώματα', nameEn: 'Antibodies', effectEl: '1×/γύρο: +1 επιπλέον θεραπεία κατά την επίλυση ❤️.', effectEn: 'Once/turn during ❤️ resolution: heal +1 extra HP.', timing: 'RESOLVE_HEARTS' },
  { id: 'K012', type: 'KEEP', cost: 4, nameEl: 'Τηλεκινητική Λαβή', nameEn: 'Telekinetic Grip', effectEl: '1×/γύρο, μετά την τελική κύλιση: γύρισε 1 ζάρι σε ⚡ ή ⚔️.', effectEn: 'Once/turn, after your final roll: set 1 die to ⚡ or ⚔️.', timing: 'AFTER_FINAL_ROLL' },
  { id: 'K013', type: 'KEEP', cost: 3, nameEl: 'Κυβιστική Τύχη', nameEn: 'Cubist Fortune', effectEl: 'Όποτε σκοράρεις σετ αριθμών: +1 ΦP.', effectEn: 'Whenever you score a number set: gain +1 VP.', timing: 'PASSIVE' },
  { id: 'K014', type: 'KEEP', cost: 3, nameEl: 'Λιγοστό Απόθεμα', nameEn: 'Scarce Supply', effectEl: 'Όταν αντίπαλος κερδίζει ≥3 ⚡ από ζάρια: εκείνος -1 ⚡.', effectEn: 'Whenever an opponent gains ≥3 ⚡ from dice: they lose 1 ⚡.', timing: 'PASSIVE' },
  { id: 'K015', type: 'KEEP', cost: 2, nameEl: 'Άγκυρα Πυρήνα', nameEn: 'Core Anchor', effectEl: 'Όταν φεύγεις εκούσια από τον Πυρήνα: +1 ΦP.', effectEn: 'When you voluntarily leave the Center: gain +1 VP.', timing: 'ON_LEAVE_CENTER' },
  { id: 'K016', type: 'KEEP', cost: 3, nameEl: 'Εκρηκτική Είσοδος', nameEn: 'Explosive Entry', effectEl: 'Όταν μπαίνεις στον Πυρήνα: ρίξε 1 επιπλέον ζάρι και εφάρμοσε μόνο ⚔️/⚡.', effectEn: 'When you enter the Center: roll 1 extra die and apply only ⚔️/⚡.', timing: 'ON_ENTER_CENTER' },
  { id: 'K017', type: 'KEEP', cost: 2, nameEl: 'Κυνηγός Ναρκών', nameEn: 'Mine Hunter', effectEl: '1×/γύρο: μετά την τελική κύλιση, ξαναρίξε ακριβώς 1 ζάρι.', effectEn: 'Once/turn: after your final roll, reroll exactly 1 die.', timing: 'AFTER_FINAL_ROLL' },
  { id: 'K018', type: 'KEEP', cost: 4, nameEl: 'Νεκρο-Τροφοδότης', nameEn: 'Necro-Feeder', effectEl: 'Κάθε ❤️ που επιλύεις σου δίνει επίσης +1 ⚡.', effectEn: 'Each ❤️ you resolve also gives +1 ⚡.', timing: 'RESOLVE_HEARTS' },
  { id: 'K019', type: 'KEEP', cost: 5, nameEl: 'Επιστροφή της Μοίρας', nameEn: 'Turn of Fate', effectEl: '1×/γύρο: όταν θα πάρεις ζημιά, πρόλαβε 1 και διάλεξε αντίπαλο να χάσει 1 HP.', effectEn: 'Once/turn when you would take damage: prevent 1 and choose an opponent to lose 1 HP.', timing: 'DAMAGE_TAKEN' },
  { id: 'K020', type: 'KEEP', cost: 4, nameEl: 'Επιφανής Καταστροφέας', nameEn: 'Eminent Devastator', effectEl: 'Αρχή γύρου (αν είσαι στον Πυρήνα): +1 ΦP.', effectEn: 'Start of your turn (if in Center): +1 VP.', timing: 'START_OF_TURN' },
  { id: 'K021', type: 'KEEP', cost: 3, nameEl: 'Λεηλατητής Στέγης', nameEn: 'Rooftop Raider', effectEl: 'Αν είσαι εκτός και έκανες ≥2 ⚔️ σε έναν γύρο: +1 ΦP.', effectEn: 'If outside and you dealt ≥2 ⚔️ this turn: gain +1 VP.', timing: 'END_OF_TURN' },
  { id: 'K022', type: 'KEEP', cost: 3, nameEl: 'Αεροσήραγγες', nameEn: 'Aero Tunnels', effectEl: '+1 extra επαναρίψη (μία επιπλέον μετά τη 2η).', effectEn: '+1 extra reroll (one additional after the 2nd).', timing: 'PASSIVE' },
  { id: 'K023', type: 'KEEP', cost: 3, nameEl: 'Σφυρηλάτηση Ζαριών', nameEn: 'Die Forging', effectEl: 'Αν κρατήσεις όλα τα ζάρια μετά την 1η κύλιση: +1 ⚡ και +1 ΦP.', effectEn: 'If you keep all dice after your 1st roll: gain +1 ⚡ and +1 VP.', timing: 'AFTER_FIRST_ROLL' },
  { id: 'K024', type: 'KEEP', cost: 2, nameEl: 'Ανακύκλωση Αγοράς', nameEn: 'Market Recycle', effectEl: '1×/γύρο: πλήρωσε 1 ⚡ → αντικατάστησε 1 ανοικτή κάρτα στο Market.', effectEn: 'Once/turn: pay 1 ⚡ → replace 1 open Market card.', timing: 'ACTIVE_ONCE_PER_TURN' },
  { id: 'K025', type: 'KEEP', cost: 5, nameEl: 'Θώρακας Νήματος', nameEn: 'Threaded Carapace', effectEl: '-1 ζημιά από κάθε πηγή (ελάχιστο 0 ανά επίλυση).', effectEn: '-1 damage from every source (min 0 per resolution).', timing: 'PASSIVE' },
  { id: 'K026', type: 'KEEP', cost: 4, nameEl: 'Ανάσα Λεπίδας', nameEn: 'Blade Breath', effectEl: 'Όταν κάνεις ≥1 ⚔️: η συνολική ζημιά σου είναι +1.', effectEn: 'When you deal ≥1 ⚔️: your total damage is +1.', timing: 'PASSIVE' },
  { id: 'K027', type: 'KEEP', cost: 4, nameEl: 'Πυρήνας Αναδόμησης', nameEn: 'Rebuild Core', effectEl: 'Όποτε θεραπεύεσαι με ❤️ εκτός Πυρήνα: +1 ⚡.', effectEn: 'Whenever you heal with ❤️ while outside: gain +1 ⚡.', timing: 'PASSIVE' },
  { id: 'K028', type: 'KEEP', cost: 3, nameEl: 'Συγχρονιστής', nameEn: 'Synchronizer', effectEl: 'Έχεις +1 συνολική επαναρίψη κάθε γύρο (έως 3).', effectEn: 'You have +1 total reroll each turn (up to 3).', timing: 'PASSIVE' },
  
  // DISCARD cards
  { id: 'D001', type: 'DISCARD', cost: 2, nameEl: 'Υπερφόρτωση', nameEn: 'Overcharge', effectEl: 'Άμεσα: +3 ⚡.', effectEn: 'Immediate: +3 ⚡.', timing: 'INSTANT' },
  { id: 'D002', type: 'DISCARD', cost: 3, nameEl: 'Έκρηξη Λεπίδων', nameEn: 'Blade Burst', effectEl: 'Άμεσα: +2 ⚔️ σε όλους τους αντιπάλους.', effectEn: 'Immediate: +2 ⚔️ to all opponents.', timing: 'INSTANT' },
  { id: 'D003', type: 'DISCARD', cost: 2, nameEl: 'Αποκατάσταση', nameEn: 'Restoration', effectEl: 'Θεράπευσε +3 HP (ακόμα κι αν είσαι στον Πυρήνα).', effectEn: 'Heal +3 HP (even if you are in the Center).', timing: 'INSTANT' },
  { id: 'D004', type: 'DISCARD', cost: 3, nameEl: 'Ανατροπή Φόρμας', nameEn: 'Form Reversal', effectEl: 'Μπαίνεις στον Πυρήνα (αν άδειος) ή εξαναγκάζεις τον ένοικο να φύγει και μπαίνεις.', effectEn: 'Enter the Center (if empty) or force the occupant out and enter.', timing: 'INSTANT' },
  { id: 'D005', type: 'DISCARD', cost: 2, nameEl: 'Ανασύνταξη', nameEn: 'Regroup', effectEl: 'Ρίξε ξανά όλα τα ζάρια σου· εφάρμοσε μόνο ⚔️/⚡ από αυτό το reroll.', effectEn: 'Reroll all your dice; from that reroll apply only ⚔️/⚡.', timing: 'ROLL_PHASE' },
  { id: 'D006', type: 'DISCARD', cost: 3, nameEl: 'Λεηλασία Αποθηκών', nameEn: 'Warehouse Plunder', effectEl: 'Πάρε +X ⚡ (X = αριθμός αντιπάλων, max 3).', effectEn: 'Gain +X ⚡ (X = number of opponents, max 3).', timing: 'INSTANT' },
  { id: 'D007', type: 'DISCARD', cost: 3, nameEl: 'Αναταραχή Αγοράς', nameEn: 'Market Turmoil', effectEl: 'Όλοι οι άλλοι ξαναρίχνουν τα ⚡ στα ζάρια τους (αν παίζεται στη σειρά σου).', effectEn: 'All others reroll any ⚡ on their dice (play only on your turn).', timing: 'INSTANT' },
  { id: 'D008', type: 'DISCARD', cost: 2, nameEl: 'Αλεξίσταχτη Ασπίδα', nameEn: 'Rainproof Shield', effectEl: 'Μέχρι την αρχή του επόμενου γύρου σου: αγνόησε όλη τη ζημιά που θα δεχτείς.', effectEn: 'Until the start of your next turn: ignore all damage you would take.', timing: 'DURATION_UNTIL_YOUR_NEXT_TURN' },
  { id: 'D009', type: 'DISCARD', cost: 3, nameEl: 'Ισχυρό Χτύπημα', nameEn: 'Power Strike', effectEl: 'Διάλεξε αντίπαλο: +X ⚔️ όπου X = ⚡ που πληρώνεις τώρα (0–3).', effectEn: 'Choose an opponent: deal +X ⚔️ where X = ⚡ you pay now (0–3).', timing: 'INSTANT' },
  { id: 'D010', type: 'DISCARD', cost: 2, nameEl: 'Γρήγορη Ανάβαση', nameEn: 'Swift Ascent', effectEl: 'Στο τέλος του γύρου σου: αν ο Πυρήνας είναι άδειος, μπες και πάρε +1 ΦP.', effectEn: 'End of your turn: if the Center is empty, enter and gain +1 VP.', timing: 'END_OF_TURN' },
  { id: 'D011', type: 'DISCARD', cost: 3, nameEl: 'Κυβερνοπειρατεία', nameEn: 'Cyber Heist', effectEl: 'Κλέψε 2 ⚡ από έναν αντίπαλο.', effectEn: 'Steal 2 ⚡ from one opponent.', timing: 'INSTANT' },
  { id: 'D012', type: 'DISCARD', cost: 2, nameEl: 'Επισκευές Πεδίου', nameEn: 'Field Repairs', effectEl: '+2 HP· αν είσαι εκτός, πάρε και +1 ΦP.', effectEn: '+2 HP; if you are outside, also gain +1 VP.', timing: 'INSTANT' },
  { id: 'D013', type: 'DISCARD', cost: 2, nameEl: 'Αντιπερισπασμός', nameEn: 'Diversion', effectEl: 'Άκυρωσε μία Discard/Instant κάρτα που μόλις έπαιξε άλλος.', effectEn: 'Cancel a Discard/Instant card just played by another player.', timing: 'REACTION' },
  { id: 'D014', type: 'DISCARD', cost: 4, nameEl: 'Ενέδρα', nameEn: 'Ambush', effectEl: 'Ρίξε 2 ζάρια και εφάρμοσε μόνο ⚔️/⚡.', effectEn: 'Roll 2 dice and apply only ⚔️/⚡.', timing: 'INSTANT' },
  { id: 'D015', type: 'DISCARD', cost: 2, nameEl: 'Καλπάζων Χρόνος', nameEn: 'Galloping Time', effectEl: '+1 επιπλέον επαναρίψη αυτόν τον γύρο.', effectEn: '+1 additional reroll this turn.', timing: 'INSTANT' },
  { id: 'D016', type: 'DISCARD', cost: 3, nameEl: 'Εξορία', nameEn: 'Exile', effectEl: 'Βγάλε τον παίκτη από τον Πυρήνα· ο Πυρήνας μένει κενός ως την αρχή του επόμενου γύρου σου.', effectEn: 'Remove the player from the Center; it stays empty until the start of your next turn.', timing: 'INSTANT' },
  { id: 'D017', type: 'DISCARD', cost: 4, nameEl: 'Αντλία Ενέργειας', nameEn: 'Energy Pump', effectEl: 'Άμεσα: +5 ⚡.', effectEn: 'Immediate: +5 ⚡.', timing: 'INSTANT' },
  { id: 'D018', type: 'DISCARD', cost: 3, nameEl: 'Δείκτης Αδυναμίας', nameEn: 'Weakpoint Marker', effectEl: 'Δώσε Weakpoint token: η επόμενη φορά που ο στόχος θα πάρει ⚔️ ζημιά, παίρνει +1 επιπλέον (έπειτα αφαιρείται).', effectEn: 'Give a Weakpoint token: next time target takes ⚔️ damage, they take +1 extra (then remove token).', timing: 'INSTANT' },
  { id: 'D019', type: 'DISCARD', cost: 2, nameEl: 'Τροχιά Τσακίσματος', nameEn: 'Shattering Orbit', effectEl: 'Μόνο αυτόν τον γύρο: κάθε ⚔️ που λύνεις δίνει και +1 ⚡ (ανά σύμβολο ⚔️, όχι ανά στόχο).', effectEn: 'This turn only: each ⚔️ you resolve also gives +1 ⚡ (per ⚔️ symbol, not per target).', timing: 'TURN_BUFF' },
  { id: 'D020', type: 'DISCARD', cost: 2, nameEl: 'Καθαρτήριο', nameEn: 'Purgation', effectEl: 'Αφαίρεσε όλα τα αρνητικά tokens σου και +1 HP.', effectEn: 'Remove all your negative tokens and heal +1 HP.', timing: 'INSTANT' }
];

export type DiceFace = '1' | '2' | '3' | 'sword' | 'energy' | 'heart';

export const diceIcons: Record<DiceFace, string> = {
  '1': '1',
  '2': '2',
  '3': '3',
  'sword': '⚔️',
  'energy': '⚡',
  'heart': '❤️'
};