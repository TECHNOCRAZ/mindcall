import { useState, useEffect, useReducer, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ================================================================
// WORD LISTS
// ================================================================
const WORDS = {
  allEnglish: [
    "able","about","above","acid","aged","also","area","army","atom","away",
    "baby","back","ball","band","bank","base","bath","bear","beat","beef",
    "bell","belt","bend","best","bind","bird","bite","black","blow","blue",
    "bold","bolt","bond","bone","book","bore","boss","both","bowl","break",
    "bright","bring","brown","buck","bull","burn","busy","cake","calm","camp",
    "cape","card","care","carry","cart","cave","cell","change","check","chip",
    "chop","city","clap","clay","clip","club","coal","code","coin","cold",
    "come","cool","copy","core","cork","corn","cost","cozy","crab","crew",
    "crop","cure","dark","dash","dawn","deal","dean","debt","deck","deed",
    "deep","deer","deny","desk","dial","dice","diet","dine","dirt","disk",
    "dive","dock","dome","door","dose","dove","down","drag","draw","drive",
    "drop","drum","duke","dull","dunk","dusk","dust","duty","each","earl",
    "earn","easy","echo","edge","edit","emit","envy","epic","even","exam",
    "exit","face","fact","fade","fail","fake","fame","fang","fare","fast",
    "fate","fear","feed","feel","fell","felt","fern","file","fill","film",
    "find","fine","fire","firm","fish","fist","flaw","flea","flex","floor",
    "flow","foam","fold","folk","fond","font","food","foot","ford","fork",
    "form","foul","free","frog","fuel","full","fund","fuse","gain","gale",
    "game","gang","gasp","gave","gaze","gear","gene","gift","gill","glad",
    "glow","glue","goal","gold","gone","good","gore","gown","grab","gray",
    "great","green","grid","grin","grit","grow","gulf","gull","gulp","hail",
    "hair","half","halt","hand","hard","harp","hash","hate","hawk","head",
    "heal","heap","heat","heel","heir","helm","hemp","herb","herd","high",
    "hike","hill","hint","hire","hive","hold","hole","home","hoop","hope",
    "horn","host","huge","hulk","hull","hunt","hurt","hymn","idea","idle",
    "inch","iron","jade","jest","join","joke","jolt","jump","keen","keep",
    "kill","kind","king","kiss","knee","knit","know","lack","lady","lake",
    "lamb","lame","lamp","land","lane","lark","lash","last","late","lawn",
    "lead","lean","leap","learn","left","less","life","lift","light","lime",
    "line","link","lint","lion","list","live","load","lock","loft","lone",
    "long","lore","lost","loud","love","luck","lure","lurk","lust","mace",
    "main","make","mall","malt","mane","many","mark","mass","mast","math",
    "maze","mean","meat","meet","melt","mesh","mild","milk","mind","mine",
    "miss","mist","moat","mode","mole","monk","moon","more","moss","moth",
    "move","much","mule","must","myth","nail","name","navy","neck","need",
    "nest","news","nick","night","none","nook","norm","nose","note","noun",
    "obey","odds","omen","once","only","open","oval","pace","pack","page",
    "pair","pale","pane","park","part","past","path","peak","peel","pelt",
    "pest","pick","pier","pile","pint","pipe","pity","place","plan","play",
    "plow","plum","poem","poke","pole","poll","pond","pore","port","post",
    "pour","power","prey","prop","pull","pump","punk","punt","pure","push",
    "rack","raid","rain","rake","ramp","rank","rare","rash","rate","rave",
    "reach","real","reef","reel","rent","rest","rich","ring","rind","riot",
    "ripe","rise","risk","rite","road","roam","robe","rock","role","roll",
    "roof","room","root","rope","rose","rule","rush","rust","safe","sage",
    "sail","sake","salt","sand","sane","save","seal","seam","seat","seed",
    "seep","self","sell","send","shape","shed","ship","show","sigh","silk",
    "sill","sink","size","skill","skin","slow","small","smell","smile","snow",
    "soil","sole","some","song","soot","soul","sour","span","spin","spool",
    "spoon","spot","spur","stab","star","stay","stem","step","stir","stop",
    "store","strap","straw","stub","stun","suck","suit","sulk","surf","swap",
    "sway","swim","tale","talk","tall","tame","tang","tape","tare","tart",
    "taut","teak","teal","tear","tell","test","tide","tile","tilt","time",
    "tire","toad","toil","toll","tomb","tome","tone","tool","toss","town",
    "trap","tree","trim","trip","trod","trot","true","trust","tuft","tug",
    "turf","turn","type","unit","upon","urge","vain","vale","vane","vase",
    "vast","veil","vein","verb","vest","vial","vice","view","vine","void",
    "vole","volt","wade","wail","wake","walk","wand","wane","want","warm",
    "warp","wash","wasp","wave","wear","weed","well","wide","wild","will",
    "wind","wing","wish","wolf","wood","word","work","wren","writ","yard",
    "yawn","yell","yoke","zeal","zero","zest","zinc","zone",
    "about","above","abuse","ache","acid","acres","actor","adapt","admit",
    "adopt","adult","after","again","agent","agree","ahead","alarm","album",
    "alert","alien","align","alike","alive","alley","allow","aloud","alter",
    "amber","amend","angel","anger","angle","angry","angry","ankle","annex",
    "apart","apple","apply","arena","argue","arise","armor","aroma","arose",
    "array","arrow","asset","atlas","attic","audio","audit","avoid","awake",
    "award","aware","awful","badly","baker","basic","basis","baton","beach",
    "beast","began","begin","begun","bench","black","blade","blame","bland",
    "blank","blast","blaze","bleed","blend","bless","blind","block","blood",
    "bloom","blown","blunt","blurb","board","boast","booth","boost","booty",
    "botch","brace","braid","brain","brave","bread","bride","brief","brisk",
    "broad","brook","broth","brush","buddy","budge","build","built","bulge",
    "bunch","burst","buyer","byway","cabin","canal","candy","carry","catch",
    "cease","chain","chalk","chase","cheap","cheat","cheek","cheer","chess",
    "chest","chick","chief","child","choir","choke","chunk","churn","civil",
    "claim","clamp","clang","clash","clasp","class","claws","clean","clear",
    "click","cliff","cling","cloak","clone","close","cloth","cloud","clout",
    "clove","couch","could","count","court","cover","crack","crane","crash",
    "crawl","crazy","creek","crisp","cross","cruel","crush","crust","cycle",
    "dairy","dance","daring","decay","decoy","delta","dense","depth","derby",
    "dodge","doubt","dough","dowry","draft","drain","drape","dread","dream",
    "dress","dried","drift","drill","drink","droop","drove","drown","dully",
    "dwarf","dwell","eager","eagle","early","earth","eight","elbow","elder",
    "elite","ember","empty","enemy","enjoy","enter","equal","error","essay",
    "event","every","exact","exert","faith","false","fancy","feast","fever",
    "fewer","fiber","field","fiery","fifth","fifty","fight","final","first",
    "fixed","fizzy","flame","flare","flash","flask","flesh","flint","float",
    "flock","flood","floor","flush","flute","focus","force","forge","forth",
    "found","frame","frank","fraud","fresh","front","froze","fruit","fully",
    "fuzzy","ghost","given","given","gland","glass","gleam","glint","gloom",
    "glory","gloss","glove","going","grace","grade","grain","grand","grant",
    "grape","grasp","grass","grave","graze","greed","greet","grief","groan",
    "group","grove","guard","guess","guide","guild","guile","guise","gusto",
    "happy","haven","heard","heart","heavy","hedge","hence","hertz","house",
    "human","humor","hurry","image","imply","index","inner","input","inter",
    "issue","joker","judge","juice","juicy","knack","knife","knock","known",
    "label","lance","large","laser","laugh","layer","lease","least","legal",
    "level","light","limit","liner","liver","lobby","local","lodge","logic",
    "loose","lower","loyal","lunar","lusty","magic","maker","manor","maple",
    "march","match","mayor","medal","mercy","merge","merit","metal","model",
    "money","month","moral","motor","motto","mound","mount","mouse","mouth",
    "movie","muddy","mural","music","narrow","nasty","noble","noise","north",
    "novel","nurse","nymph","occur","occur","offer","often","order","other",
    "outer","owner","paint","panic","paper","parse","pause","peace","penny",
    "photo","piano","pilot","pitch","pixel","pixel","pixel","pixel","pixel",
    "pixel","pixel","pixel","pixel","pixel","pixel","plain","plane","plant",
    "plate","plaza","plead","pleat","pluck","plume","plunge","point","poker",
    "polar","pound","price","pride","prime","print","prior","prize","probe",
    "prove","prowl","proxy","psalm","puffy","pulse","pupil","purse","quake",
    "queen","query","quest","queue","quick","quiet","quota","quote","radar",
    "radio","rally","ranch","range","rapid","ratio","reach","realm","rebel",
    "recap","relay","remix","renew","repay","rider","ridge","rifle","risky",
    "rival","river","robot","rocky","rouge","rough","round","route","royal",
    "ruler","rural","sadly","saint","salad","sauce","scale","scare","scene",
    "scent","score","scout","scram","screw","scrub","seize","sense","serve",
    "seven","shade","shaft","shake","shall","shame","shark","sharp","shear",
    "sheen","sheer","sheet","shelf","shell","shift","shock","shore","shout",
    "shove","sight","since","sixth","sixty","slack","slain","slang","slash",
    "slave","sleek","sleep","sleet","slice","slide","slime","sling","slope",
    "sloth","smart","smash","smear","smoke","snack","snake","snare","sneak",
    "sniff","solid","solve","sorry","south","space","spare","spark","speak",
    "spear","speck","speed","spell","spend","spice","spill","spite","split",
    "spoke","spree","sprig","squad","squab","squat","squaw","squid","squad",
    "stain","stair","stale","stall","stamp","stand","stank","stare","stark",
    "start","state","steam","steel","steep","steer","stein","stern","stiff",
    "sting","stone","stood","stoop","storm","story","stout","stove","strap",
    "stray","strip","strut","study","style","sugar","suite","sunny","super",
    "surge","swamp","swear","sweat","sweep","sweet","swept","swift","swirl",
    "sword","swore","sworn","table","taunt","taste","teach","tempo","tense",
    "tenth","terms","theft","their","theme","thick","thing","think","third",
    "thorn","three","threw","throw","thumb","tiger","tight","timer","tired",
    "title","today","token","torch","total","touch","tough","tower","towel",
    "trace","track","trade","train","trait","tramp","trend","trial","trick",
    "tried","trill","troop","trout","truck","truly","trump","trunk","truth",
    "tulip","tumor","tuner","tweak","twice","twist","tying","under","unify",
    "union","unity","until","upper","upset","urban","usage","usher","usual",
    "utter","valid","valor","value","valve","vapor","vault","veins","verse",
    "video","vigor","viral","viral","virus","visit","vista","vital","vivid",
    "vixen","vocal","voice","voter","waste","watch","water","weave","wedge",
    "weigh","weird","where","which","while","white","whole","whose","wider",
    "witty","woman","women","world","worry","worse","worst","worth","would",
    "wound","wrote","young","youth","zebra",
  ],
  animals: [
    "ant","ape","bat","bee","cat","cod","cow","cub","doe","dog","elk","emu",
    "ewe","fly","fox","gnu","hen","hog","jay","koi","owl","pig","ram","rat",
    "yak","bear","bird","boar","buck","bull","calf","clam","colt","crab","crow",
    "dart","deer","dove","duck","fawn","flea","frog","gnat","goat","hare","hawk",
    "ibis","kite","lamb","lark","lion","loon","lynx","mink","mole","moth","mule",
    "mutt","newt","pony","puma","slug","snag","swan","toad","vole","wasp","wolf","wren",
    "adder","bison","bream","crane","dingo","eagle","egret","finch","gecko","guppy",
    "hippo","horse","hound","hyena","koala","llama","macaw","moose","mouse","otter",
    "panda","quail","raven","shark","skunk","sloth","snake","squid","stork","tapir",
    "tiger","trout","viper","whale","zebra","alpaca","beaver","bobcat","canary",
    "condor","donkey","falcon","ferret","gibbon","iguana","jaguar","lizard","locust",
    "magpie","monkey","parrot","pigeon","rabbit","salmon","spider","toucan","turkey",
    "turtle","walrus","weasel","badger","beetle","buffalo","chicken","dolphin",
    "gorilla","hamster","leopard","lobster","panther","penguin","raccoon","sparrow",
    "vulture","cheetah","crocodile","elephant","flamingo","hedgehog","kangaroo",
    "porcupine","alligator","armadillo",
  ],
  animalsEasy: [
    "ant","bat","bee","cat","cow","dog","elk","emu","fly","fox","hen","hog",
    "owl","pig","ram","rat","bear","bird","bull","calf","crab","crow","deer",
    "dove","duck","fish","frog","goat","hare","hawk","lamb","lion","mole",
    "mule","pony","swan","toad","wolf","wren","crane","eagle","finch","gecko",
    "hippo","horse","hyena","koala","llama","moose","mouse","otter","panda",
    "shark","skunk","sloth","snake","stork","tiger","whale","zebra","donkey",
    "monkey","parrot","rabbit","salmon","spider","turtle","walrus","chicken",
    "dolphin","gorilla","leopard","penguin","raccoon","cheetah","elephant",
    "flamingo","kangaroo",
  ],
  countries: [
    "chad","cuba","fiji","iran","iraq","laos","mali","oman","peru","togo",
    "china","egypt","ghana","india","italy","japan","kenya","libya","nepal",
    "niger","qatar","spain","sudan","syria","tonga","wales","yemen","angola",
    "belize","brazil","canada","cyprus","france","greece","guinea","guyana",
    "israel","jordan","kuwait","malawi","mexico","monaco","norway","panama",
    "poland","rwanda","serbia","sweden","taiwan","turkey","uganda","angola",
    "albania","algeria","armenia","austria","bahrain","belarus","belgium",
    "bolivia","burundi","comoros","croatia","denmark","ecuador","eritrea",
    "estonia","finland","georgia","germany","grenada","hungary","iceland",
    "ireland","jamaica","lebanon","lesotho","liberia","moldova","mongolia",
    "morocco","myanmar","namibia","nigeria","moldova","pakistan","romania",
    "senegal","somalia","ukraine","uruguay","vietnam","zambia","zimbabwe",
    "cambodia","colombia","djibouti","dominica","ethiopia","honduras","kiribati",
    "malaysia","maldives","portugal","slovakia","slovenia","suriname","tanzania",
    "thailand","barbados","bulgaria","indonesia","lithuania","mauritius","singapore",
    "swaziland","argentina","australia","azerbaijan","bangladesh","costa rica",
    "nicaragua","guatemala","philippines","switzerland","netherlands","venezuela",
  ],
  cities: [
    "rome","lima","oslo","bern","doha","lome","riga","kiev","oslo","male",
    "suva","apia","nuku","cairo","dubai","paris","tokyo","delhi","lagos","dhaka",
    "riyadh","accra","hanoi","seoul","miami","lyons","abuja","tunis","osaka",
    "vienna","prague","warsaw","athens","lisbon","dublin","moscow","sydney","taipei",
    "nairobi","jakarta","karachi","bangkok","beijing","chicago","houston","toronto",
    "montreal","berlin","madrid","london","havana","bogota","manila","mumbai",
    "calcutta","shanghai","brussels","istanbul","singapore","amsterdam","rotterdam",
    "budapest","helsinki","stockholm","melbourne","auckland","santiago","caracas",
    "casablanca","johannesburg","copenhagen","edinburgh","manchester","barcelona",
    "frankfurt","hamburg","montreal","vancouver","brisbane","abu dhabi",
  ],
  foods: [
    "ale","bun","jam","pie","tea","fig","ham","oat","rye","cod","eel",
    "egg","oil","rum","gin","rum","rye","beef","beet","bran","brie","cake",
    "chip","clam","corn","crab","dill","duck","feta","fish","flan","herb",
    "kale","lamb","leek","lime","lard","mayo","meat","milk","mint","miso",
    "musk","naan","oats","okra","pear","peel","pita","plum","pork","port",
    "rice","sage","salt","soup","soya","stew","taco","tofu","tuna","wine",
    "yolk","apple","basil","berry","bread","brine","broth","candy","capers",
    "carob","celery","cheese","chili","chips","cider","clove","cocoa","cream",
    "curry","dates","donut","dough","drink","farro","feast","flour","fudge",
    "grape","gravy","guava","honey","juice","kebab","lemon","liver","lychee",
    "mango","maple","melon","mocha","olive","onion","pasta","peach","pecan",
    "pesto","pizza","prawn","punch","puree","ramen","salad","sauce","scone",
    "seaweed","shrimp","snack","spice","squid","steak","sugar","sweet","syrup",
    "tahini","taffy","thyme","toast","truffle","umami","vodka","waffle","wheat",
    "yogurt","almond","banana","brandy","butter","cashew","cherry","coffee",
    "cookie","fennel","garlic","ginger","hazelnut","lobster","muffin","orange",
    "papaya","pepper","potato","radish","salmon","tomato","turkey","walnut",
    "anchovy","avocado","broccoli","brownie","burrito","coconut","custard",
    "granola","lettuce","lobster","pancake","parsley","peanut","pineapple",
    "pretzel","pudding","sausage","spinach","vanilla","whiskey","zucchini",
    "blueberry","chocolate","cinnamon","croissant","mushroom","raspberry","strawberry",
  ],
  nature: [
    "ash","bay","bog","cave","clay","crag","dew","fen","fog","gem","ice","ivy",
    "jet","kelp","lake","lava","leaf","loam","log","mesa","mist","moss","mud",
    "oak","peat","pine","pond","pool","rain","reef","rock","sand","silt","snow",
    "soil","star","stem","tide","vale","ward","wave","wind","wood","bark","berm",
    "bolt","bond","bud","bush","cliff","cloud","coast","coral","creek","crest",
    "crop","dale","dell","dune","dust","fern","fern","fjord","flaw","flea","flood",
    "flora","flue","flux","foam","fold","ford","fort","frost","gale","glade",
    "glyph","gnar","gorge","grain","grass","grove","gust","hail","heath","hedge",
    "hill","inlet","isle","knoll","loch","marsh","mire","moon","mound","pass",
    "pebble","petal","plain","plant","ridge","river","roots","rose","runnel",
    "shoal","shore","shrub","slope","stalk","stone","storm","stra","stream",
    "summit","swamp","sward","thorn","trail","tundra","vale","valley","veld",
    "verdure","water","wetland","amber","basalt","canyon","cavern","cobalt",
    "comet","crater","crystal","desert","drought","eclipse","estuary","evergreen",
    "forest","glacier","granite","harvest","horizon","island","jungle","lagoon",
    "meteor","mineral","monsoon","mountain","nebula","ocean","prairie","quartz",
    "ravine","sandbar","savanna","seabed","sediment","sierra","sinkhole","solstice",
    "spring","stalagmite","steppe","tempest","terrain","thunder","tornado","tropics",
    "tsunami","twilight","typhoon","volcano","waterfall","wilderness","zephyr",
  ],
  colors: [
    "red","tan","bay","ash","sky","jet","raw","gold","blue","cyan","cyan","cyan",
    "gray","grey","jade","lime","navy","pink","plum","rose","rust","ruby","sage",
    "teal","wine","amber","azure","beige","black","brown","coral","cream","denim",
    "ebony","green","indigo","ivory","khaki","lemon","lilac","mauve","mocha","ochre",
    "olive","peach","sandy","sepia","sienna","slate","straw","taupe","umber","virid",
    "white","aqua","bronze","cobalt","copper","crimson","forest","fuchsia","garnet",
    "indigo","maroon","mustard","orange","orchid","salmon","scarlet","silver","sienna",
    "violet","yellow","burgundy","cerulean","charcoal","chartreuse","chocolate","lavender",
    "magenta","midnight","saffron","sapphire","tangerine","turquoise","vermillion",
  ],
  emotions: [
    "awed","calm","dull","glad","hurt","keen","mild","numb","okay","smug","torn","wild",
    "angry","brave","eager","fiery","happy","livid","moody","proud","ready","rigid",
    "sorry","sweet","tense","tired","upset","vexed","wary","weary","afraid","amused",
    "bored","eager","elated","empty","envious","frantic","furious","gloomy","guilty",
    "hopeful","joyful","lonely","loving","mellow","nervy","pained","rested","scared",
    "shaken","shocked","sulky","tender","uneasy","wistful","worried","zealous",
    "anxious","ashamed","content","curious","devoted","ecstatic","excited","focused",
    "forlorn","gleeful","grumpy","hopeful","hostile","humbled","jealous","jittery",
    "jubilant","longing","melancholy","nostalgic","peaceful","relieved","remorseful",
    "resentful","restless","romantic","serene","shocked","thankful","thrilled","troubled",
  ],
  sports: [
    "polo","golf","judo","luge","yoga","swim","race","run","ski","box",
    "dive","surf","bike","bowl","curl","fish","hunt","jump","kick","lift",
    "pull","push","row","spar","trek","yoga","archery","chess","climb","cycle",
    "dance","drill","fling","hurdle","joust","kayak","pitch","press","rugby",
    "shoot","skate","slack","snipe","squat","strike","throw","vault","wrestle",
    "badminton","baseball","football","handball","lacrosse","marathon","rowing",
    "sailing","skating","soccer","softball","swimming","tennis","volleyball",
    "basketball","bicycling","croquet","darts","fencing","gymnastics","hockey",
    "motocross","paragliding","rafting","skiing","snowboard","squash","triathlon",
    "weightlifting","wrestling","canoeing","kickboxing","skydiving","athletics",
  ],
  professions: [
    "chef","monk","maid","spy","vet","aide","dean","king","mage","sage",
    "actor","agent","baker","boxer","coach","clerk","coder","cook","diver","judge",
    "mayor","medic","miner","nurse","pilot","rabbi","rider","scout","smith","tutor",
    "usher","vicar","writer","barber","bishop","broker","builder","butler","captain",
    "cashier","cleric","cooper","curate","dancer","dealer","deputy","doctor","driver",
    "editor","expert","farmer","fisher","jailer","jockey","lawyer","lender","logger",
    "magician","marshal","midwife","miller","officer","painter","pastor","plumber",
    "porter","potter","priest","ranger","sailor","singer","tailor","tanner","trader",
    "warden","weaver","worker","analyst","chemist","dentist","drafter","ecologist",
    "engineer","fireman","foreman","geologist","gunsmith","historian","janitor","jeweler",
    "lecturer","librarian","mechanic","musician","optician","organist","pharmacist",
    "planner","policeman","professor","psychologist","reporter","sculptor","soldier",
    "surgeon","teacher","therapist","architect","astronomer","biologist","carpenter",
    "conductor","consultant","contractor","counselor","custodian","economist","electrician",
    "geographer","illustrator","journalist","mathematician","philosopher","programmer",
    "scientist","statistician","veterinarian",
  ],
};

const CATEGORY_LABELS = {
  allEnglish: "All English Words",
  animals: "Animals — Full",
  animalsEasy: "Animals — Easy",
  countries: "Countries",
  cities: "Cities",
  foods: "Foods & Drinks",
  nature: "Nature",
  colors: "Colors",
  emotions: "Emotions",
  sports: "Sports",
  professions: "Professions",
};

// ================================================================
// T9 + SHAPE FILTER
// ================================================================
const T9 = {};
"ABC".split("").forEach(c => (T9[c] = "2"));
"DEF".split("").forEach(c => (T9[c] = "3"));
"GHI".split("").forEach(c => (T9[c] = "4"));
"JKL".split("").forEach(c => (T9[c] = "5"));
"MNO".split("").forEach(c => (T9[c] = "6"));
"PQRS".split("").forEach(c => (T9[c] = "7"));
"TUV".split("").forEach(c => (T9[c] = "8"));
"WXYZ".split("").forEach(c => (T9[c] = "9"));

const SHAPE = {
  "1": new Set(["4", "7"]),
  "2": new Set(["2", "5"]),
  "3": new Set(["3", "6", "8", "9"]),
};

const fold = (ch) =>
  ch.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toUpperCase()[0] || "";

function filterT9(code, pool) {
  return pool.filter((w) => {
    const letters = [...w].map(fold).filter(Boolean);
    if (letters.length !== code.length) return false;
    return letters.every((ch, i) => {
      const d = T9[ch];
      return d && SHAPE[code[i]]?.has(d);
    });
  });
}

// ================================================================
// POLYBIUS VIBRATION
// ================================================================
const GRID = "ABCDEFGHIJKLMNOPQRSTUVWXY";
const POLY = {};
GRID.split("").forEach((c, i) => {
  POLY[c] = [Math.floor(i / 5) + 1, (i % 5) + 1];
});

function buildPattern(letter, pDur = 120, gDur = 500) {
  const ch = fold(letter);
  if (ch === "Z") {
    const p = [];
    for (let i = 0; i < 6; i++) {
      p.push(pDur);
      if (i < 5) p.push(100);
    }
    return p;
  }
  const pos = POLY[ch];
  if (!pos) return [pDur];
  const [row, col] = pos;
  const p = [];
  for (let i = 0; i < row; i++) {
    p.push(pDur);
    if (i < row - 1) p.push(100);
  }
  p.push(gDur);
  for (let i = 0; i < col; i++) {
    p.push(pDur);
    if (i < col - 1) p.push(100);
  }
  return p;
}

// ================================================================
// DEPTH-2 LETTER PICKER
// ================================================================
function fset(word) {
  return new Set([...word].map(fold).filter(Boolean));
}

function getPool(cat, len) {
  let pool = WORDS[cat] || WORDS.allEnglish;
  const deduped = [...new Set(pool.map((w) => w.toLowerCase().trim()))].filter(
    (w) => /^[a-z]+$/.test(w)
  );
  if (len === "3-5") return deduped.filter((w) => w.length >= 3 && w.length <= 5);
  if (len === "5-7") return deduped.filter((w) => w.length >= 5 && w.length <= 7);
  if (len === "6-8") return deduped.filter((w) => w.length >= 6 && w.length <= 8);
  return deduped;
}

function pickLetter(candidates, usedSet) {
  if (!candidates.length) return null;
  const used = new Set(usedSet);
  const kept = [];

  const eligible = (locked) =>
    candidates.filter((w) => {
      const s = fset(w);
      return locked.every((k) => s.has(k));
    });

  const freq = (ws, ex) => {
    const m = new Map();
    ws.forEach((w) => fset(w).forEach((c) => !ex.has(c) && m.set(c, (m.get(c) || 0) + 1)));
    return m;
  };

  const noCount = (ws, k) => ws.filter((w) => !fset(w).has(k)).length;

  while (true) {
    const pool = eligible(kept);
    if (pool.length <= 1) break;
    const MIN = pool.length <= 6 ? 1 : 2;
    const counts = freq(pool, used);
    const cands = [...counts.entries()].filter(([, n]) => n >= MIN && n < pool.length);
    if (!cands.length) break;

    let best = null, bS1 = Infinity, bS2 = Infinity;
    for (const [k] of cands) {
      const s1 = noCount(pool, k);
      if (!s1) continue;
      const pool2 = pool.filter((w) => !fset(w).has(k));
      const c2 = freq(pool2, new Set([...used, k]));
      const MIN2 = pool2.length <= 6 ? 1 : 2;
      let s2 = s1;
      for (const [k2, n2] of c2.entries()) {
        if (n2 < MIN2 || n2 >= pool2.length) continue;
        const ss = noCount(pool2, k2);
        if (ss > 0 && ss < s2) s2 = ss;
      }
      if (s1 < bS1 || (s1 === bS1 && s2 < bS2)) {
        best = k; bS1 = s1; bS2 = s2;
      }
    }
    if (!best) break;
    kept.push(best);
    used.add(best);
  }
  return kept[kept.length - 1] || null;
}

// ================================================================
// SETTINGS
// ================================================================
const DEF = {
  cat: "allEnglish", len: "any", delay: 10,
  hints: false, pulse: 120, pause: 500,
  wall: "dark", fontSize: "medium",
};

function loadSett() {
  try { return { ...DEF, ...JSON.parse(localStorage.getItem("mc") || "{}") }; }
  catch { return { ...DEF }; }
}
function saveSett(s) {
  try { localStorage.setItem("mc", JSON.stringify(s)); } catch { }
}

// ================================================================
// REDUCER
// ================================================================
function init() {
  const s = loadSett();
  return {
    screen: "idle",
    code: "",
    pool: [],
    kept: [],
    used: [],
    letter: "",
    word: "",
    ...s,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "DIGIT":
      return { ...state, code: state.code + action.d };
    case "CLEAR":
      return { ...state, code: "" };
    case "CONFIRM": {
      const raw = getPool(state.cat, state.len);
      const filtered = filterT9(state.code, raw);
      if (!filtered.length) return { ...state, code: "", screen: "idle" };
      if (filtered.length === 1)
        return { ...state, code: "", screen: "countdown", word: filtered[0].toUpperCase() };
      const next = pickLetter(filtered, new Set());
      if (!next) return { ...state, code: "", screen: "pick", pool: filtered };
      return {
        ...state, code: "", screen: "question",
        pool: filtered, kept: [], used: [next], letter: next,
      };
    }
    case "YES": {
      const { letter: L, pool, kept, used } = state;
      const np = pool.filter((w) => fset(w).has(L));
      const nk = [...kept, L];
      const nu = new Set(used);
      if (np.length === 1) return { ...state, screen: "countdown", word: np[0].toUpperCase(), pool: np, kept: nk };
      if (!np.length) return { ...state, screen: "idle", pool: [], kept: [], used: [], letter: "", code: "" };
      const next = pickLetter(np, nu);
      if (!next) return { ...state, screen: "pick", pool: np, kept: nk };
      return { ...state, pool: np, kept: nk, used: [...nu, next], letter: next };
    }
    case "NO": {
      const { letter: L, pool, kept, used } = state;
      const np = pool.filter((w) => {
        const s = fset(w);
        if (s.has(L)) return false;
        return kept.every((k) => s.has(k));
      });
      const nu = new Set(used);
      if (np.length === 1) return { ...state, screen: "countdown", word: np[0].toUpperCase(), pool: np };
      if (!np.length) return { ...state, screen: "idle", pool: [], kept: [], used: [], letter: "", code: "" };
      const next = pickLetter(np, nu);
      if (!next) return { ...state, screen: "pick", pool: np };
      return { ...state, pool: np, used: [...nu, next], letter: next };
    }
    case "PICK":
      return { ...state, screen: "countdown", word: action.w.toUpperCase() };
    case "REVEAL":
      return { ...state, screen: "reveal" };
    case "RESET":
      return { ...init(), screen: "idle" };
    case "SETTINGS":
      return { ...state, screen: "settings" };
    case "LIST":
      return { ...state, screen: "list" };
    case "BACK":
      return { ...state, screen: "idle" };
    case "SET": {
      const ns = { ...state, [action.k]: action.v };
      saveSett({ cat: ns.cat, len: ns.len, delay: ns.delay, hints: ns.hints, pulse: ns.pulse, pause: ns.pause, wall: ns.wall, fontSize: ns.fontSize });
      return ns;
    }
    default: return state;
  }
}

// ================================================================
// APP
// ================================================================
export default function App() {
  const [st, dispatch] = useReducer(reducer, null, init);
  const stRef = useRef(st);
  stRef.current = st;

  const audioRef = useRef(null);
  const lastVolRef = useRef(0.5);
  const volTimerRef = useRef(null);
  const pendingUpRef = useRef(false);
  const codeTimerRef = useRef(null);
  const cdRef = useRef(null);
  const [cdSecs, setCdSecs] = useState(10);
  const [flash, setFlash] = useState(false);
  const longRef = useRef(null);
  const touchRef = useRef(null);
  const twoRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);
  const [callTime, setCallTime] = useState("");

  // Flash fallback for iOS
  const doFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 80);
  }, []);

  const vibrate = useCallback((pattern) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
    else doFlash();
  }, [doFlash]);

  const vibLetter = useCallback((letter) => {
    const s = stRef.current;
    vibrate(buildPattern(letter, s.pulse, s.pause));
  }, [vibrate]);

  // Volume direction handler
  const handleVol = useCallback((dir) => {
    const s = stRef.current;
    if (s.screen === "idle") {
      if (dir === "up") {
        if (pendingUpRef.current) {
          clearTimeout(volTimerRef.current);
          pendingUpRef.current = false;
          dispatch({ type: "CONFIRM" });
          return;
        }
        pendingUpRef.current = true;
        volTimerRef.current = setTimeout(() => {
          if (pendingUpRef.current) {
            pendingUpRef.current = false;
            dispatch({ type: "DIGIT", d: "1" });
            clearTimeout(codeTimerRef.current);
            codeTimerRef.current = setTimeout(() => dispatch({ type: "CLEAR" }), 8000);
          }
        }, 450);
      } else {
        if (pendingUpRef.current) {
          clearTimeout(volTimerRef.current);
          pendingUpRef.current = false;
          dispatch({ type: "DIGIT", d: "2" });
        } else {
          dispatch({ type: "DIGIT", d: "3" });
        }
        clearTimeout(codeTimerRef.current);
        codeTimerRef.current = setTimeout(() => dispatch({ type: "CLEAR" }), 8000);
      }
    } else if (s.screen === "question") {
      if (dir === "up") dispatch({ type: "YES" });
      else dispatch({ type: "NO" });
    }
  }, []);

  // Init audio for volume detection
  useEffect(() => {
    const audio = new Audio();
    audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
    audio.loop = true;
    audio.volume = 0.5;
    lastVolRef.current = 0.5;
    audioRef.current = audio;

    const onVolChange = () => {
      const nv = audio.volume;
      const dir = nv > lastVolRef.current ? "up" : "down";
      lastVolRef.current = nv;
      handleVol(dir);
    };
    audio.addEventListener("volumechange", onVolChange);
    return () => {
      audio.removeEventListener("volumechange", onVolChange);
      audio.pause();
    };
  }, [handleVol]);

  // Vibrate next letter when question changes
  useEffect(() => {
    if (st.screen === "question" && st.letter) {
      const t = setTimeout(() => vibLetter(st.letter), 500);
      return () => clearTimeout(t);
    }
  }, [st.letter, st.screen, vibLetter]);

  // Countdown timer
  useEffect(() => {
    if (st.screen === "countdown") {
      let secs = st.delay;
      setCdSecs(secs);
      cdRef.current = setInterval(() => {
        secs--;
        setCdSecs(secs);
        if (secs <= 0) {
          clearInterval(cdRef.current);
          dispatch({ type: "REVEAL" });
        }
      }, 1000);
    }
    return () => clearInterval(cdRef.current);
  }, [st.screen, st.delay]);

  // Call screen clock
  useEffect(() => {
    if (st.screen === "reveal") {
      const update = () => {
        const d = new Date();
        setCallTime(`${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`);
      };
      update();
      const t = setInterval(update, 1000);
      return () => clearInterval(t);
    }
  }, [st.screen]);

  // Touch gestures
  const onTouchStart = useCallback((e) => {
    if (st.screen !== "idle") return;
    if (e.touches.length === 2) {
      twoRef.current = e.touches[0].clientY;
    } else {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      longRef.current = setTimeout(() => dispatch({ type: "LIST" }), 600);
    }
  }, [st.screen]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && twoRef.current !== null) {
      if (e.touches[0].clientY - twoRef.current > 80) {
        twoRef.current = null;
        dispatch({ type: "SETTINGS" });
      }
    }
    if (longRef.current && touchRef.current && e.touches.length === 1) {
      const dx = Math.abs(e.touches[0].clientX - touchRef.current.x);
      const dy = Math.abs(e.touches[0].clientY - touchRef.current.y);
      if (dx > 10 || dy > 10) clearTimeout(longRef.current);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    clearTimeout(longRef.current);
    twoRef.current = null;
  }, []);

  const startAudio = () => {
    audioRef.current?.play().catch(() => { });
    setAudioReady(true);
  };

  return (
    <div
      style={{ background: "#000", width: "100vw", height: "100vh", overflow: "hidden", userSelect: "none", WebkitUserSelect: "none", touchAction: "none" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {flash && (
        <div style={{ position: "fixed", inset: 0, background: "#fff", opacity: 0.9, zIndex: 9999, pointerEvents: "none" }} />
      )}

      {/* Tap-to-activate overlay */}
      {!audioReady && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, cursor: "pointer" }}
          onClick={startAudio}
        />
      )}

      <AnimatePresence mode="wait">
        {(st.screen === "idle" || st.screen === "countdown") && (
          <BlackScreen key="black" hints={st.hints} cdSecs={cdSecs} isCountdown={st.screen === "countdown"} />
        )}
        {st.screen === "question" && (
          <QuestionScreen key="q" letter={st.letter} count={st.pool.length} hints={st.hints} />
        )}
        {st.screen === "pick" && (
          <PickScreen key="pick" words={st.pool} onPick={(w) => dispatch({ type: "PICK", w })} />
        )}
        {st.screen === "reveal" && (
          <CallScreen key="call" word={st.word} time={callTime} wall={st.wall} fontSize={st.fontSize}
            onDecline={() => dispatch({ type: "RESET" })}
            onAccept={() => setTimeout(() => dispatch({ type: "RESET" }), 1000)}
          />
        )}
        {st.screen === "settings" && (
          <SettingsScreen key="settings" st={st} dispatch={dispatch} />
        )}
        {st.screen === "list" && (
          <ListScreen key="list" st={st} dispatch={dispatch} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ================================================================
// BLACK SCREEN
// ================================================================
function BlackScreen({ hints, cdSecs, isCountdown }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "#000" }}
    >
      {isCountdown && hints && (
        <div style={{ position: "absolute", bottom: 40, right: 20, color: "#1a1a1a", fontSize: 11, fontFamily: "monospace" }}>
          {cdSecs}
        </div>
      )}
    </motion.div>
  );
}

