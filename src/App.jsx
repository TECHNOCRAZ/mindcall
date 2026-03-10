
import { useState, useEffect, useReducer, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════
// WORD LISTS
// ═══════════════════════════════════════════════════════════════════
const ALL=[
  "ace","act","add","age","ago","aid","aim","air","all","ant","any","ape","arc","are","ark","arm","art","ash","ask","ate","awe","axe","aye",
  "bad","bag","ban","bar","bat","bay","bed","beg","bet","bid","big","bit","bow","box","boy","bud","bug","bun","bus","but","buy",
  "cab","can","cap","car","cat","cop","cow","cry","cub","cup","cut","dab","dad","dam","dip","dot","dry","dug","dye",
  "ear","eat","egg","ego","elf","elk","elm","end","era","eve","ewe","eye","fad","fan","far","fat","fax","fed","few","fig","fit","fix","fly","foe","fog","fox","fry","fun","fur",
  "gag","gap","gas","gel","gem","get","gnu","god","got","gum","gun","gut","guy","gym","had","ham","has","hat","hay","hen","her","hew","hid","him","hip","his","hit","hog","hop","hot","how","hub","hug","hum",
  "ice","ill","imp","inn","ion","its","jab","jam","jar","jaw","jet","jog","joy","jug","jut","keg","key","kid","kin",
  "lab","lad","lag","lap","law","lax","lay","led","leg","let","lid","lip","log","lot","low","lug","mad","man","map","mar","mat","max","may","men","met","mob","mod","mom","mud","mug",
  "nag","nap","net","new","nip","nod","nor","not","now","nun","oar","oat","odd","ode","off","oil","old","one","opt","orb","our","out","owe","own",
  "pad","pal","pan","par","pat","paw","pay","peg","pen","pep","per","pet","pew","pin","pit","ply","pod","pop","pot","pow","pro","pub","pup","put",
  "rag","ran","rap","raw","ray","red","ref","rep","rev","rib","rid","rim","rip","rob","rod","rot","row","rub","rug","rum","run","rut","rye",
  "sag","sap","sat","saw","say","set","sew","sip","sir","sit","six","ski","sky","sly","sob","sod","son","sow","soy","spa","spy","sty","sub","sum","sun",
  "tab","tan","tar","tax","tip","toe","ton","too","top","tot","tow","toy","try","tub","tug","two","urn","use","van","vat","via","vim","vow",
  "wad","war","was","wax","web","wed","wet","who","why","wig","win","wit","woe","wok","won","woo","wow","yam","yap","yen","yet","yew","you","zap","zip","zoo",
  "able","ache","acid","acre","aged","aide","akin","also","alto","amid","anti","apex","area","arid","army","atom","aunt","awed","axle",
  "bait","bake","bald","bale","ball","balm","band","bane","bang","bank","bare","bark","barn","base","bash","bask","bass","bath","bawl","bead","beak","beam","bean","beer","beet","bell","belt","bend","bile","bill","bind","bird","bite","blot","blow","blue","blur","boar","bold","bolt","bond","bore","born","boss","both","brag","bray","brow","buff","bulk","bull","bump","bunk","burp","buzz",
  "calf","calm","came","camp","cane","cape","care","carp","cart","cave","chap","chat","chef","chew","chin","chip","cite","clam","clap","claw","clay","clip","clog","clot","club","clue","coal","coat","coil","coin","cold","colt","come","cone","cook","cool","copy","cord","core","cork","corn","cost","cozy","cram","crib","crop","crow","cuff","curb","curd","curl","cute",
  "daft","damp","dare","dart","data","date","daze","dead","deaf","deal","dear","deed","deem","deep","deer","deft","dent","deny","dice","dill","dime","dine","disk","dive","dock","dome","done","doom","dose","dote","dove","drab","drag","draw","drip","drop","drug","drum","dual","dumb","dump","dune","dupe",
  "each","earn","ease","edge","edit","epic","even","evil","exam","fawn","fill","film","find","fire","fish","flag","flat","flaw","flea","fled","flew","flex","flop","flow","foam","fold","folk","fond","font","food","fool","ford","form","fort","foul","fray","fret","fume",
  "gale","gall","game","gape","gash","gave","gawk","gaze","give","glad","glob","gnaw","goad","gong","gore","gust","hack","hale","half","hall","halt","harm","haul","heal","heap","heat","heel","help","hemp","herb","herd","hike","hilt","hive","hoax","hold","hole","hood","hoof","hook","horn","hour","hulk","hull","hump","hunk","hymn",
  "icon","iris","itch","jade","jail","jest","jolt","junk","just","keen","kill","kiln","kind","knew","knot","lack","lair","lake","lame","lamp","land","lane","lark","lash","last","lawn","lazy","leaf","leak","lean","leap","lend","lens","levy","lick","lift","lime","limp","line","link","lock","loft","long","look","loom","loon","loud","love","luck","lump","lung","lure","lurk","lush",
  "mace","made","maid","mail","main","make","mall","mane","mare","mark","mart","mask","mast","maze","meal","mean","melt","mesh","mile","milk","mill","mime","mind","miss","mist","moat","mock","mode","mole","molt","monk","moon","more","moss","moth","muse","must","myth",
  "near","neck","need","nest","nice","node","none","nook","norm","nose","note","noun","nude","null","odds","omen","once","only","oval","oven",
  "pair","pang","park","pave","pawn","peak","peel","peer","pelt","pest","pick","pike","pill","pine","pity","plan","plod","plot","plow","plum","poem","poke","pole","poll","pond","pose","post","pour","prey","prod","prop","pull","pump","pyre",
  "rack","raft","raid","rail","rain","rake","ramp","rang","rank","rare","rash","rate","rave","real","reed","reef","reel","rein","rent","rest","rift","ring","riot","ripe","rise","risk","rite","road","roam","robe","rock","role","roll","roof","room","root","rope","rose","rout","ruin","rule","ruse","rush","rust",
  "safe","sage","sail","sake","sane","sang","save","seal","seam","seat","seed","seem","self","sell","shin","sill","sing","sink","size","skin","skip","slam","slap","slim","slip","slot","slug","snap","snow","snub","soak","sock","soil","song","soot","sore","soul","sour","span","spin","spot","spur","stab","star","stay","stem","step","stew","stir","stop","stub","stun","suit","sulk","surf","swap","sway","sync",
  "tail","take","tale","talk","tall","tame","tape","taut","teak","teal","tear","tell","tend","tent","term","tide","tile","till","time","tint","tire","toad","toll","tomb","tone","tore","torn","toss","town","tray","trim","trio","trip","true","tuft","turf","type",
  "unit","upon","urge","vain","vale","vane","vase","vast","veil","vein","verb","vest","vial","vice","view","vine","void","volt","wade","wail","wake","walk","wand","wane","want","ware","wash","wasp","weak","weed","well","what","wide","wild","will","wind","wine","wing","wise","wish","wolf","wood","word","wore","work","worm","wren","writ","yard","yarn","yawn","yell","yoke","zeal","zero","zest","zinc","zone","zoom",
  "abbey","abyss","acorn","acute","adage","adept","admit","adobe","aegis","agile","agony","ahead","aisle","alarm","album","algae","alibi","align","aloft","aloof","altar","amaze","ample","angel","angry","annex","antic","anvil","aorta","arbor","ardor","armor","aroma","array","atone","attic","avail","avert","avoid","await","awash","awful","axiom",
  "bacon","badge","banjo","baron","batch","beast","beech","belle","belly","bench","birch","bison","bland","blaze","bleak","bleat","bleed","blend","bless","blink","block","blood","bloom","blown","blunt","board","bogus","booze","botch","boxer","braid","brake","brawl","brawn","broil","brood","broom","brunt","brush","brute","bully","burly",
  "cacao","cache","cadet","camel","cameo","cargo","carol","caste","cedar","chaff","champ","cheap","chide","choir","chump","chute","cinch","civic","civil","cleft","click","cliff","cling","cloak","clone","clout","cocoa","comet","comic","conch","coral","couch","covet","cower","cramp","crane","crank","creak","creep","crimp","croak","crude","cruel","crumb","crypt","cubic","cycle",
  "daunt","decay","decoy","delta","demon","depot","derby","disco","dodge","dogma","dowry","drool","droop","drove","drown","dunce","dwarf","dying","eager","early","easel","eight","elbow","elder","elite","ember","enjoy","ensue","envoy","equip","erode","essay","ethos","evoke","exact","exert","extol",
  "fable","facet","fairy","false","farce","fatal","fault","feast","fiend","fifth","fight","finch","fjord","flame","flank","flare","flask","flesh","flint","flock","flood","floor","fluid","flute","force","forte","fungi","funny",
  "gaudy","gavel","giddy","girth","glare","gleam","glint","gloat","gloom","gloss","glove","glyph","gnome","gouge","grail","grave","graze","greed","greet","grief","grime","grind","gripe","groan","groin","groom","guile","gulch","gusto","gypsy",
  "haste","haunt","haven","havoc","heave","hedge","heist","hence","heron","hippo","hoard","hunch","hyper","icing","igloo","image","imply","inlet","ivory","jaunt","jewel","jiffy","joust",
  "knack","knave","kneel","knife","knock","known","kudos","lance","large","laser","lasso","latch","leach","leafy","leech","libel","lilac","liver","llama","lodge","lotus","lucid","lusty","lyric",
  "magic","manly","manor","marsh","maxim","melon","mercy","mirth","miser","model","money","month","moose","mourn","mucus","muddy","mulch","murky","music",
  "naval","nifty","noble","notch","nymph","ocean","onset","optic","orbit","ozone",
  "paddy","panel","papal","pearl","pedal","penny","peril","petty","plaid","plane","plank","plaza","plead","pluck","plume","plush","polka","poppy","posit","pouch","prank","preen","prism","probe","prone","prowl","prune","psalm","pudgy","putty",
  "query","quill","quirk","quota","rabid","radar","raven","rayon","realm","regal","reign","relax","repay","retro","rider","ripen","rivet","robot","rogue","rouge","rocky","rowdy","rugby","rusty",
  "saint","salsa","savvy","scald","scalp","scamp","scare","scene","scone","scorn","scout","scowl","screw","scrub","seize","seven","sever","shack","shaft","shake","shale","shark","shawl","sheen","sheer","shelf","shift","shoal","shock","shout","shove","shred","shrug","skirt","skull","skunk","slack","slain","slash","slave","sleek","sleep","slice","slick","slide","slime","sling","slosh","sloth","slump",
  "smack","smash","smear","smell","smoke","snack","snake","snare","sneak","sniff","snout","solar","solve","sonic","south","spank","spark","spawn","speak","spear","spend","spice","spill","spine","spire","spite","spore","sport","spout","spree","squad","squat","squid",
  "stack","staff","stain","stair","stale","stall","stamp","stare","stark","start","stash","state","steed","steel","steep","steer","stern","stiff","sting","stink","stomp","stool","stoop","storm","stout","stove","straw","stray","strip","strum","strut","stuck","study","stuff","stump","style","suave","sunny","super","surge","swamp","swear","sweat","sweep","swept","swift","swirl","swoon","swoop","sword",
  "taboo","taunt","tapir","tempo","tense","their","thief","thigh","thing","think","thorn","those","throb","throw","tiger","timer","tipsy","title","today","tonic","topaz","torch","total","touch","towel","toxic","track","trade","trail","train","tramp","trash","trawl","tread","trend","tribe","trick","tried","troth","trout","trove","truce","truck","trunk","tulip","tumor","tweet","twist",
  "ulcer","under","unify","union","unity","until","upper","upset","usher","utter","vague","valor","value","valve","vapor","vault","verge","verse","vexed","vicar","vigil","vigor","villa","viral","visor","vixen","vocal","voter",
  "wager","waltz","watch","water","weave","wedge","weird","whack","whiff","whine","whirl","whisk","whole","widow","wince","witch","wrath","wrist","yearn","young","youth","zesty",
  "abduct","ablaze","aboard","abrupt","absorb","absurd","accent","accord","accrue","acquit","adhere","adjust","admire","advice","affirm","afford","afraid","agenda","aghast","alight","allure","almond","alpaca","always","ambush","animal","annual","anoint","anyway","aplomb","appeal","arcane","archer","ardent","assail","astray","attain","august","awhile",
  "badger","baffle","ballot","bamboo","banish","banner","banter","barren","barter","beacon","bestow","betray","blight","blonde","blossom","blouse","borrow","bounce","bovine","branch","brassy","breach","bridle","broken","bronze","brooch","bruise","brutal","bumble","burrow",
  "cactus","candid","canine","cannon","canopy","canyon","carbon","casino","casket","castle","cinder","circle","circus","clergy","clever","closet","cobalt","cobweb","colony","combat","commit","common","compel","comply","concur","condor","confer","consul","convex","convey","copper","corner","corset","cotton","coyote","crisis","custom",
  "dagger","damage","dampen","dangle","daring","darken","deadly","debris","decent","decide","deepen","defend","define","demand","desert","design","detour","devoid","devour","differ","direct","divide","double","driven","dynamo",
  "easily","effect","elapse","empire","employ","enable","endure","engulf","entail","entice","entire","enzyme","equate","escape","evolve","excess","excite","exempt","exhale","expand","expire","extend",
  "famine","famous","fathom","felony","ferret","fester","filter","finale","finger","fiscal","flight","formal","foster","freeze","frenzy","fringe","frosty","frozen","fumble",
  "galley","gallop","garner","gentle","geyser","gibbon","goblin","gravel","grieve","guilty","hamper","handle","harbor","hardly","herald","hermit","huddle","humble","hunter","hustle",
  "ignite","immune","impact","impede","import","infuse","inhale","injure","insane","insult","invade","ironic","jungle","jester","jostle","jumble","kidnap","lament","lavish","likely","linear","liquid","loathe","locket","lunacy",
  "mangle","mayhem","meddle","mentor","marvel","mellow","method","mirror","morale","mostly","motley","muddle","murmur","mutiny","mutual","mystic",
  "negate","nettle","nimble","notion","novice","ordeal","ornate","outfit","outlaw","outrun",
  "pallor","pardon","parrot","patrol","pebble","pellet","pencil","pounce","powder","prison","profit","pursue","quaint","rancor","random","ransom","ravage","recess","reduce","refine","refuge","regain","regent","reject","relate","relief","relish","remain","render","repent","rescue","resist","retort","reveal","revolt","reward","ribbon","riddle","ripple","ritual","robust","rugged","rattle",
  "sadden","salute","sample","savage","scheme","scorch","scream","seldom","settle","sickle","simple","sinful","sleuth","sliver","smudge","snatch","soothe","spleen","sprawl","spring","sprout","squall","squeak","squeal","squint","stable","stench","stereo","stolen","stooge","strain","strand","strife","stroke","stroll","sucker","sudden","suffer","summon","sunder","sunset","supple","symbol",
  "tangle","tailor","talent","throne","thrash","thread","thrill","thrive","toucan","treaty","tremor","tribal","trifle","triple","tyrant","unruly","update","uphold","vacuum","vanish","velvet","vendor","versus","victim","violet","virile","virtue","vision","volley",
  "wallet","wallow","walrus","wander","weaken","weasel","whimsy","wicker","wither","wonder","wraith","writhe","yearly","zealot",
];
const ANIMALS=["ant","ape","bat","bee","cat","cod","cow","cub","doe","dog","elk","emu","ewe","fly","fox","gnu","hen","hog","jay","koi","owl","pig","ram","rat","yak","bear","bird","boar","buck","bull","calf","clam","colt","crab","crow","deer","dove","duck","fawn","flea","frog","gnat","goat","hare","hawk","ibis","kite","lamb","lark","lion","loon","lynx","mink","mole","moth","mule","newt","pony","puma","slug","swan","toad","vole","wasp","wolf","wren","adder","bison","crane","dingo","eagle","egret","finch","gecko","guppy","hippo","horse","hound","hyena","koala","llama","macaw","moose","mouse","otter","panda","quail","raven","shark","skunk","sloth","snake","squid","stork","tapir","tiger","trout","viper","whale","zebra","alpaca","beaver","bobcat","canary","condor","donkey","falcon","ferret","gibbon","iguana","jaguar","lizard","locust","magpie","monkey","parrot","pigeon","rabbit","salmon","spider","toucan","turkey","turtle","walrus","weasel","badger","beetle","buffalo","chicken","dolphin","gorilla","hamster","leopard","lobster","panther","penguin","raccoon","sparrow","vulture","cheetah","elephant","flamingo","hedgehog","kangaroo","porcupine","alligator","armadillo","orangutan","chameleon","chimpanzee"];
const ANIMALS_EASY=["ant","bat","bee","cat","cow","dog","elk","emu","fly","fox","hen","hog","owl","pig","ram","rat","bear","bull","calf","crab","crow","deer","dove","duck","fish","frog","goat","hare","hawk","lamb","lion","mole","mule","pony","swan","toad","wolf","wren","crane","eagle","finch","gecko","hippo","horse","hyena","koala","llama","moose","mouse","otter","panda","shark","skunk","sloth","snake","stork","tiger","whale","zebra","donkey","monkey","parrot","rabbit","salmon","spider","turtle","walrus","chicken","dolphin","gorilla","leopard","penguin","raccoon","cheetah","elephant","flamingo","kangaroo"];
const COUNTRIES=["chad","cuba","fiji","iran","iraq","laos","mali","oman","peru","togo","china","egypt","ghana","india","italy","japan","kenya","libya","nepal","niger","qatar","spain","sudan","syria","tonga","wales","yemen","angola","belize","brazil","canada","cyprus","france","greece","guinea","guyana","israel","jordan","kuwait","malawi","mexico","monaco","norway","panama","poland","rwanda","serbia","sweden","taiwan","turkey","uganda","albania","algeria","armenia","austria","bahrain","belarus","belgium","bolivia","burundi","comoros","croatia","denmark","ecuador","eritrea","estonia","finland","georgia","germany","grenada","hungary","iceland","ireland","jamaica","lebanon","lesotho","liberia","moldova","mongolia","morocco","myanmar","namibia","nigeria","pakistan","romania","senegal","somalia","ukraine","uruguay","vietnam","zambia","zimbabwe","cambodia","colombia","djibouti","dominica","ethiopia","honduras","kiribati","malaysia","maldives","portugal","slovakia","slovenia","suriname","tanzania","thailand","barbados","bulgaria","indonesia","lithuania","mauritius","singapore","argentina","australia","azerbaijan","bangladesh","mozambique","madagascar","uzbekistan","kyrgyzstan","kazakhstan","afghanistan"];
const CITIES=["rome","lima","oslo","bern","doha","riga","cairo","dubai","paris","tokyo","delhi","lagos","dhaka","accra","hanoi","seoul","miami","abuja","tunis","osaka","vienna","prague","warsaw","athens","lisbon","dublin","moscow","sydney","taipei","london","berlin","madrid","havana","bogota","manila","mumbai","nairobi","jakarta","karachi","bangkok","beijing","chicago","houston","toronto","montreal","shanghai","brussels","istanbul","singapore","amsterdam","budapest","helsinki","stockholm","melbourne","auckland","santiago","caracas","casablanca","johannesburg","copenhagen","edinburgh","manchester","barcelona","frankfurt","hamburg","kathmandu","islamabad","tashkent","yerevan","tbilisi","almaty","bishkek","minsk","chisinau","tallinn","vilnius","sofia","bucharest","belgrade","zagreb","tirana","sarajevo","podgorica","reykjavik","wellington","canberra","ottawa","brasilia","tehran","baghdad","damascus","beirut","amman","riyadh","jeddah","muscat","manama","ankara","nicosia","valletta","zurich","geneva","antwerp","ghent","bruges","rotterdam","aarhus","odense","gothenburg","malmo","bergen","tampere","turku","galway","cork","lyon","marseille","toulouse","bordeaux","nice","nantes","strasbourg","lille","rennes","grenoble","munich","hamburg","cologne","stuttgart","dortmund","leipzig","dresden","nuremberg","naples","turin","palermo","genoa","bologna","florence","venice","catania","valencia","seville","zaragoza","malaga","porto","braga","coimbra","krakow","lodz","poznan","wroclaw","gdansk","debrecen","plovdiv","varna","thessaloniki","patras","heraklion","brno","ostrava","bratislava","kosice","split","rijeka","novi sad","pristina","chisinau","kharkiv","odessa","dnipro","lviv","novosibirsk","yekaterinburg","kazan","chelyabinsk","samara","volgograd","krasnodar"];
const FOODS=["ale","bun","jam","pie","tea","fig","ham","oat","rye","cod","egg","oil","rum","gin","beef","beet","bran","brie","cake","chip","clam","corn","crab","dill","duck","feta","fish","flan","herb","kale","lamb","leek","lime","lard","mayo","meat","milk","mint","miso","naan","oats","okra","pear","pita","plum","pork","rice","sage","salt","soup","soya","stew","taco","tofu","tuna","wine","yolk","apple","basil","berry","bread","brine","broth","candy","cheese","chili","chips","cider","clove","cocoa","cream","curry","dates","donut","dough","drink","flour","fudge","grape","gravy","guava","honey","juice","kebab","lemon","liver","lychee","mango","maple","melon","mocha","olive","onion","pasta","peach","pecan","pesto","pizza","prawn","punch","ramen","salad","sauce","scone","shrimp","snack","spice","squid","steak","sugar","sweet","syrup","thyme","toast","vodka","waffle","wheat","yogurt","almond","banana","brandy","butter","cashew","cherry","coffee","cookie","fennel","garlic","ginger","lobster","muffin","orange","papaya","pepper","potato","radish","salmon","tomato","turkey","walnut","anchovy","avocado","broccoli","brownie","burrito","coconut","custard","granola","lettuce","pancake","parsley","peanut","pretzel","pudding","sausage","spinach","vanilla","whiskey","zucchini","blueberry","chocolate","cinnamon","croissant","mushroom","raspberry","strawberry","watermelon","cauliflower","pineapple","grapefruit","pomegranate","artichoke","asparagus","tangerine","blackberry","cranberry","nectarine"];
const NATURE=["ash","bay","bog","clay","crag","dew","fen","fog","gem","ice","ivy","kelp","lake","lava","leaf","loam","mesa","mist","moss","mud","oak","peat","pine","pond","pool","rain","reef","rock","sand","silt","snow","soil","star","stem","tide","vale","wave","wind","wood","bark","bush","cliff","cloud","coast","coral","creek","crest","dale","dune","dust","fern","fjord","flora","frost","gale","glade","gorge","grain","grass","grove","gust","hail","heath","hedge","hill","inlet","isle","knoll","loch","marsh","mire","moon","mound","pebble","petal","plain","plant","ridge","river","roots","rose","shore","shrub","slope","stalk","stone","storm","stream","swamp","thorn","trail","water","amber","basalt","canyon","cavern","comet","crater","crystal","desert","drought","eclipse","estuary","forest","glacier","granite","harvest","horizon","island","jungle","lagoon","meteor","mineral","monsoon","mountain","nebula","ocean","prairie","quartz","ravine","savanna","seabed","sierra","solstice","spring","steppe","tempest","terrain","thunder","tornado","tropics","tsunami","twilight","typhoon","volcano","wilderness","zephyr","aurora","bamboo","breeze","cobble","current","delta","erosion","geyser","grotto","habitat","iceberg","lakebed","lowland","mangrove","meadow","plateau","redwood","sandbar","seashore","snowfall","summit","sundown","tundra","upland","wetland","woodland"];
const COLORS=["red","tan","bay","ash","sky","jet","gold","blue","cyan","gray","grey","jade","lime","navy","pink","plum","rose","rust","ruby","sage","teal","wine","amber","azure","beige","black","brown","coral","cream","denim","ebony","green","ivory","khaki","lemon","lilac","mauve","mocha","ochre","olive","peach","sandy","sepia","slate","straw","taupe","umber","white","aqua","bronze","cobalt","copper","crimson","forest","fuchsia","garnet","indigo","maroon","mustard","orange","orchid","salmon","scarlet","silver","sienna","violet","yellow","burgundy","cerulean","charcoal","chartreuse","chocolate","lavender","magenta","midnight","saffron","sapphire","tangerine","turquoise","vermillion","alabaster","aubergine","champagne","cornflower","goldenrod","mahogany","periwinkle","terracotta","ultramarine"];
const EMOTIONS=["awed","calm","glad","hurt","keen","mild","numb","smug","torn","wild","angry","brave","eager","happy","livid","moody","proud","ready","sorry","sweet","tense","tired","upset","vexed","wary","weary","afraid","amused","bored","elated","empty","frantic","furious","gloomy","guilty","hopeful","joyful","lonely","loving","mellow","pained","rested","scared","shaken","shocked","sulky","tender","uneasy","wistful","worried","zealous","anxious","ashamed","content","curious","devoted","ecstatic","excited","focused","forlorn","gleeful","grumpy","hostile","humbled","jealous","jittery","jubilant","longing","peaceful","relieved","resentful","restless","romantic","serene","thankful","thrilled","troubled","bewildered","captivated","depressed","disgusted","enchanted","exhausted","fascinated","frustrated","horrified","impressed","irritated","melancholy","nostalgic","optimistic","overwhelmed","passionate","perplexed","satisfied","sensitive","skeptical","surprised","sympathetic","vulnerable"];
const SPORTS=["polo","golf","judo","luge","yoga","swim","race","run","ski","box","dive","surf","bike","bowl","curl","fish","hunt","jump","kick","lift","pull","push","row","spar","trek","archery","chess","climb","cycle","dance","drill","hurdle","kayak","pitch","press","rugby","shoot","skate","squat","throw","vault","badminton","baseball","football","handball","lacrosse","marathon","rowing","sailing","skating","soccer","softball","swimming","tennis","volleyball","basketball","bicycling","croquet","darts","fencing","gymnastics","hockey","motocross","rafting","skiing","snowboard","squash","triathlon","weightlifting","wrestling","canoeing","kickboxing","skydiving","athletics","bobsled","curling","hurling","netball","paddling","skateboard","snorkeling","surfboard","wakeboard","windsurfing","yachting"];
const PROFESSIONS=["chef","monk","maid","spy","vet","aide","dean","sage","actor","agent","baker","boxer","coach","clerk","coder","cook","diver","judge","mayor","medic","miner","nurse","pilot","rabbi","rider","scout","smith","tutor","usher","vicar","barber","bishop","broker","butler","captain","cashier","cleric","curate","dancer","dealer","deputy","doctor","driver","editor","expert","farmer","fisher","jockey","lawyer","lender","logger","marshal","midwife","miller","officer","painter","pastor","plumber","porter","potter","priest","ranger","sailor","singer","tailor","trader","warden","weaver","worker","analyst","chemist","dentist","engineer","fireman","foreman","geologist","janitor","jeweler","lecturer","librarian","mechanic","musician","optician","organist","planner","reporter","sculptor","soldier","surgeon","teacher","therapist","architect","astronomer","biologist","carpenter","conductor","consultant","contractor","counselor","custodian","economist","electrician","journalist","programmer","scientist","statistician","veterinarian","accountant","astronaut","cardiologist","cartographer","detective","diplomat","firefighter","geographer","illustrator","interpreter","mathematician","neurologist","nutritionist","oceanographer","paramedic","pathologist","pediatrician","pharmacist","philosopher","photographer","politician","professor","psychiatrist","psychologist","radiologist","recruiter","sociologist","sommelier","translator","zoologist"];

const POOLS={all:ALL,animals:ANIMALS,easy:ANIMALS_EASY,countries:COUNTRIES,cities:CITIES,foods:FOODS,nature:NATURE,colors:COLORS,emotions:EMOTIONS,sports:SPORTS,professions:PROFESSIONS};
const CAT_LABELS={all:"All English",animals:"Animals",easy:"Animals (Easy)",countries:"Countries",cities:"Cities",foods:"Foods",nature:"Nature",colors:"Colors",emotions:"Emotions",sports:"Sports",professions:"Professions"};

// ═══════════════════════════════════════════════════════════════════
// T9 + SHAPE FILTER
// ═══════════════════════════════════════════════════════════════════
const T9={};[..."ABC"].forEach(c=>(T9[c]="2"));[..."DEF"].forEach(c=>(T9[c]="3"));[..."GHI"].forEach(c=>(T9[c]="4"));[..."JKL"].forEach(c=>(T9[c]="5"));[..."MNO"].forEach(c=>(T9[c]="6"));[..."PQRS"].forEach(c=>(T9[c]="7"));[..."TUV"].forEach(c=>(T9[c]="8"));[..."WXYZ"].forEach(c=>(T9[c]="9"));
const SH={"1":new Set(["4","7"]),"2":new Set(["2","5"]),"3":new Set(["3","6","8","9"])};
const fold=c=>c.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toUpperCase()[0]||"";
const wset=w=>new Set([...w].map(fold).filter(Boolean));

function filterCode(code,pool){
  return pool.filter(w=>{
    const ch=[...w].map(fold).filter(Boolean);
    return ch.length===code.length&&ch.every((c,i)=>{const d=T9[c];return d&&SH[code[i]]?.has(d);});
  });
}

// ═══════════════════════════════════════════════════════════════════
// LETTER PICKER — depth-2
// ═══════════════════════════════════════════════════════════════════
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
      const p2=p.filter(w=>!wset(w).has(k)),c2=freq(p2,new Set([...used,k])),MIN2=p2.length<=6?1:2;
      let s2=s1;for(const[,n2] of c2)if(n2>=MIN2&&n2<p2.length){const ss=noC(p2,[...c2.keys()][0]);if(ss>0&&ss<s2)s2=ss;}
      if(s1<b1||(s1===b1&&s2<b2)){best=k;b1=s1;b2=s2;}
    }
    if(!best)break;kept.push(best);used.add(best);
  }
  return kept[kept.length-1]||null;
}

