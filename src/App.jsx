import { useState, useEffect, useReducer, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════
// SHAPE MAP
// 1 = STRAIGHT only:  A E F H I K L M N T V W X Y Z
// 2 = MIXED:          B D G J P Q R U
// 3 = CURVES only:    C O S
// ═══════════════════════════════════════════════════════
const SM={A:"1",E:"1",F:"1",H:"1",I:"1",K:"1",L:"1",M:"1",N:"1",T:"1",V:"1",W:"1",X:"1",Y:"1",Z:"1",B:"2",D:"2",G:"2",J:"2",P:"2",Q:"2",R:"2",U:"2",C:"3",O:"3",S:"3"};
const fold=c=>c.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toUpperCase()[0]||"";
const ls=c=>SM[fold(c)]||null;
const wcode=w=>[...w].map(ls).join("");
const wset=w=>new Set([...w].map(fold).filter(Boolean));
const filterShape=(code,pool)=>pool.filter(w=>{const s=wcode(w);return s.length===code.length&&s===code;});

// ═══════════════════════════════════════════════════════
// POLYBIUS 5×5
// ═══════════════════════════════════════════════════════
const POLY="ABCDEFGHIJKLMNOPQRSTUVWXY";
function polyRC(letter){
  const ch=fold(letter);
  if(ch==="Z")return{row:6,col:0};
  const i=POLY.indexOf(ch);
  return i<0?null:{row:Math.floor(i/5)+1,col:(i%5)+1};
}
// Build vibration array — SLOW defaults: pDur=250ms, interPulse=150ms, groupPause=800ms
function buildVibe(letter,pDur=250,gPause=800){
  const rc=polyRC(letter);
  if(!rc)return[pDur];
  const ip=150; // inter-pulse gap within a group
  const mk=(n)=>{const a=[];for(let i=0;i<n;i++){a.push(pDur);if(i<n-1)a.push(ip);}return a;};
  if(rc.row===6)return mk(6);
  return[...mk(rc.row),gPause,...mk(rc.col)];
}
function vibeDur(pat){return pat.reduce((a,b)=>a+b,0);}

// Audio beeps
function polyBeeps(ctx,letter,pDur,gPause){
  if(!ctx||ctx.state==="closed")return;
  const rc=polyRC(letter);if(!rc)return;
  const pd=pDur/1000,ip=0.15,gp=gPause/1000;
  const beep=(freq,t,d)=>{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type="sine";o.frequency.value=freq;
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(0.22,t+0.02);
    g.gain.linearRampToValueAtTime(0,t+d-0.02);
    o.connect(g);g.connect(ctx.destination);
    o.start(t);o.stop(t+d+0.05);
  };
  let t=ctx.currentTime+0.1;
  const rows=rc.row===6?6:rc.row;
  for(let i=0;i<rows;i++){beep(550,t,pd);t+=pd+ip;}
  if(rc.row!==6){t+=gp;for(let i=0;i<rc.col;i++){beep(990,t,pd);t+=pd+ip;}}
}

// iOS ringtone — authentic ascending arpeggio
function playRingtone(ctx){
  if(!ctx||ctx.state==="closed")return()=>{};
  const nodes=[];
  const tone=(freq,start,dur,vol=0.2)=>{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type="sine";o.frequency.value=freq;
    g.gain.setValueAtTime(0,start);
    g.gain.linearRampToValueAtTime(vol,start+0.025);
    g.gain.linearRampToValueAtTime(vol,start+dur-0.04);
    g.gain.linearRampToValueAtTime(0,start+dur);
    o.connect(g);g.connect(ctx.destination);
    o.start(start);o.stop(start+dur+0.1);
    nodes.push(o);
  };
  // Classic iPhone ring: Marimba-like G# A# D# ascending
  const ring=(t)=>{
    // first chord up
    tone(830,t,0.14);tone(932,t+0.12,0.14);tone(1245,t+0.24,0.2);
    // second chord
    tone(830,t+0.55,0.14);tone(932,t+0.67,0.14);tone(1245,t+0.79,0.2);
  };
  let t=ctx.currentTime+0.1;
  ring(t);ring(t+1.5);ring(t+3.0);
  return()=>nodes.forEach(n=>{try{n.stop();}catch{}});
}

// ═══════════════════════════════════════════════════════
// LETTER PICKER depth-2
// ═══════════════════════════════════════════════════════
function pickLetter(pool,usedSet){
  const used=new Set(usedSet),kept=[];
  const elig=lk=>pool.filter(w=>lk.every(k=>wset(w).has(k)));
  const freq=(ws,ex)=>{const m=new Map();ws.forEach(w=>wset(w).forEach(c=>!ex.has(c)&&m.set(c,(m.get(c)||0)+1)));return m;};
  const noC=(ws,k)=>ws.filter(w=>!wset(w).has(k)).length;
  for(;;){
    const p=elig(kept);if(p.length<=1)break;
    const MIN=p.length<=6?1:2,cnt=freq(p,used);
    const cds=[...cnt.entries()].filter(([,n])=>n>=MIN&&n<p.length);if(!cds.length)break;
    let best=null,b1=Infinity,b2=Infinity;
    for(const[k] of cds){
      const s1=noC(p,k);if(!s1)continue;
      const p2=p.filter(w=>!wset(w).has(k)),c2=freq(p2,new Set([...used,k]));
      const MIN2=p2.length<=6?1:2;let s2=s1;
      for(const[k2,n2]of c2){if(n2<MIN2||n2>=p2.length)continue;const ss=noC(p2,k2);if(ss>0&&ss<s2)s2=ss;}
      if(s1<b1||(s1===b1&&s2<b2)){best=k;b1=s1;b2=s2;}
    }
    if(!best)break;kept.push(best);used.add(best);
  }
  return kept[kept.length-1]||null;
}

// ═══════════════════════════════════════════════════════
// WORD LISTS
// ═══════════════════════════════════════════════════════
const ALL=["abandon","abbey","abide","ability","ablaze","able","aboard","abode","abort","about","above","abrupt","absence","absent","absolve","absorb","absurd","abyss","accent","access","acclaim","accord","accost","accrue","accuse","ace","ache","achieve","aching","acid","acidic","acorn","acquire","acre","across","act","action","active","actual","acute","adage","add","addend","adept","adhere","adjoin","adjust","admire","admit","adobe","adorn","adult","advert","advice","aegis","aerial","affect","affirm","afford","affront","afield","afraid","after","again","against","age","aged","ageing","agency","agenda","aghast","agile","agitate","ago","agony","agreed","aground","ahead","aid","aide","ailment","aim","air","aisle","akin","alarm","albeit","album","alder","algae","alibi","alight","align","all","allay","allot","allow","allure","almond","almost","aloft","alone","along","aloof","aloud","alpaca","alpha","also","altar","alto","always","amaze","amber","amble","ambush","amend","amid","among","amount","ample","amuse","angel","angry","animal","annex","annual","annul","anoint","another","ant","anti","antic","anvil","anxious","any","anyway","aorta","apart","ape","apex","aphid","aplomb","appeal","apple","apply","aptly","arbor","arc","arcane","archer","archive","ardent","ardor","are","area","arena","argue","arid","arise","ark","arm","armor","army","aroma","around","array","arrive","arson","art","article","ascend","ascent","ash","aside","ask","asked","aspen","assail","assault","astray","ate","atom","atone","attain","attempt","attic","attract","audit","augur","august","aunt","avail","avert","avid","avoid","avow","await","awake","awash","awe","awed","aweigh","awful","awhile","awoke","axe","axiom","axle","aye","babble","backed","bacon","bad","badge","badly","baffle","bag","bagel","baggy","bait","bake","baker","balance","bald","bale","ball","ballot","balm","bamboo","ban","band","bandy","bane","bang","banish","banjo","bank","banner","banter","baptize","bar","barb","bare","bark","barley","barn","baron","barren","barrier","barter","base","bash","basil","bask","bass","baste","bat","batch","bath","bathe","batter","bawl","bay","bayou","beacon","bead","beady","beak","beam","bean","beard","beast","became","because","become","bed","beech","beer","beet","befit","before","beg","began","begin","begot","behind","believe","bell","belle","bellow","belly","belong","below","belt","bench","bend","berm","beseech","beset","besom","bespoke","bestow","bet","betide","betray","between","beware","beyond","bid","bifold","big","bile","bilge","bill","bind","binge","birch","bird","bison","bit","bite","bitty","black","blade","bland","blank","blast","blaze","bleak","bleat","bleed","blend","bless","blight","blink","block","blond","blonde","blood","bloom","blossom","blot","blow","blown","blue","blues","blunt","blur","blurb","boar","board","bodies","boggy","bogus","bold","bolster","bolt","bond","bonny","bore","bored","born","borrow","boss","botch","both","bounce","bound","bounty","bovine","bow","box","boxer","boy","brag","braid","brake","branch","brash","brawl","brawn","braze","breach","bred","bridle","brine","bring","brisk","brittle","broil","broken","bronze","brood","broom","brought","brow","bruise","brunt","brush","brutal","brute","bud","buff","bug","building","bulk","bull","bully","bumble","bump","bun","bunk","burly","burp","burrow","bus","but","buxom","buy","buzz","cab","cabin","cabinet","cache","cactus","cadet","cagey","cairn","calf","called","calm","came","camel","cameo","camp","can","canal","candid","cane","canine","cannon","canopy","canyon","cap","cape","capon","captain","captive","capture","car","carbon","care","careful","cargo","carol","carp","carried","carry","cart","cascade","casino","casket","caste","castle","cat","catalog","catch","catchy","causal","cave","cease","cedar","ceiling","century","certain","chafe","chain","chair","chalk","champ","change","channel","chant","chaos","chap","chard","charge","charity","chasm","chat","cheap","cheer","chef","chess","chew","chide","child","chill","chimp","chin","chip","choir","chomp","choose","chosen","chump","chute","cinch","cinder","circle","circus","cite","city","civic","civil","clam","clamp","clap","clarity","class","claw","clay","clean","clear","cleft","clench","clergy","clerk","clever","click","cliff","cling","clink","clip","cloak","clog","clone","close","closet","clot","clout","clown","club","clue","cluster","coal","coarse","coat","cobalt","cobra","cobweb","cocoa","coil","coin","cold","collect","college","colony","color","colt","combat","combine","come","comely","comes","comet","comfort","comic","command","commit","common","company","compel","compete","compile","complete","complex","comply","concept","conch","concur","condor","conduct","cone","confer","confess","confirm","confuse","consider","consul","consult","contain","contend","continue","control","convey","convoy","cook","cool","cop","copper","copy","coral","cord","core","cork","corn","corner","corny","cost","cotton","couch","could","counsel","courage","court","cover","covet","cow","cower","coyote","cozy","cram","cramp","crane","crank","creak","create","creep","crest","crib","crimp","crisis","crisp","croak","crony","crook","croon","crop","cross","crow","crucial","crude","cruel","crumb","crux","cry","crypt","cub","cubic","cuff","cup","curb","curd","curing","curl","curry","curtain","cushy","custom","cut","cute","cycle","dab","dad","daft","dagger","daily","daisy","dally","dam","damage","damp","dampen","dandy","danger","dare","daring","darken","dart","data","date","daunt","daze","deacon","dead","deadly","deaf","deal","dealt","dear","debris","decay","deceit","decent","decide","decoy","deed","deem","deep","deepen","deer","deery","defend","define","deft","delay","delta","delve","demand","demon","dense","dent","deny","depot","depth","derby","desert","design","despite","destiny","deter","detour","detox","devoid","devour","diamond","dice","differ","different","dill","dime","dine","dip","direct","direction","disco","disk","display","distant","disturb","ditty","dive","divide","dizzy","dock","dodge","dogma","dolly","dolphin","dome","done","doom","dormant","dose","dot","dote","double","doubt","douse","dove","dowel","dowry","drab","draft","drag","drain","drape","draw","drawl","dreamy","dredge","dried","drift","drip","drive","driven","drool","droop","drop","drove","drown","drug","drum","dry","dryer","dual","dug","dumb","dump","dunce","dune","dupe","duple","during","dusky","dusty","dwarf","dye","dying","dynamo","each","eager","ear","early","earn","earth","ease","easel","easily","eat","ebony","edge","edgy","edit","effect","egg","ego","eight","elapse","elbow","elder","elf","elite","elk","elm","embed","ember","emery","emit","emote","empire","employ","empty","enable","enact","end","endow","endure","engulf","enjoy","enough","enrage","ensue","entail","enter","entice","entire","envoy","enzyme","epic","equal","equate","equip","era","erode","escape","essay","ethos","evade","eve","even","every","evict","evil","evoke","evolve","ewe","exact","exactly","exam","excess","excite","exempt","exert","exhale","exist","expand","expel","expire","extend","extol","extra","exude","eye","fable","face","facet","fad","fade","fail","faint","fairway","fairy","faith","fake","false","fame","family","famine","famous","fan","fancy","fantasy","far","farce","fare","fashion","fast","fat","fatal","fate","father","fathom","fatigue","fault","fawn","fax","feast","feather","fed","feign","ferret","ferry","fester","fetal","few","fiction","fiend","fifth","fig","fight","fighter","fill","film","filter","final","finale","finally","finch","find","finger","fire","fiscal","fish","fit","fix","fixed","flag","flair","flake","flame","flank","flap","flare","flash","flask","flat","flaunt","flaw","flea","fled","fledge","flesh","flew","flex","flight","flint","flock","flood","floor","flop","floss","flout","flow","flower","flown","fluid","flute","fly","foam","foamy","foe","fog","fold","folk","follow","folly","fond","font","food","fool","foray","force","ford","forge","forgo","forgot","form","formal","fort","forte","forth","forward","foster","foul","found","four","fox","frail","frame","fraud","fray","freaky","freedom","freeze","frenzy","fresh","fret","frill","fringe","frisk","frisky","frolic","front","frosty","froze","frozen","fry","fudge","fully","fumble","fume","fun","fungi","funny","fur","furnish","further","fussy","fuzzy","gag","gale","gall","gallant","galley","gallop","game","gap","gape","garner","gas","gash","gassy","gaudy","gauze","gave","gavel","gawk","gaze","gel","gem","gentle","genuine","get","geyser","ghast","giddy","giffy","girth","give","given","glacier","glad","glare","glass","gleam","glean","glide","glimpse","glint","glitter","gloat","glob","gloom","gloss","glove","gnash","gnaw","gnome","gnu","goad","goblin","god","going","gong","gore","got","gouge","govern","grace","graft","grail","grand","grant","grasp","grave","gravel","graze","great","greed","green","greet","grief","grieve","grime","grind","groan","groin","groom","gross","group","growl","grown","gruel","gruff","grunge","guard","guide","guile","guilty","guise","gulch","gully","gum","gun","gust","gusto","gut","guy","gym","hack","had","haiku","hale","half","hall","halt","ham","hamper","handle","handy","happy","harbor","hardly","harm","harmony","harsh","harvest","has","haste","hat","haul","haunt","haven","havoc","hay","heady","heal","healing","heap","heart","heat","heave","heavy","hedge","heel","hefty","heist","help","hen","hence","her","herald","herb","herby","herd","hermit","heron","hew","hid","hike","hilt","him","hinged","hip","hippo","hippy","his","history","hit","hive","hoard","hoax","hog","hold","hole","homey","honor","hood","hoof","hook","hop","horde","horn","hornet","horrid","horse","hot","hour","how","howl","hub","huddle","hug","hulk","hull","hum","human","humble","hump","hunch","hunk","hunter","husky","hustle","hymn","hyper","ice","icing","icon","ideal","idly","igloo","ignite","ill","image","immune","imp","impact","impede","imply","import","include","inept","infer","infuse","ingest","inhale","inherit","injure","inky","inlet","inn","insane","inset","inside","instead","insult","inter","interest","invade","ion","ionic","irate","iris","irk","ironic","irons","irony","island","itch","its","itself","ivory","jab","jade","jagged","jail","jam","jammy","jar","jaunt","jaw","jerky","jest","jester","jet","jewel","jiffy","jived","jog","jolly","jolt","jostle","joust","jovial","joy","judge","jug","juicy","jumpy","jungle","junk","just","justice","jut","keen","keg","kept","key","kid","kidnap","kill","kiln","kin","kind","kinky","knack","knave","kneel","knew","knife","knock","knot","knotty","known","kudos","lab","lack","lad","lag","lair","lake","lame","lament","lamp","lance","land","lane","lanky","lap","lapdog","lapse","large","largo","lark","laser","lash","lasso","last","latch","later","lavish","law","lawn","lax","lay","layer","lazy","leaf","leafy","leak","lean","leap","learn","leave","led","ledge","leech","leg","legal","lend","lens","let","level","levy","libel","lick","lid","lift","light","likely","lilac","lime","limit","limp","line","linear","link","lip","liquid","lithe","liver","llama","loathe","local","lock","locket","lodge","loft","log","long","look","loom","loon","loopy","lot","lotus","loud","love","low","lowly","loyalty","lucid","luck","lug","lump","lumpy","lunacy","lung","lure","lurk","lush","lusty","lyric","mace","mad","made","magic","maid","mail","main","major","make","mall","man","mane","mangle","mangy","manic","manly","manor","map","mar","mare","mark","marsh","mart","marvel","mask","mast","mat","match","matey","max","maxim","may","mayhem","maze","meager","meal","mean","means","meaty","meddle","mellow","melon","melt","men","mentor","mercy","mesh","met","method","might","mile","miles","milk","mill","mime","mind","minty","mirror","mirth","miser","miss","mist","moat","mob","mock","mod","mode","model","moist","mole","molt","mom","money","monk","month","moody","moon","moose","mopey","moral","morale","more","moss","mostly","moth","motley","mourn","moved","mucus","mud","muddle","muddy","mug","muggy","mulch","murky","murmur","muse","music","must","musty","mutiny","mutual","mystery","mystic","myth","nag","nail","naive","name","nap","nasty","naval","navy","near","neck","need","negate","nest","net","nettle","network","new","nice","nifty","night","nimble","nip","nippy","noble","nod","node","nomad","nonce","none","nook","nor","norm","north","nose","not","notably","notch","note","notion","noun","novel","novice","now","nubile","nude","null","nun","nutty","nymph","oaken","oar","oat","obese","ocean","odd","oddly","odds","ode","off","often","oil","old","older","omen","once","one","only","onset","oozy","opaque","opt","optic","orb","orbit","ordeal","ornate","other","our","out","outfit","outlaw","outrun","outside","oval","oven","owe","own","owned","ozone","pace","pacify","pack","pad","padded","page","paint","pair","pal","pale","pallor","pan","pane","panel","pansy","papal","par","pardon","park","parka","parrot","part","party","passion","past","pat","patchy","path","patient","patrol","pattern","paved","paw","pay","peace","peak","pearl","pebble","pedal","peel","peg","pellet","pen","pencil","penny","pep","per","perfect","peril","perky","person","pest","pet","petty","pew","phone","pick","piece","pier","piggy","pile","pin","pint","pipe","pit","pithy","pity","pixie","place","plaid","plain","plan","plane","plank","plaza","plead","plod","plot","plow","pluck","plum","plume","plump","plunk","plush","ply","pod","poem","poke","pole","polka","poll","pond","pop","poppy","pose","posit","post","pot","pouch","pounce","pour","pouty","poverty","pow","powder","power","prank","preen","press","prey","price","pride","prima","prime","print","prism","prison","privy","pro","probe","problem","prod","profit","prone","proof","prop","proud","prove","provide","prowl","prune","psalm","pub","pudgy","puffy","pull","pump","punk","punt","pup","pure","purpose","pursue","push","pushy","put","putty","pygmy","query","quick","quill","quirk","quirky","quite","quorum","quota","rabid","rack","radar","raft","rag","raid","rail","rain","rainy","rake","ramble","ramp","ran","random","rang","rangy","rank","ransom","rap","rapid","rare","rash","raspy","rate","rattle","ravage","rave","raven","raw","rawly","ray","rayon","reach","ready","real","reality","realm","rebuild","recess","red","reduce","reed","reedy","reef","reel","ref","refine","refuge","regain","regal","regent","reign","rein","reject","relate","relax","relief","relish","remain","render","rent","rep","repay","repent","replete","request","rescue","resist","resolve","rest","restore","retch","retort","retro","rev","reveal","revolt","reward","rib","ribbon","rid","riddle","rider","rift","right","rim","ring","riot","rip","ripe","ripen","ripple","rise","risk","risky","rite","ritual","ritzy","river","rivet","road","roam","rob","robe","robot","robust","rock","rocky","rod","rogue","role","roll","romance","roof","room","root","rope","ropy","rose","rot","rouge","round","rout","row","rowdy","rub","ruddy","rug","rugby","rugged","ruin","rule","rum","rummy","run","runty","ruse","rush","rust","rustle","rusty","rut","rye","sadden","sadly","safe","sag","sage","sail","saint","sake","salsa","salt","salty","salute","sample","sand","sane","sang","sap","sat","saucy","savage","save","savvy","saw","say","scald","scalp","scamp","scant","scare","scary","scatter","scene","scheme","scone","scorch","scorn","scout","scowl","scrawl","scream","screw","scrub","seal","seam","seat","seed","seedy","seem","seize","seldom","self","sell","sense","serve","set","settle","seven","sever","sew","shack","shaft","shake","shaky","shale","shallow","share","shark","shawl","sheen","sheer","shelf","shelter","shift","shimmer","shin","shiny","shoal","shock","short","shout","shove","showy","shred","shrill","shrink","shrug","sickle","silence","sill","simple","since","sinew","sinful","sing","sink","sip","sir","siren","sit","six","size","sizeable","skew","ski","skin","skinny","skip","skirt","skull","skunk","sky","slack","slain","slam","slap","slash","slave","sleek","sleep","sleet","sleuth","slice","slick","slide","slim","slime","sling","slinky","slip","sliver","sloppy","slosh","slot","sloth","slug","slump","sly","smack","small","smart","smartly","smash","smear","smell","smile","smoke","smoky","smudge","snack","snake","snap","snappy","snare","snatch","snazzy","sneak","sneaky","sniff","snout","snow","snub","soak","sob","sock","sod","soil","solar","soldier","solve","son","song","sonic","soot","soothe","sooty","sorcery","sore","soul","soulful","sound","sour","south","sow","soy","spa","space","span","spank","spark","sparkle","spawn","speak","spear","special","speed","spend","spice","spiky","spill","spin","spine","spire","spite","spleen","spooky","spore","sport","spot","spout","sprawl","spree","sprightly","spring","sprout","spry","spur","spy","squad","squall","squat","squeak","squid","stab","stable","stack","staff","stain","stair","stale","stall","stamp","stand","star","stare","stark","start","startle","startling","stash","state","stately","staunch","stay","steed","steel","steep","steer","stem","stench","step","stereo","stern","stew","stiff","sting","stingy","stink","stir","stoic","stomp","stone","stool","stoop","stop","store","storm","story","stout","stove","strain","strand","strange","straw","stray","strife","strip","stroke","stroll","strum","strut","stub","stuck","student","study","stuff","stumble","stump","stun","sty","style","suave","sub","success","sucker","sudden","suffer","suit","sulk","sullen","sum","summon","sun","sunny","sunset","super","supple","support","surf","surface","surge","sustain","swamp","swampy","swanky","swap","sway","swear","sweat","sweaty","sweep","swept","swift","swirl","swoon","swoop","sword","symbol","symptom","syrupy","tab","table","taboo","tacky","tail","take","taken","tale","talent","talk","tall","tame","tan","tangle","tangy","tape","tapir","tar","taste","taunt","taupe","taut","tawny","tax","teach","teacher","teak","teal","tear","tell","tempo","tend","tense","tension","tent","tepid","term","terms","text","texture","thatch","their","there","these","thief","thigh","thing","think","thorn","thorny","those","thrash","thread","thrill","thrive","throb","throne","throw","thunder","tide","tiger","tight","tile","till","time","timer","times","tinge","tint","tip","tipsy","tire","tired","title","toad","toasty","today","toe","toll","tomb","ton","tone","tonic","tonight","too","top","topaz","topsy","torch","tore","torn","toss","tot","total","toucan","touch","touchy","tow","towel","town","toxic","toy","track","trade","tragedy","trail","train","tramp","trash","trawl","tray","tread","treat","treaty","tremor","trend","tribal","tribe","trick","tricky","tried","trifle","trim","trio","trip","triple","triumph","troth","trouble","trout","trove","truce","truck","true","trunk","trusty","try","tub","tubby","tuft","tug","tulip","tumble","tumor","tundra","turbid","turf","turns","tweet","twice","twinkle","twist","twisty","two","type","tyrant","ulcer","umber","under","unfit","unify","union","unison","unit","unity","unknown","unruly","until","unusual","update","upon","upper","upset","urge","urn","use","usher","using","utter","vacuum","vague","vain","vale","valor","value","valve","van","vane","vanish","vapid","vapor","vase","vast","vat","vault","veil","vein","velvet","vendor","verb","verge","verse","versus","vest","vexed","via","vial","vibrant","vicar","vice","victim","video","view","vigil","vigor","villa","vim","vine","vintage","violet","viral","virtue","viscous","vision","visit","visor","vivid","vixen","vocal","voice","void","volley","volt","voted","voter","vow","wad","wade","wager","wail","wake","walk","wallet","wallow","walrus","waltz","wand","wander","wane","want","war","ware","warrior","was","wash","wasp","watch","water","watery","wavy","wax","weak","weaken","weasel","weather","weave","web","wed","wedge","weed","weedy","weird","welcome","well","wet","whack","what","where","whiff","while","whimsy","whine","whirl","whisk","who","whole","whose","why","wicker","wide","widow","width","wig","wild","will","win","wince","wind","wine","wing","wiry","wise","wish","wisp","wispy","wit","witch","wither","witty","woe","wok","wolf","women","won","wonder","woo","wood","wooly","word","wordy","wore","work","world","worm","worship","worth","would","wow","wraith","wrath","wren","wrist","writ","write","writhe","wrong","yam","yap","yappy","yard","yarn","yawn","yearly","yearn","years","yell","yen","yet","yew","yoke","yonder","you","young","yours","youth","zap","zappy","zeal","zealot","zero","zest","zesty","zinc","zip","zippy","zone","zonked","zoo","zoom"];
const ANIMALS=["ant","ape","bat","bee","cat","cod","cow","cub","doe","dog","elk","emu","ewe","fly","fox","gnu","hen","hog","jay","koi","owl","pig","ram","rat","yak","bear","bird","boar","buck","bull","calf","clam","colt","crab","crow","deer","dove","duck","fawn","flea","frog","gnat","goat","hare","hawk","ibis","kite","lamb","lark","lion","loon","lynx","mink","mole","moth","mule","newt","pony","puma","slug","swan","toad","vole","wasp","wolf","wren","adder","bison","crane","dingo","eagle","egret","finch","gecko","guppy","hippo","horse","hound","hyena","koala","llama","macaw","moose","mouse","otter","panda","quail","raven","shark","skunk","sloth","snake","squid","stork","tapir","tiger","trout","viper","whale","zebra","alpaca","beaver","bobcat","canary","condor","donkey","falcon","ferret","gibbon","iguana","jaguar","lizard","locust","magpie","monkey","parrot","pigeon","rabbit","salmon","spider","toucan","turkey","turtle","walrus","weasel","badger","beetle","buffalo","chicken","dolphin","gorilla","hamster","leopard","lobster","panther","penguin","raccoon","sparrow","vulture","cheetah","elephant","flamingo","hedgehog","kangaroo","porcupine","alligator","armadillo","orangutan","chameleon","chimpanzee"];
const ANIMALS_EASY=["ant","bat","bee","cat","cow","dog","elk","emu","fly","fox","hen","hog","owl","pig","ram","rat","bear","bull","calf","crab","crow","deer","dove","duck","fish","frog","goat","hare","hawk","lamb","lion","mole","mule","pony","swan","toad","wolf","wren","crane","eagle","finch","gecko","hippo","horse","hyena","koala","llama","moose","mouse","otter","panda","shark","skunk","sloth","snake","stork","tiger","whale","zebra","donkey","monkey","parrot","rabbit","salmon","spider","turtle","walrus","chicken","dolphin","gorilla","leopard","penguin","raccoon","cheetah","elephant","flamingo","kangaroo"];
const COUNTRIES=["chad","cuba","fiji","iran","iraq","laos","mali","oman","peru","togo","china","egypt","ghana","india","italy","japan","kenya","libya","nepal","niger","qatar","spain","sudan","syria","tonga","wales","yemen","angola","belize","brazil","canada","cyprus","france","greece","guinea","guyana","israel","jordan","kuwait","malawi","mexico","monaco","norway","panama","poland","rwanda","serbia","sweden","taiwan","turkey","uganda","albania","algeria","armenia","austria","bahrain","belarus","belgium","bolivia","burundi","comoros","croatia","denmark","ecuador","eritrea","estonia","finland","georgia","germany","grenada","hungary","iceland","ireland","jamaica","lebanon","lesotho","liberia","moldova","mongolia","morocco","myanmar","namibia","nigeria","pakistan","romania","senegal","somalia","ukraine","uruguay","vietnam","zambia","zimbabwe","cambodia","colombia","djibouti","dominica","ethiopia","honduras","malaysia","maldives","portugal","slovakia","slovenia","suriname","tanzania","thailand","barbados","bulgaria","indonesia","lithuania","mauritius","singapore","argentina","australia","azerbaijan","bangladesh","mozambique","madagascar","uzbekistan","kyrgyzstan","kazakhstan","afghanistan"];
const CITIES=["rome","lima","oslo","bern","doha","riga","cairo","dubai","paris","tokyo","delhi","lagos","dhaka","accra","hanoi","seoul","miami","abuja","tunis","osaka","vienna","prague","warsaw","athens","lisbon","dublin","moscow","sydney","taipei","london","berlin","madrid","havana","bogota","manila","mumbai","nairobi","jakarta","karachi","bangkok","beijing","chicago","houston","toronto","montreal","shanghai","brussels","istanbul","singapore","amsterdam","budapest","helsinki","stockholm","melbourne","auckland","santiago","caracas","casablanca","johannesburg","copenhagen","edinburgh","manchester","barcelona","frankfurt","hamburg","kathmandu","islamabad","tashkent","yerevan","tbilisi","almaty","bishkek","minsk","chisinau","tallinn","vilnius","sofia","bucharest","belgrade","zagreb","tirana","sarajevo","podgorica","reykjavik","wellington","canberra","ottawa","brasilia","tehran","baghdad","damascus","beirut","amman","riyadh","jeddah","muscat","manama","ankara","nicosia","zurich","geneva","antwerp","ghent","bruges","rotterdam","gothenburg","malmo","bergen","tampere","turku","galway","cork","lyon","marseille","toulouse","bordeaux","nice","nantes","strasbourg","lille","rennes","grenoble","munich","cologne","stuttgart","dortmund","leipzig","dresden","nuremberg","naples","turin","palermo","genoa","bologna","florence","venice","catania","valencia","seville","zaragoza","malaga","porto","braga","coimbra","krakow","lodz","poznan","wroclaw","gdansk","debrecen","plovdiv","varna","thessaloniki","patras","brno","ostrava","bratislava","kosice","split","rijeka","pristina","kharkiv","odessa","lviv","novosibirsk","yekaterinburg","kazan"];
const FOODS=["ale","bun","jam","pie","tea","fig","ham","oat","rye","cod","egg","oil","rum","gin","beef","beet","bran","brie","cake","chip","clam","corn","crab","dill","duck","feta","fish","flan","herb","kale","lamb","leek","lime","lard","mayo","meat","milk","mint","miso","naan","oats","okra","pear","pita","plum","pork","rice","sage","salt","soup","soya","stew","taco","tofu","tuna","wine","yolk","apple","basil","berry","bread","brine","broth","candy","cheese","chili","chips","cider","clove","cocoa","cream","curry","dates","donut","dough","drink","flour","fudge","grape","gravy","guava","honey","juice","kebab","lemon","liver","lychee","mango","maple","melon","mocha","olive","onion","pasta","peach","pecan","pesto","pizza","prawn","punch","ramen","salad","sauce","scone","shrimp","snack","spice","squid","steak","sugar","sweet","syrup","thyme","toast","vodka","waffle","wheat","yogurt","almond","banana","brandy","butter","cashew","cherry","coffee","cookie","fennel","garlic","ginger","lobster","muffin","orange","papaya","pepper","potato","radish","salmon","tomato","turkey","walnut","anchovy","avocado","broccoli","brownie","burrito","coconut","custard","granola","lettuce","pancake","parsley","peanut","pretzel","pudding","sausage","spinach","vanilla","whiskey","zucchini","blueberry","chocolate","cinnamon","croissant","mushroom","raspberry","strawberry","watermelon","cauliflower","pineapple","grapefruit","pomegranate","artichoke","asparagus","tangerine","blackberry","cranberry","nectarine"];
const NATURE=["ash","bay","bog","clay","crag","dew","fen","fog","gem","ice","ivy","kelp","lake","lava","leaf","loam","mesa","mist","moss","mud","oak","peat","pine","pond","pool","rain","reef","rock","sand","silt","snow","soil","star","stem","tide","vale","wave","wind","wood","bark","bush","cliff","cloud","coast","coral","creek","crest","dale","dune","dust","fern","fjord","flora","frost","gale","glade","gorge","grain","grass","grove","gust","hail","heath","hedge","hill","inlet","isle","knoll","loch","marsh","mire","moon","mound","pebble","petal","plain","plant","ridge","river","roots","rose","shore","shrub","slope","stalk","stone","storm","stream","swamp","thorn","trail","water","amber","basalt","canyon","cavern","comet","crater","crystal","desert","drought","eclipse","estuary","forest","glacier","granite","harvest","horizon","island","jungle","lagoon","meteor","mineral","monsoon","mountain","nebula","ocean","prairie","quartz","ravine","savanna","seabed","sierra","solstice","spring","steppe","tempest","terrain","thunder","tornado","tropics","tsunami","twilight","typhoon","volcano","wilderness","zephyr","aurora","bamboo","breeze","cobble","current","delta","erosion","geyser","grotto","habitat","iceberg","lakebed","lowland","mangrove","meadow","plateau","redwood","sandbar","seashore","snowfall","summit","sundown","tundra","upland","wetland","woodland"];
const COLORS=["red","tan","bay","ash","sky","jet","gold","blue","cyan","gray","grey","jade","lime","navy","pink","plum","rose","rust","ruby","sage","teal","wine","amber","azure","beige","black","brown","coral","cream","denim","ebony","green","ivory","khaki","lemon","lilac","mauve","mocha","ochre","olive","peach","sandy","sepia","slate","straw","taupe","umber","white","aqua","bronze","cobalt","copper","crimson","forest","fuchsia","garnet","indigo","maroon","mustard","orange","orchid","salmon","scarlet","silver","sienna","violet","yellow","burgundy","cerulean","charcoal","chartreuse","chocolate","lavender","magenta","midnight","saffron","sapphire","tangerine","turquoise","vermillion","alabaster","aubergine","champagne","cornflower","goldenrod","mahogany","periwinkle","terracotta","ultramarine"];
const EMOTIONS=["awed","calm","glad","hurt","keen","mild","numb","smug","torn","wild","angry","brave","eager","happy","livid","moody","proud","ready","sorry","sweet","tense","tired","upset","vexed","wary","weary","afraid","amused","bored","elated","empty","frantic","furious","gloomy","guilty","hopeful","joyful","lonely","loving","mellow","pained","rested","scared","shaken","shocked","sulky","tender","uneasy","wistful","worried","zealous","anxious","ashamed","content","curious","devoted","ecstatic","excited","focused","forlorn","gleeful","grumpy","hostile","humbled","jealous","jittery","jubilant","longing","peaceful","relieved","resentful","restless","romantic","serene","thankful","thrilled","troubled"];
const SPORTS=["polo","golf","judo","luge","yoga","swim","race","run","ski","box","dive","surf","bike","bowl","curl","fish","hunt","jump","kick","lift","pull","push","row","spar","trek","archery","chess","climb","cycle","dance","hurdle","kayak","pitch","rugby","shoot","skate","squat","throw","vault","badminton","baseball","football","handball","lacrosse","marathon","rowing","sailing","skating","soccer","softball","swimming","tennis","volleyball","basketball","bicycling","croquet","darts","fencing","gymnastics","hockey","rafting","skiing","snowboard","squash","triathlon","weightlifting","wrestling","canoeing","kickboxing","skydiving","athletics","bobsled","curling","hurling","netball","skateboard","snorkeling","surfboard","windsurfing","yachting"];
const PROFESSIONS=["chef","monk","maid","spy","vet","aide","dean","sage","actor","agent","baker","boxer","coach","clerk","coder","cook","diver","judge","mayor","medic","miner","nurse","pilot","rabbi","rider","scout","smith","tutor","usher","vicar","barber","bishop","broker","butler","captain","cashier","cleric","curate","dancer","dealer","deputy","doctor","driver","editor","expert","farmer","fisher","jockey","lawyer","lender","logger","marshal","midwife","miller","officer","painter","pastor","plumber","porter","potter","priest","ranger","sailor","singer","tailor","trader","warden","weaver","worker","analyst","chemist","dentist","engineer","fireman","foreman","geologist","janitor","jeweler","lecturer","librarian","mechanic","musician","optician","planner","reporter","sculptor","soldier","surgeon","teacher","therapist","architect","astronomer","biologist","carpenter","conductor","consultant","contractor","counselor","custodian","economist","electrician","journalist","programmer","scientist","statistician","veterinarian","accountant","astronaut","detective","diplomat","firefighter","geographer","illustrator","interpreter","mathematician","neurologist","nutritionist","oceanographer","paramedic","pathologist","pediatrician","pharmacist","philosopher","photographer","politician","professor","psychiatrist","psychologist","radiologist","recruiter","sociologist","sommelier","translator","zoologist"];

const POOLS={all:ALL,animals:ANIMALS,easy:ANIMALS_EASY,countries:COUNTRIES,cities:CITIES,foods:FOODS,nature:NATURE,colors:COLORS,emotions:EMOTIONS,sports:SPORTS,professions:PROFESSIONS};
const CAT_LABELS={all:"All English",animals:"Animals",easy:"Animals Easy",countries:"Countries",cities:"Cities",foods:"Foods",nature:"Nature",colors:"Colors",emotions:"Emotions",sports:"Sports",professions:"Professions"};

function getPool(cat,len){
  let p=[...new Set((POOLS[cat]||POOLS.all).map(w=>w.toLowerCase().trim()))].filter(w=>/^[a-z]+$/.test(w));
  if(len==="3-5")p=p.filter(w=>w.length>=3&&w.length<=5);
  else if(len==="5-7")p=p.filter(w=>w.length>=5&&w.length<=7);
  else if(len==="6-8")p=p.filter(w=>w.length>=6&&w.length<=8);
  return p;
}

// ═══════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════
const DEF={cat:"all",len:"any",delay:10,pulse:250,pause:800,revealMode:"call",apiUrl:"",apiKey:"",apiKeyName:"key",wall:"dark",fontSize:"medium",inputMode:"swipe"};
function loadS(){try{return{...DEF,...JSON.parse(localStorage.getItem("mc6")||"{}")}}catch{return{...DEF}}}
function saveS(s){try{localStorage.setItem("mc6",JSON.stringify(s))}catch{}}

// ═══════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════
function initSt(){return{screen:"idle",code:"",pool:[],kept:[],used:[],letter:"",word:"",...loadS()};}
function reducer(s,a){
  switch(a.type){
    case"DIGIT":return{...s,code:s.code+a.d};
    case"CLRCODE":return{...s,code:""};
    case"CONFIRM":{
      const raw=getPool(s.cat,s.len),f=filterShape(s.code,raw);
      if(!f.length)return{...s,code:""};
      if(f.length===1)return{...s,code:"",screen:"countdown",word:f[0].toUpperCase(),pool:f};
      const L=pickLetter(f,new Set());
      if(!L)return{...s,code:"",screen:"pick",pool:f};
      return{...s,code:"",screen:"vibrating",pool:f,kept:[],used:[L],letter:L};
    }
    case"VD":return{...s,screen:"question"};
    case"YES":{
      const{letter:L,pool,kept,used}=s;
      const np=pool.filter(w=>wset(w).has(L)),nk=[...kept,L],nu=new Set(used);
      if(!np.length)return{...s,screen:"idle",pool:[],code:""};
      if(np.length===1)return{...s,screen:"countdown",word:np[0].toUpperCase(),pool:np,kept:nk};
      const nx=pickLetter(np,nu);
      if(!nx)return{...s,screen:"pick",pool:np,kept:nk};
      return{...s,screen:"vibrating",pool:np,kept:nk,used:[...nu,nx],letter:nx};
    }
    case"NO":{
      const{letter:L,pool,kept,used}=s;
      const np=pool.filter(w=>{const ws=wset(w);return!ws.has(L)&&kept.every(k=>ws.has(k));});
      const nu=new Set(used);
      if(!np.length)return{...s,screen:"idle",pool:[],code:""};
      if(np.length===1)return{...s,screen:"countdown",word:np[0].toUpperCase(),pool:np};
      const nx=pickLetter(np,nu);
      if(!nx)return{...s,screen:"pick",pool:np};
      return{...s,screen:"vibrating",pool:np,used:[...nu,nx],letter:nx};
    }
    case"PICK":return{...s,screen:"countdown",word:a.w.toUpperCase()};
    case"REVEAL":return{...s,screen:"reveal"};
    case"RESET":return{...initSt(),screen:"idle"};
    case"SETTINGS":return{...s,screen:"settings"};
    case"BACK":return{...s,screen:"idle"};
    case"SET":{const ns={...s,[a.k]:a.v};saveS({cat:ns.cat,len:ns.len,delay:ns.delay,pulse:ns.pulse,pause:ns.pause,revealMode:ns.revealMode,apiUrl:ns.apiUrl,apiKey:ns.apiKey,apiKeyName:ns.apiKeyName,wall:ns.wall,fontSize:ns.fontSize,inputMode:ns.inputMode});return ns;}
    default:return s;
  }
}

// ═══════════════════════════════════════════════════════
// SWIPE HOOK
// ═══════════════════════════════════════════════════════
function useSwipe(onSwipe){
  const s0=useRef(null),MIN=50;
  const onStart=useCallback(e=>{const t=e.touches[0];s0.current={x:t.clientX,y:t.clientY};},[]);
  const onEnd=useCallback(e=>{
    if(!s0.current)return;
    const t=e.changedTouches[0];
    const dx=t.clientX-s0.current.x,dy=t.clientY-s0.current.y;
    s0.current=null;
    const ax=Math.abs(dx),ay=Math.abs(dy);
    if(Math.max(ax,ay)<MIN)return;
    if(ax>ay)onSwipe(dx>0?"right":"left");
    else onSwipe(dy>0?"down":"up");
  },[onSwipe]);
  return{onTouchStart:onStart,onTouchEnd:onEnd};
}

// ═══════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════
export default function App(){
  const[st,dispatch]=useReducer(reducer,null,initSt);
  const stRef=useRef(st);stRef.current=st;
  const[activated,setActivated]=useState(false);
  const[callTime,setCallTime]=useState("");
  const[cdSecs,setCdSecs]=useState(10);
  const[flash,setFlash]=useState(null);
  const[apiStatus,setApiStatus]=useState("idle");
  const ctxRef=useRef(null);
  const cdRef=useRef(null);
  const ringStopRef=useRef(null);
  const codeTimer=useRef(null);
  const ppLast=useRef(0); // play/pause last press time (bluetooth double-press)

  const doFlash=useCallback(dir=>{setFlash(dir);setTimeout(()=>setFlash(null),400);if(navigator.vibrate)navigator.vibrate(30);},[]);

  // ── Core input handler (swipe OR bluetooth) ──
  const handleInput=useCallback(action=>{
    doFlash(action==="1"?"up":action==="2"?"right":action==="3"?"down":action==="confirm"?"left":action==="yes"?"up":"down");
    const s=stRef.current;
    if(s.screen==="vibrating")return;
    if(s.screen==="idle"){
      if(action==="1"||action==="2"||action==="3"){
        dispatch({type:"DIGIT",d:action});
        clearTimeout(codeTimer.current);
        codeTimer.current=setTimeout(()=>dispatch({type:"CLRCODE"}),8000);
      } else if(action==="confirm"){
        clearTimeout(codeTimer.current);
        dispatch({type:"CONFIRM"});
      }
    } else if(s.screen==="question"){
      if(action==="yes")dispatch({type:"YES"});
      else if(action==="no")dispatch({type:"NO"});
    }
  },[doFlash]);

  // Swipe → action mapping
  const handleSwipe=useCallback(dir=>{
    const s=stRef.current;
    if(s.screen==="idle"){
      if(dir==="up")handleInput("1");
      else if(dir==="right")handleInput("2");
      else if(dir==="down")handleInput("3");
      else if(dir==="left")handleInput("confirm");
    } else if(s.screen==="question"){
      if(dir==="up")handleInput("yes");
      else if(dir==="down")handleInput("no");
    }
  },[handleInput]);

  const{onTouchStart,onTouchEnd}=useSwipe(handleSwipe);

  // ── Bluetooth Media Remote ──
  useEffect(()=>{
    if(st.inputMode!=="bluetooth")return;
    // Set up MediaSession so Bluetooth media buttons fire handlers
    if(!navigator.mediaSession)return;
    navigator.mediaSession.metadata=new MediaMetadata({title:"MindCall",artist:"Performer"});
    navigator.mediaSession.setActionHandler("previoustrack",()=>{
      const s=stRef.current;
      if(s.screen==="idle")handleInput("1");
      else if(s.screen==="question")handleInput("yes");
    });
    navigator.mediaSession.setActionHandler("nexttrack",()=>{
      const s=stRef.current;
      if(s.screen==="idle")handleInput("3");
      else if(s.screen==="question")handleInput("no");
    });
    navigator.mediaSession.setActionHandler("play",()=>{
      const now=Date.now();
      const s=stRef.current;
      if(s.screen==="idle"){
        if(now-ppLast.current<600){handleInput("confirm");ppLast.current=0;}
        else{handleInput("2");ppLast.current=now;}
      }
    });
    navigator.mediaSession.setActionHandler("pause",()=>{
      const now=Date.now();
      const s=stRef.current;
      if(s.screen==="idle"){
        if(now-ppLast.current<600){handleInput("confirm");ppLast.current=0;}
        else{handleInput("2");ppLast.current=now;}
      }
    });
    // Keyboard fallback
    const onKey=e=>{
      if(e.key==="MediaTrackPrevious"){e.preventDefault();navigator.mediaSession.actionHandlers?.get?.("previoustrack")||(() => { const s=stRef.current; if(s.screen==="idle")handleInput("1"); else if(s.screen==="question")handleInput("yes"); })();}
      else if(e.key==="MediaPlayPause"){e.preventDefault();
        const now=Date.now();const s=stRef.current;
        if(s.screen==="idle"){if(now-ppLast.current<600){handleInput("confirm");ppLast.current=0;}else{handleInput("2");ppLast.current=now;}}
      }
      else if(e.key==="MediaTrackNext"){e.preventDefault();const s=stRef.current;if(s.screen==="idle")handleInput("3");else if(s.screen==="question")handleInput("no");}
    };
    document.addEventListener("keydown",onKey);
    return()=>{
      document.removeEventListener("keydown",onKey);
      ["previoustrack","nexttrack","play","pause"].forEach(a=>{try{navigator.mediaSession.setActionHandler(a,null);}catch{}});
    };
  },[st.inputMode,handleInput]);

  // Start silent audio for BT (MediaSession needs active audio)
  const silentRef=useRef(null);
  useEffect(()=>{
    if(st.inputMode==="bluetooth"&&activated&&!silentRef.current){
      const audio=new Audio();
      const sr=8000,ns=sr;const buf=new ArrayBuffer(44+ns);const v=new DataView(buf);
      const ws=(o,s)=>[...s].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
      ws(0,"RIFF");v.setUint32(4,36+ns,true);ws(8,"WAVE");ws(12,"fmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr,true);v.setUint16(32,1,true);v.setUint16(34,8,true);ws(36,"data");v.setUint32(40,ns,true);
      for(let i=0;i<ns;i++)v.setUint8(44+i,0x80);
      audio.src=URL.createObjectURL(new Blob([buf],{type:"audio/wav"}));
      audio.loop=true;audio.volume=0.01;silentRef.current=audio;
      audio.play().catch(()=>{});
    }
    return()=>{if(st.inputMode!=="bluetooth"&&silentRef.current){silentRef.current.pause();silentRef.current=null;}}
  },[st.inputMode,activated]);

  // ── ACTIVATE ──
  const activate=()=>{
    setActivated(true);
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    const ctx=new AC();ctxRef.current=ctx;
    const osc=ctx.createOscillator(),g=ctx.createGain();
    g.gain.value=0.00001;osc.connect(g);g.connect(ctx.destination);osc.start();
    if(ctx.state==="suspended")ctx.resume();
  };

  // ── VIBRATING ──
  useEffect(()=>{
    if(st.screen!=="vibrating"||!st.letter)return;
    const pat=buildVibe(st.letter,st.pulse,st.pause);
    if(navigator.vibrate)navigator.vibrate(pat);
    polyBeeps(ctxRef.current,st.letter,st.pulse,st.pause);
    const dur=vibeDur(pat)+500;
    const t=setTimeout(()=>dispatch({type:"VD"}),dur);
    return()=>clearTimeout(t);
  },[st.screen,st.letter,st.pulse,st.pause]);

  // ── COUNTDOWN ──
  useEffect(()=>{
    if(st.screen!=="countdown")return;
    let secs=st.delay;setCdSecs(secs);
    cdRef.current=setInterval(()=>{secs--;setCdSecs(secs);if(secs<=0){clearInterval(cdRef.current);dispatch({type:"REVEAL"});}},1000);
    return()=>clearInterval(cdRef.current);
  },[st.screen,st.delay]);

  // ── REVEAL ──
  useEffect(()=>{
    if(st.screen!=="reveal")return;
    const tick=()=>{const d=new Date();setCallTime(`${d.getHours()%12||12}:${String(d.getMinutes()).padStart(2,"0")}`);};
    tick();const t=setInterval(tick,1000);
    if(st.revealMode==="call"){
      if(ringStopRef.current)ringStopRef.current();
      ringStopRef.current=playRingtone(ctxRef.current);
    } else if(st.revealMode==="api"){
      setApiStatus("sending");
      const body={};body[st.apiKeyName||"word"]=st.word;
      const headers={"Content-Type":"application/json"};
      if(st.apiKey)headers["X-API-Key"]=st.apiKey;
      const payload={[st.apiKeyName||"word"]:st.word};
      if(st.apiKey)payload["key"]=st.apiKey;
      fetch(st.apiUrl,{method:"POST",headers,body:JSON.stringify(payload)})
        .then(r=>r.ok?setApiStatus("sent"):setApiStatus("error"))
        .catch(()=>setApiStatus("error"));
    }
    return()=>{clearInterval(t);if(ringStopRef.current){ringStopRef.current();ringStopRef.current=null;}};
  },[st.screen,st.revealMode,st.word,st.apiUrl,st.apiKeyName]);

  // ── 2-finger swipe → settings ──
  const tf=useRef(null);
  const onTwoS=useCallback(e=>{if(e.touches.length===2&&stRef.current.screen==="idle")tf.current=e.touches[0].clientY;},[]);
  const onTwoM=useCallback(e=>{if(e.touches.length===2&&tf.current!==null&&e.touches[0].clientY-tf.current>80){tf.current=null;dispatch({type:"SETTINGS"});}},[]);

  const FLASH_COLORS={up:"linear-gradient(to bottom,rgba(0,240,80,.55),transparent 40%)",down:"linear-gradient(to top,rgba(255,50,50,.55),transparent 40%)",left:"linear-gradient(to right,rgba(100,160,255,.55),transparent 50%)",right:"linear-gradient(to left,rgba(255,200,0,.55),transparent 50%)"};

  return(
    <div style={{position:"fixed",inset:0,background:"#000",overflow:"hidden",userSelect:"none",WebkitUserSelect:"none",WebkitTouchCallout:"none"}}
      onTouchStart={e=>{onTouchStart(e);onTwoS(e);}} onTouchMove={onTwoM} onTouchEnd={onTouchEnd}>
      <AnimatePresence>{flash&&<motion.div key={flash+Date.now()} initial={{opacity:0.9}} animate={{opacity:0}} transition={{duration:0.4}} style={{position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",background:FLASH_COLORS[flash]||""}}/>}</AnimatePresence>
      {!activated&&<ActivateSplash onActivate={activate}/>}
      <AnimatePresence mode="wait">
        {st.screen==="idle"&&<IdleScreen key="i" st={st} onInput={handleInput} onSettings={()=>dispatch({type:"SETTINGS"})}/>}
        {st.screen==="vibrating"&&<VibratingScreen key="v" st={st}/>}
        {st.screen==="question"&&<QuestionScreen key="q" st={st} onInput={handleInput}/>}
        {st.screen==="countdown"&&<CountdownScreen key="cd" word={st.word} secs={cdSecs}/>}
        {st.screen==="pick"&&<PickScreen key="p" words={st.pool} onPick={w=>dispatch({type:"PICK",w})}/>}
        {st.screen==="reveal"&&st.revealMode==="call"&&<CallScreen key="cs" st={st} time={callTime} onDecline={()=>dispatch({type:"RESET"})} onAccept={()=>setTimeout(()=>dispatch({type:"RESET"}),800)}/>}
        {st.screen==="reveal"&&st.revealMode==="peek"&&<PeekScreen key="pk" st={st} onDismiss={()=>dispatch({type:"RESET"})}/>}
        {st.screen==="reveal"&&st.revealMode==="api"&&<ApiScreen key="ap" word={st.word} status={apiStatus} onDismiss={()=>{setApiStatus("idle");dispatch({type:"RESET"});}}/>}
        {st.screen==="settings"&&<SettingsScreen key="s" st={st} dispatch={dispatch}/>}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────
// ACTIVATE
// ──────────────────────────────────────────────
function ActivateSplash({onActivate}){
  return(
    <div onClick={onActivate} style={{position:"fixed",inset:0,zIndex:400,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:22,cursor:"pointer"}}>
      <motion.div animate={{scale:[1,1.12,1],rotate:[0,6,-6,0]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}><div style={{fontSize:80}}>🎩</div></motion.div>
      <div style={{color:"#fff",fontSize:26,fontFamily:"system-ui",fontWeight:800,letterSpacing:3}}>MindCall</div>
      <div style={{color:"#333",fontSize:14,fontFamily:"system-ui"}}>Tap to begin</div>
    </div>
  );
}

// ──────────────────────────────────────────────
// IDLE
// ──────────────────────────────────────────────
function IdleScreen({st,onInput,onSettings}){
  const{code,cat,len,inputMode}=st;
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      {/* code display */}
      <div style={{display:"flex",gap:10,marginBottom:22,minHeight:56,alignItems:"center"}}>
        {code.length===0
          ?<div style={{color:"#171717",fontSize:12,fontFamily:"monospace",letterSpacing:5}}>ENTER CODE</div>
          :[...code].map((d,i)=>{
            const c=d==="1"?"#00e676":d==="2"?"#ffb300":"#ef5350";
            const b=d==="1"?"#0b2e16":d==="2"?"#2e2000":"#2e0b0b";
            return(<motion.div key={i} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:600,damping:22}}
              style={{width:50,height:50,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,fontFamily:"monospace",background:b,border:`2px solid ${c}`,color:c}}>{d}</motion.div>);
          })}
      </div>
      {inputMode==="swipe"?(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gridTemplateRows:"1fr 1fr 1fr",gap:6,width:210,height:210,marginBottom:22}}>
            <div style={{gridColumn:2,gridRow:1}}><SwBtn dir="↑" label="1" sub="Straight" c="#00e676" bg="#0b2e16" onClick={()=>onInput("1")}/></div>
            <div style={{gridColumn:1,gridRow:2,display:"flex",alignItems:"center",justifyContent:"center"}}><SwBtn dir="←" label="✓" sub="Confirm" c="#29b6f6" bg="#0b1e2e" onClick={()=>onInput("confirm")}/></div>
            <div style={{gridColumn:2,gridRow:2,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:44,height:44,borderRadius:"50%",border:"1px solid #181818",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"#181818",fontSize:8,fontFamily:"monospace",letterSpacing:1}}>SWIPE</div></div></div>
            <div style={{gridColumn:3,gridRow:2,display:"flex",alignItems:"center",justifyContent:"center"}}><SwBtn dir="→" label="2" sub="Mixed" c="#ffb300" bg="#2e2000" onClick={()=>onInput("2")}/></div>
            <div style={{gridColumn:2,gridRow:3}}><SwBtn dir="↓" label="3" sub="Curves" c="#ef5350" bg="#2e0b0b" onClick={()=>onInput("3")}/></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5,width:"85%",maxWidth:310,marginBottom:18}}>
            {[["1","Straight — A E F H I K L M N T V W X Y Z","#00e676","#0b2e16"],["2","Mixed — B D G J P Q R U","#ffb300","#2e2000"],["3","Curves — C O S","#ef5350","#2e0b0b"]].map(([sh,desc,c,bg])=>(
              <div key={sh} style={{background:bg,border:`1px solid ${c}22`,borderRadius:8,padding:"5px 12px",display:"flex",gap:10,alignItems:"center"}}>
                <div style={{color:c,fontSize:15,fontWeight:900,fontFamily:"monospace",minWidth:12}}>{sh}</div>
                <div style={{color:`${c}88`,fontSize:9,fontFamily:"monospace",letterSpacing:0.5,lineHeight:1.4}}>{desc}</div>
              </div>
            ))}
          </div>
        </>
      ):(
        <div style={{marginBottom:22,display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
          <div style={{color:"#222",fontSize:11,fontFamily:"monospace",letterSpacing:3,marginBottom:4}}>BLUETOOTH REMOTE</div>
          {[["⏮","Previous","1 — Straight"],["⏯","Play/Pause","2 — Mixed (×2 = Confirm)"],["⏭","Next","3 — Curves"]].map(([ico,btn,act])=>(
            <div key={btn} style={{display:"flex",gap:14,alignItems:"center",background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:10,padding:"10px 18px",width:240}}>
              <div style={{fontSize:22}}>{ico}</div>
              <div><div style={{color:"#333",fontSize:12,fontFamily:"system-ui",fontWeight:600}}>{btn}</div><div style={{color:"#222",fontSize:10,fontFamily:"monospace",letterSpacing:1}}>{act}</div></div>
            </div>
          ))}
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:6,width:"85%",maxWidth:310}}>
            {[["1","A E F H I K L M N T V W X Y Z","#00e676","#0b2e16"],["2","B D G J P Q R U","#ffb300","#2e2000"],["3","C O S","#ef5350","#2e0b0b"]].map(([sh,desc,c,bg])=>(
              <div key={sh} style={{background:bg,border:`1px solid ${c}22`,borderRadius:8,padding:"4px 10px",display:"flex",gap:10,alignItems:"center"}}>
                <div style={{color:c,fontSize:13,fontWeight:900,fontFamily:"monospace"}}>{sh}</div>
                <div style={{color:`${c}77`,fontSize:9,fontFamily:"monospace",letterSpacing:0.5}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={onSettings} style={{background:"#0a0a0a",border:"1px solid #181818",borderRadius:20,padding:"7px 20px",color:"#222",fontSize:11,fontFamily:"monospace",letterSpacing:2,cursor:"pointer",textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>
        {CAT_LABELS[cat]}  ·  {len==="any"?"any":len}
      </button>
      <div style={{position:"absolute",bottom:38,color:"#0e0e0e",fontSize:9,fontFamily:"monospace",letterSpacing:3}}>2-FINGER SWIPE DOWN = SETTINGS</div>
    </motion.div>
  );
}

function SwBtn({dir,label,sub,c,bg,onClick}){
  return(<button onClick={onClick} style={{background:bg,border:`2px solid ${c}`,borderRadius:12,padding:"8px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,width:"100%",height:"100%",WebkitTapHighlightColor:"transparent",outline:"none"}}>
    <span style={{color:c,fontSize:16,fontWeight:900,fontFamily:"monospace"}}>{dir}</span>
    <span style={{color:c,fontSize:13,fontWeight:800,fontFamily:"monospace"}}>{label}</span>
    <span style={{color:`${c}88`,fontSize:7,fontFamily:"monospace",letterSpacing:1}}>{sub}</span>
  </button>);
}

// ──────────────────────────────────────────────
// VIBRATING
// ──────────────────────────────────────────────
function VibratingScreen({st}){
  const{letter,pool,kept,pulse,pause}=st;
  const rc=polyRC(letter);
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,background:"#030303",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
      {kept.length>0&&<div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",justifyContent:"center"}}>{kept.map((k,i)=><div key={i} style={{background:"#0a2e14",border:"1px solid #00e676",borderRadius:6,color:"#00e676",fontSize:11,fontWeight:700,fontFamily:"monospace",padding:"3px 10px",letterSpacing:2}}>✓ {k}</div>)}</div>}
      <motion.div animate={{opacity:[0.25,1,0.25],scale:[0.95,1.07,0.95]}} transition={{duration:(pulse+pause)/1000*0.8||0.9,repeat:Infinity,ease:"easeInOut"}}
        style={{color:"#fff",fontSize:190,fontWeight:900,fontFamily:"Georgia,serif",lineHeight:1}}>{letter}</motion.div>
      {rc&&rc.row!==6&&(
        <div style={{display:"flex",gap:18,marginTop:6}}>
          <div style={{textAlign:"center"}}><div style={{color:"#1c1c1c",fontSize:9,fontFamily:"monospace",letterSpacing:2}}>ROW</div><div style={{color:"#2a2a2a",fontSize:22,fontWeight:700,fontFamily:"monospace"}}>{rc.row}</div></div>
          <div style={{color:"#181818",fontSize:22,alignSelf:"center"}}>·</div>
          <div style={{textAlign:"center"}}><div style={{color:"#1c1c1c",fontSize:9,fontFamily:"monospace",letterSpacing:2}}>COL</div><div style={{color:"#2a2a2a",fontSize:22,fontWeight:700,fontFamily:"monospace"}}>{rc.col}</div></div>
        </div>
      )}
      <motion.div animate={{opacity:[0.1,0.45,0.1]}} transition={{duration:0.8,repeat:Infinity}} style={{color:"#222",fontSize:10,fontFamily:"monospace",letterSpacing:5,marginTop:10}}>SENSING…</motion.div>
      {pool.length<=12&&pool.length>1&&<div style={{marginTop:14,display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",maxWidth:340,padding:"0 20px"}}>{pool.map((w,i)=><div key={i} style={{color:"#161616",fontSize:10,fontFamily:"monospace",background:"#090909",borderRadius:4,padding:"2px 7px",border:"1px solid #111",letterSpacing:1,textTransform:"uppercase"}}>{w}</div>)}</div>}
      {pool.length>12&&<div style={{color:"#141414",fontSize:10,fontFamily:"monospace",marginTop:12,letterSpacing:2}}>{pool.length} CANDIDATES</div>}
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// QUESTION
// ──────────────────────────────────────────────
function QuestionScreen({st,onInput}){
  const{letter,pool,kept,inputMode}=st;
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,background:"#020202",display:"flex",flexDirection:"column",alignItems:"center",padding:"32px 20px 20px"}}>
      {kept.length>0&&<div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",justifyContent:"center"}}>{kept.map((k,i)=><div key={i} style={{background:"#0a2e14",border:"1px solid #00e676",borderRadius:6,color:"#00e676",fontSize:11,fontWeight:700,fontFamily:"monospace",padding:"3px 10px",letterSpacing:2}}>✓ {k}</div>)}</div>}
      <motion.div key={letter} initial={{scale:0.55,opacity:0,y:24}} animate={{scale:1,opacity:1,y:0}} transition={{type:"spring",stiffness:400,damping:22}}
        style={{color:"#fff",fontSize:180,fontWeight:900,fontFamily:"Georgia,serif",lineHeight:1}}>{letter}</motion.div>
      <div style={{color:"#1e1e1e",fontSize:11,fontFamily:"monospace",letterSpacing:4,marginTop:2}}>IS THIS LETTER IN YOUR WORD?</div>
      <div style={{display:"flex",gap:14,marginTop:18,width:"100%",maxWidth:320}}>
        <button onClick={()=>onInput("yes")} style={{flex:1,padding:"18px 0",background:"#0b2e16",border:"2.5px solid #00e676",borderRadius:14,color:"#00e676",fontSize:20,fontWeight:900,fontFamily:"monospace",letterSpacing:4,cursor:"pointer",WebkitTapHighlightColor:"transparent",outline:"none"}}>
          YES<br/><span style={{fontSize:9,opacity:0.45,letterSpacing:1}}>{inputMode==="bluetooth"?"⏮ PREV":""}</span>
        </button>
        <button onClick={()=>onInput("no")} style={{flex:1,padding:"18px 0",background:"#2e0b0b",border:"2.5px solid #ef5350",borderRadius:14,color:"#ef5350",fontSize:20,fontWeight:900,fontFamily:"monospace",letterSpacing:4,cursor:"pointer",WebkitTapHighlightColor:"transparent",outline:"none"}}>
          NO<br/><span style={{fontSize:9,opacity:0.45,letterSpacing:1}}>{inputMode==="bluetooth"?"⏭ NEXT":""}</span>
        </button>
      </div>
      {pool.length<=12&&pool.length>1&&<div style={{marginTop:16,width:"100%",maxWidth:360}}><div style={{color:"#141414",fontSize:9,fontFamily:"monospace",letterSpacing:3,textAlign:"center",marginBottom:8}}>{pool.length} CANDIDATES</div><div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>{pool.map((w,i)=><div key={i} style={{color:"#1c1c1c",fontSize:10,fontFamily:"monospace",background:"#0a0a0a",borderRadius:4,padding:"2px 7px",border:"1px solid #141414",letterSpacing:1,textTransform:"uppercase"}}>{w}</div>)}</div></div>}
      {pool.length>12&&<div style={{color:"#141414",fontSize:10,fontFamily:"monospace",marginTop:14,letterSpacing:2}}>{pool.length} CANDIDATES</div>}
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// COUNTDOWN
// ──────────────────────────────────────────────
function CountdownScreen({word,secs}){
  return(<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
    <div style={{color:"#111",fontSize:10,fontFamily:"monospace",letterSpacing:5}}>CALL IN</div>
    <motion.div key={secs} initial={{scale:1.5,opacity:0}} animate={{scale:1,opacity:1}} style={{color:"#1c1c1c",fontSize:110,fontWeight:900,fontFamily:"monospace",lineHeight:1}}>{secs}</motion.div>
    <div style={{color:"#0d0d0d",fontSize:10,fontFamily:"monospace",letterSpacing:6,marginTop:8,textTransform:"uppercase"}}>{word}</div>
  </motion.div>);
}

// ──────────────────────────────────────────────
// PICK
// ──────────────────────────────────────────────
function PickScreen({words,onPick}){
  return(<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,background:"#080808",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:28}}>
    <div style={{color:"#2a2a2a",fontSize:10,fontFamily:"monospace",letterSpacing:4,marginBottom:6}}>MULTIPLE MATCHES</div>
    {words.slice(0,8).map(w=><button key={w} onClick={()=>onPick(w)} style={{color:"#fff",fontSize:18,fontWeight:700,fontFamily:"monospace",background:"#111",border:"1px solid #1e1e1e",borderRadius:12,padding:"12px 0",cursor:"pointer",width:"100%",textTransform:"uppercase",letterSpacing:5,WebkitTapHighlightColor:"transparent"}}>{w}</button>)}
  </motion.div>);
}

// ──────────────────────────────────────────────
// CALL SCREEN — iOS 26 Liquid Glass
// ──────────────────────────────────────────────
function CallScreen({st,time,onDecline,onAccept}){
  const{word,wall,fontSize}=st;
  const fz={small:26,medium:36,large:50}[fontSize]||36;
  // Liquid glass wallpapers
  const bgs={
    dark:"radial-gradient(ellipse at 30% 20%,#1a1a2e,#16213e 40%,#0f3460 70%,#1a1a2e)",
    g1:"radial-gradient(ellipse at 40% 30%,#0f0c29,#302b63 50%,#24243e 80%)",
    g2:"radial-gradient(ellipse at 50% 40%,#1a0010,#3d0030 50%,#1a0010)",
    g3:"radial-gradient(ellipse at 40% 30%,#001a0a,#003320 50%,#001a0a)",
  };
  const bg=bgs[wall]||bgs.dark;
  return(
    <motion.div initial={{y:"100%",scale:0.95}} animate={{y:0,scale:1}} exit={{y:"100%"}} transition={{type:"spring",stiffness:260,damping:26}}
      style={{position:"fixed",inset:0,background:bg,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"system-ui",overflow:"hidden"}}>
      {/* Ambient blurred orbs for depth */}
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(100,120,255,.18),transparent 70%)",top:-60,left:-40,pointerEvents:"none",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,100,150,.12),transparent 70%)",bottom:100,right:-60,pointerEvents:"none",filter:"blur(50px)"}}/>
      {/* Status bar */}
      <div style={{width:"100%",display:"flex",justifyContent:"space-between",padding:"max(env(safe-area-inset-top),16px) 24px 0",alignItems:"center",boxSizing:"border-box",zIndex:10}}>
        <span style={{color:"#fff",fontSize:17,fontWeight:600,textShadow:"0 1px 4px rgba(0,0,0,.4)"}}>{time}</span>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="white" opacity="0.9"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5"/><rect x="9" y="2.5" width="3" height="9.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="12" rx="0.5"/></svg>
          <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="white" strokeOpacity="0.5"/><rect x="2" y="2" width="15" height="9" rx="2" fill="white" fillOpacity="0.95"/><path d="M23 5v3a1.5 1.5 0 0 0 0-3z" fill="white" fillOpacity="0.5"/></svg>
        </div>
      </div>
      {/* Liquid glass pill — "incoming call" */}
      <motion.div animate={{opacity:[0.5,1,0.5]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
        style={{marginTop:18,padding:"6px 20px",borderRadius:50,background:"rgba(255,255,255,0.1)",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",border:"1px solid rgba(255,255,255,0.18)",color:"rgba(255,255,255,0.8)",fontSize:14,letterSpacing:0.3}}>
        incoming call
      </motion.div>
      {/* Avatar — liquid glass circle */}
      <div style={{marginTop:28,position:"relative"}}>
        <div style={{width:112,height:112,borderRadius:"50%",background:"rgba(255,255,255,0.08)",backdropFilter:"blur(30px) saturate(200%)",WebkitBackdropFilter:"blur(30px) saturate(200%)",border:"1.5px solid rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.3)"}}>
          <svg width="60" height="60" viewBox="0 0 56 56" fill="rgba(255,255,255,0.7)"><circle cx="28" cy="20" r="12.5"/><path d="M2 52c0-14.4 11.6-24 26-24s26 9.6 26 24"/></svg>
        </div>
      </div>
      {/* Caller name */}
      <div style={{color:"#fff",fontSize:fz,fontWeight:700,marginTop:18,textAlign:"center",padding:"0 20px",letterSpacing:0.5,textShadow:"0 2px 20px rgba(0,0,0,.6)"}}>{word}</div>
      <div style={{color:"rgba(255,255,255,0.55)",fontSize:15,marginTop:6,letterSpacing:0.2}}>mobile</div>
      {/* Action buttons — liquid glass style */}
      <div style={{position:"absolute",bottom:"max(env(safe-area-inset-bottom,0px),50px)",width:"100%",display:"flex",justifyContent:"space-around",padding:"0 52px",boxSizing:"border-box"}}>
        {[
          {fn:onDecline,label:"Decline",bg:"rgba(255,59,48,0.85)",border:"rgba(255,59,48,0.6)",shadow:"rgba(255,59,48,0.5)",icon:<EndCallIcon/>},
          {fn:onAccept,label:"Accept",bg:"rgba(52,199,89,0.85)",border:"rgba(52,199,89,0.6)",shadow:"rgba(52,199,89,0.5)",icon:<AcceptCallIcon/>}
        ].map(({fn,label,bg,border,shadow,icon})=>(
          <div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <button onClick={fn} style={{width:76,height:76,borderRadius:"50%",background:bg,border:`1.5px solid ${border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",boxShadow:`0 4px 30px ${shadow}, inset 0 1px 0 rgba(255,255,255,0.3)`,WebkitTapHighlightColor:"transparent"}}>
              {icon}
            </button>
            <span style={{color:"rgba(255,255,255,0.65)",fontSize:13,fontWeight:500}}>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
const EndCallIcon=()=><svg width="32" height="32" viewBox="0 0 32 32" fill="white"><path d="M5 22C7.5 15 10.5 13 16 13s8.5 2 11 9l-3.8 3.8C21.5 23.5 19 22 16 22s-5.5 1.5-7.2 3.8Z" transform="rotate(135 16 19)"/></svg>;
const AcceptCallIcon=()=><svg width="32" height="32" viewBox="0 0 32 32" fill="white"><path d="M5 10C7.5 3 10.5 1 16 1s8.5 2 11 9l-3.8 3.8C21.5 11.5 19 10 16 10s-5.5 1.5-7.2 3.8Z"/></svg>;

// ──────────────────────────────────────────────
// PEEK
// ──────────────────────────────────────────────
function PeekScreen({st,onDismiss}){
  const fz={small:44,medium:62,large:84}[st.fontSize]||62;
  return(<motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:0.35}} onClick={onDismiss} style={{position:"fixed",inset:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:14}}>
    <motion.div animate={{opacity:[0.55,1,0.55]}} transition={{duration:2.2,repeat:Infinity}}>
      <div style={{color:"#fff",fontSize:fz,fontWeight:900,fontFamily:"system-ui",textAlign:"center",padding:"0 24px",letterSpacing:3,textTransform:"uppercase"}}>{st.word}</div>
    </motion.div>
    <div style={{color:"#141414",fontSize:10,fontFamily:"monospace",letterSpacing:4,marginTop:16}}>TAP TO DISMISS</div>
  </motion.div>);
}

// ──────────────────────────────────────────────
// API
// ──────────────────────────────────────────────
function ApiScreen({word,status,onDismiss}){
  const map={sending:["⏳","SENDING…","#444"],sent:["✅","SENT","#00e676"],error:["❌","FAILED","#ef5350"]};
  const[ico,msg,col]=map[status]||map.sending;
  return(<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,background:"#050505",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:18}}>
    <div style={{fontSize:56}}>{ico}</div>
    <div style={{color:"#fff",fontSize:22,fontFamily:"monospace",fontWeight:700,letterSpacing:2}}>{word}</div>
    <div style={{color:col,fontSize:12,fontFamily:"monospace",letterSpacing:3}}>{msg}</div>
    {(status==="sent"||status==="error")&&<button onClick={onDismiss} style={{marginTop:20,background:"#111",border:"1px solid #333",borderRadius:12,padding:"12px 36px",color:"#fff",fontFamily:"monospace",fontSize:12,cursor:"pointer",letterSpacing:3}}>RESET</button>}
  </motion.div>);
}

// ──────────────────────────────────────────────
// SETTINGS
// ──────────────────────────────────────────────
function SettingsScreen({st,dispatch}){
  const set=(k,v)=>dispatch({type:"SET",k,v});
  const[apiUrl,setApiUrl]=useState(st.apiUrl);
  const[apiKey,setApiKey]=useState(st.apiKey);
  const[apiKeyName,setApiKeyName]=useState(st.apiKeyName||"word");
  return(<motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}} transition={{type:"spring",stiffness:300,damping:30}} style={{position:"fixed",inset:0,background:"#1C1C1E",overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
    <div style={{padding:"max(env(safe-area-inset-top),16px) 0 80px",maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 16px 24px"}}>
        <h1 style={{color:"#fff",fontSize:28,fontWeight:700,fontFamily:"system-ui",margin:0}}>Settings</h1>
        <button onClick={()=>dispatch({type:"BACK"})} style={{color:"#fff",background:"#3A3A3C",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent"}}>×</button>
      </div>

      <Sect title="INPUT MODE">
        <SRow label="👆  Swipe Gestures" sub="Up/Right/Down/Left" active={st.inputMode==="swipe"} onClick={()=>set("inputMode","swipe")} last={false}/>
        <SRow label="🎵  Bluetooth Remote" sub="⏮ ⏯ ⏭ buttons" active={st.inputMode==="bluetooth"} onClick={()=>set("inputMode","bluetooth")} last={true}/>
      </Sect>

      {st.inputMode==="bluetooth"&&<div style={{padding:"0 16px 20px"}}>
        <div style={{background:"#2C2C2E",borderRadius:12,padding:"12px 14px"}}>
          <div style={{color:"#8E8E93",fontSize:11,fontFamily:"system-ui",marginBottom:8}}>Phase 1 — Code Entry</div>
          {[["⏮ Previous","= digit 1 (Straight)"],["⏯ Play/Pause","= digit 2 (Mixed)"],["⏯⏯ Double Press","= Confirm"],["⏭ Next","= digit 3 (Curves)"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:"#fff",fontFamily:"system-ui",fontSize:13}}>{k}</span><span style={{color:"#555",fontFamily:"monospace",fontSize:12}}>{v}</span></div>)}
          <div style={{color:"#8E8E93",fontSize:11,fontFamily:"system-ui",marginTop:10,marginBottom:8}}>Phase 2 — YES / NO</div>
          {[["⏮ Previous","= YES"],["⏭ Next","= NO"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:"#fff",fontFamily:"system-ui",fontSize:13}}>{k}</span><span style={{color:"#555",fontFamily:"monospace",fontSize:12}}>{v}</span></div>)}
        </div>
      </div>}

      <Sect title="REVEAL MODE">
        {[["call","📱  iOS Call Screen"],["peek","👁  Word on Black Screen"],["api","🔗  POST to API"]].map(([v,l],i,a)=><SRow key={v} label={l} active={st.revealMode===v} onClick={()=>set("revealMode",v)} last={i===a.length-1}/>)}
      </Sect>

      {st.revealMode==="api"&&<Sect title="API SETTINGS">
        <div style={{padding:"10px 0",borderBottom:"1px solid #3A3A3C"}}>
          <Label>POST URL</Label>
          <Inp value={apiUrl} onChange={e=>setApiUrl(e.target.value)} onBlur={()=>set("apiUrl",apiUrl)} placeholder="https://your-api.example.com/word"/>
        </div>
        <div style={{padding:"10px 0",borderBottom:"1px solid #3A3A3C"}}>
          <Label>JSON Key Name</Label>
          <Inp value={apiKeyName} onChange={e=>setApiKeyName(e.target.value)} onBlur={()=>set("apiKeyName",apiKeyName)} placeholder="word"/>
          <div style={{color:"#555",fontSize:10,fontFamily:"monospace",marginTop:4}}>Sends: {`{"`}{apiKeyName}{`": "WORD"}`}</div>
        </div>
        <div style={{padding:"10px 0"}}>
          <Label>API Key / Secret</Label>
          <Inp value={apiKey} type="password" onChange={e=>setApiKey(e.target.value)} onBlur={()=>set("apiKey",apiKey)} placeholder="optional-secret"/>
          <div style={{color:"#555",fontSize:10,fontFamily:"monospace",marginTop:4}}>Sent as X-API-Key header</div>
        </div>
      </Sect>}

      {st.revealMode==="call"&&<Sect title="CALL SETTINGS">
        <Row label="Delay"><Tb label="−" onClick={()=>set("delay",Math.max(1,st.delay-1))}/><span style={{color:"#0A84FF",fontFamily:"system-ui",fontWeight:700,minWidth:44,textAlign:"center"}}>{st.delay}s</span><Tb label="+" onClick={()=>set("delay",Math.min(30,st.delay+1))}/></Row>
        <Row label="Name size"><>{["small","medium","large"].map(s=><Seg key={s} label={s} active={st.fontSize===s} onClick={()=>set("fontSize",s)}/>)}</></Row>
        <Row label="Wallpaper" last>
          <div style={{display:"flex",gap:8}}>{[["dark","radial-gradient(#1a1a2e,#0f3460)"],["g1","radial-gradient(#302b63,#0f0c29)"],["g2","radial-gradient(#3d0030,#1a0010)"],["g3","radial-gradient(#003320,#001a0a)"]].map(([v,bg])=><button key={v} onClick={()=>set("wall",v)} style={{width:38,height:38,borderRadius:9,border:st.wall===v?"3px solid #0A84FF":"2px solid #444",cursor:"pointer",background:bg,WebkitTapHighlightColor:"transparent"}}/>)}</div>
        </Row>
      </Sect>}

      <Sect title="WORD CATEGORY">
        {Object.keys(CAT_LABELS).map((c,i,a)=><SRow key={c} label={CAT_LABELS[c]} sub={`${POOLS[c].length}`} active={st.cat===c} onClick={()=>set("cat",c)} last={i===a.length-1}/>)}
      </Sect>

      <Sect title="WORD LENGTH">
        <div style={{display:"flex",gap:8,padding:"12px 0"}}>{[["any","Any"],["3-5","3–5"],["5-7","5–7"],["6-8","6–8"]].map(([v,l])=><button key={v} onClick={()=>set("len",v)} style={{flex:1,padding:"10px 4px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontFamily:"system-ui",fontWeight:600,background:st.len===v?"#0A84FF":"#3A3A3C",color:"#fff"}}>{l}</button>)}</div>
      </Sect>

      <Sect title="VIBRATION TIMING">
        <Row label="Pulse duration"><>{[150,250,350].map(d=><Seg key={d} label={`${d}ms`} active={st.pulse===d} onClick={()=>set("pulse",d)}/>)}</></Row>
        <Row label="Group pause" last><>{[600,800,1100].map(d=><Seg key={d} label={`${d}ms`} active={st.pause===d} onClick={()=>set("pause",d)}/>)}</></Row>
      </Sect>

      <div style={{color:"#1e1e1e",fontSize:11,fontFamily:"system-ui",textAlign:"center",marginTop:20}}>MindCall v6.0</div>
    </div>
  </motion.div>);
}
// Settings helpers
function Sect({title,children}){return(<div style={{padding:"0 16px",marginBottom:28}}><div style={{color:"#8E8E93",fontSize:11,fontFamily:"system-ui",letterSpacing:0.8,marginBottom:8,textTransform:"uppercase",paddingLeft:4}}>{title}</div><div style={{background:"#2C2C2E",borderRadius:12,padding:"0 16px"}}>{children}</div></div>);}
function SRow({label,sub,active,onClick,last}){return(<button onClick={onClick} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"14px 0",background:"none",border:"none",borderBottom:last?"none":"1px solid #3A3A3C",cursor:"pointer",textAlign:"left",WebkitTapHighlightColor:"transparent"}}><span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>{label}</span><div style={{display:"flex",gap:10,alignItems:"center"}}>{sub&&<span style={{color:"#555",fontSize:12,fontFamily:"system-ui"}}>{sub}</span>}{active&&<span style={{color:"#34C759",fontSize:20}}>✓</span>}</div></button>);}
function Row({label,children,last}){return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:last?"none":"1px solid #3A3A3C"}}><span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>{label}</span><div style={{display:"flex",gap:8,alignItems:"center"}}>{children}</div></div>);}
function Tb({label,onClick}){return(<button onClick={onClick} style={{color:"#fff",background:"#3A3A3C",border:"none",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:18,fontFamily:"system-ui",display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent"}}>{label}</button>);}
function Seg({label,active,onClick}){return(<button onClick={onClick} style={{padding:"6px 10px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontFamily:"system-ui",fontWeight:600,background:active?"#0A84FF":"#3A3A3C",color:"#fff",WebkitTapHighlightColor:"transparent"}}>{label}</button>);}
function Label({children}){return(<div style={{color:"#8E8E93",fontSize:11,fontFamily:"system-ui",marginBottom:6}}>{children}</div>);}
function Inp({value,onChange,onBlur,placeholder,type="text"}){return(<input value={value} type={type} onChange={onChange} onBlur={onBlur} placeholder={placeholder} style={{width:"100%",background:"#3A3A3C",border:"none",borderRadius:8,padding:"10px 12px",color:"#fff",fontFamily:"monospace",fontSize:13,outline:"none",boxSizing:"border-box"}}/>);}
