/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
const categorySelect = document.getElementById('category-select');
const inputFrom = document.getElementById('input-from');
const selectFrom = document.getElementById('select-from');
const labelFrom = document.getElementById('label-from');
const inputTo = document.getElementById('input-to');
const selectTo = document.getElementById('select-to');
const labelTo = document.getElementById('label-to');
const swapButton = document.getElementById('swap-button');
const factoidContainer = document.getElementById('factoid-container');
const factoidContent = document.getElementById('factoid-content');

let debounceTimer;

const backgroundImages = {
    length: [
        'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070',
        'https://images.unsplash.com/photo-1483728642387-6c351b4013de?q=80&w=2070',
        'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2070',
        'https://images.unsplash.com/photo-1490644343542-5369556515b2?q=80&w=1932',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070',
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070',
        'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=2070'
    ],
    weight: [
        'https://images.unsplash.com/photo-1593074609383-f3228f4a02c3?q=80&w=2070',
        'https://images.unsplash.com/photo-1526402232386-4e5a2f5a6f23?q=80&w=1974',
        'https://images.unsplash.com/photo-1549060279-8a6a687c5dfe?q=80&w=2070',
        'https://images.unsplash.com/photo-1594498652139-3458a58434f8?q=80&w=1974',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070',
        'https://images.unsplash.com/photo-1579758629938-03607ccdb340?q=80&w=2070',
        'https://images.unsplash.com/photo-1550963198-4235e23a4a15?q=80&w=1964',
        'https://images.unsplash.com/photo-1587280501635-3957242d22a6?q=80&w=2070',
        'https://images.unsplash.com/photo-1581333122159-e1f1a58cedba?q=80&w=1935',
        'https://images.unsplash.com/photo-1627225793914-77a83d4016e2?q=80&w=1935',
        'https://images.unsplash.com/photo-1577960346014-a93165b40846?q=80&w=1974',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070'
    ],
    temperature: [
        'https://images.unsplash.com/photo-1505322268928-7f01584c8a41?q=80&w=1932',
        'https://images.unsplash.com/photo-1477601263568-180e2c6d042e?q=80&w=1974',
        'https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1976',
        'https://images.unsplash.com/photo-1531316282956-d3844f1b5594?q=80&w=1974',
        'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?q=80&w=1965',
        'https://images.unsplash.com/photo-1453306458620-5bbef13a5bca?q=80&w=2070',
        'https://images.unsplash.com/photo-1442120107521-28565b6f5038?q=80&w=1974',
        'https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=2070',
        'https://images.unsplash.com/photo-1581224463294-9273c33252a1?q=80&w=1974',
        'https://images.unsplash.com/photo-1612208176513-e6e96b86e2d1?q=80&w=1974',
        'https://images.unsplash.com/photo-1422207124325-385627725966?q=80&w=2070',
        'https://images.unsplash.com/photo-1542676030-222474889613?q=80&w=2070'
    ],
    volume: [
        'https://images.unsplash.com/photo-1542067790-2f81405b9748?q=80&w=1974',
        'https://images.unsplash.com/photo-1594535182358-0ed2a215a7ee?q=80&w=1974',
        'https://images.unsplash.com/photo-1499754162586-08f451261482?q=80&w=1974',
        'https://images.unsplash.com/photo-1550644339-354e63283624?q=80&w=1974',
        'https://images.unsplash.com/photo-1437482078695-a213c443a534?q=80&w=1976',
        'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?q=80&w=1974',
        'https://images.unsplash.com/photo-1473773562308-a4239f373111?q=80&w=1974',
        'https://images.unsplash.com/photo-1535555438493-78b17b2b0a0a?q=80&w=1974',
        'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?q=80&w=2070',
        'https://images.unsplash.com/photo-1520037893943-7a2e0a9b83b8?q=80&w=1974',
        'https://images.unsplash.com/photo-1601269389063-54817a1921f3?q=80&w=1974',
        'https://images.unsplash.com/photo-1545310943-85f2696b26f5?q=80&w=1974'
    ],
    area: [
        'https://images.unsplash.com/photo-1560931924-87a0b1f5155c?q=80&w=1974',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070',
        'https://images.unsplash.com/photo-1504996614144-2d02a24ae50b?q=80&w=1974',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932',
        'https://images.unsplash.com/photo-1495452567223-28f0a0e53a2a?q=80&w=2070',
        'https://images.unsplash.com/photo-1542224283-a723ce75e7a1?q=80&w=2070',
        'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=2070',
        'https://images.unsplash.com/photo-1494522855154-9297acba4865?q=80&w=2070',
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070',
        'https://images.unsplash.com/photo-1507525428034-b723a996f329?q=80&w=2070',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021',
        'https://images.unsplash.com/photo-1505670714151-a06a6c4b22e2?q=80&w=2070'
    ],
    speed: [
        'https://images.unsplash.com/photo-1534792376229-3015256c3447?q=80&w=2070',
        'https://images.unsplash.com/photo-1469504512102-11059a43a298?q=80&w=1974',
        'https://images.unsplash.com/photo-1552633349-84227f71d5b3?q=80&w=2070',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072',
        'https://images.unsplash.com/photo-1550133734-698f185f1642?q=80&w=2072',
        'https://images.unsplash.com/photo-1580403358943-8f0a99be7621?q=80&w=1974',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070',
        'https://images.unsplash.com/photo-1610398236744-12a832f05646?q=80&w=2070',
        'https://images.unsplash.com/photo-1618365908642-a745f4b50715?q=80&w=1932',
        'https://images.unsplash.com/photo-1599549925208-4a9f73b640f0?q=80&w=2070',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070',
        'https://images.unsplash.com/photo-1549399542-7e64a78a15b5?q=80&w=2070'
    ],
    time: [
        'https://images.unsplash.com/photo-1495001258031-d1b407bc1776?q=80&w=1974',
        'https://images.unsplash.com/photo-1482079239824-28a113d09a06?q=80&w=1953',
        'https://images.unsplash.com/photo-1504321926768-3bda5c1a7f05?q=80&w=1931',
        'https://images.unsplash.com/photo-1515164998188-6db244c13038?q=80&w=1974',
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072',
        'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=2070',
        'https://images.unsplash.com/photo-1529339873652-845f7a075253?q=80&w=2070',
        'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2070',
        'https://images.unsplash.com/photo-1465146633011-14f8e0781093?q=80&w=2070',
        'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?q=80&w=2071',
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070',
        'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?q=80&w=2070'
    ],
    power: [
        'https://images.unsplash.com/photo-1507668040349-a3acd3da2203?q=80&w=1974',
        'https://images.unsplash.com/photo-1580228183099-b7f3b8904344?q=80&w=1974',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072',
        'https://images.unsplash.com/photo-1543616992-8f19272323b7?q=80&w=1974',
        'https://images.unsplash.com/photo-1589578228253-35dd9a2a3dba?q=80&w=1974',
        'https://images.unsplash.com/photo-1627993079093-b605658e0a81?q=80&w=1932',
        'https://images.unsplash.com/photo-1533512920429-b68e4a9e144a?q=80&w=2070',
        'https://images.unsplash.com/photo-1591834927163-875f6170664e?q=80&w=1974',
        'https://images.unsplash.com/photo-1630707735316-22a488583416?q=80&w=2070',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072',
        'https://images.unsplash.com/photo-1624969862263-a2e9b864a428?q=80&w=2070',
        'https://images.unsplash.com/photo-1545129559-0f6c20536d72?q=80&w=2070'
    ],
    energy: [
        'https://images.unsplash.com/photo-1444154845898-84f9143684a0?q=80&w=2067',
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070',
        'https://images.unsplash.com/photo-1496034663057-6245713e8b26?q=80&w=2070',
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2070',
        'https://images.unsplash.com/photo-1533793929417-2f3b97f01a35?q=80&w=2070',
        'https://images.unsplash.com/photo-1549472301-44a53823467c?q=80&w=2070',
        'https://images.unsplash.com/photo-1557342938-1f1f1a562854?q=80&w=2070',
        'https://images.unsplash.com/photo-1605663829094-1b1a8d07b7ef?q=80&w=1974',
        'https://images.unsplash.com/photo-1521752763353-c9e8a719c81a?q=80&w=2070',
        'https://images.unsplash.com/photo-1558486948-356950795c63?q=80&w=2070',
        'https://images.unsplash.com/photo-1622359992429-251f2a36b539?q=80&w=2070',
        'https://images.unsplash.com/photo-1615568198948-d3c5f4b4cda4?q=80&w=2070'
    ],
    pressure: [
        'https://images.unsplash.com/photo-1605651202772-1d542a201e19?q=80&w=1974',
        'https://images.unsplash.com/photo-1553049132-a9b0c2a5e54d?q=80&w=2070',
        'https://images.unsplash.com/photo-1444837881205-59b8a3423cb7?q=80&w=1974',
        'https://images.unsplash.com/photo-1596613342378-c2b0c3272d1f?q=80&w=1974',
        'https://images.unsplash.com/photo-1546949313-0865e913a34a?q=80&w=2062',
        'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=1928',
        'https://images.unsplash.com/photo-1543732585-64f7623577d6?q=80&w=2070',
        'https://images.unsplash.com/photo-1461352195244-8d956041a7d6?q=80&w=2070',
        'https://images.unsplash.com/photo-1611118182939-a790b9685a2c?q=80&w=2070',
        'https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=2070',
        'https://images.unsplash.com/photo-1560026333-913a3754aa52?q=80&w=1974',
        'https://images.unsplash.com/photo-1558422394-839f379a5563?q=80&w=2070'
    ],
    data: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1934',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
        'https://images.unsplash.com/photo-1581092921461-8a6e67c4c794?q=80&w=1974',
        'https://images.unsplash.com/photo-1593435713438-c62678c4a1b3?q=80&w=1932',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070',
        'https://images.unsplash.com/photo-1542831371-d5f9d4b8cec3?q=80&w=2070',
        'https://images.unsplash.com/photo-1544890225-2fde0e66f35b?q=80&w=2070',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069',
        'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070'
    ]
};