// ═══════════════════════════════════════════════════════════════════
// POLYBIUS VIBRATION
// ═══════════════════════════════════════════════════════════════════
const POLY="ABCDEFGHIJKLMNOPQRSTUVWXY";
function pulses(n,dur,gap){const p=[];for(let i=0;i<n;i++){p.push(dur);if(i<n-1)p.push(gap);}return p;}
function polyPattern(letter,pDur=120,gDur=500){
  const ch=letter.toUpperCase();
  if(ch==="Z") return pulses(6,pDur,100);
  const idx=POLY.indexOf(ch);
  if(idx<0) return [pDur];
  const row=Math.floor(idx/5)+1,col=(idx%5)+1;
  return [...pulses(row,pDur,100),gDur,...pulses(col,pDur,100)];
}
const patDur=p=>p.reduce((a,b)=>a+b,0);

// Play audio beeps (fallback + complement to haptic)
function playPolyBeeps(ctx,letter,pDur,gDur){
  if(!ctx) return;
  const ch=letter.toUpperCase();
  const idx=POLY.indexOf(ch);
  const row=ch==="Z"?6:Math.floor(idx/5)+1;
  const col=ch==="Z"?0:(idx%5)+1;
  let t=ctx.currentTime+0.05;
  const beep=(freq,start,dur)=>{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.frequency.value=freq;g.gain.setValueAtTime(0,start);
    g.gain.linearRampToValueAtTime(0.15,start+0.01);
    g.gain.linearRampToValueAtTime(0,start+dur-0.01);
    o.connect(g);g.connect(ctx.destination);
    o.start(start);o.stop(start+dur);
  };
  const pd=pDur/1000,gap=0.1;
  for(let i=0;i<row;i++){beep(880,t,pd);t+=pd+gap;}
  if(ch!=="Z"){t+=gDur/1000;for(let i=0;i<col;i++){beep(1320,t,pd);t+=pd+gap;}}
}

