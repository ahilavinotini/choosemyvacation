// Quiz content, scoring weights and recommendations.
// NOTE: destinations, 3-day plans and weights are placeholder content from the
// design prototype — confirm with product before shipping.

export type ArchetypeKey = 'bali' | 'alps' | 'tokyo' | 'paris';
export type Side = 'L' | 'R';
/** Answer id, e.g. "1L" = question 1, left answer. */
export type AnswerId = `${1 | 2 | 3 | 4 | 5}${Side}`;
export type Weights = Partial<Record<ArchetypeKey, number>>;

export interface Question {
  cat: string;
  prompt: string;
  left: string;
  right: string;
  L: Weights;
  R: Weights;
}

export interface Destination {
  name: string;
  line: string;
  when: string;
  tags: AnswerId[];
  days: [string, string, string];
}

export interface Archetype {
  code: string;
  titleA: string;
  titleB: string;
  bg: string;
  fg: string;
  blurb: string;
  recs: Destination[];
}

export const QUESTIONS: Question[] = [
  { cat: 'Morning', prompt: 'Morning of day 1?', left: 'Beach & sunscreen', right: 'Hike before sunrise', L: { bali: 3, paris: 1 }, R: { alps: 3, tokyo: 1 } },
  { cat: 'Packing', prompt: 'Your suitcase is mostly...', left: 'Swimwear', right: 'Sneakers', L: { bali: 3 }, R: { alps: 3, tokyo: 1 } },
  { cat: 'Dinner', prompt: 'Dinner tonight?', left: 'Street food stall', right: 'Fine dining', L: { tokyo: 3, bali: 1 }, R: { paris: 3, alps: 1 } },
  { cat: 'Afternoon', prompt: 'Free afternoon, you...', left: 'Nap by the pool', right: 'Explore the old town', L: { bali: 2, paris: 1 }, R: { paris: 2, tokyo: 2 } },
  { cat: 'Souvenir', prompt: 'Souvenir you bring home?', left: 'A tan', right: 'A hundred photos', L: { bali: 3 }, R: { tokyo: 2, alps: 1, paris: 1 } },
];

/** Display + tie-break order. */
export const ORDER: ArchetypeKey[] = ['bali', 'alps', 'tokyo', 'paris'];