const factoids = {
    length: [
        "The length of a marathon, 26.2 miles, was standardized at the 1908 London Olympics to cover the distance from Windsor Castle to the royal box in the stadium.",
        "A light-year, the distance light travels in a year, is about 9.46 trillion kilometers (5.88 trillion miles). The nearest star system is 4.25 light-years away.",
        "The Great Wall of China is the longest man-made structure, stretching approximately 21,196 kilometers (13,171 miles).",
        "An inch was historically defined as the length of three barleycorns laid end-to-end.",
        "The diameter of a typical human hair is about 0.05 millimeters, which is thinner than a piece of paper."
    ],
    weight: [
        "A kilogram was originally defined as the mass of one liter of water. Now it's based on a physical constant.",
        "The world's heaviest-ever recorded pumpkin weighed 2,702 pounds (1,226 kg) – heavier than a small car!",
        "Ounces come from the Roman 'uncia,' which was 1/12th of a Roman pound. That's why there are 12 inches in a foot, too!",
        "The Earth weighs approximately 5.97 sextillion kilograms. That's a 6 followed by 24 zeros!",
        "A single teaspoon of a neutron star would weigh about 6 billion tons, due to its incredible density."
    ],
    temperature: [
        "The only temperature that is the same in both Celsius and Fahrenheit is -40 degrees.",
        "The highest temperature ever recorded on Earth was 56.7 °C (134.1 °F) in Death Valley, California, in 1913.",
        "Water is most dense at 4°C (39.2°F). Above and below this temperature, it expands.",
        "The Kelvin scale is an absolute scale, where 0 K is absolute zero—the point at which all atomic motion stops.",
        "Your body temperature is a great example of homeostasis. It stays around 37°C (98.6°F) regardless of the outside temperature."
    ],
    volume: [
        "The total volume of water on Earth is estimated at 1.386 billion cubic kilometers (333 million cubic miles), with 97% being saltwater.",
        "One liter of water weighs almost exactly one kilogram.",
        "A pint of beer in the UK is 20 fluid ounces, while in the US it's only 16 fluid ounces. A British 'pint' is about 20% larger!",
        "The cargo hold of a Boeing 747 has a volume of about 170 cubic meters, enough to hold 600 suitcases.",
        "The volume of the sun is so large that approximately 1.3 million Earths could fit inside it."
    ],
    area: [
        "An acre was originally defined as the amount of land a yoke of oxen could plow in one day.",
        "Monaco, the second smallest country, has an area of just 2.02 square kilometers (0.78 square miles). You could walk across it in under an hour!",
        "The surface area of Russia, the world's largest country, is larger than the surface area of the dwarf planet Pluto.",
        "A single hectare is equivalent to 10,000 square meters, roughly the size of two and a half football fields.",
        "The total surface area of all the leaves on a mature oak tree can be greater than 7,000 square meters (1.7 acres)."
    ],
    speed: [
        "The fastest land animal is the cheetah, which can reach speeds of up to 120 km/h (75 mph) in short bursts.",
        "A knot is a unit of speed equal to one nautical mile per hour. It's used by sailors and aviators because a nautical mile relates to the Earth's longitude and latitude.",
        "The speed of sound in air is about 343 meters per second (1,125 feet per second). A plane is 'supersonic' when it breaks this barrier.",
        "Earth orbits the Sun at an average speed of about 30 kilometers per second (18.5 miles per second).",
        "The fastest speed possible in the universe is the speed of light, which is exactly 299,792,458 meters per second."
    ],
    time: [
        "A 'jiffy' is an actual unit of time! In physics, it's the time it takes for light to travel one centimeter in a vacuum, about 33.3 picoseconds.",
        "One day isn't exactly 24 hours. It's 23 hours, 56 minutes, and 4.1 seconds. We have leap years to correct for this difference.",
        "The atomic clock is so precise that it would only lose or gain one second in about 100 million years.",
        "A week has seven days because ancient Babylonians observed seven celestial bodies: the Sun, the Moon, Mercury, Venus, Mars, Jupiter, and Saturn.",
        "The 'New York Minute' is a phrase meaning a very short period of time, reflecting the city's fast-paced lifestyle."
    ],
    power: [
        "The term 'horsepower' was invented by engineer James Watt to compare the power of steam engines with the power of draft horses.",
        "A single lightning bolt can contain up to 1 billion watts of power, enough to power a city for a moment.",
        "A professional cyclist can produce over 1,000 watts of power during a sprint, which is enough to toast four slices of bread at once.",
        "The human brain, while resting, consumes about 20 watts of power, similar to a dim light bulb.",
        "A modern nuclear power plant can generate about 1 gigawatt (1 billion watts) of power, enough to supply a city of about 750,000 homes."
    ],
    energy: [
        "The energy in a single Snickers bar (about 250 kilocalories) is enough for an average person to walk about 3 miles (5 km).",
        "A joule is a tiny amount of energy. Lifting a small apple one meter off the ground takes about one joule.",
        "A kilowatt-hour (kWh) is the unit you see on your electricity bill. It's the energy used by a 1,000-watt appliance running for one hour.",
        "The energy released by a magnitude 6 earthquake is equivalent to the explosion of about 15,000 tons of TNT.",
        "Your body contains enough potential energy to explode with the force of 30 hydrogen bombs. Thankfully, it's well-contained!"
    ],
    pressure: [
        "Atmospheric pressure at sea level is about 101,325 Pascals (or 14.7 PSI). This means the air above every square inch of your body is pushing down with 14.7 pounds of force.",
        "A woman's stiletto heel can exert more pressure on the ground than an elephant's foot due to its tiny surface area.",
        "The pressure at the bottom of the Mariana Trench is over 1,000 times the pressure at sea level, equivalent to having 50 jumbo jets stacked on top of you.",
        "A bar is a unit of pressure roughly equal to atmospheric pressure at sea level. Your car tires are typically inflated to about 2-3 bars.",
        "PSI (Pounds per Square Inch) is commonly used in the US for measuring things like tire pressure and water pressure."
    ],
    data: [
        "The first gigabyte hard drive, the IBM 3380, was released in 1980. It weighed over 500 pounds and cost $40,000.",
        "A byte is made of 8 bits. The word 'byte' was coined by Dr. Werner Buchholz in 1956.",
        "It's estimated that by 2025, the total amount of digital data created worldwide will reach 175 zettabytes. One zettabyte is a trillion gigabytes.",
        "A terabyte can hold about 250,000 songs or 500 hours of HD movies.",
        "The term 'bit' is short for 'binary digit,' the smallest unit of data in a computer, representing a 0 or a 1."
    ]
};