// iOS-style ringtone
function playRingtone(ctx,stop){
  if(!ctx||!stop) return ()=>{};
  const nodes=[];
  const chord=[1175,1319,1480]; // FGA arpeggio
  let t=ctx.currentTime;
  const ring=()=>{
    chord.forEach((fr,i)=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type="sine";o.frequency.value=fr;
      g.gain.setValueAtTime(0,t+i*0.05);
      g.gain.linearRampToValueAtTime(0.2,t+i*0.05+0.04);
      g.gain.linearRampToValueAtTime(0,t+i*0.05+0.3);
      o.connect(g);g.connect(ctx.destination);
      o.start(t+i*0.05);o.stop(t+i*0.05+0.35);
      nodes.push(o);
    });
    t+=0.7;
    const chord2=[880,988,1109];
    chord2.forEach((fr,i)=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type="sine";o.frequency.value=fr;
      g.gain.setValueAtTime(0,t+i*0.05);
      g.gain.linearRampToValueAtTime(0.2,t+i*0.05+0.04);
      g.gain.linearRampToValueAtTime(0,t+i*0.05+0.3);
      o.connect(g);g.connect(ctx.destination);
      o.start(t+i*0.05);o.stop(t+i*0.05+0.35);
      nodes.push(o);
    });
    t+=1.5; // gap
  };
  ring();ring();ring(); // 3 rings
  return ()=>nodes.forEach(n=>{try{n.stop();}catch{}});
}

