export const PAGES: Record<string, { h1: string; intro: string; how: string; tips: string[]; faq: string[][] }> = {
 "home": {
  "h1": "Pick something. Let chance decide.",
  "intro": "Type your names, spin the wheel, and pick a winner. More free random tools are one tap away.",
  "how": "Type one name per line in the box. The wheel updates as you type. Press Spin and the winner appears in a pop-up. Choose Remove to take that name off the list, or Close to keep it.",
  "tips": [
   "Paste a whole class list at once.",
   "Use Remove to pick several winners in a row.",
   "Shuffle changes the order on the wheel."
  ],
  "faq": [
   [
    "Is the pick fair?",
    "Yes. The winner is chosen with your browser's secure random generator."
   ],
   [
    "Are my names saved?",
    "Only in your browser. They are never sent anywhere."
   ]
  ]
 },
 "yes-or-no-wheel": {
  "h1": "Yes or No Wheel",
  "intro": "Can't decide? Ask your question, then spin.",
  "how": "Type your question in your head, press Spin, and the wheel lands on Yes or No. You can add extra options such as Maybe, or remove the winner after each spin.",
  "tips": [
   "Say the question out loud before you spin so it feels fair.",
   "Add \"Maybe\" or \"Ask again\" for a more playful wheel.",
   "Use \"Remove winner\" to run elimination rounds."
  ],
  "faq": [
   [
    "Is the wheel fair?",
    "Yes. The result is picked with your browser's secure random generator, and the wheel is then animated to land on it."
   ],
   [
    "Can I add more options?",
    "Yes. Add, edit, or remove options and they are saved in your browser."
   ]
  ]
 },
 "flip-a-coin": {
  "h1": "Flip a Coin",
  "intro": "Heads or tails, decided in a second.",
  "how": "Press Flip. The coin turns and lands on heads or tails. The counters keep track of how many times each side came up, and Reset clears them.",
  "tips": [
   "Call heads or tails before you flip.",
   "Run best-of-three by watching the counters.",
   "Reset the count to start a fresh game."
  ],
  "faq": [
   [
    "Is it really 50/50?",
    "Yes. Each flip uses a secure random number, so heads and tails are equally likely."
   ],
   [
    "Are my counts saved?",
    "They are saved only in your browser."
   ]
  ]
 },
 "random-number-generator": {
  "h1": "Random Number Generator",
  "intro": "Set a range, get fair random numbers.",
  "how": "Enter a minimum, a maximum, and how many numbers you want. Turn on No duplicates to draw each number only once, like a raffle.",
  "tips": [
   "Use No duplicates for raffles and lucky draws.",
   "Negative numbers work too.",
   "Use Copy to paste the list elsewhere."
  ],
  "faq": [
   [
    "Can I get numbers without repeats?",
    "Yes. Turn on No duplicates. The count cannot be bigger than the size of the range."
   ],
   [
    "How many numbers at once?",
    "Up to 100."
   ]
  ]
 },
 "what-to-eat-wheel": {
  "h1": "What to Eat Wheel",
  "intro": "Stop arguing about dinner. Spin.",
  "how": "Spin for a starting idea, or replace the choices with your own favourite places and dishes. Your list is saved in your browser.",
  "tips": [
   "Replace the defaults with places near you.",
   "Use Remove winner to build a shortlist.",
   "Add a \"Cook at home\" slice."
  ],
  "faq": [
   [
    "Can I use my own food list?",
    "Yes. Edit, add, or remove any option."
   ],
   [
    "Is my list private?",
    "Yes. It stays in your browser."
   ]
  ]
 },
 "team-picker": {
  "h1": "Team Picker",
  "intro": "Paste names. Get fair teams.",
  "how": "Paste one name per line, or separate them with commas. Choose how many teams and press Make teams. Press again to reshuffle.",
  "tips": [
   "Teams are as even as possible.",
   "Duplicate names are kept, so add a last initial if needed.",
   "Use Copy teams to share in a chat."
  ],
  "faq": [
   [
    "What if names do not divide evenly?",
    "Some teams get one extra person."
   ],
   [
    "Are the names stored?",
    "No. They stay on your page and are not sent anywhere."
   ]
  ]
 }
}
export const TOOLS = [
 {
  "path": "/",
  "name": "Wheel of Names",
  "line": "Type names, spin, pick a winner."
 },
 {
  "path": "/yes-or-no-wheel",
  "name": "Yes or No Wheel",
  "line": "Spin to decide. Free, instant."
 },
 {
  "path": "/flip-a-coin",
  "name": "Flip a Coin",
  "line": "Heads or tails in one tap."
 },
 {
  "path": "/random-number-generator",
  "name": "Random Number Generator",
  "line": "Pick numbers in any range."
 },
 {
  "path": "/what-to-eat-wheel",
  "name": "What to Eat Wheel",
  "line": "Spin for dinner."
 },
 {
  "path": "/team-picker",
  "name": "Team Picker",
  "line": "Split names into fair teams."
 }
]