const units = {
    length: {
        meters: { name: 'Meters', factor: 1 },
        kilometers: { name: 'Kilometers', factor: 1000 },
        centimeters: { name: 'Centimeters', factor: 0.01 },
        miles: { name: 'Miles', factor: 1609.34 },
        feet: { name: 'Feet', factor: 0.3048 },
        inches: { name: 'Inches', factor: 0.0254 },
    },
    weight: {
        kilograms: { name: 'Kilograms', factor: 1 },
        grams: { name: 'Grams', factor: 0.001 },
        pounds: { name: 'Pounds', factor: 0.453592 },
        ounces: { name: 'Ounces', factor: 0.0283495 },
    },
    temperature: {
        celsius: { name: 'Celsius', factor: 1 },
        fahrenheit: { name: 'Fahrenheit', factor: 1 }, // Special handling
        kelvin: { name: 'Kelvin', factor: 1 }, // Special handling
    },
    volume: {
        liters: { name: 'Liters', factor: 1 },
        milliliters: { name: 'Milliliters', factor: 0.001 },
        gallons: { name: 'Gallons (US)', factor: 3.78541 },
        pints: { name: 'Pints (US)', factor: 0.473176 },
    },
    area: {
        square_meters: { name: 'Square Meters', factor: 1 },
        square_kilometers: { name: 'Square Kilometers', factor: 1e6 },
        hectares: { name: 'Hectares', factor: 10000 },
        square_miles: { name: 'Square Miles', factor: 2.59e+6 },
        acres: { name: 'Acres', factor: 4046.86 },
        square_feet: { name: 'Square Feet', factor: 0.092903 },
        square_inches: { name: 'Square Inches', factor: 0.00064516 },
    },
    speed: {
        mps: { name: 'Meters/sec', factor: 1 },
        kph: { name: 'Kilometers/hr', factor: 1 / 3.6 },
        mph: { name: 'Miles/hr', factor: 0.44704 },
        knots: { name: 'Knots', factor: 0.514444 },
    },
    time: {
        seconds: { name: 'Seconds', factor: 1 },
        minutes: { name: 'Minutes', factor: 60 },
        hours: { name: 'Hours', factor: 3600 },
        days: { name: 'Days', factor: 86400 },
        weeks: { name: 'Weeks', factor: 604800 },
    },
    power: {
        watts: { name: 'Watts', factor: 1 },
        kilowatts: { name: 'Kilowatts', factor: 1000 },
        horsepower: { name: 'Horsepower (HP)', factor: 745.7 },
    },
    energy: {
        joules: { name: 'Joules', factor: 1 },
        kilojoules: { name: 'Kilojoules', factor: 1000 },
        calories: { name: 'Calories', factor: 4.184 },
        kilocalories: { name: 'Kilocalories (kcal)', factor: 4184 },
        kwh: { name: 'Kilowatt-hours', factor: 3.6e+6 },
    },
    pressure: {
        pascals: { name: 'Pascals', factor: 1 },
        kilopascals: { name: 'Kilopascals', factor: 1000 },
        bars: { name: 'Bars', factor: 100000 },
        psi: { name: 'PSI', factor: 6894.76 },
        atm: { name: 'Atmospheres', factor: 101325 },
    },
    data: {
        bits: { name: 'Bits', factor: 1 },
        bytes: { name: 'Bytes', factor: 8 },
        kilobytes: { name: 'Kilobytes (KB)', factor: 8 * 1024 },
        megabytes: { name: 'Megabytes (MB)', factor: 8 * 1024 * 1024 },
        gigabytes: { name: 'Gigabytes (GB)', factor: 8 * 1024 * 1024 * 1024 },
        terabytes: { name: 'Terabytes (TB)', factor: 8 * 1024 * 1024 * 1024 * 1024 },
    }
};