export const TYPES: Record<ArchetypeKey, Archetype> = {
  bali: {
    code: 'DPS · Tropics', titleA: 'Bali Beach', titleB: 'Bum', bg: '#FF8C42', fg: '#111111',
    blurb: 'Your ideal itinerary has one item on it: the sea. Warm water, a long lunch, and nowhere to be before sunset.',
    recs: [
      { name: 'Uluwatu, Bali', line: 'Cliff-top beach clubs, surf breaks and sunset temples.', when: 'Apr – Oct', tags: ['1L', '2L', '4L', '5L', '3L'],
        days: ['Padang Padang beach, then a long lunch at a warung.', 'Surf lesson in the morning, pool until sundown.', 'Kecak dance at Uluwatu Temple at dusk.'] },
      { name: 'Siargao, Philippines', line: 'Island hopping, palm roads and zero dress code.', when: 'Mar – Oct', tags: ['1L', '2L', '5L', '3L'],
        days: ['Scooter to Magpupungko rock pools.', 'Island-hop Naked, Daku and Guyam.', 'Cloud 9 boardwalk, then hammock time.'] },
      { name: 'Tulum, Mexico', line: 'Cenotes, taco stands and white-sand mornings.', when: 'Nov – Apr', tags: ['1L', '2L', '3L', '4L', '4R'],
        days: ['Beach club and ruins on the same stretch of sand.', 'Swim two cenotes, tacos al pastor for dinner.', 'Bike into town for mezcal and a late night.'] },
    ],
  },
  alps: {
    code: 'ZRH · Altitude', titleA: 'Swiss Alps', titleB: 'Adventurer', bg: '#4BFFC8', fg: '#111111',
    blurb: 'You set an alarm on vacation, on purpose. Thin air, a trail map, and a view you had to earn.',
    recs: [
      { name: 'Zermatt, Switzerland', line: 'Car-free village under the Matterhorn.', when: 'Jun – Sep', tags: ['1R', '2R', '3R', '5R'],
        days: ['Sunrise at Gornergrat, fondue at night.', 'Five Lakes Walk with Matterhorn reflections.', 'Cable car to Glacier Paradise.'] },
      { name: 'Dolomites, Italy', line: 'Hut-to-hut hiking with pasta at every stop.', when: 'Jun – Sep', tags: ['1R', '2R', '3R', '4R', '5R'],
        days: ['Tre Cime loop, lunch at Rifugio Locatelli.', 'Seceda ridge at golden hour.', 'Lago di Braies, then Cortina old town.'] },
      { name: 'Banff, Canada', line: 'Glacier lakes, big trails and hot springs after.', when: 'Jun – Sep', tags: ['1R', '2R', '5R', '4L'],
        days: ['Moraine Lake at sunrise before the crowds.', 'Plain of Six Glaciers to the teahouse.', 'Banff Upper Hot Springs to recover.'] },
    ],
  },
  tokyo: {
    code: 'HND · Neon', titleA: 'Tokyo', titleB: 'Explorer', bg: '#7B5CF5', fg: '#FFFDF5',
    blurb: 'You walk 30,000 steps and call it rest. Back alleys, late-night noodles, and a camera roll that needs its own trip.',
    recs: [
      { name: 'Tokyo, Japan', line: 'A different neighborhood every few train stops.', when: 'Mar – May, Oct – Nov', tags: ['3L', '4R', '5R', '1R'],
        days: ['Yanaka old streets, then yakitori under the tracks.', 'Shimokitazawa vintage, Shibuya at night.', 'Day hike up Mt. Takao, ramen after.'] },
      { name: 'Seoul, South Korea', line: 'Night markets, palaces and hills inside the city.', when: 'Apr – Jun, Sep – Nov', tags: ['3L', '4R', '5R', '1R', '2R'],
        days: ['Bukchon hanok village, Gwangjang Market dinner.', 'Sunrise hike on Bukhansan.', 'Seongsu cafés and Hongdae at night.'] },
      { name: 'Taipei, Taiwan', line: 'The best night markets in Asia, with mountains on the edge.', when: 'Oct – Apr', tags: ['3L', '4R', '5R', '1R'],
        days: ['Dadaocheng old town, Raohe Night Market.', 'Elephant Mountain at sunrise.', 'Train to Jiufen and its lantern alleys.'] },
    ],
  },
  paris: {
    code: 'CDG · Table for two', titleA: 'Parisian', titleB: 'Foodie', bg: '#F5FF4B', fg: '#111111',
    blurb: 'You plan the trip around the reservations. A long lunch is a sight, and a good bakery is a landmark.',
    recs: [
      { name: 'Paris, France', line: 'Tasting menus, corner bistros and a croissant for every walk.', when: 'Apr – Jun, Sep – Oct', tags: ['3R', '4R', '5R'],
        days: ['Le Marais on foot, dinner at a bistronomy spot.', 'Market morning at Rue Cler, tasting menu at night.', 'Montmartre, then wine bars in the 11th.'] },
      { name: 'Lyon, France', line: "France's food capital, at half the crowd.", when: 'May – Sep', tags: ['3R', '4R', '4L'],
        days: ['Vieux Lyon traboules, dinner at a bouchon.', 'Les Halles Paul Bocuse for lunch.', 'Day trip to Beaujolais vineyards.'] },
      { name: 'San Sebastián, Spain', line: 'Pintxos bars, Michelin stars and a city beach.', when: 'Jun – Sep', tags: ['3R', '3L', '4R', '1L', '4L'],
        days: ['Pintxos crawl in Parte Vieja.', 'La Concha beach, then a long tasting menu.', 'Walk up Monte Urgull, cider house dinner.'] },
    ],
  },
};

/** Miles added to the header counter per answered question. */
export const MILES_PER_STOP = 1240;
