import fs from 'fs';
import path from 'path';

const ANIMAL_PAGES = [
  // Farm
  { id: 'goat', name: 'Goat', emoji: '🐐', category: 'farm', soundType: 'goat', funFact: 'Goats were one of the first animals to be tamed by humans and were being herded 9,000 years ago.', wiki: 'Goat' },
  { id: 'donkey', name: 'Donkey', emoji: '🫏', category: 'farm', soundType: 'donkey', funFact: 'Donkeys have an incredible memory and can recognize areas and other donkeys they were with up to 25 years ago.', wiki: 'Donkey' },
  { id: 'turkey', name: 'Turkey', emoji: '🦃', category: 'farm', soundType: 'turkey', funFact: 'Wild turkeys can fly at speeds of up to 55 miles per hour over short distances.', wiki: 'Wild_turkey' },
  { id: 'llama', name: 'Llama', emoji: '🦙', category: 'farm', soundType: 'llama', funFact: 'Llamas know their own limits. If you try to overload a llama with too much weight, it will simply lie down or refuse to move.', wiki: 'Llama' },
  { id: 'alpaca', name: 'Alpaca', emoji: '🦙', category: 'farm', soundType: 'alpaca', funFact: 'Alpacas hum when they are curious, content, worried, bored, fearful, distressed or cautious.', wiki: 'Alpaca' },
  { id: 'goose', name: 'Goose', emoji: '🪿', category: 'farm', soundType: 'goose', funFact: 'Geese fly in a V formation which allows them to fly 71% further than if they flew alone.', wiki: 'Greylag_goose' },
  { id: 'rooster', name: 'Rooster', emoji: '🐓', category: 'farm', soundType: 'rooster', funFact: 'A rooster will often crow to establish its territory and warn other roosters to stay away.', wiki: 'Rooster' },
  { id: 'buffalo', name: 'Water Buffalo', emoji: '🐃', category: 'farm', soundType: 'buffalo', funFact: 'Water buffalo are often used to plow rice paddies in Asia.', wiki: 'Water_buffalo' },
  { id: 'ox', name: 'Ox', emoji: '🐂', category: 'farm', soundType: 'ox', funFact: 'Oxen are commonly castrated adult male cattle used as draft animals.', wiki: 'Ox' },
  { id: 'camel', name: 'Camel', emoji: '🐪', category: 'farm', soundType: 'camel', funFact: 'Camels have three sets of eyelids and two rows of eyelashes to keep sand out of their eyes.', wiki: 'Dromedary' },
  { id: 'bactrian-camel', name: 'Bactrian Camel', emoji: '🐫', category: 'farm', soundType: 'camel', funFact: 'Unlike the dromedary, Bactrian camels have two humps.', wiki: 'Bactrian_camel' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', category: 'farm', soundType: 'rabbit', funFact: 'A rabbit’s teeth never stop growing, so they need to constantly chew to wear them down.', wiki: 'Rabbit' },

  // Wild
  { id: 'gorilla', name: 'Gorilla', emoji: '🦍', category: 'wild', soundType: 'gorilla', funFact: 'Gorillas can catch human colds and other illnesses.', wiki: 'Gorilla' },
  { id: 'rhino', name: 'Rhinoceros', emoji: '🦏', category: 'wild', soundType: 'rhino', funFact: 'A rhinoceros horn is made of keratin, the same protein that makes up human hair and nails.', wiki: 'Rhinoceros' },
  { id: 'kangaroo', name: 'Kangaroo', emoji: '🦘', category: 'wild', soundType: 'kangaroo', funFact: 'Kangaroos cannot walk backwards because of the shape of their legs and their large muscular tail.', wiki: 'Kangaroo' },
  { id: 'koala', name: 'Koala', emoji: '🐨', category: 'wild', soundType: 'koala', funFact: 'Koalas sleep for up to 22 hours a day because their diet of eucalyptus leaves provides very little energy.', wiki: 'Koala' },
  { id: 'panda', name: 'Giant Panda', emoji: '🐼', category: 'wild', soundType: 'panda', funFact: 'Giant pandas spend 10-16 hours a day eating bamboo.', wiki: 'Giant_panda' },
  { id: 'sloth', name: 'Sloth', emoji: '🦥', category: 'wild', soundType: 'sloth', funFact: 'Sloths are so slow that algae can actually grow on their fur.', wiki: 'Sloth' },
  { id: 'leopard', name: 'Leopard', emoji: '🐆', category: 'wild', soundType: 'leopard', funFact: 'Leopards are excellent climbers and often drag their prey up into trees to keep it safe from scavengers.', wiki: 'Leopard' },
  { id: 'hyena', name: 'Hyena', emoji: '🐆', category: 'wild', soundType: 'hyena', funFact: 'Spotted hyenas are more closely related to cats than dogs, despite their dog-like appearance.', wiki: 'Spotted_hyena' },
  { id: 'meerkat', name: 'Meerkat', emoji: '🦦', category: 'wild', soundType: 'meerkat', funFact: 'Meerkats are immune to venom from many snakes and scorpions.', wiki: 'Meerkat' },
  { id: 'mongoose', name: 'Mongoose', emoji: '🦦', category: 'wild', soundType: 'mongoose', funFact: 'Some species of mongoose are known for their ability to fight and kill venomous snakes.', wiki: 'Mongoose' },
  { id: 'fox', name: 'Fox', emoji: '🦊', category: 'wild', soundType: 'fox', funFact: 'Foxes use the Earth’s magnetic field to hunt, judging the distance and direction of their prey before pouncing.', wiki: 'Red_fox' },
  { id: 'raccoon', name: 'Raccoon', emoji: '🦝', category: 'wild', soundType: 'raccoon', funFact: 'Raccoons have highly sensitive hands that become even more sensitive when wet.', wiki: 'Raccoon' },
  { id: 'moose', name: 'Moose', emoji: '🦌', category: 'wild', soundType: 'moose', funFact: 'Moose are excellent swimmers and can dive up to 5 meters to feed on aquatic plants.', wiki: 'Moose' },
  { id: 'deer', name: 'Deer', emoji: '🦌', category: 'wild', soundType: 'deer', funFact: 'Male deer grow new antlers every year, which are covered in a fuzzy skin called velvet.', wiki: 'Deer' },
  { id: 'reindeer', name: 'Reindeer', emoji: '🦌', category: 'wild', soundType: 'reindeer', funFact: 'Reindeer are the only deer species where both males and females grow antlers.', wiki: 'Reindeer' },
  { id: 'boar', name: 'Wild Boar', emoji: '🐗', category: 'wild', soundType: 'boar', funFact: 'Wild boars use their hardened snouts to dig for roots and tubers in the ground.', wiki: 'Wild_boar' },
  { id: 'bison', name: 'Bison', emoji: '🦬', category: 'wild', soundType: 'bison', funFact: 'Bison can weigh up to 2,000 pounds and run at speeds of up to 35 miles per hour.', wiki: 'American_bison' },
  { id: 'badger', name: 'Badger', emoji: '🦡', category: 'wild', soundType: 'badger', funFact: 'Badgers create complex underground burrow systems called setts, which can be centuries old.', wiki: 'European_badger' },
  { id: 'hedgehog', name: 'Hedgehog', emoji: '🦔', category: 'wild', soundType: 'hedgehog', funFact: 'A hedgehog has between 5,000 and 7,000 quills on its back.', wiki: 'Hedgehog' },
  { id: 'skunk', name: 'Skunk', emoji: '🦨', category: 'wild', soundType: 'skunk', funFact: 'Skunks can spray their stinky scent up to 10 feet away.', wiki: 'Striped_skunk' },
  { id: 'bat', name: 'Bat', emoji: '🦇', category: 'wild', soundType: 'bat', funFact: 'Bats are the only mammals capable of true sustained flight.', wiki: 'Bat' },
  { id: 'monkey', name: 'Monkey', emoji: '🐒', category: 'wild', soundType: 'monkey', funFact: 'Capuchin monkeys use rocks as tools to crack open hard nuts.', wiki: 'Capuchin_monkey' },
  { id: 'orangutan', name: 'Orangutan', emoji: '🦧', category: 'wild', soundType: 'orangutan', funFact: 'Orangutans share 96.4% of our genes and are highly intelligent apes.', wiki: 'Orangutan' },
  { id: 'lemur', name: 'Lemur', emoji: '🐒', category: 'wild', soundType: 'lemur', funFact: 'Lemurs are native only to the island of Madagascar.', wiki: 'Ring-tailed_lemur' },
  { id: 'baboon', name: 'Baboon', emoji: '🐒', category: 'wild', soundType: 'baboon', funFact: 'Baboons have dog-like muzzles and powerful jaws.', wiki: 'Baboon' },
  { id: 'squirrel', name: 'Squirrel', emoji: '🐿️', category: 'wild', soundType: 'squirrel', funFact: 'Squirrels plant thousands of new trees each year simply by forgetting where they buried their acorns.', wiki: 'Eastern_gray_squirrel' },
  { id: 'chipmunk', name: 'Chipmunk', emoji: '🐿️', category: 'wild', soundType: 'chipmunk', funFact: 'A chipmunk can stuff its cheek pouches with food until they expand to three times the size of its head.', wiki: 'Eastern_chipmunk' },
  { id: 'beaver', name: 'Beaver', emoji: '🦫', category: 'wild', soundType: 'beaver', funFact: 'Beavers have orange teeth because they contain iron, which makes them stronger for chewing wood.', wiki: 'North_American_beaver' },
  { id: 'armadillo', name: 'Armadillo', emoji: '🪖', category: 'wild', soundType: 'armadillo', funFact: 'Nine-banded armadillos nearly always give birth to four identical quadruplets.', wiki: 'Nine-banded_armadillo' },
  { id: 'wolverine', name: 'Wolverine', emoji: '🐻', category: 'wild', soundType: 'wolverine', funFact: 'Wolverines have a reputation for ferocity and strength out of proportion to their size.', wiki: 'Wolverine' },

  // Sea
  { id: 'walrus', name: 'Walrus', emoji: '🦭', category: 'sea', soundType: 'walrus', funFact: 'Walruses use their long tusks to pull themselves out of the water and onto the ice.', wiki: 'Walrus' },
  { id: 'seal', name: 'Seal', emoji: '🦭', category: 'sea', soundType: 'seal', funFact: 'Seals can hold their breath for up to two hours underwater.', wiki: 'Harbor_seal' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', category: 'sea', soundType: 'penguin', funFact: 'Penguins possess a gland above their eyes that converts seawater into freshwater.', wiki: 'Emperor_penguin' },
  { id: 'orca', name: 'Orca (Killer Whale)', emoji: '🐋', category: 'sea', soundType: 'orca', funFact: 'Orcas are actually the largest species of the dolphin family.', wiki: 'Orca' },
  { id: 'beluga', name: 'Beluga Whale', emoji: '🐳', category: 'sea', soundType: 'beluga', funFact: 'Beluga whales can change the shape of their bulbous foreheads, called "melons," by blowing air around their sinuses.', wiki: 'Beluga_whale' },
  { id: 'humpback-whale', name: 'Humpback Whale', emoji: '🐋', category: 'sea', soundType: 'whale', funFact: 'Humpback whales are known for their magical and complex songs, which can last for hours.', wiki: 'Humpback_whale' },
  { id: 'narwhal', name: 'Narwhal', emoji: '🦄', category: 'sea', soundType: 'whale', funFact: 'The narwhal’s "horn" is actually an elongated upper left canine tooth.', wiki: 'Narwhal' },
  { id: 'manatee', name: 'Manatee', emoji: '🧜', category: 'sea', soundType: 'manatee', funFact: 'Manatees are closely related to elephants, not to other marine mammals like whales or dolphins.', wiki: 'Manatee' },
  { id: 'crab', name: 'Crab', emoji: '🦀', category: 'sea', soundType: 'crab', funFact: 'Crabs communicate with each other by drumming or waving their pincers.', wiki: 'Crab' },
  { id: 'lobster', name: 'Lobster', emoji: '🦞', category: 'sea', soundType: 'lobster', funFact: 'Lobsters chew their food in their stomachs, not in their mouths.', wiki: 'Lobster' },
  { id: 'shrimp', name: 'Shrimp', emoji: '🦐', category: 'sea', soundType: 'shrimp', funFact: 'The heart of a shrimp is located in its head.', wiki: 'Shrimp' },
  { id: 'squid', name: 'Squid', emoji: '🦑', category: 'sea', soundType: 'squid', funFact: 'Giant squids have eyes the size of dinner plates, the largest in the animal kingdom.', wiki: 'Giant_squid' },
  { id: 'stingray', name: 'Stingray', emoji: '🐡', category: 'sea', soundType: 'stingray', funFact: 'Stingrays are closely related to sharks, and their skeletons are also made of cartilage.', wiki: 'Stingray' },
  { id: 'seahorse', name: 'Seahorse', emoji: '🐎', category: 'sea', soundType: 'seahorse', funFact: 'Male seahorses are the ones who carry and give birth to their young.', wiki: 'Seahorse' },
  { id: 'starfish', name: 'Starfish', emoji: '⭐', category: 'sea', soundType: 'starfish', funFact: 'Starfish can regenerate their own arms, and a single arm can regenerate a whole body.', wiki: 'Starfish' },
  { id: 'coral', name: 'Coral', emoji: '🪸', category: 'sea', soundType: 'coral', funFact: 'Coral reefs are actually made up of millions of tiny animals called polyps.', wiki: 'Coral' },
  { id: 'blowfish', name: 'Pufferfish', emoji: '🐡', category: 'sea', soundType: 'blowfish', funFact: 'Pufferfish can inflate their bodies like balloons to make themselves harder for predators to swallow.', wiki: 'Tetraodontidae' },

  // Birds
  { id: 'swan', name: 'Swan', emoji: '🦢', category: 'birds', soundType: 'swan', funFact: 'Swans mate for life, and when they touch their beaks together, their necks form a heart shape.', wiki: 'Mute_swan' },
  { id: 'peacock', name: 'Peacock', emoji: '🦚', category: 'birds', soundType: 'peacock', funFact: 'Only the males are called peacocks. Females are called peahens, and together they are peafowl.', wiki: 'Peafowl' },
  { id: 'pelican', name: 'Pelican', emoji: '🦤', category: 'birds', soundType: 'pelican', funFact: 'A pelican’s pouch can hold up to 3 gallons of water—more than its stomach can hold.', wiki: 'Pelican' },
  { id: 'stork', name: 'Stork', emoji: '🦩', category: 'birds', soundType: 'stork', funFact: 'Storks use their large bills to catch fish, frogs, and large insects.', wiki: 'White_stork' },
  { id: 'ostrich', name: 'Ostrich', emoji: '🦅', category: 'birds', soundType: 'ostrich', funFact: 'An ostrich’s eye is bigger than its brain.', wiki: 'Common_ostrich' },
  { id: 'emu', name: 'Emu', emoji: '🦅', category: 'birds', soundType: 'emu', funFact: 'Emus cannot walk backwards.', wiki: 'Emu' },
  { id: 'kiwi', name: 'Kiwi', emoji: '🥝', category: 'birds', soundType: 'kiwi', funFact: 'Kiwi birds have nostrils at the end of their beaks, allowing them to sniff out insects underground.', wiki: 'Kiwi' },
  { id: 'woodpecker', name: 'Woodpecker', emoji: '🦜', category: 'birds', soundType: 'woodpecker', funFact: 'Woodpeckers can peck at wood up to 20 times per second.', wiki: 'Woodpecker' },
  { id: 'hummingbird', name: 'Hummingbird', emoji: '🐦', category: 'birds', soundType: 'hummingbird', funFact: 'Hummingbirds are the only birds that can fly backwards.', wiki: 'Hummingbird' },
  { id: 'pigeon', name: 'Pigeon', emoji: '🐦', category: 'birds', soundType: 'pigeon', funFact: 'Pigeons can recognize themselves in a mirror.', wiki: 'Rock_dove' },
  { id: 'crow', name: 'Crow', emoji: '🐦‍⬛', category: 'birds', soundType: 'crow', funFact: 'Crows can recognize individual human faces and remember them for years.', wiki: 'Crow' },
  { id: 'raven', name: 'Raven', emoji: '🐦‍⬛', category: 'birds', soundType: 'raven', funFact: 'Ravens are highly playful and have been observed playing in the snow and sliding down hills.', wiki: 'Common_raven' },
  { id: 'dove', name: 'Dove', emoji: '🕊️', category: 'birds', soundType: 'dove', funFact: 'Doves produce a special milk, called crop milk, to feed their chicks.', wiki: 'Mourning_dove' },
  { id: 'seagull', name: 'Seagull', emoji: '🪶', category: 'birds', soundType: 'seagull', funFact: 'Seagulls have a special pair of glands above their eyes that flushes salt from their systems.', wiki: 'Gull' },
  { id: 'canary', name: 'Canary', emoji: '🐥', category: 'birds', soundType: 'canary', funFact: 'Canaries were once used in coal mines to detect toxic gases.', wiki: 'Domestic_canary' },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', category: 'birds', soundType: 'parrot', funFact: 'Some parrot species can live to be over 80 years old.', wiki: 'Parrot' },
  { id: 'vulture', name: 'Vulture', emoji: '🦅', category: 'birds', soundType: 'vulture', funFact: 'Vultures have stomach acid that is so corrosive it can digest anthrax and botulism toxins without harm.', wiki: 'Vulture' },
  { id: 'falcon', name: 'Falcon', emoji: '🦅', category: 'birds', soundType: 'falcon', funFact: 'The peregrine falcon is the fastest bird in the world, capable of diving at over 240 mph.', wiki: 'Peregrine_falcon' },
  { id: 'hawk', name: 'Hawk', emoji: '🦅', category: 'birds', soundType: 'hawk', funFact: 'A hawk’s vision is roughly eight times sharper than a human’s.', wiki: 'Red-tailed_hawk' },
  { id: 'turkey-vulture', name: 'Turkey Vulture', emoji: '🦅', category: 'birds', soundType: 'vulture', funFact: 'Turkey vultures find their food primarily by smell, rather than sight.', wiki: 'Turkey_vulture' },
  
  // Bugs
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', category: 'bugs', soundType: 'butterfly', funFact: 'Butterflies taste with their feet to find the right plants for their caterpillars.', wiki: 'Butterfly' },
  { id: 'bee', name: 'Bee', emoji: '🐝', category: 'bugs', soundType: 'bee', funFact: 'A honey bee will visit about 50 to 100 flowers during one collection trip.', wiki: 'Honey_bee' },
  { id: 'ladybug', name: 'Ladybug', emoji: '🐞', category: 'bugs', soundType: 'ladybug', funFact: 'Ladybugs can eat up to 5,000 insects in their lifetime.', wiki: 'Coccinellidae' },
  { id: 'ant', name: 'Ant', emoji: '🐜', category: 'bugs', soundType: 'ant', funFact: 'Ants can lift up to 50 times their own body weight.', wiki: 'Ant' },
  { id: 'spider', name: 'Spider', emoji: '🕷️', category: 'bugs', soundType: 'spider', funFact: 'Spider silk is incredibly strong, and is proportionally stronger than steel.', wiki: 'Spider' },
  { id: 'scorpion', name: 'Scorpion', emoji: '🦂', category: 'bugs', soundType: 'scorpion', funFact: 'Scorpions glow under ultraviolet light.', wiki: 'Scorpion' },
  { id: 'mosquito', name: 'Mosquito', emoji: '🦟', category: 'bugs', soundType: 'mosquito', funFact: 'Only female mosquitoes bite, as they need blood to produce their eggs.', wiki: 'Mosquito' },
  { id: 'fly', name: 'Fly', emoji: '🪰', category: 'bugs', soundType: 'fly', funFact: 'Flies hum in the key of F.', wiki: 'Housefly' },
  { id: 'beetle', name: 'Beetle', emoji: '🪲', category: 'bugs', soundType: 'beetle', funFact: 'One out of every four animal species on Earth is a beetle.', wiki: 'Beetle' },
  { id: 'cockroach', name: 'Cockroach', emoji: '🪳', category: 'bugs', soundType: 'cockroach', funFact: 'A cockroach can live for a week without its head.', wiki: 'Cockroach' },
  { id: 'cricket', name: 'Cricket', emoji: '🦗', category: 'bugs', soundType: 'cricket', funFact: 'You can estimate the temperature by counting a cricket’s chirps.', wiki: 'Cricket_(insect)' },
  { id: 'caterpillar', name: 'Caterpillar', emoji: '🐛', category: 'bugs', soundType: 'caterpillar', funFact: 'Caterpillars have 12 eyes, but their vision is very poor.', wiki: 'Caterpillar' },
  { id: 'snail', name: 'Snail', emoji: '🐌', category: 'bugs', soundType: 'snail', funFact: 'A snail can sleep for up to 3 years.', wiki: 'Snail' },
  { id: 'worm', name: 'Worm', emoji: '🪱', category: 'bugs', soundType: 'worm', funFact: 'Earthworms have five hearts.', wiki: 'Earthworm' },

  // Pets / Others
  { id: 'mouse', name: 'Mouse', emoji: '🐭', category: 'wild', soundType: 'mouse', funFact: 'A mouse’s teeth never stop growing, so they have to gnaw on things to wear them down.', wiki: 'House_mouse' },
  { id: 'rat', name: 'Rat', emoji: '🐀', category: 'wild', soundType: 'rat', funFact: 'Rats take care of injured and sick members of their group.', wiki: 'Brown_rat' },
  { id: 'hamster', name: 'Hamster', emoji: '🐹', category: 'wild', soundType: 'hamster', funFact: 'Hamsters are crepuscular, meaning they are most active during the twilight hours.', wiki: 'Hamster' },
  { id: 'guinea-pig', name: 'Guinea Pig', emoji: '🐹', category: 'wild', soundType: 'guinea_pig', funFact: 'When happy, guinea pigs often jump straight up in the air, a move called "popcorning".', wiki: 'Guinea_pig' },
  { id: 'ferret', name: 'Ferret', emoji: '🦦', category: 'wild', soundType: 'ferret', funFact: 'Ferrets love to sleep and can snooze for up to 18 hours a day.', wiki: 'Ferret' },
  { id: 'chinchilla', name: 'Chinchilla', emoji: '🐭', category: 'wild', soundType: 'chinchilla', funFact: 'Chinchillas take dust baths to clean themselves because their fur is too dense for water.', wiki: 'Chinchilla' },
  { id: 'snake', name: 'Snake', emoji: '🐍', category: 'wild', soundType: 'snake', funFact: 'Snakes use their tongues to smell their surroundings.', wiki: 'Snake' },
  { id: 'turtle', name: 'Turtle', emoji: '🐢', category: 'wild', soundType: 'turtle', funFact: 'Turtles have been on Earth for over 200 million years, predating crocodiles and snakes.', wiki: 'Turtle' },
  { id: 'lizard', name: 'Lizard', emoji: '🦎', category: 'wild', soundType: 'lizard', funFact: 'Many lizards can detach their tails to escape from predators, and some can grow them back.', wiki: 'Lizard' },
  { id: 'iguana', name: 'Iguana', emoji: '🦎', category: 'wild', soundType: 'iguana', funFact: 'Iguanas have a "third eye" on top of their head to detect shadows of predatory birds.', wiki: 'Iguana' },
  { id: 'chameleon', name: 'Chameleon', emoji: '🦎', category: 'wild', soundType: 'chameleon', funFact: 'Chameleons change color not just for camouflage, but also to regulate their temperature or show their mood.', wiki: 'Chameleon' },
  { id: 'crocodile', name: 'Crocodile', emoji: '🐊', category: 'wild', soundType: 'crocodile', funFact: 'Crocodiles can replace each of their 80 teeth up to 50 times in their lifetime.', wiki: 'Crocodile' },
  { id: 'alligator', name: 'Alligator', emoji: '🐊', category: 'wild', soundType: 'alligator', funFact: 'An alligator’s sex is determined by the temperature of the nest where its egg was incubated.', wiki: 'American_alligator' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const targetDir = path.resolve('public/assets/animals');

async function fetchWikiImage(pageTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AnimalSoundApp/1.0 (https://github.com/example/animalsoundapp)' },
  });
  if (!res.ok) throw new Error(`Wiki API failed: ${res.status}`);
  const data = await res.json();
  const imageUrl = data.originalimage?.source || data.thumbnail?.source;
  if (!imageUrl) throw new Error(`No image found`);
  return { imageUrl, title: data.title };
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AnimalSoundApp/1.0' },
  });
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  return arrayBuffer.byteLength;
}

async function run() {
  console.log(`Starting download for ${ANIMAL_PAGES.length} new animals...`);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const successful = [];
  
  for (const item of ANIMAL_PAGES) {
    const destFile = path.join(targetDir, `${item.id}.jpg`);
    if (fs.existsSync(destFile) && fs.statSync(destFile).size > 5000) {
      console.log(`[ALREADY EXISTS] ${item.id}`);
      successful.push(item);
      continue;
    }
    try {
      await sleep(1200);
      const { imageUrl } = await fetchWikiImage(item.wiki);
      await sleep(1000);
      await downloadFile(imageUrl, destFile);
      console.log(`[OK] ${item.id}`);
      successful.push(item);
    } catch (err) {
      console.error(`[ERROR] ${item.id}:`, err.message);
    }
  }

  // Update animalsData.ts
  const animalsDataPath = path.resolve('lib/animalsData.ts');
  let dataContent = fs.readFileSync(animalsDataPath, 'utf8');

  // Insert bugs into Habitat
  if (!dataContent.includes(`id: 'bugs'`)) {
    dataContent = dataContent.replace(
      `export type AnimalCategory = 'all' | 'farm' | 'wild' | 'sea' | 'birds';`,
      `export type AnimalCategory = 'all' | 'farm' | 'wild' | 'sea' | 'birds' | 'bugs';`
    );
    dataContent = dataContent.replace(
      `category: 'farm' | 'wild' | 'sea' | 'birds';`,
      `category: 'farm' | 'wild' | 'sea' | 'birds' | 'bugs';`
    );
    dataContent = dataContent.replace(
      `  {
    id: 'birds',
    name: 'Birds',
    emoji: '🦜',
    bgGradient: 'bg-rose-50/40',
  },
];`,
      `  {
    id: 'birds',
    name: 'Birds',
    emoji: '🦜',
    bgGradient: 'bg-rose-50/40',
  },
  {
    id: 'bugs',
    name: 'Bugs',
    emoji: '🐛',
    bgGradient: 'bg-lime-50/40',
  },
];`
    );
  }

  let codeToInject = `\n  // ==================== NEW ANIMALS ====================\n`;
  for (const item of successful) {
    // Only if not already present
    if (!dataContent.includes(`id: '${item.id}',`)) {
      codeToInject += `  {
    id: '${item.id}',
    name: "${item.name.replace(/"/g, '\\"')}",
    emoji: '${item.emoji}',
    category: '${item.category}',
    imageUrl: '/assets/animals/${item.id}.jpg',
    soundType: '${item.soundType}',
    funFact: "${item.funFact.replace(/"/g, '\\"')}",
  },\n`;
    }
  }

  dataContent = dataContent.replace(/];\s*$/, codeToInject + '];\n');
  fs.writeFileSync(animalsDataPath, dataContent);
  console.log(`Updated lib/animalsData.ts successfully.`);
}

run();