// ================================================================
// QUESTION SCREEN
// ================================================================
function QuestionScreen({ letter, count, hints }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
    >
      <motion.div
        key={letter}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ color: "#fff", fontSize: 200, fontWeight: 900, fontFamily: "'Georgia', serif", lineHeight: 1 }}
      >
        {letter}
      </motion.div>
      <div style={{ color: "#222", fontSize: 12, fontFamily: "monospace", marginTop: 12, letterSpacing: 4 }}>
        IN YOUR WORD?
      </div>
      {hints && (
        <div style={{ position: "absolute", bottom: 30, right: 24, color: "#1c1c1c", fontSize: 10, fontFamily: "monospace" }}>
          {count}
        </div>
      )}
    </motion.div>
  );
}

// ================================================================
// PICK SCREEN
// ================================================================
function PickScreen({ words, onPick }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 32 }}
    >
      {words.slice(0, 8).map((w) => (
        <button key={w} onClick={() => onPick(w)}
          style={{ color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: "'Georgia', serif", background: "none", border: "1px solid #222", borderRadius: 12, padding: "12px 28px", cursor: "pointer", width: "100%", textTransform: "uppercase", letterSpacing: 6 }}
        >
          {w}
        </button>
      ))}
    </motion.div>
  );
}

// ================================================================
// CALL SCREEN
// ================================================================
function CallScreen({ word, time, wall, fontSize, onDecline, onAccept }) {
  const fz = { small: 26, medium: 34, large: 44 }[fontSize] || 34;
  const bg = wall === "gradient1"
    ? "linear-gradient(180deg,#0f0c29 0%,#302b63 50%,#24243e 100%)"
    : wall === "gradient2"
      ? "linear-gradient(180deg,#1a0000 0%,#2d1515 50%,#1a0000 100%)"
      : wall === "gradient3"
        ? "linear-gradient(180deg,#001a00 0%,#0a2e0a 50%,#001a00 100%)"
        : "#1C1C1E";

  return (
    <motion.div
      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      style={{ position: "fixed", inset: 0, background: bg, display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Status bar */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "14px 22px 0", alignItems: "center" }}>
        <span style={{ color: "#fff", fontSize: 17, fontWeight: 600, fontFamily: "system-ui" }}>{time}</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
            <rect x="0" y="8" width="3" height="4" rx="0.5" />
            <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
            <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" />
            <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
            <path d="M7.5 2.5A7 7 0 0 1 13.5 5.5l-1.5 1.5a5 5 0 0 0-4.5-3 5 5 0 0 0-4.5 3L1.5 5.5A7 7 0 0 1 7.5 2.5z" />
            <path d="M7.5 5A4 4 0 0 1 11 7l-1.5 1.5a2 2 0 0 0-2-1.5 2 2 0 0 0-2 1.5L4 7A4 4 0 0 1 7.5 5z" />
            <circle cx="7.5" cy="10" r="1.5" />
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="white" strokeOpacity="0.35" />
            <rect x="2" y="2" width="15" height="8" rx="1.5" fill="white" />
            <path d="M22 4.5v3a1.5 1.5 0 0 0 0-3z" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Pulsing label */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: "#8E8E93", fontSize: 14, fontFamily: "system-ui", marginTop: 18, letterSpacing: 0.2 }}
      >
        incoming call
      </motion.div>

      {/* Avatar */}
      <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#3A3A3C", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 28 }}>
        <svg width="52" height="52" viewBox="0 0 52 52" fill="#8E8E93">
          <circle cx="26" cy="18" r="11" />
          <path d="M4 46c0-12 9.8-20 22-20s22 8 22 20" />
        </svg>
      </div>

      {/* Caller name */}
      <div style={{ color: "#fff", fontSize: fz, fontWeight: 700, fontFamily: "system-ui", marginTop: 18, letterSpacing: 0.3, textAlign: "center", padding: "0 20px", maxWidth: "100%" }}>
        {word}
      </div>
      <div style={{ color: "#8E8E93", fontSize: 15, fontFamily: "system-ui", marginTop: 5 }}>mobile</div>

      {/* Buttons */}
      <div style={{ position: "absolute", bottom: "max(env(safe-area-inset-bottom,0px), 40px)", width: "100%", display: "flex", justifyContent: "space-around", padding: "0 40px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <button onClick={onDecline}
            style={{ width: 72, height: 72, borderRadius: "50%", background: "#FF3B30", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(255,59,48,0.4)" }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="white">
              <path d="M3 24 C6 18 8 17 15 17 C22 17 24 18 27 24 L24 27 C22 25 20 24 15 24 C10 24 8 25 6 27 Z" transform="rotate(135,15,15)" />
            </svg>
          </button>
          <span style={{ color: "#8E8E93", fontSize: 13, fontFamily: "system-ui" }}>Decline</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <button onClick={onAccept}
            style={{ width: 72, height: 72, borderRadius: "50%", background: "#34C759", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(52,199,89,0.4)" }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="white">
              <path d="M3 6 C6 0 8 -1 15 -1 C22 -1 24 0 27 6 L24 9 C22 7 20 6 15 6 C10 6 8 7 6 9 Z" />
            </svg>
          </button>
          <span style={{ color: "#8E8E93", fontSize: 13, fontFamily: "system-ui" }}>Accept</span>
        </div>
      </div>
    </motion.div>
  );
}

// ================================================================
// SETTINGS SCREEN
// ================================================================
function SettingsScreen({ st, dispatch }) {
  const set = (k, v) => dispatch({ type: "SET", k, v });
  const cats = Object.keys(CATEGORY_LABELS);

  return (
    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ position: "fixed", inset: 0, background: "#1C1C1E", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
    >
      <div style={{ padding: "56px 16px 60px", maxWidth: 500, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, fontFamily: "system-ui", margin: 0 }}>Settings</h1>
          <button onClick={() => dispatch({ type: "BACK" })}
            style={{ color: "#fff", background: "#3A3A3C", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 18, fontFamily: "system-ui", display: "flex", alignItems: "center", justifyContent: "center" }}
          >×</button>
        </div>

        <Sect label="WORD CATEGORY">
          {cats.map((c) => (
            <SRow key={c} label={CATEGORY_LABELS[c]} sub={`${WORDS[c].length} words`} active={st.cat === c} onClick={() => set("cat", c)} />
          ))}
        </Sect>

        <Sect label="WORD LENGTH">
          <div style={{ display: "flex", gap: 8, padding: "12px 0" }}>
            {[["any", "Any"], ["3-5", "3–5"], ["5-7", "5–7"], ["6-8", "6–8"]].map(([v, l]) => (
              <button key={v} onClick={() => set("len", v)}
                style={{ flex: 1, padding: "9px 4px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "system-ui", fontWeight: 600, background: st.len === v ? "#0A84FF" : "#3A3A3C", color: "#fff" }}
              >{l}</button>
            ))}
          </div>
        </Sect>

        <Sect label="CALL SETTINGS">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #2C2C2E" }}>
            <span style={{ color: "#fff", fontFamily: "system-ui" }}>Call delay</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Btn label="−" onClick={() => set("delay", Math.max(1, st.delay - 1))} />
              <span style={{ color: "#0A84FF", fontFamily: "system-ui", fontWeight: 700, minWidth: 44, textAlign: "center" }}>{st.delay}s</span>
              <Btn label="+" onClick={() => set("delay", Math.min(30, st.delay + 1))} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #2C2C2E" }}>
            <span style={{ color: "#fff", fontFamily: "system-ui" }}>Caller font size</span>
            <div style={{ display: "flex", gap: 8 }}>
              {["small", "medium", "large"].map((s) => (
                <button key={s} onClick={() => set("fontSize", s)}
                  style={{ padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontFamily: "system-ui", background: st.fontSize === s ? "#0A84FF" : "#3A3A3C", color: "#fff", textTransform: "capitalize" }}
                >{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
            <span style={{ color: "#fff", fontFamily: "system-ui" }}>Wallpaper theme</span>
            <div style={{ display: "flex", gap: 8 }}>
              {[["dark", "#1C1C1E"], ["gradient1", "linear-gradient(#0f0c29,#24243e)"], ["gradient2", "linear-gradient(#1a0000,#2d1515)"], ["gradient3", "linear-gradient(#001a00,#0a2e0a)"]].map(([v, bg]) => (
                <button key={v} onClick={() => set("wall", v)}
                  style={{ width: 30, height: 30, borderRadius: 7, border: st.wall === v ? "2px solid #0A84FF" : "2px solid #555", cursor: "pointer", background: bg }}
                />
              ))}
            </div>
          </div>
        </Sect>

        <Sect label="VIBRATION">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #2C2C2E" }}>
            <span style={{ color: "#fff", fontFamily: "system-ui" }}>Pulse duration</span>
            <div style={{ display: "flex", gap: 8 }}>
              {[80, 120, 160].map((d) => (
                <button key={d} onClick={() => set("pulse", d)}
                  style={{ padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontFamily: "system-ui", background: st.pulse === d ? "#0A84FF" : "#3A3A3C", color: "#fff" }}
                >{d}ms</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
            <span style={{ color: "#fff", fontFamily: "system-ui" }}>Group pause</span>
            <div style={{ display: "flex", gap: 8 }}>
              {[400, 500, 700].map((d) => (
                <button key={d} onClick={() => set("pause", d)}
                  style={{ padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontFamily: "system-ui", background: st.pause === d ? "#0A84FF" : "#3A3A3C", color: "#fff" }}
                >{d}ms</button>
              ))}
            </div>
          </div>
        </Sect>

        <Sect label="PERFORMANCE">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
            <span style={{ color: "#fff", fontFamily: "system-ui" }}>Show candidate count</span>
            <Toggle on={st.hints} onClick={() => set("hints", !st.hints)} />
          </div>
        </Sect>

        <div style={{ color: "#444", fontSize: 12, fontFamily: "system-ui", textAlign: "center", marginTop: 32 }}>
          MindCall v1.0 — Mentalism Performance Tool
        </div>
      </div>
    </motion.div>
  );
}

// ================================================================
// LIST QUICK-SELECT
// ================================================================
function ListScreen({ st, dispatch }) {
  const set = (k, v) => dispatch({ type: "SET", k, v });
  const cats = Object.keys(CATEGORY_LABELS);
  return (
    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#2C2C2E", borderRadius: "20px 20px 0 0", padding: "16px 16px 48px", maxHeight: "75vh", overflowY: "auto" }}
    >
      <div style={{ width: 36, height: 4, background: "#555", borderRadius: 2, margin: "0 auto 18px" }} />
      <h2 style={{ color: "#fff", fontFamily: "system-ui", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Select List</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {cats.map((c) => (
          <button key={c} onClick={() => set("cat", c)}
            style={{ padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontFamily: "system-ui", background: st.cat === c ? "#0A84FF" : "#3A3A3C", color: "#fff", fontWeight: st.cat === c ? 700 : 400 }}
          >{CATEGORY_LABELS[c]}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["any", "Any"], ["3-5", "3–5"], ["5-7", "5–7"], ["6-8", "6–8"]].map(([v, l]) => (
          <button key={v} onClick={() => set("len", v)}
            style={{ flex: 1, padding: "10px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "system-ui", fontWeight: 600, background: st.len === v ? "#0A84FF" : "#3A3A3C", color: "#fff" }}
          >{l}</button>
        ))}
      </div>
      <button onClick={() => dispatch({ type: "BACK" })}
        style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "#3A3A3C", color: "#fff", fontFamily: "system-ui", fontSize: 15, cursor: "pointer", fontWeight: 600 }}
      >Done</button>
    </motion.div>
  );
}

// ================================================================
// UI HELPERS
// ================================================================
function Sect({ label, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ color: "#8E8E93", fontSize: 11, fontFamily: "system-ui", letterSpacing: 0.8, marginBottom: 8, textTransform: "uppercase", paddingLeft: 4 }}>{label}</div>
      <div style={{ background: "#2C2C2E", borderRadius: 12, padding: "0 16px" }}>{children}</div>
    </div>
  );
}

function SRow({ label, sub, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "14px 0", borderBottom: "1px solid #3A3A3C", background: "none", border: "none", borderBottom: "1px solid #3A3A3C", cursor: "pointer", textAlign: "left" }}
    >
      <span style={{ color: "#fff", fontFamily: "system-ui", fontSize: 15 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#555", fontSize: 12, fontFamily: "system-ui" }}>{sub}</span>
        {active && <span style={{ color: "#34C759", fontSize: 17 }}>✓</span>}
      </div>
    </button>
  );
}

function Btn({ label, onClick }) {
  return (
    <button onClick={onClick}
      style={{ color: "#fff", background: "#3A3A3C", border: "none", borderRadius: 7, width: 30, height: 30, cursor: "pointer", fontSize: 18, fontFamily: "system-ui", display: "flex", alignItems: "center", justifyContent: "center" }}
    >{label}</button>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick}
      style={{ width: 51, height: 31, borderRadius: 16, background: on ? "#34C759" : "#3A3A3C", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
    >
      <div style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 27, height: 27, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
    </button>
  );
}