// ═══════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════
const DEF={cat:"all",len:"any",delay:10,pulse:120,pause:500,revealMode:"call",apiUrl:"",apiKey:"",wall:"dark",fontSize:"medium"};
function loadS(){try{return{...DEF,...JSON.parse(localStorage.getItem("mc4")||"{}")}}catch{return{...DEF}}}
function saveS(s){try{localStorage.setItem("mc4",JSON.stringify(s))}catch{}}
function getPool(cat,len){
  let p=[...new Set((POOLS[cat]||POOLS.all).map(w=>w.toLowerCase().trim()))].filter(w=>/^[a-z]+$/.test(w));
  if(len==="3-5")p=p.filter(w=>w.length>=3&&w.length<=5);
  else if(len==="5-7")p=p.filter(w=>w.length>=5&&w.length<=7);
  else if(len==="6-8")p=p.filter(w=>w.length>=6&&w.length<=8);
  return p;
}

// ═══════════════════════════════════════════════════════════════════
// REDUCER — states: idle | vibrating | question | countdown | reveal | settings
// ═══════════════════════════════════════════════════════════════════
function init(){return{screen:"idle",code:"",pool:[],kept:[],used:[],letter:"",word:"",...loadS()};}

function reducer(s,a){
  switch(a.type){
    case"DIGIT": return{...s,code:s.code+a.d};
    case"CLRCODE": return{...s,code:""};
    case"CONFIRM":{
      const raw=getPool(s.cat,s.len),f=filterCode(s.code,raw);
      if(!f.length) return{...s,code:""};
      if(f.length===1) return{...s,code:"",screen:"countdown",word:f[0].toUpperCase(),pool:f};
      const L=pickLetter(f,new Set());
      if(!L) return{...s,code:"",screen:"pick",pool:f};
      return{...s,code:"",screen:"vibrating",pool:f,kept:[],used:[L],letter:L};
    }
    case"VIBDONE":{
      // transition from vibrating → question
      return{...s,screen:"question"};
    }
    case"YES":{
      const{letter:L,pool,kept,used}=s;
      const np=pool.filter(w=>wset(w).has(L));
      const nk=[...kept,L],nu=new Set(used);
      if(np.length===0) return{...s,screen:"idle",pool:[],code:""};
      if(np.length===1) return{...s,screen:"countdown",word:np[0].toUpperCase(),pool:np,kept:nk};
      const nx=pickLetter(np,nu);
      if(!nx) return{...s,screen:"pick",pool:np,kept:nk};
      return{...s,screen:"vibrating",pool:np,kept:nk,used:[...nu,nx],letter:nx};
    }
    case"NO":{
      const{letter:L,pool,kept,used}=s;
      const np=pool.filter(w=>{const ws=wset(w);return!ws.has(L)&&kept.every(k=>ws.has(k));});
      const nu=new Set(used);
      if(np.length===0) return{...s,screen:"idle",pool:[],code:""};
      if(np.length===1) return{...s,screen:"countdown",word:np[0].toUpperCase(),pool:np};
      const nx=pickLetter(np,nu);
      if(!nx) return{...s,screen:"pick",pool:np};
      return{...s,screen:"vibrating",pool:np,used:[...nu,nx],letter:nx};
    }
    case"PICK": return{...s,screen:"countdown",word:a.w.toUpperCase()};
    case"REVEAL": return{...s,screen:"reveal"};
    case"RESET": return{...init(),screen:"idle"};
    case"SETTINGS": return{...s,screen:"settings"};
    case"BACK": return{...s,screen:"idle"};
    case"SET":{ const ns={...s,[a.k]:a.v};saveS({cat:ns.cat,len:ns.len,delay:ns.delay,pulse:ns.pulse,pause:ns.pause,revealMode:ns.revealMode,apiUrl:ns.apiUrl,apiKey:ns.apiKey,wall:ns.wall,fontSize:ns.fontSize});return ns;}
    default: return s;
  }
}

