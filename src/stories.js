// Authored narrative threads. A beat is a clue, not a cutscene: agents continue living between observations.
// All romantic characters are adults. Intimacy is suggested through performance, staging and implication.
export const STORIES = [
  {
    id:"second-plate", floor:12, col:1, title:"The Second Plate", genre:"LONGING / UNCANNY",
    theme:"dining", description:"A carefully dressed table. Two place settings. Only one coat by the door.",
    cast:[{name:"Ada",age:67,look:"elder",hair:"silver",clothes:"cream",skin:2,needs:{connection:.14,fatigue:.42},motive:"belonging"}],
    props:["dining","chair","chair","lamp","flowers","photo","books","clock"],
    beats:[
      {text:"At precisely the same time each evening, Ada sets a second plate. She checks the hallway whenever the elevator stops.",clue:"The second place setting has fresh food. The framed photograph is turned face down.",choices:[{label:"Stay still and watch",reply:"She mouths a name to the empty chair. Then smiles at something you cannot see.",gesture:"remember",shift:{connection:-.13,stress:.09}},{label:"Tap gently on the pane",reply:"Ada looks up and nods, as though she was expecting you.",gesture:"window",shift:{connection:.14,fear:.04}}]},
      {text:"Tonight the empty chair moves an inch. Ada doesn't look surprised. Under the plate lies a folded bus ticket dated tomorrow.",clue:"A bus ticket, one day in the future.",choices:[{label:"Look for someone in the room",reply:"For a second, a second shadow crosses the wall. The room has only one light.",gesture:"freeze",shift:{fear:.22}},{label:"Let her have this moment",reply:"Ada pours tea into the second cup, with hands that have finally stopped shaking.",gesture:"tea",shift:{connection:.2}}]},
      {text:"When you return, there's a handwritten note against the glass: 'HE ALWAYS HATED THE RAIN.' Ada is asleep at the table. Both cups are empty.",clue:"Both teacups have been used.",choices:[{label:"Write it in your casebook",reply:"Some stories aren't mysteries to solve. They're people trying to survive an absence.",gesture:"sleep",shift:{stress:-.12}}]}
    ]
  },
  {
    id:"cipher",floor:11,col:0,title:"The Frequency",genre:"CONSPIRACY / SURVIVAL",theme:"study",
    description:"Radio equipment. Maps of the building. A red light that never switches off.",
    cast:[{name:"Malik",age:38,look:"sharp",hair:"short",clothes:"navy",skin:3,needs:{safety:.22,curiosity:.91},motive:"safety"}],
    props:["desk","radio","maps","lamp","papers","mug","shelf","phone"],
    beats:[
      {text:"Malik transmits three short tones into a radio, then waits. A reply comes from somewhere inside the tower.",clue:"A hand-drawn map marks a circle around UNIT 0902.",choices:[{label:"Follow his gaze toward floor nine",reply:"He circles a ninth-floor window on the map, then violently crosses it out.",gesture:"panic",shift:{fear:.22}},{label:"Make your presence known",reply:"Malik kills the lights. His monitor displays a single word: PANE.",gesture:"hide",shift:{fear:.35}}]},
      {text:"The radio bursts into life. Malik presses his hand against the glass: three fingers, then one. The same signal flashes in another apartment.",clue:"An alternating three-one signal links two apartments.",choices:[{label:"Answer with three taps, then one",reply:"He relaxes for one breath. Somewhere above, a light switches on.",gesture:"relief",shift:{safety:.25}},{label:"Stay out of it",reply:"Malik scribbles faster. His fingers shake as the signal repeats.",gesture:"work",shift:{stress:.12}}]},
      {text:"Malik's desk is empty now. The radio still speaks. On the map, a new X has been placed outside his window.",clue:"Someone knew the exact position of your platform.",choices:[{label:"Keep the map in mind",reply:"The next broadcast is just rain. You can hear breathing beneath it.",gesture:"window",shift:{fear:.1}}]}
    ]
  },
  {
    id:"red-dress",floor:10,col:2,title:"The Red Dress",genre:"DESIRE / DECEPTION",theme:"romance",
    description:"Velvet curtains, two glasses of wine, and a red dress across the back of a chair.",
    cast:[{name:"Vera",age:32,look:"graceful",hair:"bob",clothes:"red",skin:1,needs:{desire:.87,connection:.55},motive:"intimacy"},{name:"Elise",age:35,look:"tall",hair:"dark",clothes:"black",skin:2,needs:{connection:.68,safety:.5},motive:"intimacy"}],
    props:["sofa","lamp","glass","glass","curtain","record","flowers","photo"],
    beats:[
      {text:"The record is playing. Vera and Elise dance slowly, close enough to whisper things no microphone could catch. Then Vera spots you.",clue:"A lipstick message on the mirror reads: 'DON'T LET HER LEAVE.'",choices:[{label:"Look away and give them privacy",reply:"Vera draws the curtains halfway. Their silhouettes move together in a kiss, then disappear.",gesture:"kiss",shift:{connection:.2,desire:.12}},{label:"Continue cleaning, professionally",reply:"Elise laughs at the awkward interruption and waves you along. Vera doesn't laugh.",gesture:"wave",shift:{fear:.08,desire:-.06}}]},
      {text:"One glass lies broken. Elise is pulling on her coat; Vera holds a sealed letter without handing it over.",clue:"The envelope is addressed to someone living on the first floor.",choices:[{label:"Knock to warn them about the broken glass",reply:"Vera opens the letter. The look that follows is not anger. It's terror.",gesture:"panic",shift:{fear:.31}},{label:"Give them space",reply:"Elise places her forehead against Vera's. They stand without moving for a long time.",gesture:"embrace",shift:{connection:.22}}]},
      {text:"The red dress hangs in the window like a signal flag. Below it, two pairs of shoes are placed neatly side by side.",clue:"The red dress appears to be a signal, not simply an outfit.",choices:[{label:"Leave the lovers to their secrets",reply:"The light goes out. For a moment, you see the warmth of two hands through the curtain.",gesture:"dance",shift:{connection:.2}}]}
    ]
  },
  {
    id:"thirteenth",floor:9,col:1,title:"The Thirteenth Floor",genre:"DREAD / PARANOIA",theme:"minimal",
    description:"One chair faces a wall of photographs. Every photograph shows this building.",
    cast:[{name:"Leon",age:46,look:"gaunt",hair:"messy",clothes:"gray",skin:0,needs:{fear:.8,curiosity:.9},motive:"control"}],
    props:["chair","photos","clock","desk","papers","phone","lamp"],
    beats:[
      {text:"Leon counts the floors with a trembling fingertip. Twelve. Then he writes THIRTEEN and turns toward the ceiling.",clue:"All the photographs show the building with thirteen storeys.",choices:[{label:"Look up at the roofline",reply:"The uppermost silhouette shifts behind the rain. You blink and see only twelve floors.",gesture:"fear",shift:{fear:.25}},{label:"Tap once on the glass",reply:"Leon holds up a photograph: the worker outside its window is you.",gesture:"window",shift:{fear:.3}}]},
      {text:"Every clock in the apartment has stopped at 3:13. Leon drags the chair into the middle of the room and sits facing you.",clue:"Every clock shows 03:13. In one photograph, the platform has no cables.",choices:[{label:"Hold his gaze",reply:"Leon slowly points behind your shoulder. There is nothing there when you turn.",gesture:"point",shift:{fear:.21}},{label:"Back away",reply:"He exhales with relief, then immediately begins counting again.",gesture:"relief",shift:{safety:.14}}]},
      {text:"The photographs have been removed. Only one remains: the building without a single lit window, except the one you're looking through.",clue:"Leon photographed a version of the building that seems not to exist.",choices:[{label:"Close the file, for now",reply:"From the other side of the glass, someone knocks three times.",gesture:"window",shift:{fear:.25}}]}
    ]
  },
  {
    id:"lullaby",floor:8,col:2,title:"The Lullaby",genre:"HORROR / PROTECTION",theme:"nursery",
    description:"A small cot, a rotating mobile, and an old baby monitor crackling beside a rocking chair.",
    cast:[{name:"June",age:30,look:"tired",hair:"ponytail",clothes:"olive",skin:1,needs:{fatigue:.93,safety:.24},motive:"protection"}],
    props:["crib","rocker","lamp","toy","photo","plant","clock","blanket"],
    beats:[
      {text:"June rocks an empty crib and hums. When she leaves the room to answer her phone, the hanging mobile keeps spinning against the still air.",clue:"The mobile begins moving when June steps away.",choices:[{label:"Watch the cot carefully",reply:"A second, smaller shadow crosses the crib. June rushes back, visibly frightened.",gesture:"protect",shift:{fear:.23,safety:-.12}},{label:"Tap to alert June",reply:"She gathers a blanket tightly to her chest and shuts the nursery door.",gesture:"panic",shift:{fear:.27}}]},
      {text:"June has brought a carpenter's level. She sets it beside the cot and waits. The bubble glides sideways as though the floor has tilted.",clue:"Objects move independently in the child's room.",choices:[{label:"Stay and watch",reply:"For one heartbeat a little handprint appears on the inside of the glass, then fades.",gesture:"freeze",shift:{fear:.22}},{label:"Give her a reassuring wave",reply:"June looks at you and almost smiles. The mobile stops.",gesture:"wave",shift:{connection:.2}}]},
      {text:"The cot has been moved against the window. Inside is a handwritten card: 'GOODNIGHT, MAMA.' June is smiling through tears.",clue:"A message appears in the empty cot.",choices:[{label:"Leave the family in peace",reply:"You close the blinds from the outside, slowly enough not to wake anyone.",gesture:"rest",shift:{fear:-.12}}]}
    ]
  },
  {
    id:"overtime",floor:7,col:0,title:"The Night Shift",genre:"EXHAUSTION / COMPASSION",theme:"kitchen",
    description:"Unopened bills on the table. Scrubs hanging from a chair. A kettle never quite cools.",
    cast:[{name:"Rosa",age:40,look:"tired",hair:"bun",clothes:"teal",skin:4,needs:{fatigue:.96,hunger:.12,connection:.18},motive:"survival"}],
    props:["table","kettle","cup","bills","chair","lamp","clock","plant"],
    beats:[
      {text:"Rosa falls asleep while standing at the counter. Her phone lights up with another request for an overnight shift.",clue:"Three hospital shifts are circled on the calendar. None leaves time for sleep.",choices:[{label:"Knock to wake her before she falls",reply:"Rosa steadies herself, startled but grateful. She turns off the kettle.",gesture:"relief",shift:{safety:.3,fatigue:-.05}},{label:"Let her rest",reply:"She drifts to the floor and sleeps against the cupboard. The kettle begins to whistle.",gesture:"sleep",shift:{fatigue:-.18}}]},
      {text:"The screen of her phone fills with missed calls. Rosa looks at the scrubs, then at the unpaid rent notice.",clue:"The hospital keeps calling; rent is overdue.",choices:[{label:"Offer a silent wave of support",reply:"She raises two fingers in response and finally sits down to eat.",gesture:"eat",shift:{connection:.28,hunger:.25}},{label:"Keep your distance",reply:"She puts on her scrubs again. The tea is untouched.",gesture:"work",shift:{fatigue:.17}}]},
      {text:"Rosa has opened the window a crack. A little paper sign reads: 'THANK YOU FOR NOT ASKING QUESTIONS.'",clue:"Rosa knows she has been seen, and is grateful for kindness.",choices:[{label:"Move to the next apartment",reply:"You hear a laugh behind the glass. The kind that comes after an impossible week.",gesture:"relief",shift:{stress:-.3}}]}
    ]
  },
  {
    id:"neighbors",floor:6,col:1,title:"Across the Divide",genre:"LONGING / ROMANCE",theme:"studio",
    description:"Two desks back to back. Notes attached to the shared wall. Separate mugs, matching flowers.",
    cast:[{name:"Noah",age:28,look:"soft",hair:"curly",clothes:"beige",skin:2,needs:{connection:.27,desire:.75},motive:"belonging"},{name:"Mina",age:29,look:"sharp",hair:"bob",clothes:"blue",skin:3,needs:{connection:.44,desire:.69},motive:"belonging"}],
    props:["desk","desk","chair","books","plant","notes","lamp","cup"],
    beats:[
      {text:"Noah writes a note on the wall: 'ARE YOU STILL AWAKE?' A moment later another note appears from behind the bookshelf: 'ALWAYS.'",clue:"The two people have built a secret correspondence through the wall.",choices:[{label:"Wait for the reply",reply:"Mina presses her hand against the partition. Noah mirrors it on the other side.",gesture:"tender",shift:{connection:.22}},{label:"Tap a rhythm on the window",reply:"They both turn toward you and burst out laughing. The tension breaks.",gesture:"laugh",shift:{fear:-.14}}]},
      {text:"A small hole has been drilled through the separating shelf. They pass a daisy through it, petal by petal.",clue:"The shared wall has a hole large enough to pass small gifts.",choices:[{label:"Signal that the hallway is empty",reply:"Noah quietly slips out the door. Moments later, they are together at the window.",gesture:"embrace",shift:{connection:.36,desire:.18}},{label:"Respect the moment",reply:"Mina leans into the wall, eyes closed, smiling at a voice you can't hear.",gesture:"dream",shift:{connection:.2}}]},
      {text:"The desks now face one another. A single vase stands between them. There is no longer a bookshelf against the shared wall.",clue:"The neighboring rooms have become one home.",choices:[{label:"Smile and continue",reply:"They wave together as you descend into the rain.",gesture:"wave",shift:{connection:.2}}]}
    ]
  },
  {
    id:"greenhouse",floor:5,col:2,title:"The Greenhouse",genre:"OBSESSION / WONDER",theme:"plants",
    description:"The wallpaper has disappeared beneath vines. Plants reach toward the glass like fingers.",
    cast:[{name:"Iris",age:36,look:"wild",hair:"curly",clothes:"green",skin:2,needs:{curiosity:.95,connection:.19},motive:"control"}],
    props:["plant","plant","plant","plant","shelf","lamp","vase","journal"],
    beats:[
      {text:"Iris measures the growth of a vine. A branch curls against the light and traces a deliberate circle on the window.",clue:"The vines appear to respond to observation, not simply sunlight.",choices:[{label:"Trace the same circle in the grime",reply:"The vine curls closer. Iris drops her measuring tape.",gesture:"wonder",shift:{curiosity:.18,fear:.12}},{label:"Keep the glass clean",reply:"Iris places a small handwritten DON'T against the glass.",gesture:"window",shift:{fear:.2}}]},
      {text:"Every clock in the room is buried in leaves. Iris's notebook shows diagrams of roots connecting apartments through the walls.",clue:"Iris believes the building's plant roots form a nervous system.",choices:[{label:"Test the leaves with one gentle tap",reply:"All the plants turn in the same direction. Downstairs, a lamp flashes twice.",gesture:"fear",shift:{fear:.15}},{label:"Let her experiment",reply:"She brushes a leaf as though it were a frightened animal.",gesture:"tender",shift:{connection:.15}}]},
      {text:"A single flower blooms directly against the newly cleaned patch. It has the precise shape of a human eye.",clue:"The strange flower appears only where the glass was cleared.",choices:[{label:"Record the flower",reply:"Iris holds a hand up to the window, palm to palm, separated by one thin sheet of glass.",gesture:"window",shift:{curiosity:.2}}]}
    ]
  },
  {
    id:"three-knocks",floor:4,col:0,title:"Three Knocks",genre:"SUSPENSE / INSTINCT",theme:"workshop",
    description:"An improvised workbench. A locked metal box. Scuff marks by the front door.",
    cast:[{name:"Ed",age:54,look:"broad",hair:"bald",clothes:"brown",skin:1,needs:{safety:.13,fear:.72},motive:"protection"}],
    props:["table","box","tools","lamp","chair","papers","clock"],
    beats:[
      {text:"Ed opens a box, peeks inside and immediately closes it. Someone knocks three times on the apartment door. He does not answer.",clue:"Three knocks are followed by a pause of exactly thirteen seconds.",choices:[{label:"Knock three times on the glass",reply:"Ed backs away in terror, then notices the squeegee and lets out a short, disbelieving laugh.",gesture:"panic",shift:{fear:.3}},{label:"Wait in silence",reply:"A piece of paper slides beneath his door. Ed burns it without reading.",gesture:"freeze",shift:{fear:.2}}]},
      {text:"The door handle turns slowly. Ed holds the box against his chest and turns all the lights off.",clue:"Someone outside has access to the apartment door.",choices:[{label:"Flash your work light to warn him",reply:"Ed bolts the door. The handle stops moving. He nods toward you.",gesture:"relief",shift:{safety:.4}},{label:"Keep your eyes on the hallway",reply:"You see a second shadow appear beneath the door. Then both are gone.",gesture:"hide",shift:{fear:.3}}]},
      {text:"The box is open. Inside is a collection of apartment keys, every one labeled with a different floor.",clue:"Ed holds keys to almost every apartment in the building.",choices:[{label:"Make a note of the keys",reply:"He looks up. For the first time, he seems more afraid of you than of the door.",gesture:"window",shift:{fear:.2}}]}
    ]
  },
  {
    id:"moving",floor:3,col:1,title:"Moving Out",genre:"MYSTERY / LOSS",theme:"boxes",
    description:"Sealed moving boxes. Labels scratched away. A dusty rectangle where a photograph used to hang.",
    cast:[{name:"Finn",age:33,look:"slim",hair:"dark",clothes:"gray",skin:0,needs:{stress:.75,safety:.26},motive:"escape"}],
    props:["boxes","boxes","sofa","box","lamp","photo","chair"],
    beats:[
      {text:"Finn stuffs photographs into a cardboard box. Every photo is of the same woman. In the corner stands a packed suitcase with no handle.",clue:"The moving boxes have no destination address.",choices:[{label:"Read a label through the glass",reply:"Every box says 'RETURN TO SENDER,' in Finn's own handwriting.",gesture:"work",shift:{stress:.12}},{label:"Tap to offer a hand",reply:"He mouths 'DON'T COME IN.' Then points urgently at the ceiling.",gesture:"panic",shift:{fear:.2}}]},
      {text:"Finn is still packing the same three boxes. The clock jumps forward, but the room never seems to empty.",clue:"The same boxes are being repeatedly filled and unpacked.",choices:[{label:"Keep watching the clock",reply:"The minute hand spins once. Finn vanishes behind a box and never comes out.",gesture:"hide",shift:{fear:.2}},{label:"Give him a moment alone",reply:"Finn sits beside the suitcase and closes his eyes. You hear the elevator rise.",gesture:"rest",shift:{stress:-.15}}]},
      {text:"The apartment is empty except for one chair facing the window. A blank moving label hangs from its back.",clue:"All signs of the move have vanished overnight.",choices:[{label:"Leave the label untouched",reply:"On your way down, you hear a box scrape across an empty floor.",gesture:"window",shift:{fear:.15}}]}
    ]
  },
  {
    id:"waltz",floor:2,col:2,title:"One Last Waltz",genre:"LOVE / MEMORY",theme:"vintage",
    description:"An old record player, photographs of a dance hall, and a wooden floor worn smooth.",
    cast:[{name:"Hugo",age:79,look:"elder",hair:"silver",clothes:"maroon",skin:1,needs:{connection:.2,fatigue:.53},motive:"belonging"}],
    props:["record","chair","lamp","photos","flowers","table","books"],
    beats:[
      {text:"Hugo puts on a record and dances with someone who isn't there. His left hand holds the shape of an absent shoulder.",clue:"The same dance hall appears in all his photographs.",choices:[{label:"Watch until the song ends",reply:"He bows to an empty chair. For a few seconds he looks forty years younger.",gesture:"dance",shift:{connection:.2}},{label:"Give a small wave",reply:"He bows to you with the grace of a man who has practiced for a lifetime.",gesture:"wave",shift:{connection:.14}}]},
      {text:"A woman in a blue coat stands beside Hugo. He reaches for her; she steps backward, out of the lamplight, and is gone.",clue:"Hugo's dance partner appeared only within the lamplight.",choices:[{label:"Look again where she stood",reply:"There are two sets of footprints in the dust on the floor.",gesture:"wonder",shift:{fear:.08}},{label:"Let the music continue",reply:"He closes his eyes and dances through the last refrain, smiling.",gesture:"dance",shift:{connection:.2}}]},
      {text:"The record has stopped. Hugo sits peacefully, holding a blue coat on his knees. He seems to have found what he was looking for.",clue:"The missing blue coat has returned.",choices:[{label:"Leave quietly",reply:"Even through the rain, you can almost hear the final note.",gesture:"rest",shift:{stress:-.14}}]}
    ]
  },
  {
    id:"witness",floor:1,col:0,title:"The Witness",genre:"REVELATION / DANGER",theme:"detective",
    description:"Pinned photographs, newspaper clippings, a telescope, and a map of the tower.",
    cast:[{name:"Nell",age:42,look:"sharp",hair:"bob",clothes:"black",skin:3,needs:{curiosity:.96,safety:.19},motive:"truth"}],
    props:["desk","photos","maps","lamp","phone","papers","camera","chair"],
    beats:[
      {text:"Nell has covered the wall with photographs of the residents. In the middle is a photograph of a window cleaner. She's been watching you watch them.",clue:"Nell's investigation includes your platform and every other inhabited floor.",choices:[{label:"Approach the glass",reply:"Nell lifts a sign: 'WHO TOLD YOU TO CLEAN THIS BUILDING?'",gesture:"window",shift:{fear:.2}},{label:"Pretend you haven't seen her",reply:"She turns a photograph over. On its back is tomorrow's date.",gesture:"point",shift:{stress:.18}}]},
      {text:"Nell traces a red thread from the radio on floor eleven to the empty chair on floor nine. She points at the window, demanding your attention.",clue:"The radio transmissions and altered photographs may be connected.",choices:[{label:"Signal that you understand",reply:"She holds up a last card: 'LOOK AT THE REFLECTION.'",gesture:"point",shift:{connection:.15}},{label:"Step back to see the whole tower",reply:"In the glass, for one blink, your reflection seems to move before you do.",gesture:"freeze",shift:{fear:.29}}]},
      {text:"A new photo is pinned to the wall. It shows you looking through this very window. Beneath it Nell has written: 'THE LAST WITNESS.'",clue:"Someone anticipated the moment you found Nell.",choices:[{label:"Finish your shift",reply:"The last window gleams. But in the reflection you can still see a thirteenth floor.",gesture:"window",shift:{fear:.22}}]}
    ]
  }
];