function updateBackground(category) {
    const images = backgroundImages[category];
    if (images && images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length);
        const imageUrl = images[randomIndex];
        
        // Preload the image to ensure smooth transition
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            document.body.style.backgroundImage = `url('${imageUrl}')`;
        };
    }
}


function displayRandomFactoid() {
    const category = categorySelect.value;
    const fromUnitName = selectFrom.options[selectFrom.selectedIndex].text;
    const toUnitName = selectTo.options[selectTo.selectedIndex].text;

    if (fromUnitName === toUnitName) {
        factoidContainer.style.display = 'none';
        return;
    }

    const categoryFacts = factoids[category];
    if (categoryFacts && categoryFacts.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoryFacts.length);
        const randomFact = categoryFacts[randomIndex];
        factoidContent.textContent = randomFact;
        factoidContainer.style.display = 'block';
    } else {
        factoidContainer.style.display = 'none';
    }
}

function populateSelects(category) {
    const unitOptions = units[category];
    selectFrom.innerHTML = '';
    selectTo.innerHTML = '';

    Object.keys(unitOptions).forEach(key => {
        const option = unitOptions[key];
        selectFrom.innerHTML += `<option value="${key}">${option.name}</option>`;
        selectTo.innerHTML += `<option value="${key}">${option.name}</option>`;
    });

    selectFrom.selectedIndex = 0;
    selectTo.selectedIndex = 1;
    if (Object.keys(unitOptions).length <= 1) {
        selectTo.selectedIndex = 0;
    }
    updateLabels();
}