// ═══════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════
export default function App(){
  const[st,dispatch]=useReducer(reducer,null,init);
  const stRef=useRef(st);stRef.current=st;

  const[activated,setActivated]=useState(false);
  const[callTime,setCallTime]=useState("");
  const[cdSecs,setCdSecs]=useState(10);
  const[flash,setFlash]=useState(null);
  const[vibratingLetter,setVibratingLetter]=useState("");
  const[apiStatus,setApiStatus]=useState("idle"); // idle|sending|sent|error

  const ctxRef=useRef(null);
  const audioElRef=useRef(null);
  const cdRef=useRef(null);
  const ringStopRef=useRef(null);
  const twoRef=useRef(null);
  const pendUp=useRef(false);
  const upTimer=useRef(null);
  const codeTimer=useRef(null);

  // ── flash helper ──
  const doFlash=useCallback((dir)=>{
    setFlash(dir);setTimeout(()=>setFlash(null),350);
    if(navigator.vibrate) navigator.vibrate(35);
  },[]);

  // ── INPUT HANDLER ──
  const handleDir=useCallback((dir)=>{
    const s=stRef.current;
    if(s.screen==="vibrating") return; // ignore during vibration
    doFlash(dir);
    if(s.screen==="idle"){
      if(dir==="up"){
        if(pendUp.current){
          clearTimeout(upTimer.current);pendUp.current=false;
          clearTimeout(codeTimer.current);dispatch({type:"CONFIRM"});
        } else {
          pendUp.current=true;
          upTimer.current=setTimeout(()=>{
            if(pendUp.current){pendUp.current=false;dispatch({type:"DIGIT",d:"1"});clearTimeout(codeTimer.current);codeTimer.current=setTimeout(()=>dispatch({type:"CLRCODE"}),8000);}
          },450);
        }
      } else {
        if(pendUp.current){clearTimeout(upTimer.current);pendUp.current=false;dispatch({type:"DIGIT",d:"2"});}
        else dispatch({type:"DIGIT",d:"3"});
        clearTimeout(codeTimer.current);codeTimer.current=setTimeout(()=>dispatch({type:"CLRCODE"}),8000);
      }
    } else if(s.screen==="question"){
      if(dir==="up") dispatch({type:"YES"});
      else dispatch({type:"NO"});
    }
  },[doFlash]);

  // ── ACTIVATE AUDIO SESSION (required for iOS volume events) ──
  const activate=()=>{
    if(activated) return;
    setActivated(true);
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC) return;
    const ctx=new AC();ctxRef.current=ctx;
    // Keep audio session alive: near-silent oscillator
    const osc=ctx.createOscillator(),g=ctx.createGain();
    g.gain.value=0.0001;osc.connect(g);g.connect(ctx.destination);osc.start();
    // Build looping silent WAV (1s, 8kHz, 8-bit mono) for volumechange events
    const sr=8000,ns=sr,buf=new ArrayBuffer(44+ns);
    const v=new DataView(buf);
    const ws=(o,s)=>[...s].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
    ws(0,"RIFF");v.setUint32(4,36+ns,true);ws(8,"WAVE");ws(12,"fmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr,true);v.setUint16(32,1,true);v.setUint16(34,8,true);ws(36,"data");v.setUint32(40,ns,true);
    for(let i=0;i<ns;i++) v.setUint8(44+i,0x80); // silent (unsigned 8-bit centre)
    const blob=new Blob([buf],{type:"audio/wav"});
    const audio=new Audio(URL.createObjectURL(blob));
    audio.loop=true;audio.volume=0.5;
    audioElRef.current=audio;
    let lastVol=0.5;
    audio.addEventListener("volumechange",()=>{
      const nv=audio.volume;
      if(Math.abs(nv-lastVol)<0.001){lastVol=nv;return;}
      const dir=nv>lastVol?"up":"down";lastVol=nv;
      handleDir(dir);
    });
    audio.play().then(()=>{if(ctx.state==="suspended")ctx.resume();}).catch(()=>{});
  };

  // ── VIBRATING STATE: fire haptic+beeps then auto-advance ──
  useEffect(()=>{
    if(st.screen==="vibrating"&&st.letter){
      setVibratingLetter(st.letter);
      const pat=polyPattern(st.letter,st.pulse,st.pause);
      if(navigator.vibrate) navigator.vibrate(pat);
      playPolyBeeps(ctxRef.current,st.letter,st.pulse,st.pause);
      const dur=patDur(pat)+300; // +300ms buffer
      const t=setTimeout(()=>dispatch({type:"VIBDONE"}),dur);
      return()=>clearTimeout(t);
    }
  },[st.screen,st.letter,st.pulse,st.pause]);

  // ── COUNTDOWN ──
  useEffect(()=>{
    if(st.screen==="countdown"){
      let secs=st.delay;setCdSecs(secs);
      cdRef.current=setInterval(()=>{secs--;setCdSecs(secs);if(secs<=0){clearInterval(cdRef.current);dispatch({type:"REVEAL"});}},1000);
    }
    return()=>clearInterval(cdRef.current);
  },[st.screen,st.delay]);

  // ── REVEAL EFFECTS ──
  useEffect(()=>{
    if(st.screen!=="reveal") return;
    // Clock
    const tick=()=>{const d=new Date();setCallTime(`${d.getHours()%12||12}:${String(d.getMinutes()).padStart(2,"0")}`);};
    tick();const t=setInterval(tick,1000);
    // Mode-specific
    if(st.revealMode==="call"){
      if(ringStopRef.current) ringStopRef.current();
      ringStopRef.current=playRingtone(ctxRef.current,true);
    } else if(st.revealMode==="api"){
      setApiStatus("sending");
      const url=st.apiUrl,key=st.apiKey;
      fetch(url,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({word:st.word})})
        .then(r=>r.ok?setApiStatus("sent"):setApiStatus("error"))
        .catch(()=>setApiStatus("error"));
    }
    return()=>{clearInterval(t);if(ringStopRef.current){ringStopRef.current();ringStopRef.current=null;}};
  },[st.screen,st.revealMode,st.word,st.apiUrl,st.apiKey]);

  // ── 2-FINGER SWIPE DOWN → SETTINGS ──
  const onTS=useCallback((e)=>{if(e.touches.length===2)twoRef.current=e.touches[0].clientY;},[]);
  const onTM=useCallback((e)=>{if(e.touches.length===2&&twoRef.current!==null&&e.touches[0].clientY-twoRef.current>90){twoRef.current=null;dispatch({type:"SETTINGS"});}},[]);
  const onTE=useCallback(()=>{twoRef.current=null;},[]);

  return(
    <div style={{position:"fixed",inset:0,background:"#000",overflow:"hidden",userSelect:"none",WebkitUserSelect:"none",WebkitTouchCallout:"none"}}
      onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}>
      {/* Flash */}
      <AnimatePresence>{flash&&<motion.div key={flash+Date.now()} initial={{opacity:0.9}} animate={{opacity:0}} transition={{duration:0.35}} style={{position:"fixed",inset:0,zIndex:9999,pointerEvents:"none",background:flash==="up"?"linear-gradient(to bottom,rgba(0,240,100,.5),transparent 45%)":"linear-gradient(to top,rgba(255,50,50,.5),transparent 45%)"}}/>}</AnimatePresence>
      {/* Activate */}
      {!activated&&<ActivateScreen onActivate={activate}/>}
      <AnimatePresence mode="wait">
        {st.screen==="idle"&&<IdleScreen key="idle" code={st.code} cat={st.cat} len={st.len} onDir={handleDir} onSettings={()=>dispatch({type:"SETTINGS"})} onList={()=>dispatch({type:"SETTINGS"})}/>}
        {st.screen==="vibrating"&&<VibratingScreen key="vib" letter={st.letter} kept={st.kept} pool={st.pool}/>}
        {st.screen==="question"&&<QuestionScreen key="q" letter={st.letter} kept={st.kept} pool={st.pool} onDir={handleDir}/>}
        {st.screen==="countdown"&&<CountdownScreen key="cd" word={st.word} secs={cdSecs}/>}
        {st.screen==="pick"&&<PickScreen key="pick" words={st.pool} onPick={w=>dispatch({type:"PICK",w})}/>}
        {st.screen==="reveal"&&st.revealMode==="call"&&<CallScreen key="call" word={st.word} time={callTime} wall={st.wall} fontSize={st.fontSize} onDecline={()=>dispatch({type:"RESET"})} onAccept={()=>setTimeout(()=>dispatch({type:"RESET"}),800)}/>}
        {st.screen==="reveal"&&st.revealMode==="peek"&&<PeekScreen key="peek" word={st.word} fontSize={st.fontSize} onDismiss={()=>dispatch({type:"RESET"})}/>}
        {st.screen==="reveal"&&st.revealMode==="api"&&<ApiScreen key="api" word={st.word} status={apiStatus} onDismiss={()=>{setApiStatus("idle");dispatch({type:"RESET"});}}/>}
        {st.screen==="settings"&&<SettingsScreen key="s" st={st} dispatch={dispatch}/>}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ACTIVATE