export const AMBIENT_EVENTS = [
  "A kettle starts to whistle. Nobody moves to turn it off.",
  "Someone laughs at a message, then immediately looks worried.",
  "A shadow passes behind a curtain. The room seems empty.",
  "The resident looks straight at you, then pretends they didn't.",
  "A glass tips over. They stare at the spill for an unusually long time.",
  "A phone lights up for a third time. They turn it face down.",
  "For a moment the music is loud enough to feel through the glass.",
  "A cat jumps onto the table, scattering the evening's careful work.",
  "They reach for a photograph, hesitate, and put it back.",
  "The room goes dark. A small lamp clicks on near the window.",
  "Someone tries to say something, but the pane turns words into silence.",
  "A hand appears through the curtain, brushing dust from the sill."
];

export const ROOM_NAMES = ["Apartment","A Quiet Room","A Light Left On","After Hours","Domestic Scene","Someone's Home"];
export const FIRST_LINES = [
  "There is a strange intimacy in seeing someone who cannot hear you.",
  "A window is only a boundary until someone looks back.",
  "The rain edits every conversation into silence.",
  "You are here to clean the glass. Not to understand the people.",
  "Every apartment has a different kind of loneliness.",
  "For a moment, the city feels like it is holding its breath."
];
export function findStory(floor,col){return STORIES.find(s=>s.floor===floor&&s.col===col)||null}
