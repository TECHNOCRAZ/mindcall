import { useState, useEffect, useReducer, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────
// WORD LISTS
// ─────────────────────────────────────────────
const WORDS = {
  allEnglish: [
    "able","acid","aged","also","area","army","atom","away","baby","back","ball","band",
    "bank","base","bath","bear","beat","beef","bell","belt","bend","best","bind","bird",
    "bite","black","blow","blue","bold","bolt","bond","bone","book","bore","boss","both",
    "bowl","break","bright","bring","brown","buck","bull","burn","busy","cake","calm","camp",
    "cape","card","care","carry","cart","cave","cell","change","check","chip","chop","city",
    "clap","clay","clip","club","coal","code","coin","cold","come","cool","copy","core",
    "cork","corn","cost","cozy","crab","crew","crop","cure","dark","dash","dawn","deal",
    "dean","debt","deck","deed","deep","deer","deny","desk","dial","dice","diet","dine",
    "dirt","disk","dive","dock","dome","door","dose","dove","down","drag","draw","drive",
    "drop","drum","duke","dull","dusk","dust","duty","each","earl","earn","easy","echo",
    "edge","edit","emit","envy","epic","even","exam","exit","face","fact","fade","fail",
    "fake","fame","fare","fast","fate","fear","feed","feel","fell","felt","fern","file",
    "fill","film","find","fine","fire","firm","fish","fist","flaw","flea","flex","flow",
    "foam","fold","folk","fond","font","food","foot","ford","fork","form","foul","free",
    "frog","fuel","full","fund","fuse","gain","gale","game","gang","gasp","gave","gaze",
    "gear","gene","gift","gill","glad","glow","glue","goal","gold","gone","good","gore",
    "gown","grab","gray","great","green","grid","grin","grit","grow","gulf","gull","gulp",
    "hail","hair","half","halt","hand","hard","harp","hash","hate","hawk","head","heal",
    "heap","heat","heel","heir","helm","herb","herd","high","hike","hill","hint","hire",
    "hive","hold","hole","home","hoop","hope","horn","host","huge","hulk","hull","hunt",
    "hurt","hymn","idea","idle","inch","iron","jade","jest","join","joke","jolt","jump",
    "keen","keep","kill","kind","king","kiss","knee","knit","know","lack","lady","lake",
    "lamb","lame","lamp","land","lane","lark","lash","last","late","lawn","lead","lean",
    "leap","learn","left","less","life","lift","light","lime","line","link","lint","lion",
    "list","live","load","lock","loft","lone","long","lore","lost","loud","love","luck",
    "lure","lurk","lust","mace","main","make","mall","malt","mane","many","mark","mass",
    "mast","math","maze","mean","meat","meet","melt","mesh","mild","milk","mind","mine",
    "miss","mist","moat","mode","mole","monk","moon","more","moss","moth","move","much",
    "mule","must","myth","nail","name","navy","neck","need","nest","news","nick","night",
    "none","nook","norm","nose","note","noun","obey","odds","omen","once","only","open",
    "oval","pace","pack","page","pair","pale","pane","park","part","past","path","peak",
    "peel","pest","pick","pier","pile","pint","pipe","pity","place","plan","play","plow",
    "plum","poem","poke","pole","poll","pond","pore","port","post","pour","power","prey",
    "prop","pull","pump","punk","punt","pure","push","rack","raid","rain","rake","ramp",
    "rank","rare","rash","rate","rave","reach","real","reef","reel","rent","rest","rich",
    "ring","rind","riot","ripe","rise","risk","rite","road","roam","robe","rock","role",
    "roll","roof","room","root","rope","rose","rule","rush","rust","safe","sage","sail",
    "sake","salt","sand","sane","save","seal","seam","seat","seed","seep","self","sell",
    "send","shed","ship","show","sigh","silk","sill","sink","size","skin","slow","small",
    "smell","smile","snow","soil","sole","some","song","soot","soul","sour","span","spin",
    "spot","spur","stab","star","stay","stem","step","stir","stop","store","stub","stun",
    "suck","suit","sulk","surf","swap","sway","swim","tale","talk","tall","tame","tape",
    "tart","taut","teak","teal","tear","tell","test","tide","tile","tilt","time","tire",
    "toad","toil","toll","tomb","tone","tool","toss","town","trap","tree","trim","trip",
    "trot","true","tuft","turf","turn","type","unit","upon","urge","vain","vale","vane",
    "vase","vast","veil","vein","verb","vest","vial","vice","view","vine","void","volt",
    "wade","wail","wake","walk","wand","wane","want","warm","warp","wash","wasp","wave",
    "wear","weed","well","wide","wild","will","wind","wing","wish","wolf","wood","word",
    "work","wren","yard","yawn","yell","yoke","zeal","zero","zest","zinc","zone",
    "about","above","abuse","actor","adapt","admit","adopt","adult","after","again","agent",
    "agree","ahead","alarm","album","alert","alien","align","alike","alive","alley","allow",
    "alter","amber","amend","angel","anger","angle","ankle","annex","apart","apple","apply",
    "arena","argue","arise","armor","aroma","arose","array","arrow","asset","atlas","attic",
    "audio","audit","avoid","awake","award","aware","awful","badly","baker","basic","basis",
    "beach","beast","began","begin","bench","blade","blame","bland","blank","blast","blaze",
    "bleed","blend","bless","blind","block","blood","bloom","blown","blunt","board","boast",
    "booth","boost","brace","braid","brain","brave","bread","bride","brief","brisk","broad",
    "brook","broth","brush","buddy","build","built","bulge","bunch","burst","buyer","cabin",
    "canal","candy","cease","chain","chalk","chase","cheap","cheat","cheek","cheer","chess",
    "chest","chick","chief","child","choir","choke","chunk","churn","civil","claim","clamp",
    "clash","clasp","class","claws","clean","clear","click","cliff","cling","cloak","clone",
    "close","cloth","cloud","clout","clove","couch","could","count","court","cover","crack",
    "crane","crash","crawl","crazy","creek","crisp","cross","cruel","crush","crust","cycle",
    "dairy","dance","decay","delta","dense","depth","dodge","doubt","dough","draft","drain",
    "drape","dread","dream","dress","dried","drift","drill","drink","droop","drove","drown",
    "dwarf","dwell","eager","eagle","early","earth","eight","elbow","elder","elite","ember",
    "empty","enemy","enjoy","enter","equal","error","essay","event","every","exact","exert",
    "faith","false","fancy","feast","fever","fewer","fiber","field","fiery","fifth","fifty",
    "fight","final","first","fixed","fizzy","flame","flare","flash","flask","flesh","flint",
    "float","flock","flood","floor","flush","flute","focus","force","forge","forth","found",
    "frame","frank","fraud","fresh","front","froze","fruit","fully","fuzzy","ghost","given",
    "glass","gleam","glint","gloom","glory","gloss","glove","going","grace","grade","grain",
    "grand","grant","grape","grasp","grass","grave","graze","greed","greet","grief","groan",
    "group","grove","guard","guess","guide","guild","guile","guise","gusto","happy","haven",
    "heard","heart","heavy","hedge","hence","house","human","humor","hurry","image","imply",
    "index","inner","input","issue","judge","juice","juicy","knack","knife","knock","known",
    "label","lance","large","laser","laugh","layer","lease","least","legal","level","limit",
    "liner","liver","lobby","local","lodge","logic","loose","lower","loyal","lunar","lusty",
    "magic","maker","manor","maple","march","match","mayor","medal","mercy","merge","merit",
    "metal","model","money","month","moral","motor","motto","mound","mount","mouse","mouth",
    "movie","muddy","music","nasty","noble","noise","north","novel","nurse","nymph","occur",
    "offer","often","order","other","outer","owner","paint","panic","paper","pause","peace",
    "penny","photo","piano","pilot","pitch","plain","plane","plant","plate","plaza","plead",
    "pleat","pluck","plume","point","poker","polar","pound","price","pride","prime","print",
    "prior","prize","probe","prove","prowl","psalm","puffy","pulse","pupil","purse","quake",
    "queen","query","quest","quick","quiet","quota","quote","radar","radio","rally","ranch",
    "range","rapid","ratio","reach","realm","rebel","recap","relay","remix","renew","repay",
    "rider","ridge","rifle","risky","rival","river","robot","rocky","rouge","rough","round",
    "route","royal","ruler","rural","sadly","saint","salad","sauce","scale","scare","scene",
    "scent","score","scout","screw","scrub","seize","sense","serve","seven","shade","shaft",
    "shake","shall","shame","shark","sharp","shear","sheen","sheer","sheet","shelf","shell",
    "shift","shock","shore","shout","shove","sight","since","sixth","sixty","slack","slain",
    "slash","slave","sleek","sleep","slice","slide","slime","sling","slope","sloth","smart",
    "smash","smear","smoke","snack","snake","snare","sneak","solid","solve","sorry","south",
    "space","spare","spark","speak","spear","speck","speed","spell","spend","spice","spill",
    "spite","split","spoke","squad","stain","stair","stale","stall","stamp","stand","stare",
    "stark","start","state","steam","steel","steep","steer","stern","stiff","sting","stone",
    "stood","stoop","storm","story","stout","stove","stray","strip","strut","study","style",
    "sugar","suite","sunny","super","surge","swamp","swear","sweat","sweep","sweet","swept",
    "swift","swirl","sword","swore","sworn","table","taunt","taste","teach","tempo","tense",
    "tenth","terms","theft","theme","thick","thing","think","third","thorn","three","threw",
    "throw","thumb","tiger","tight","timer","tired","title","today","token","torch","total",
    "touch","tough","tower","towel","trace","track","trade","train","trait","tramp","trend",
    "trial","trick","tried","trill","troop","trout","truck","truly","trump","trunk","truth",
    "tulip","tumor","tuner","tweak","twice","twist","under","unify","union","unity","until",
    "upper","upset","urban","usage","usher","usual","utter","valid","valor","value","valve",
    "vapor","vault","verse","video","vigor","viral","virus","visit","vista","vital","vivid",
    "vixen","vocal","voice","voter","waste","watch","water","weave","wedge","weigh","weird",
    "where","while","white","whole","whose","wider","witty","woman","women","world","worry",
    "worse","worst","worth","would","wound","wrote","young","youth","zebra",
  ],
  animals: [
    "ant","ape","bat","bee","cat","cod","cow","cub","doe","dog","elk","emu","ewe","fly",
    "fox","gnu","hen","hog","jay","koi","owl","pig","ram","rat","yak","bear","bird","boar",
    "buck","bull","calf","clam","colt","crab","crow","deer","dove","duck","fawn","flea",
    "frog","gnat","goat","hare","hawk","ibis","kite","lamb","lark","lion","loon","lynx",
    "mink","mole","moth","mule","newt","pony","puma","slug","swan","toad","vole","wasp",
    "wolf","wren","adder","bison","crane","dingo","eagle","egret","finch","gecko","guppy",
    "hippo","horse","hound","hyena","koala","llama","macaw","moose","mouse","otter","panda",
    "quail","raven","shark","skunk","sloth","snake","squid","stork","tapir","tiger","trout",
    "viper","whale","zebra","alpaca","beaver","bobcat","canary","condor","donkey","falcon",
    "ferret","gibbon","iguana","jaguar","lizard","locust","magpie","monkey","parrot","pigeon",
    "rabbit","salmon","spider","toucan","turkey","turtle","walrus","weasel","badger","beetle",
    "buffalo","chicken","dolphin","gorilla","hamster","leopard","lobster","panther","penguin",
    "raccoon","sparrow","vulture","cheetah","elephant","flamingo","hedgehog","kangaroo",
    "porcupine","alligator","armadillo",
  ],
  animalsEasy: [
    "ant","bat","bee","cat","cow","dog","elk","emu","fly","fox","hen","hog","owl","pig",
    "ram","rat","bear","bull","calf","crab","crow","deer","dove","duck","fish","frog","goat",
    "hare","hawk","lamb","lion","mole","mule","pony","swan","toad","wolf","wren","crane",
    "eagle","finch","gecko","hippo","horse","hyena","koala","llama","moose","mouse","otter",
    "panda","shark","skunk","sloth","snake","stork","tiger","whale","zebra","donkey","monkey",
    "parrot","rabbit","salmon","spider","turtle","walrus","chicken","dolphin","gorilla",
    "leopard","penguin","raccoon","cheetah","elephant","flamingo","kangaroo",
  ],
  countries: [
    "chad","cuba","fiji","iran","iraq","laos","mali","oman","peru","togo","china","egypt",
    "ghana","india","italy","japan","kenya","libya","nepal","niger","qatar","spain","sudan",
    "syria","tonga","wales","yemen","angola","belize","brazil","canada","cyprus","france",
    "greece","guinea","guyana","israel","jordan","kuwait","malawi","mexico","monaco","norway",
    "panama","poland","rwanda","serbia","sweden","taiwan","turkey","uganda","albania","algeria",
    "armenia","austria","bahrain","belarus","belgium","bolivia","burundi","comoros","croatia",
    "denmark","ecuador","eritrea","estonia","finland","georgia","germany","grenada","hungary",
    "iceland","ireland","jamaica","lebanon","lesotho","liberia","moldova","mongolia","morocco",
    "myanmar","namibia","nigeria","pakistan","romania","senegal","somalia","ukraine","uruguay",
    "vietnam","zambia","zimbabwe","cambodia","colombia","djibouti","dominica","ethiopia",
    "honduras","kiribati","malaysia","maldives","portugal","slovakia","slovenia","suriname",
    "tanzania","thailand","barbados","bulgaria","indonesia","lithuania","mauritius","singapore",
  ],
  cities: [
    "rome","lima","oslo","bern","doha","riga","cairo","dubai","paris","tokyo","delhi","lagos",
    "dhaka","accra","hanoi","seoul","miami","abuja","tunis","osaka","vienna","prague","warsaw",
    "athens","lisbon","dublin","moscow","sydney","taipei","nairobi","jakarta","karachi",
    "bangkok","beijing","chicago","houston","toronto","montreal","berlin","madrid","london",
    "havana","bogota","manila","mumbai","shanghai","brussels","istanbul","singapore","amsterdam",
    "budapest","helsinki","stockholm","melbourne","auckland","santiago","caracas","casablanca",
    "johannesburg","copenhagen","edinburgh","manchester","barcelona","frankfurt","hamburg",
  ],
  foods: [
    "ale","bun","jam","pie","tea","fig","ham","oat","rye","cod","egg","oil","rum","gin",
    "beef","beet","bran","brie","cake","chip","clam","corn","crab","dill","duck","feta",
    "fish","flan","herb","kale","lamb","leek","lime","lard","mayo","meat","milk","mint",
    "miso","naan","oats","okra","pear","pita","plum","pork","rice","sage","salt","soup",
    "soya","stew","taco","tofu","tuna","wine","yolk","apple","basil","berry","bread","brine",
    "broth","candy","celery","cheese","chili","chips","cider","clove","cocoa","cream","curry",
    "dates","donut","dough","drink","flour","fudge","grape","gravy","guava","honey","juice",
    "kebab","lemon","liver","lychee","mango","maple","melon","mocha","olive","onion","pasta",
    "peach","pecan","pesto","pizza","prawn","punch","ramen","salad","sauce","scone","shrimp",
    "snack","spice","squid","steak","sugar","sweet","syrup","thyme","toast","vodka","waffle",
    "wheat","yogurt","almond","banana","brandy","butter","cashew","cherry","coffee","cookie",
    "fennel","garlic","ginger","lobster","muffin","orange","papaya","pepper","potato","radish",
    "salmon","tomato","turkey","walnut","anchovy","avocado","broccoli","brownie","burrito",
    "coconut","custard","granola","lettuce","pancake","parsley","peanut","pretzel","pudding",
    "sausage","spinach","vanilla","whiskey","zucchini","blueberry","chocolate","cinnamon",
    "croissant","mushroom","raspberry","strawberry",
  ],
  nature: [
    "ash","bay","bog","clay","crag","dew","fen","fog","gem","ice","ivy","kelp","lake","lava",
    "leaf","loam","mesa","mist","moss","mud","oak","peat","pine","pond","pool","rain","reef",
    "rock","sand","silt","snow","soil","star","stem","tide","vale","wave","wind","wood","bark",
    "bush","cliff","cloud","coast","coral","creek","crest","crop","dale","dell","dune","dust",
    "fern","fjord","flora","frost","gale","glade","gorge","grain","grass","grove","gust","hail",
    "heath","hedge","hill","inlet","isle","knoll","loch","marsh","mire","moon","mound","pebble",
    "petal","plain","plant","ridge","river","roots","rose","shore","shrub","slope","stalk",
    "stone","storm","stream","swamp","thorn","trail","water","amber","basalt","canyon","cavern",
    "comet","crater","crystal","desert","drought","eclipse","estuary","forest","glacier",
    "granite","harvest","horizon","island","jungle","lagoon","meteor","mineral","monsoon",
    "mountain","nebula","ocean","prairie","quartz","ravine","savanna","seabed","sierra",
    "solstice","spring","steppe","tempest","terrain","thunder","tornado","tropics","tsunami",
    "twilight","typhoon","volcano","waterfall","wilderness","zephyr",
  ],
  colors: [
    "red","tan","bay","ash","sky","jet","gold","blue","cyan","gray","grey","jade","lime","navy",
    "pink","plum","rose","rust","ruby","sage","teal","wine","amber","azure","beige","black",
    "brown","coral","cream","denim","ebony","green","ivory","khaki","lemon","lilac","mauve",
    "mocha","ochre","olive","peach","sandy","sepia","slate","straw","taupe","umber","white",
    "aqua","bronze","cobalt","copper","crimson","forest","fuchsia","garnet","indigo","maroon",
    "mustard","orange","orchid","salmon","scarlet","silver","sienna","violet","yellow","burgundy",
    "cerulean","charcoal","chartreuse","chocolate","lavender","magenta","midnight","saffron",
    "sapphire","tangerine","turquoise","vermillion",
  ],
  emotions: [
    "awed","calm","glad","hurt","keen","mild","numb","smug","torn","wild","angry","brave","eager",
    "happy","livid","moody","proud","ready","rigid","sorry","sweet","tense","tired","upset","vexed",
    "wary","weary","afraid","amused","bored","elated","empty","frantic","furious","gloomy","guilty",
    "hopeful","joyful","lonely","loving","mellow","pained","rested","scared","shaken","shocked",
    "sulky","tender","uneasy","wistful","worried","zealous","anxious","ashamed","content","curious",
    "devoted","ecstatic","excited","focused","forlorn","gleeful","grumpy","hostile","humbled",
    "jealous","jittery","jubilant","longing","peaceful","relieved","remorseful","resentful",
    "restless","romantic","serene","thankful","thrilled","troubled",
  ],
  sports: [
    "polo","golf","judo","luge","yoga","swim","race","run","ski","box","dive","surf","bike",
    "bowl","curl","fish","hunt","jump","kick","lift","pull","push","row","spar","trek","archery",
    "chess","climb","cycle","dance","drill","hurdle","kayak","pitch","press","rugby","shoot",
    "skate","squat","throw","vault","badminton","baseball","football","handball","lacrosse",
    "marathon","rowing","sailing","skating","soccer","softball","swimming","tennis","volleyball",
    "basketball","bicycling","croquet","darts","fencing","gymnastics","hockey","motocross",
    "rafting","skiing","snowboard","squash","triathlon","weightlifting","wrestling","canoeing",
    "kickboxing","skydiving","athletics",
  ],
  professions: [
    "chef","monk","maid","spy","vet","aide","dean","mage","sage","actor","agent","baker","boxer",
    "coach","clerk","coder","cook","diver","judge","mayor","medic","miner","nurse","pilot","rabbi",
    "rider","scout","smith","tutor","usher","vicar","barber","bishop","broker","butler","captain",
    "cashier","cleric","cooper","curate","dancer","dealer","deputy","doctor","driver","editor",
    "expert","farmer","fisher","jockey","lawyer","lender","logger","marshal","midwife","miller",
    "officer","painter","pastor","plumber","porter","potter","priest","ranger","sailor","singer",
    "tailor","trader","warden","weaver","worker","analyst","chemist","dentist","engineer","fireman",
    "foreman","geologist","gunsmith","janitor","jeweler","lecturer","librarian","mechanic","musician",
    "optician","organist","planner","policeman","professor","reporter","sculptor","soldier","surgeon",
    "teacher","therapist","architect","astronomer","biologist","carpenter","conductor","consultant",
    "contractor","counselor","custodian","economist","electrician","journalist","programmer",
    "scientist","statistician","veterinarian",
  ],
};

const CATEGORY_LABELS = {
  allEnglish: "All English",
  animals: "Animals",
  animalsEasy: "Animals Easy",
  countries: "Countries",
  cities: "Cities",
  foods: "Foods",
  nature: "Nature",
  colors: "Colors",
  emotions: "Emotions",
  sports: "Sports",
  professions: "Professions",
};

// ─────────────────────────────────────────────
// T9 + SHAPE FILTER
// ─────────────────────────────────────────────
const T9MAP = {};
[..."ABC"].forEach(c => T9MAP[c]="2");
[..."DEF"].forEach(c => T9MAP[c]="3");
[..."GHI"].forEach(c => T9MAP[c]="4");
[..."JKL"].forEach(c => T9MAP[c]="5");
[..."MNO"].forEach(c => T9MAP[c]="6");
[..."PQRS"].forEach(c => T9MAP[c]="7");
[..."TUV"].forEach(c => T9MAP[c]="8");
[..."WXYZ"].forEach(c => T9MAP[c]="9");

const SHAPE_CLASS = {
  "1": new Set(["4","7"]),
  "2": new Set(["2","5"]),
  "3": new Set(["3","6","8","9"]),
};

function foldChar(ch){
  return ch.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toUpperCase()[0]||"";
}

function filterByCode(code, pool){
  return pool.filter(w=>{
    const letters=[...w].map(foldChar).filter(Boolean);
    if(letters.length!==code.length) return false;
    return letters.every((ch,i)=>{
      const d=T9MAP[ch];
      return d && SHAPE_CLASS[code[i]]?.has(d);
    });
  });
}

// ─────────────────────────────────────────────
// LETTER PICKER — depth-2 look-ahead
// ─────────────────────────────────────────────
function wordLetterSet(word){
  return new Set([...word].map(foldChar).filter(Boolean));
}

function pickNextLetter(candidates, usedSet){
  const used=new Set(usedSet);
  const kept=[];

  const eligible=(locked)=>candidates.filter(w=>{
    const s=wordLetterSet(w);
    return locked.every(k=>s.has(k));
  });

  const freqMap=(ws,ex)=>{
    const m=new Map();
    ws.forEach(w=>wordLetterSet(w).forEach(c=>!ex.has(c)&&m.set(c,(m.get(c)||0)+1)));
    return m;
  };

  const noCount=(ws,k)=>ws.filter(w=>!wordLetterSet(w).has(k)).length;

  while(true){
    const pool=eligible(kept);
    if(pool.length<=1) break;
    const MIN=pool.length<=6?1:2;
    const counts=freqMap(pool,used);
    const cands=[...counts.entries()].filter(([,n])=>n>=MIN&&n<pool.length);
    if(!cands.length) break;

    let best=null,bS1=Infinity,bS2=Infinity;
    for(const [k] of cands){
      const s1=noCount(pool,k);
      if(!s1) continue;
      const pool2=pool.filter(w=>!wordLetterSet(w).has(k));
      const c2=freqMap(pool2,new Set([...used,k]));
      const MIN2=pool2.length<=6?1:2;
      let s2=s1;
      for(const [k2,n2] of c2.entries()){
        if(n2<MIN2||n2>=pool2.length) continue;
        const ss=noCount(pool2,k2);
        if(ss>0&&ss<s2) s2=ss;
      }
      if(s1<bS1||(s1===bS1&&s2<bS2)){best=k;bS1=s1;bS2=s2;}
    }
    if(!best) break;
    kept.push(best);
    used.add(best);
  }
  return kept[kept.length-1]||null;
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
const DEF={cat:"allEnglish",len:"any",delay:10,pulse:120,pause:500,wall:"dark",fontSize:"medium"};
function loadSett(){try{return{...DEF,...JSON.parse(localStorage.getItem("mc2")||"{}")}}catch{return{...DEF}}}
function saveSett(s){try{localStorage.setItem("mc2",JSON.stringify(s))}catch{}}

// ─────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────
function getPool(cat,len){
  let pool=WORDS[cat]||WORDS.allEnglish;
  pool=[...new Set(pool.map(w=>w.toLowerCase().trim()))].filter(w=>/^[a-z]+$/.test(w));
  if(len==="3-5") pool=pool.filter(w=>w.length>=3&&w.length<=5);
  else if(len==="5-7") pool=pool.filter(w=>w.length>=5&&w.length<=7);
  else if(len==="6-8") pool=pool.filter(w=>w.length>=6&&w.length<=8);
  return pool;
}

function initState(){
  const s=loadSett();
  return{screen:"idle",code:"",pool:[],kept:[],used:[],letter:"",word:"",...s};
}

function reducer(state,action){
  switch(action.type){
    case "DIGIT":
      return{...state,code:state.code+action.d};
    case "CLEAR_CODE":
      return{...state,code:""};
    case "CONFIRM":{
      const raw=getPool(state.cat,state.len);
      const filtered=filterByCode(state.code,raw);
      if(!filtered.length) return{...state,code:"",screen:"idle"};
      if(filtered.length===1) return{...state,code:"",screen:"countdown",word:filtered[0].toUpperCase()};
      const next=pickNextLetter(filtered,new Set());
      if(!next) return{...state,code:"",screen:"pick",pool:filtered};
      return{...state,code:"",screen:"question",pool:filtered,kept:[],used:[next],letter:next};
    }
    case "YES":{
      const{letter:L,pool,kept,used}=state;
      const np=pool.filter(w=>wordLetterSet(w).has(L));
      const nk=[...kept,L];
      const nu=new Set(used);
      if(np.length===1) return{...state,screen:"countdown",word:np[0].toUpperCase(),pool:np,kept:nk};
      if(!np.length) return{...state,screen:"idle",pool:[],kept:[],used:[],letter:"",code:""};
      const next=pickNextLetter(np,nu);
      if(!next) return{...state,screen:"pick",pool:np,kept:nk};
      return{...state,pool:np,kept:nk,used:[...nu,next],letter:next};
    }
    case "NO":{
      const{letter:L,pool,kept,used}=state;
      const np=pool.filter(w=>{
        const s=wordLetterSet(w);
        if(s.has(L)) return false;
        return kept.every(k=>s.has(k));
      });
      const nu=new Set(used);
      if(np.length===1) return{...state,screen:"countdown",word:np[0].toUpperCase(),pool:np};
      if(!np.length) return{...state,screen:"idle",pool:[],kept:[],used:[],letter:"",code:""};
      const next=pickNextLetter(np,nu);
      if(!next) return{...state,screen:"pick",pool:np};
      return{...state,pool:np,used:[...nu,next],letter:next};
    }
    case "PICK":
      return{...state,screen:"countdown",word:action.w.toUpperCase()};
    case "REVEAL":
      return{...state,screen:"reveal"};
    case "RESET":
      return{...initState(),screen:"idle"};
    case "GO_SETTINGS":
      return{...state,screen:"settings"};
    case "GO_LIST":
      return{...state,screen:"list"};
    case "BACK":
      return{...state,screen:"idle"};
    case "SET":{
      const ns={...state,[action.k]:action.v};
      saveSett({cat:ns.cat,len:ns.len,delay:ns.delay,pulse:ns.pulse,pause:ns.pause,wall:ns.wall,fontSize:ns.fontSize});
      return ns;
    }
    default:return state;
  }
}

// ─────────────────────────────────────────────
// VIBRATION
// ─────────────────────────────────────────────
const POLYBIUS="ABCDEFGHIJKLMNOPQRSTUVWXY";
function buildVibPattern(letter,pDur=120,gDur=500){
  const ch=letter.toUpperCase();
  if(ch==="Z"){
    const p=[];for(let i=0;i<6;i++){p.push(pDur);if(i<5)p.push(100);}return p;
  }
  const idx=POLYBIUS.indexOf(ch);
  if(idx<0) return[pDur];
  const row=Math.floor(idx/5)+1,col=(idx%5)+1;
  const p=[];
  for(let i=0;i<row;i++){p.push(pDur);if(i<row-1)p.push(100);}
  p.push(gDur);
  for(let i=0;i<col;i++){p.push(pDur);if(i<col-1)p.push(100);}
  return p;
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App(){
  const[st,dispatch]=useReducer(reducer,null,initState);
  const stRef=useRef(st);
  stRef.current=st;

  const audioRef=useRef(null);
  const lastVolRef=useRef(null);
  const volTimerRef=useRef(null);
  const pendingUpRef=useRef(false);
  const codeResetRef=useRef(null);
  const cdIntervalRef=useRef(null);
  const[cdSecs,setCdSecs]=useState(10);
  const[callTime,setCallTime]=useState("");
  const[flash,setFlash]=useState(null); // "up" | "down" | null
  const[audioReady,setAudioReady]=useState(false);
  const[longPressTimer,setLongPressTimer]=useState(null);
  const twoFingStart=useRef(null);

  // ── Volume detection via silent audio ──
  const handleVolDir=useCallback((dir)=>{
    const s=stRef.current;
    // Visual feedback flash
    setFlash(dir);
    setTimeout(()=>setFlash(null),300);
    // Vibrate feedback
    if(navigator.vibrate) navigator.vibrate(30);

    if(s.screen==="idle"){
      if(dir==="up"){
        if(pendingUpRef.current){
          // double up = confirm
          clearTimeout(volTimerRef.current);
          pendingUpRef.current=false;
          clearTimeout(codeResetRef.current);
          dispatch({type:"CONFIRM"});
        } else {
          pendingUpRef.current=true;
          volTimerRef.current=setTimeout(()=>{
            if(pendingUpRef.current){
              pendingUpRef.current=false;
              dispatch({type:"DIGIT",d:"1"});
              clearTimeout(codeResetRef.current);
              codeResetRef.current=setTimeout(()=>dispatch({type:"CLEAR_CODE"}),8000);
            }
          },450);
        }
      } else {
        if(pendingUpRef.current){
          // up then down = digit 2
          clearTimeout(volTimerRef.current);
          pendingUpRef.current=false;
          dispatch({type:"DIGIT",d:"2"});
        } else {
          dispatch({type:"DIGIT",d:"3"});
        }
        clearTimeout(codeResetRef.current);
        codeResetRef.current=setTimeout(()=>dispatch({type:"CLEAR_CODE"}),8000);
      }
    } else if(s.screen==="question"){
      if(dir==="up") dispatch({type:"YES"});
      else dispatch({type:"NO"});
    }
  },[]);

  // ── Init silent audio ──
  useEffect(()=>{
    // Build a minimal silent WAV as data URL
    const silentWav="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
    const audio=new Audio(silentWav);
    audio.loop=true;
    audio.volume=0.5;
    lastVolRef.current=0.5;
    audioRef.current=audio;

    const onVolChange=()=>{
      const nv=audio.volume;
      const prev=lastVolRef.current;
      if(prev===null){lastVolRef.current=nv;return;}
      const dir=nv>prev?"up":"down";
      lastVolRef.current=nv;
      handleVolDir(dir);
    };
    audio.addEventListener("volumechange",onVolChange);
    return()=>{
      audio.removeEventListener("volumechange",onVolChange);
      audio.pause();
    };
  },[handleVolDir]);

  const activateAudio=()=>{
    audioRef.current?.play().catch(()=>{});
    setAudioReady(true);
  };

  // ── Countdown ──
  useEffect(()=>{
    if(st.screen==="countdown"){
      let secs=st.delay;
      setCdSecs(secs);
      cdIntervalRef.current=setInterval(()=>{
        secs--;
        setCdSecs(secs);
        if(secs<=0){clearInterval(cdIntervalRef.current);dispatch({type:"REVEAL"});}
      },1000);
    }
    return()=>clearInterval(cdIntervalRef.current);
  },[st.screen,st.delay]);

  // ── Call screen clock ──
  useEffect(()=>{
    if(st.screen==="reveal"){
      const upd=()=>{const d=new Date();setCallTime(`${d.getHours()%12||12}:${String(d.getMinutes()).padStart(2,"0")}`);};
      upd();const t=setInterval(upd,1000);return()=>clearInterval(t);
    }
  },[st.screen]);

  // ── Two-finger swipe down → settings ──
  const onTouchStart=useCallback((e)=>{
    if(st.screen!=="idle") return;
    if(e.touches.length===2){
      twoFingStart.current={y0:e.touches[0].clientY,y1:e.touches[1].clientY};
    }
  },[st.screen]);

  const onTouchMove=useCallback((e)=>{
    if(e.touches.length===2&&twoFingStart.current){
      const dy0=e.touches[0].clientY-twoFingStart.current.y0;
      const dy1=e.touches[1].clientY-twoFingStart.current.y1;
      if(dy0>90&&dy1>90){twoFingStart.current=null;dispatch({type:"GO_SETTINGS"});}
    }
  },[]);

  const onTouchEnd=useCallback(()=>{twoFingStart.current=null;},[]);

  return(
    <div
      style={{position:"fixed",inset:0,background:"#000",overflow:"hidden",userSelect:"none",WebkitUserSelect:"none",touchAction:"pan-y"}}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Volume direction flash overlay */}
      <AnimatePresence>
        {flash&&(
          <motion.div key={flash+Date.now()}
            initial={{opacity:0.7}} animate={{opacity:0}} transition={{duration:0.3}}
            style={{
              position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",
              background:flash==="up"
                ?"linear-gradient(to bottom, rgba(0,200,100,0.4) 0%, transparent 60%)"
                :"linear-gradient(to top, rgba(255,80,80,0.4) 0%, transparent 60%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Tap to activate audio — only shows once */}
      {!audioReady&&(
        <div onClick={activateAudio}
          style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",background:"#000",cursor:"pointer"}}
        >
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>🫳</div>
            <div style={{color:"#fff",fontSize:18,fontFamily:"system-ui",fontWeight:600,letterSpacing:1}}>Tap to activate</div>
            <div style={{color:"#555",fontSize:13,fontFamily:"system-ui",marginTop:8}}>Required to enable volume buttons</div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {st.screen==="idle"&&<IdleScreen key="idle" code={st.code} pool={st.pool} cat={st.cat} len={st.len}/>}
        {st.screen==="question"&&<QuestionScreen key="q" letter={st.letter} pool={st.pool} kept={st.kept}/>}
        {st.screen==="countdown"&&<CountdownScreen key="cd" word={st.word} secs={cdSecs}/>}
        {st.screen==="pick"&&<PickScreen key="pick" words={st.pool} onPick={w=>dispatch({type:"PICK",w})}/>}
        {st.screen==="reveal"&&<CallScreen key="call" word={st.word} time={callTime} wall={st.wall} fontSize={st.fontSize} onDecline={()=>dispatch({type:"RESET"})} onAccept={()=>setTimeout(()=>dispatch({type:"RESET"}),1000)}/>}
        {st.screen==="settings"&&<SettingsScreen key="settings" st={st} dispatch={dispatch}/>}
        {st.screen==="list"&&<ListScreen key="list" st={st} dispatch={dispatch}/>}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// IDLE SCREEN — shows code being entered
// ─────────────────────────────────────────────
function IdleScreen({code,pool,cat,len}){
  const hint=code.length>0
    ? `${code.length} digit${code.length>1?"s":""} entered`
    : "Vol ↑ = 1 · Vol ↑↓ = 2 · Vol ↓ = 3 · ↑↑ = confirm";

  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:0}}
    >
      {/* Code display */}
      <div style={{display:"flex",gap:12,marginBottom:32,minHeight:60,alignItems:"center"}}>
        {code.length===0?(
          <div style={{color:"#1a1a1a",fontSize:14,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase"}}>
            ready
          </div>
        ):(
          [...code].map((d,i)=>(
            <motion.div key={i}
              initial={{scale:0,opacity:0}}
              animate={{scale:1,opacity:1}}
              transition={{type:"spring",stiffness:500,damping:25}}
              style={{
                width:44,height:44,borderRadius:10,
                background:d==="1"?"#1a3a2a":d==="2"?"#1a2a3a":"#3a1a1a",
                border:`1px solid ${d==="1"?"#00ff88":d==="2"?"#00aaff":"#ff4444"}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:d==="1"?"#00ff88":d==="2"?"#00aaff":"#ff4444",
                fontSize:22,fontWeight:900,fontFamily:"monospace",
              }}
            >{d}</motion.div>
          ))
        )}
      </div>

      {/* Hint text */}
      <div style={{color:"#282828",fontSize:11,fontFamily:"monospace",letterSpacing:2,textAlign:"center",padding:"0 32px",lineHeight:2}}>
        {hint}
      </div>

      {/* Category badge */}
      <div style={{position:"absolute",bottom:60,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div style={{color:"#1a1a1a",fontSize:10,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase"}}>
          {CATEGORY_LABELS[cat]||cat} · {len==="any"?"any length":len+" letters"}
        </div>
        <div style={{color:"#111",fontSize:10,fontFamily:"monospace",letterSpacing:2}}>
          swipe down with 2 fingers → settings
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// QUESTION SCREEN — shows letter + candidate list
// ─────────────────────────────────────────────
function QuestionScreen({letter,pool,kept}){
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#050505",display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 20px 20px"}}
    >
      {/* Kept letters row */}
      {kept.length>0&&(
        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",justifyContent:"center"}}>
          {kept.map((k,i)=>(
            <div key={i} style={{
              background:"#0a2a0a",border:"1px solid #00ff88",borderRadius:6,
              color:"#00ff88",fontSize:13,fontWeight:700,fontFamily:"monospace",
              padding:"3px 10px",letterSpacing:2,
            }}>✓ {k}</div>
          ))}
        </div>
      )}

      {/* Big letter */}
      <motion.div
        key={letter}
        initial={{scale:0.6,opacity:0,y:20}}
        animate={{scale:1,opacity:1,y:0}}
        transition={{type:"spring",stiffness:400,damping:22}}
        style={{
          color:"#fff",fontSize:180,fontWeight:900,fontFamily:"'Georgia',serif",
          lineHeight:1,textShadow:"0 0 60px rgba(255,255,255,0.08)",
        }}
      >{letter}</motion.div>

      {/* Ask label */}
      <div style={{color:"#333",fontSize:11,fontFamily:"monospace",letterSpacing:4,marginTop:4,textTransform:"uppercase"}}>
        in your word?
      </div>

      {/* YES/NO instructions */}
      <div style={{display:"flex",gap:20,marginTop:20}}>
        <div style={{
          background:"#0a200a",border:"1px solid #00aa44",borderRadius:10,
          padding:"8px 24px",color:"#00ff88",fontSize:12,fontWeight:700,
          fontFamily:"monospace",letterSpacing:3,
        }}>Vol ↑ = YES</div>
        <div style={{
          background:"#200a0a",border:"1px solid #aa2200",borderRadius:10,
          padding:"8px 24px",color:"#ff4444",fontSize:12,fontWeight:700,
          fontFamily:"monospace",letterSpacing:3,
        }}>Vol ↓ = NO</div>
      </div>

      {/* Candidate words */}
      {pool.length<=12&&pool.length>0&&(
        <div style={{marginTop:24,width:"100%",maxWidth:360}}>
          <div style={{color:"#1a1a1a",fontSize:9,fontFamily:"monospace",letterSpacing:3,textAlign:"center",marginBottom:10}}>
            {pool.length} CANDIDATE{pool.length>1?"S":""}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
            {pool.map((w,i)=>(
              <div key={i} style={{
                color:"#2a2a2a",fontSize:11,fontFamily:"monospace",
                background:"#0d0d0d",borderRadius:4,padding:"3px 8px",
                border:"1px solid #1a1a1a",letterSpacing:1,textTransform:"uppercase",
              }}>{w}</div>
            ))}
          </div>
        </div>
      )}
      {pool.length>12&&(
        <div style={{color:"#1a1a1a",fontSize:10,fontFamily:"monospace",marginTop:20,letterSpacing:2}}>
          {pool.length} candidates
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// COUNTDOWN SCREEN
// ─────────────────────────────────────────────
function CountdownScreen({word,secs}){
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}
    >
      <div style={{color:"#111",fontSize:12,fontFamily:"monospace",letterSpacing:4,textTransform:"uppercase"}}>
        call incoming in
      </div>
      <motion.div
        key={secs}
        initial={{scale:1.4,opacity:0}}
        animate={{scale:1,opacity:1}}
        style={{color:"#222",fontSize:72,fontWeight:900,fontFamily:"monospace",lineHeight:1}}
      >{secs}</motion.div>
      <div style={{color:"#0d0d0d",fontSize:10,fontFamily:"monospace",letterSpacing:4,marginTop:8,textTransform:"uppercase"}}>
        word: {word}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PICK SCREEN — multiple words remain
// ─────────────────────────────────────────────
function PickScreen({words,onPick}){
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#080808",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:28}}
    >
      <div style={{color:"#333",fontSize:10,fontFamily:"monospace",letterSpacing:4,textTransform:"uppercase",marginBottom:10}}>
        select word
      </div>
      {words.slice(0,8).map((w)=>(
        <button key={w} onClick={()=>onPick(w)}
          style={{
            color:"#fff",fontSize:20,fontWeight:700,fontFamily:"monospace",
            background:"#111",border:"1px solid #222",borderRadius:12,
            padding:"12px 28px",cursor:"pointer",width:"100%",
            textTransform:"uppercase",letterSpacing:5,
          }}
        >{w}</button>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// CALL SCREEN — fake iOS incoming call
// ─────────────────────────────────────────────
function CallScreen({word,time,wall,fontSize,onDecline,onAccept}){
  const fz={small:26,medium:36,large:50}[fontSize]||36;
  const bg=wall==="gradient1"
    ?"linear-gradient(180deg,#0f0c29 0%,#302b63 50%,#24243e 100%)"
    :wall==="gradient2"
    ?"linear-gradient(180deg,#1a0000 0%,#2d1515 50%,#1a0000 100%)"
    :wall==="gradient3"
    ?"linear-gradient(180deg,#001a00 0%,#0a2e0a 50%,#001a00 100%)"
    :"#1C1C1E";

  return(
    <motion.div
      initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
      transition={{type:"spring",stiffness:280,damping:28}}
      style={{position:"fixed",inset:0,background:bg,display:"flex",flexDirection:"column",alignItems:"center"}}
    >
      {/* Status bar */}
      <div style={{width:"100%",display:"flex",justifyContent:"space-between",padding:"16px 24px 0",alignItems:"center"}}>
        <span style={{color:"#fff",fontSize:17,fontWeight:600,fontFamily:"system-ui"}}>{time}</span>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
            <rect x="0" y="8" width="3" height="4" rx="0.5"/>
            <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5"/>
            <rect x="9" y="2.5" width="3" height="9.5" rx="0.5"/>
            <rect x="13.5" y="0" width="3" height="12" rx="0.5"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="white" strokeOpacity="0.35"/>
            <rect x="2" y="2" width="15" height="8" rx="1.5" fill="white"/>
            <path d="M22 4.5v3a1.5 1.5 0 0 0 0-3z" fill="white" fillOpacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Incoming label */}
      <motion.div
        animate={{opacity:[0.5,1,0.5]}}
        transition={{duration:1.6,repeat:Infinity,ease:"easeInOut"}}
        style={{color:"#8E8E93",fontSize:14,fontFamily:"system-ui",marginTop:20,letterSpacing:0.2}}
      >incoming call</motion.div>

      {/* Avatar */}
      <div style={{width:100,height:100,borderRadius:"50%",background:"#3A3A3C",display:"flex",alignItems:"center",justifyContent:"center",marginTop:30}}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="#8E8E93">
          <circle cx="28" cy="20" r="12"/>
          <path d="M4 50c0-13.3 10.7-22 24-22s24 8.7 24 22"/>
        </svg>
      </div>

      {/* Word */}
      <div style={{color:"#fff",fontSize:fz,fontWeight:700,fontFamily:"system-ui",marginTop:20,letterSpacing:0.5,textAlign:"center",padding:"0 20px"}}>
        {word}
      </div>
      <div style={{color:"#8E8E93",fontSize:15,fontFamily:"system-ui",marginTop:6}}>mobile</div>

      {/* Buttons */}
      <div style={{position:"absolute",bottom:"max(env(safe-area-inset-bottom,0px),44px)",width:"100%",display:"flex",justifyContent:"space-around",padding:"0 48px",boxSizing:"border-box"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <button onClick={onDecline}
            style={{width:72,height:72,borderRadius:"50%",background:"#FF3B30",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 24px rgba(255,59,48,0.5)"}}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
              <path d="M5 22C8 15 11 13 16 13C21 13 24 15 27 22L23.5 25.5C21.5 22.5 19 21 16 21C13 21 10.5 22.5 8.5 25.5Z" transform="rotate(135,16,18)"/>
            </svg>
          </button>
          <span style={{color:"#8E8E93",fontSize:13,fontFamily:"system-ui"}}>Decline</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <button onClick={onAccept}
            style={{width:72,height:72,borderRadius:"50%",background:"#34C759",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 24px rgba(52,199,89,0.5)"}}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
              <path d="M5 10C8 3 11 1 16 1C21 1 24 3 27 10L23.5 13.5C21.5 10.5 19 9 16 9C13 9 10.5 10.5 8.5 13.5Z"/>
            </svg>
          </button>
          <span style={{color:"#8E8E93",fontSize:13,fontFamily:"system-ui"}}>Accept</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SETTINGS SCREEN
// ─────────────────────────────────────────────
function SettingsScreen({st,dispatch}){
  const set=(k,v)=>dispatch({type:"SET",k,v});
  const cats=Object.keys(CATEGORY_LABELS);

  return(
    <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
      transition={{type:"spring",stiffness:300,damping:30}}
      style={{position:"fixed",inset:0,background:"#1C1C1E",overflowY:"auto",WebkitOverflowScrolling:"touch"}}
    >
      <div style={{padding:"56px 16px 80px",maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <h1 style={{color:"#fff",fontSize:28,fontWeight:700,fontFamily:"system-ui",margin:0}}>Settings</h1>
          <button onClick={()=>dispatch({type:"BACK"})}
            style={{color:"#fff",background:"#3A3A3C",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}
          >×</button>
        </div>

        <Sect label="WORD CATEGORY">
          {cats.map(c=>(
            <SRow key={c} label={CATEGORY_LABELS[c]} sub={`${WORDS[c].length} words`} active={st.cat===c} onClick={()=>set("cat",c)} last={c===cats[cats.length-1]}/>
          ))}
        </Sect>

        <Sect label="WORD LENGTH">
          <div style={{display:"flex",gap:8,padding:"12px 0"}}>
            {[["any","Any"],["3-5","3–5"],["5-7","5–7"],["6-8","6–8"]].map(([v,l])=>(
              <button key={v} onClick={()=>set("len",v)}
                style={{flex:1,padding:"10px 4px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontFamily:"system-ui",fontWeight:600,background:st.len===v?"#0A84FF":"#3A3A3C",color:"#fff"}}
              >{l}</button>
            ))}
          </div>
        </Sect>

        <Sect label="CALL SETTINGS">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #2C2C2E"}}>
            <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Call delay</span>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <TinyBtn label="−" onClick={()=>set("delay",Math.max(1,st.delay-1))}/>
              <span style={{color:"#0A84FF",fontFamily:"system-ui",fontWeight:700,minWidth:48,textAlign:"center",fontSize:16}}>{st.delay}s</span>
              <TinyBtn label="+" onClick={()=>set("delay",Math.min(30,st.delay+1))}/>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #2C2C2E"}}>
            <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Caller name size</span>
            <div style={{display:"flex",gap:8}}>
              {["small","medium","large"].map(s=>(
                <button key={s} onClick={()=>set("fontSize",s)}
                  style={{padding:"6px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontFamily:"system-ui",background:st.fontSize===s?"#0A84FF":"#3A3A3C",color:"#fff",textTransform:"capitalize"}}
                >{s}</button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0"}}>
            <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Wallpaper</span>
            <div style={{display:"flex",gap:8}}>
              {[["dark","#1C1C1E"],["gradient1","linear-gradient(#0f0c29,#24243e)"],["gradient2","linear-gradient(#1a0000,#2d1515)"],["gradient3","linear-gradient(#001a00,#0a2e0a)"]].map(([v,bg])=>(
                <button key={v} onClick={()=>set("wall",v)}
                  style={{width:32,height:32,borderRadius:8,border:st.wall===v?"2px solid #0A84FF":"2px solid #444",cursor:"pointer",background:bg}}
                />
              ))}
            </div>
          </div>
        </Sect>

        <Sect label="VIBRATION">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #2C2C2E"}}>
            <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Pulse duration</span>
            <div style={{display:"flex",gap:8}}>
              {[80,120,160].map(d=>(
                <button key={d} onClick={()=>set("pulse",d)}
                  style={{padding:"6px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontFamily:"system-ui",background:st.pulse===d?"#0A84FF":"#3A3A3C",color:"#fff"}}
                >{d}ms</button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0"}}>
            <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Group pause</span>
            <div style={{display:"flex",gap:8}}>
              {[400,500,700].map(d=>(
                <button key={d} onClick={()=>set("pause",d)}
                  style={{padding:"6px 8px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontFamily:"system-ui",background:st.pause===d?"#0A84FF":"#3A3A3C",color:"#fff"}}
                >{d}ms</button>
              ))}
            </div>
          </div>
        </Sect>

        <div style={{color:"#2a2a2a",fontSize:12,fontFamily:"system-ui",textAlign:"center",marginTop:24}}>
          MindCall v2.0
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// LIST QUICK-SELECT
// ─────────────────────────────────────────────
function ListScreen({st,dispatch}){
  const set=(k,v)=>dispatch({type:"SET",k,v});
  const cats=Object.keys(CATEGORY_LABELS);
  return(
    <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
      transition={{type:"spring",stiffness:400,damping:35}}
      style={{position:"fixed",bottom:0,left:0,right:0,background:"#2C2C2E",borderRadius:"20px 20px 0 0",padding:"16px 16px 48px",maxHeight:"75vh",overflowY:"auto"}}
    >
      <div style={{width:36,height:4,background:"#555",borderRadius:2,margin:"0 auto 18px"}}/>
      <h2 style={{color:"#fff",fontFamily:"system-ui",fontSize:17,fontWeight:700,marginBottom:16}}>Select List</h2>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>set("cat",c)}
            style={{padding:"8px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:13,fontFamily:"system-ui",background:st.cat===c?"#0A84FF":"#3A3A3C",color:"#fff",fontWeight:st.cat===c?700:400}}
          >{CATEGORY_LABELS[c]}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["any","Any"],["3-5","3–5"],["5-7","5–7"],["6-8","6–8"]].map(([v,l])=>(
          <button key={v} onClick={()=>set("len",v)}
            style={{flex:1,padding:"10px 4px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontFamily:"system-ui",fontWeight:600,background:st.len===v?"#0A84FF":"#3A3A3C",color:"#fff"}}
          >{l}</button>
        ))}
      </div>
      <button onClick={()=>dispatch({type:"BACK"})}
        style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"#3A3A3C",color:"#fff",fontFamily:"system-ui",fontSize:15,cursor:"pointer",fontWeight:600}}
      >Done</button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────
function Sect({label,children}){
  return(
    <div style={{marginBottom:24}}>
      <div style={{color:"#8E8E93",fontSize:11,fontFamily:"system-ui",letterSpacing:0.8,marginBottom:8,textTransform:"uppercase",paddingLeft:4}}>{label}</div>
      <div style={{background:"#2C2C2E",borderRadius:12,padding:"0 16px"}}>{children}</div>
    </div>
  );
}

function SRow({label,sub,active,onClick,last}){
  return(
    <button onClick={onClick}
      style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"14px 0",background:"none",border:"none",borderBottom:last?"none":"1px solid #3A3A3C",cursor:"pointer",textAlign:"left"}}
    >
      <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>{label}</span>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{color:"#555",fontSize:12,fontFamily:"system-ui"}}>{sub}</span>
        {active&&<span style={{color:"#34C759",fontSize:18}}>✓</span>}
      </div>
    </button>
  );
}

function TinyBtn({label,onClick}){
  return(
    <button onClick={onClick}
      style={{color:"#fff",background:"#3A3A3C",border:"none",borderRadius:7,width:32,height:32,cursor:"pointer",fontSize:18,fontFamily:"system-ui",display:"flex",alignItems:"center",justifyContent:"center"}}
    >{label}</button>
  );
}