// ═══════════════════════════════════════════════════════════════════
function ActivateScreen({onActivate}){
  return(
    <div onClick={onActivate} style={{position:"fixed",inset:0,zIndex:300,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,cursor:"pointer"}}>
      <motion.div animate={{scale:[1,1.12,1]}} transition={{duration:2.2,repeat:Infinity,ease:"easeInOut"}}>
        <div style={{fontSize:72}}>🎩</div>
      </motion.div>
      <div style={{color:"#fff",fontSize:24,fontFamily:"system-ui",fontWeight:700,letterSpacing:2}}>MindCall</div>
      <div style={{color:"#333",fontSize:14,fontFamily:"system-ui",marginTop:-8}}>Tap anywhere to begin</div>
      <div style={{color:"#1a1a1a",fontSize:11,fontFamily:"monospace",letterSpacing:2,marginTop:8}}>ACTIVATES VOLUME BUTTON DETECTION</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// IDLE SCREEN — shape code entry
// ═══════════════════════════════════════════════════════════════════
function IdleScreen({code,cat,len,onDir,onSettings}){
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:0}}>
      {/* Code digits */}
      <div style={{display:"flex",gap:10,marginBottom:32,minHeight:56,alignItems:"center"}}>
        {code.length===0
          ?<div style={{color:"#181818",fontSize:12,fontFamily:"monospace",letterSpacing:5}}>READY</div>
          :[...code].map((d,i)=>(
            <motion.div key={i} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:600,damping:24}}
              style={{width:48,height:48,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,fontFamily:"monospace",
                background:d==="1"?"#0b2e16":d==="2"?"#0b1d2e":"#2e0b0b",
                border:`2px solid ${d==="1"?"#00e676":d==="2"?"#29b6f6":"#ef5350"}`,
                color:d==="1"?"#00e676":d==="2"?"#29b6f6":"#ef5350"}}>{d}</motion.div>
          ))}
      </div>
      {/* Buttons */}
      <div style={{display:"flex",gap:14,marginBottom:18}}>
        <VolBtn label="VOL ↑" sub="= 1" col="#00e676" bg="#0b2e16" onClick={()=>onDir("up")}/>
        <VolBtn label="VOL ↓" sub="= 3" col="#ef5350" bg="#2e0b0b" onClick={()=>onDir("down")}/>
      </div>
      <div style={{color:"#1a1a1a",fontSize:10,fontFamily:"monospace",letterSpacing:2,marginBottom:32,textAlign:"center",lineHeight:2}}>
        ↑ then ↓ = 2 &nbsp;·&nbsp; ↑↑ = CONFIRM
      </div>
      {/* Category pill */}
      <button onClick={onSettings} style={{background:"#0a0a0a",border:"1px solid #181818",borderRadius:20,padding:"7px 20px",color:"#222",fontSize:11,fontFamily:"monospace",letterSpacing:2,cursor:"pointer",textTransform:"uppercase",WebkitTapHighlightColor:"transparent"}}>
        {CAT_LABELS[cat]} · {len==="any"?"any length":len}
      </button>
      <div style={{position:"absolute",bottom:44,color:"#0e0e0e",fontSize:10,fontFamily:"monospace",letterSpacing:2}}>2-FINGER SWIPE DOWN = SETTINGS</div>
    </motion.div>
  );
}