function updateLabels() {
    labelFrom.textContent = selectFrom.options[selectFrom.selectedIndex].text;
    labelTo.textContent = selectTo.options[selectTo.selectedIndex].text;
}

function convert(value, fromUnit, toUnit, category) {
    if (category === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    }

    const categoryUnits = units[category];
    const fromFactor = categoryUnits[fromUnit].factor;
    const toFactor = categoryUnits[toUnit].factor;

    const valueInBaseUnit = value * fromFactor;
    return valueInBaseUnit / toFactor;
}

function convertTemperature(value, from, to) {
    if (from === to) return value;
    let celsius;

    switch (from) {
        case 'fahrenheit':
            celsius = (value - 32) * 5 / 9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
        default:
            celsius = value;
    }

    switch (to) {
        case 'fahrenheit':
            return (celsius * 9 / 5) + 32;
        case 'kelvin':
            return celsius + 273.15;
        default:
            return celsius;
    }
}

function handleConversion(source) {
    const category = categorySelect.value;
    const [sourceInput, targetInput] = source === 'from' ? [inputFrom, inputTo] : [inputTo, inputFrom];
    const [sourceSelect, targetSelect] = source === 'from' ? [selectFrom, selectTo] : [selectTo, selectFrom];

    const value = parseFloat(sourceInput.value);
    if (isNaN(value)) {
        targetInput.value = '';
        return;
    }
    
    const fromUnit = sourceSelect.value;
    const toUnit = targetSelect.value;
    
    const result = convert(value, fromUnit, toUnit, category);
    
    targetInput.value = Number(result.toPrecision(15)).toString();

    // Trigger animation on the target input
    targetInput.classList.add('animate-pop');
    targetInput.addEventListener('animationend', () => {
        targetInput.classList.remove('animate-pop');
    }, { once: true });
}