function VolBtn({label,sub,col,bg,onClick}){
  return(
    <button onClick={onClick} style={{background:bg,border:`2px solid ${col}`,borderRadius:12,padding:"13px 22px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,minWidth:96,WebkitTapHighlightColor:"transparent",outline:"none"}}>
      <span style={{color:col,fontSize:15,fontWeight:800,fontFamily:"monospace",letterSpacing:1}}>{label}</span>
      <span style={{color:col+"99",fontSize:9,fontFamily:"monospace",letterSpacing:2}}>{sub}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VIBRATING SCREEN — shows while haptic pattern plays
// ═══════════════════════════════════════════════════════════════════
function VibratingScreen({letter,kept,pool}){
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#040404",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
      {kept.length>0&&(
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",justifyContent:"center"}}>
          {kept.map((k,i)=><div key={i} style={{background:"#0a2e14",border:"1px solid #00e676",borderRadius:6,color:"#00e676",fontSize:11,fontWeight:700,fontFamily:"monospace",padding:"3px 10px",letterSpacing:2}}>✓ {k}</div>)}
        </div>
      )}
      <motion.div animate={{opacity:[0.3,1,0.3],scale:[0.95,1.05,0.95]}} transition={{duration:0.8,repeat:Infinity,ease:"easeInOut"}}
        style={{color:"#fff",fontSize:180,fontWeight:900,fontFamily:"Georgia,serif",lineHeight:1}}>
        {letter}
      </motion.div>
      <motion.div animate={{opacity:[0.2,0.6,0.2]}} transition={{duration:0.8,repeat:Infinity}}
        style={{color:"#333",fontSize:11,fontFamily:"monospace",letterSpacing:5,marginTop:8}}>
        FEELING…
      </motion.div>
      {pool.length<=12&&pool.length>1&&(
        <div style={{marginTop:20,display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",maxWidth:340,padding:"0 20px"}}>
          {pool.map((w,i)=><div key={i} style={{color:"#1e1e1e",fontSize:10,fontFamily:"monospace",background:"#0a0a0a",borderRadius:4,padding:"2px 7px",border:"1px solid #141414",letterSpacing:1,textTransform:"uppercase"}}>{w}</div>)}
        </div>
      )}
      {pool.length>12&&<div style={{color:"#141414",fontSize:10,fontFamily:"monospace",marginTop:16,letterSpacing:2}}>{pool.length} CANDIDATES</div>}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// QUESTION SCREEN — waiting for YES / NO
// ═══════════════════════════════════════════════════════════════════
function QuestionScreen({letter,kept,pool,onDir}){
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#020202",display:"flex",flexDirection:"column",alignItems:"center",padding:"32px 20px 20px"}}>
      {kept.length>0&&(
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",justifyContent:"center"}}>
          {kept.map((k,i)=><div key={i} style={{background:"#0a2e14",border:"1px solid #00e676",borderRadius:6,color:"#00e676",fontSize:11,fontWeight:700,fontFamily:"monospace",padding:"3px 10px",letterSpacing:2}}>✓ {k}</div>)}
        </div>
      )}
      <motion.div key={letter} initial={{scale:0.6,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} transition={{type:"spring",stiffness:400,damping:22}}
        style={{color:"#fff",fontSize:170,fontWeight:900,fontFamily:"Georgia,serif",lineHeight:1}}>
        {letter}
      </motion.div>
      <div style={{color:"#222",fontSize:11,fontFamily:"monospace",letterSpacing:4,marginTop:2}}>IS THIS LETTER IN YOUR WORD?</div>
      <div style={{display:"flex",gap:14,marginTop:18,width:"100%",maxWidth:320}}>
        <button onClick={()=>onDir("up")} style={{flex:1,padding:"18px 0",background:"#0b2e16",border:"2.5px solid #00e676",borderRadius:14,color:"#00e676",fontSize:18,fontWeight:900,fontFamily:"monospace",letterSpacing:4,cursor:"pointer",WebkitTapHighlightColor:"transparent",outline:"none"}}>
          YES<br/><span style={{fontSize:9,opacity:0.5,letterSpacing:2}}>VOL ↑</span>
        </button>
        <button onClick={()=>onDir("down")} style={{flex:1,padding:"18px 0",background:"#2e0b0b",border:"2.5px solid #ef5350",borderRadius:14,color:"#ef5350",fontSize:18,fontWeight:900,fontFamily:"monospace",letterSpacing:4,cursor:"pointer",WebkitTapHighlightColor:"transparent",outline:"none"}}>
          NO<br/><span style={{fontSize:9,opacity:0.5,letterSpacing:2}}>VOL ↓</span>
        </button>
      </div>
      {pool.length<=12&&pool.length>1&&(
        <div style={{marginTop:18,width:"100%",maxWidth:360}}>
          <div style={{color:"#141414",fontSize:9,fontFamily:"monospace",letterSpacing:3,textAlign:"center",marginBottom:8}}>{pool.length} CANDIDATES</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
            {pool.map((w,i)=><div key={i} style={{color:"#202020",fontSize:10,fontFamily:"monospace",background:"#0a0a0a",borderRadius:4,padding:"2px 7px",border:"1px solid #141414",letterSpacing:1,textTransform:"uppercase"}}>{w}</div>)}
          </div>
        </div>
      )}
      {pool.length>12&&<div style={{color:"#141414",fontSize:10,fontFamily:"monospace",marginTop:14,letterSpacing:2}}>{pool.length} CANDIDATES</div>}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COUNTDOWN
// ═══════════════════════════════════════════════════════════════════
function CountdownScreen({word,secs}){
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
      <div style={{color:"#111",fontSize:11,fontFamily:"monospace",letterSpacing:5}}>CALL INCOMING IN</div>
      <motion.div key={secs} initial={{scale:1.5,opacity:0}} animate={{scale:1,opacity:1}}
        style={{color:"#1c1c1c",fontSize:100,fontWeight:900,fontFamily:"monospace",lineHeight:1}}>{secs}</motion.div>
      <div style={{color:"#0c0c0c",fontSize:11,fontFamily:"monospace",letterSpacing:5,marginTop:8,textTransform:"uppercase"}}>{word}</div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PICK SCREEN (rare fallback)
// ═══════════════════════════════════════════════════════════════════
function PickScreen({words,onPick}){
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#080808",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:28}}>
      <div style={{color:"#2a2a2a",fontSize:10,fontFamily:"monospace",letterSpacing:4,marginBottom:8}}>SELECT WORD</div>
      {words.slice(0,8).map(w=>(
        <button key={w} onClick={()=>onPick(w)} style={{color:"#fff",fontSize:18,fontWeight:700,fontFamily:"monospace",background:"#111",border:"1px solid #1e1e1e",borderRadius:12,padding:"12px 0",cursor:"pointer",width:"100%",textTransform:"uppercase",letterSpacing:5,WebkitTapHighlightColor:"transparent"}}>
          {w}
        </button>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REVEAL: CALL SCREEN (iOS Style)
// ═══════════════════════════════════════════════════════════════════
function CallScreen({word,time,wall,fontSize,onDecline,onAccept}){
  const fz={small:26,medium:36,large:50}[fontSize]||36;
  const bg=wall==="g1"?"linear-gradient(180deg,#0f0c29,#302b63 50%,#24243e)":wall==="g2"?"linear-gradient(180deg,#1a0000,#2d1515 50%,#1a0000)":wall==="g3"?"linear-gradient(180deg,#001a00,#0a2e0a 50%,#001a00)":"#1C1C1E";
  return(
    <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}} transition={{type:"spring",stiffness:280,damping:28}}
      style={{position:"fixed",inset:0,background:bg,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"system-ui"}}>
      {/* status bar */}
      <div style={{width:"100%",display:"flex",justifyContent:"space-between",padding:"env(safe-area-inset-top,16px) 24px 0",alignItems:"center",boxSizing:"border-box",paddingTop:"max(env(safe-area-inset-top),16px)"}}>
        <span style={{color:"#fff",fontSize:17,fontWeight:600}}>{time}</span>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5"/><rect x="9" y="2.5" width="3" height="9.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="12" rx="0.5"/></svg>
          <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="white" strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="9" rx="2" fill="white"/><path d="M23 5v3a1.5 1.5 0 0 0 0-3z" fill="white" fillOpacity="0.4"/></svg>
        </div>
      </div>
      {/* incoming label */}
      <motion.div animate={{opacity:[0.45,1,0.45]}} transition={{duration:1.8,repeat:Infinity,ease:"easeInOut"}}
        style={{color:"#ffffffaa",fontSize:15,letterSpacing:0.3,marginTop:18}}>incoming call</motion.div>
      {/* avatar */}
      <div style={{width:104,height:104,borderRadius:"50%",background:"#3A3A3C",display:"flex",alignItems:"center",justifyContent:"center",marginTop:28,boxShadow:"0 0 0 4px rgba(255,255,255,0.06)"}}>
        <svg width="60" height="60" viewBox="0 0 56 56" fill="#8E8E93"><circle cx="28" cy="20" r="12.5"/><path d="M2 52c0-14.4 11.6-24 26-24s26 9.6 26 24"/></svg>
      </div>
      {/* word */}
      <div style={{color:"#fff",fontSize:fz,fontWeight:700,marginTop:18,textAlign:"center",padding:"0 20px",letterSpacing:0.5,textShadow:"0 2px 16px rgba(0,0,0,0.4)"}}>{word}</div>
      <div style={{color:"#8E8E93",fontSize:15,marginTop:6}}>mobile</div>
      {/* time badge */}
      <div style={{color:"#8E8E93",fontSize:13,marginTop:4}}>MindCall Performance</div>
      {/* buttons */}
      <div style={{position:"absolute",bottom:"max(env(safe-area-inset-bottom,0px),44px)",width:"100%",display:"flex",justifyContent:"space-around",padding:"0 48px",boxSizing:"border-box"}}>
        {[{fn:onDecline,bg:"#FF3B30",sh:"#FF3B3066",label:"Decline",icon:<EndIcon/>},{fn:onAccept,bg:"#34C759",sh:"#34C75966",label:"Accept",icon:<AcceptIcon/>}].map(({fn,bg,sh,label,icon})=>(
          <div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <button onClick={fn} style={{width:74,height:74,borderRadius:"50%",background:bg,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 28px ${sh}`,WebkitTapHighlightColor:"transparent"}}>{icon}</button>
            <span style={{color:"#8E8E93",fontSize:13}}>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
const EndIcon=()=><svg width="32" height="32" viewBox="0 0 32 32" fill="white"><path d="M4 21c2.5-6 6.5-9 12-9s9.5 3 12 9l-4 4c-1.5-2.5-4-4-8-4s-6.5 1.5-8 4Z" transform="rotate(135 16 18)"/></svg>;
const AcceptIcon=()=><svg width="32" height="32" viewBox="0 0 32 32" fill="white"><path d="M4 11c2.5-6 6.5-9 12-9s9.5 3 12 9l-4 4c-1.5-2.5-4-4-8-4s-6.5 1.5-8 4Z"/></svg>;

// ═══════════════════════════════════════════════════════════════════
// REVEAL: PEEK SCREEN
// ═══════════════════════════════════════════════════════════════════
function PeekScreen({word,fontSize,onDismiss}){
  const fz={small:42,medium:60,large:80}[fontSize]||60;
  return(
    <motion.div initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:0.4}}
      onClick={onDismiss} style={{position:"fixed",inset:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,cursor:"pointer"}}>
      <motion.div animate={{opacity:[0.6,1,0.6]}} transition={{duration:2,repeat:Infinity}}>
        <div style={{color:"#fff",fontSize:fz,fontWeight:900,fontFamily:"system-ui",textAlign:"center",padding:"0 24px",letterSpacing:2,textTransform:"uppercase"}}>{word}</div>
      </motion.div>
      <div style={{color:"#1a1a1a",fontSize:10,fontFamily:"monospace",letterSpacing:4,marginTop:16}}>TAP TO DISMISS</div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REVEAL: API SCREEN
// ═══════════════════════════════════════════════════════════════════
function ApiScreen({word,status,onDismiss}){
  const icon=status==="sending"?"⏳":status==="sent"?"✅":"❌";
  const msg=status==="sending"?"Sending to API…":status==="sent"?"Sent successfully":status==="error"?"API error":"Ready";
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,background:"#050505",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
      <div style={{fontSize:56}}>{icon}</div>
      <div style={{color:"#fff",fontSize:20,fontFamily:"monospace",fontWeight:700,letterSpacing:2}}>{word}</div>
      <div style={{color:"#333",fontSize:13,fontFamily:"monospace",letterSpacing:2}}>{msg}</div>
      {(status==="sent"||status==="error")&&(
        <button onClick={onDismiss} style={{marginTop:24,background:"#1a1a1a",border:"1px solid #333",borderRadius:12,padding:"12px 32px",color:"#fff",fontFamily:"monospace",fontSize:13,cursor:"pointer",letterSpacing:2}}>RESET</button>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════
function SettingsScreen({st,dispatch}){
  const set=(k,v)=>dispatch({type:"SET",k,v});
  const[apiUrlDraft,setApiUrlDraft]=useState(st.apiUrl);
  const[apiKeyDraft,setApiKeyDraft]=useState(st.apiKey);
  return(
    <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}} transition={{type:"spring",stiffness:300,damping:30}}
      style={{position:"fixed",inset:0,background:"#1C1C1E",overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{padding:"max(env(safe-area-inset-top),16px) 0 80px",maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 16px 24px"}}>
          <h1 style={{color:"#fff",fontSize:28,fontWeight:700,fontFamily:"system-ui",margin:0}}>Settings</h1>
          <button onClick={()=>dispatch({type:"BACK"})} style={{color:"#fff",background:"#3A3A3C",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent"}}>×</button>
        </div>

        {/* REVEAL MODE */}
        <Sect title="REVEAL MODE">
          {[["call","📱 iOS Call Screen"],["peek","👁 Peek — word on screen"],["api","🔗 API / External Device"]].map(([v,l])=>(
            <SRow key={v} label={l} active={st.revealMode===v} onClick={()=>set("revealMode",v)} last={v==="api"}/>
          ))}
        </Sect>

        {/* API settings */}
        {st.revealMode==="api"&&(
          <Sect title="API CONFIGURATION">
            <div style={{padding:"12px 0",borderBottom:"1px solid #3A3A3C"}}>
              <div style={{color:"#8E8E93",fontSize:11,fontFamily:"system-ui",marginBottom:6}}>POST URL</div>
              <input value={apiUrlDraft} onChange={e=>setApiUrlDraft(e.target.value)} onBlur={()=>set("apiUrl",apiUrlDraft)}
                placeholder="https://your-api.example.com/word"
                style={{width:"100%",background:"#2C2C2E",border:"none",borderRadius:8,padding:"10px 12px",color:"#fff",fontFamily:"monospace",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{padding:"12px 0"}}>
              <div style={{color:"#8E8E93",fontSize:11,fontFamily:"system-ui",marginBottom:6}}>API KEY (Bearer token)</div>
              <input value={apiKeyDraft} onChange={e=>setApiKeyDraft(e.target.value)} onBlur={()=>set("apiKey",apiKeyDraft)}
                placeholder="your-secret-key"
                type="password"
                style={{width:"100%",background:"#2C2C2E",border:"none",borderRadius:8,padding:"10px 12px",color:"#fff",fontFamily:"monospace",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
          </Sect>
        )}

        {/* Call settings */}
        {st.revealMode==="call"&&(
          <Sect title="CALL SETTINGS">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #3A3A3C"}}>
              <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Call delay</span>
              <div style={{display:"flex",gap:12,alignItems:"center"}}><Tb label="−" onClick={()=>set("delay",Math.max(1,st.delay-1))}/><span style={{color:"#0A84FF",fontFamily:"system-ui",fontWeight:700,minWidth:44,textAlign:"center"}}>{st.delay}s</span><Tb label="+" onClick={()=>set("delay",Math.min(30,st.delay+1))}/></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #3A3A3C"}}>
              <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Name size</span>
              <div style={{display:"flex",gap:8}}>{["small","medium","large"].map(s=><button key={s} onClick={()=>set("fontSize",s)} style={{padding:"6px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontFamily:"system-ui",background:st.fontSize===s?"#0A84FF":"#3A3A3C",color:"#fff",textTransform:"capitalize"}}>{s}</button>)}</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0"}}>
              <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Wallpaper</span>
              <div style={{display:"flex",gap:8}}>
                {[["dark","#1C1C1E"],["g1","linear-gradient(#0f0c29,#24243e)"],["g2","linear-gradient(#1a0000,#2d1515)"],["g3","linear-gradient(#001a00,#0a2e0a)"]].map(([v,bg])=>(
                  <button key={v} onClick={()=>set("wall",v)} style={{width:32,height:32,borderRadius:8,border:st.wall===v?"2.5px solid #0A84FF":"2px solid #444",cursor:"pointer",background:bg,WebkitTapHighlightColor:"transparent"}}/>
                ))}
              </div>
            </div>
          </Sect>
        )}

        {/* WORD LIST */}
        <Sect title="WORD CATEGORY">
          {Object.keys(CAT_LABELS).map((c,i,a)=>(
            <SRow key={c} label={CAT_LABELS[c]} sub={`${POOLS[c].length}`} active={st.cat===c} onClick={()=>set("cat",c)} last={i===a.length-1}/>
          ))}
        </Sect>

        <Sect title="WORD LENGTH">
          <div style={{display:"flex",gap:8,padding:"12px 0"}}>
            {[["any","Any"],["3-5","3–5"],["5-7","5–7"],["6-8","6–8"]].map(([v,l])=>(
              <button key={v} onClick={()=>set("len",v)} style={{flex:1,padding:"10px 4px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontFamily:"system-ui",fontWeight:600,background:st.len===v?"#0A84FF":"#3A3A3C",color:"#fff"}}>{l}</button>
            ))}
          </div>
        </Sect>

        {/* VIBRATION */}
        <Sect title="VIBRATION / AUDIO">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #3A3A3C"}}>
            <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Pulse duration</span>
            <div style={{display:"flex",gap:8}}>{[80,120,160].map(d=><button key={d} onClick={()=>set("pulse",d)} style={{padding:"6px 9px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontFamily:"system-ui",background:st.pulse===d?"#0A84FF":"#3A3A3C",color:"#fff"}}>{d}ms</button>)}</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0"}}>
            <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>Group pause</span>
            <div style={{display:"flex",gap:8}}>{[300,500,700].map(d=><button key={d} onClick={()=>set("pause",d)} style={{padding:"6px 9px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontFamily:"system-ui",background:st.pause===d?"#0A84FF":"#3A3A3C",color:"#fff"}}>{d}ms</button>)}</div>
          </div>
        </Sect>

        <div style={{color:"#1e1e1e",fontSize:12,fontFamily:"system-ui",textAlign:"center",marginTop:24,paddingBottom:20}}>MindCall v4.0</div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────
function Sect({title,children}){
  return(
    <div style={{padding:"0 16px",marginBottom:28}}>
      <div style={{color:"#8E8E93",fontSize:11,fontFamily:"system-ui",letterSpacing:0.8,marginBottom:8,textTransform:"uppercase",paddingLeft:4}}>{title}</div>
      <div style={{background:"#2C2C2E",borderRadius:12,padding:"0 16px"}}>{children}</div>
    </div>
  );
}
function SRow({label,sub,active,onClick,last}){
  return(
    <button onClick={onClick} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"14px 0",background:"none",border:"none",borderBottom:last?"none":"1px solid #3A3A3C",cursor:"pointer",textAlign:"left",WebkitTapHighlightColor:"transparent"}}>
      <span style={{color:"#fff",fontFamily:"system-ui",fontSize:15}}>{label}</span>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {sub&&<span style={{color:"#555",fontSize:12,fontFamily:"system-ui"}}>{sub}</span>}
        {active&&<span style={{color:"#34C759",fontSize:20}}>✓</span>}
      </div>
    </button>
  );
}
function Tb({label,onClick}){
  return(
    <button onClick={onClick} style={{color:"#fff",background:"#3A3A3C",border:"none",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:18,fontFamily:"system-ui",display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent"}}>{label}</button>
  );
}