function handleInputWithDebounce(source) {
    handleConversion(source);

    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
        if (inputFrom.value) {
            displayRandomFactoid();
        }
    }, 600);
}


function swapUnits() {
    swapButton.classList.add('rotating');
    
    const fromIndex = selectFrom.selectedIndex;
    selectFrom.selectedIndex = selectTo.selectedIndex;
    selectTo.selectedIndex = fromIndex;
    
    updateLabels();
    handleConversion('from');
    displayRandomFactoid();

    swapButton.addEventListener('transitionend', () => {
        swapButton.classList.remove('rotating');
    }, { once: true });
}

function onCategoryChange() {
    const category = categorySelect.value;
    populateSelects(category);
    handleConversion('from');
    displayRandomFactoid();
    updateBackground(category);
}

// Event Listeners
categorySelect.addEventListener('change', onCategoryChange);
inputFrom.addEventListener('input', () => handleInputWithDebounce('from'));
inputTo.addEventListener('input', () => handleInputWithDebounce('to'));
selectFrom.addEventListener('change', () => {
    updateLabels();
    handleConversion('from');
    displayRandomFactoid();
});
selectTo.addEventListener('change', () => {
    updateLabels();
    handleConversion('from');
    displayRandomFactoid();
});
swapButton.addEventListener('click', swapUnits);

// Initial setup
function init() {
    onCategoryChange();
}

init();