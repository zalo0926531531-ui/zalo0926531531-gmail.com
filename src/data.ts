/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CelestialBody, SpaceTechEntry } from "./types";

export const CELESTIAL_BODIES: CelestialBody[] = [
  {
    id: "sun",
    name: "Sol (The Sun)",
    type: "star",
    classification: "Yellow Dwarf (G2V)",
    mass: "1.989 × 10^30 kg (333,000 Earths)",
    temperature: "5,500 °C (Surface) / 15,000,000 °C (Core)",
    atmosphere: "Hydrogen (73%), Helium (25%)",
    distance: "149.6 Million km (1.0 AU)",
    habitable: false,
    description: "The main-sequence G-type star at the center of our Solar System. Its gravity binds the solar family together, driving our weather, ocean currents, seasons, and sustaining all terrestrial life through immense thermonuclear fusion.",
    colors: ["#ffe066", "#f59f00", "#e8590c"],
    radius: 40,
    orbitRadius: 0,
    orbitSpeed: 0,
    moonsCount: 0,
    featured: true
  },
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    classification: "Terrestrial Planet",
    mass: "3.285 × 10^23 kg (0.055 Earths)",
    temperature: "-173°C to 427°C",
    atmosphere: "Exosphere of Oxygen, Sodium, Hydrogen",
    distance: "57.9 Million km (0.39 AU)",
    habitable: false,
    description: "The smallest and closest planet to the Sun. Mercury is a cratered, extreme world of scorching days and freezing nights, rotating slowly in a 3:2 spin-orbit resonance under intense gravitational tidal forces.",
    colors: ["#adb5bd", "#6c757d", "#495057"],
    radius: 12,
    orbitRadius: 75,
    orbitSpeed: 0.03,
    moonsCount: 0
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    classification: "Terrestrial Planet",
    mass: "4.867 × 10^24 kg (0.815 Earths)",
    temperature: "462°C (Average)",
    atmosphere: "Carbon Dioxide (96.5%), Nitrogen (3.5%)",
    distance: "108.2 Million km (0.72 AU)",
    habitable: false,
    description: "Earth's structural sister, wrapped in a suffocating thermal blanket. Venus exhibits an extreme runaway greenhouse effect and retrograde rotation, with yellow-hued clouds of sulfuric acid shielding a volcanic basaltic surface.",
    colors: ["#ffd8a8", "#fd7e14", "#d9480f"],
    radius: 16,
    orbitRadius: 110,
    orbitSpeed: 0.022,
    moonsCount: 0
  },
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    classification: "Terrestrial Planet (Habitable)",
    mass: "5.972 × 10^24 kg",
    temperature: "-88°C to 58°C",
    atmosphere: "Nitrogen (78%), Oxygen (21%), Argon (0.9%)",
    distance: "149.6 Million km (1.0 AU)",
    habitable: true,
    description: "The oasis of the Cosmos. Earth is the only known planet hosting liquid surface oceans and active organic life. It possesses a protective magnetosphere powered by a churning liquid iron core and is framed by a rich biological nitrogen-oxygen envelope.",
    colors: ["#339af0", "#2b8a3e", "#74c0fc"],
    radius: 18,
    orbitRadius: 155,
    orbitSpeed: 0.018,
    moonsCount: 1,
    featured: true
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    classification: "Terrestrial Planet",
    mass: "6.390 × 10^23 kg (0.107 Earths)",
    temperature: "-153°C to 20°C",
    atmosphere: "Carbon Dioxide (95%), Nitrogen (2.8%)",
    distance: "227.9 Million km (1.52 AU)",
    habitable: false,
    description: "The dusty Red Planet. Mars is a dry, desert world displaying massive iron oxide dust shields, towering extinct volcanoes like Olympus Mons, polar carbon dioxide ice caps, and ancient dry river valleys hinting at a warmer watery past.",
    colors: ["#ff8787", "#e03131", "#c92a2a"],
    radius: 14,
    orbitRadius: 200,
    orbitSpeed: 0.014,
    moonsCount: 2
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    classification: "Gas Giant",
    mass: "1.898 × 10^27 kg (318 Earths)",
    temperature: "-108°C (Average)",
    atmosphere: "Hydrogen (89.8%), Helium (10.2%)",
    distance: "778.5 Million km (5.2 AU)",
    habitable: false,
    description: "The King of Planets. Jupiter is a colossal gas giant carrying more mass than all other planets combined. It is defined by iconic colored band zones, a liquid metallic hydrogen ocean core, and the Great Red Spot—a massive storm wider than Earth.",
    colors: ["#ffe3e3", "#f76707", "#d9480f"],
    radius: 28,
    orbitRadius: 260,
    orbitSpeed: 0.009,
    moonsCount: 95,
    featured: true
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    classification: "Gas Giant",
    mass: "5.683 × 10^26 kg (95 Earths)",
    temperature: "-139°C (Average)",
    atmosphere: "Hydrogen (96%), Helium (3%)",
    distance: "1.4 Billion km (9.58 AU)",
    habitable: false,
    description: "The jewel of the solar system. Saturn is a majestic gas giant surrounded by a spectacular, complex ring system composed of billions of water-ice fragments, orbiting above a highly low-density atmosphere capable of floating on water.",
    colors: ["#ffec99", "#f59f00", "#e67e22"],
    radius: 24,
    orbitRadius: 320,
    orbitSpeed: 0.007,
    moonsCount: 146
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    classification: "Ice Giant",
    mass: "8.681 × 10^25 kg (14.5 Earths)",
    temperature: "-224°C",
    atmosphere: "Hydrogen (83%), Helium (15%), Methane (2%)",
    distance: "2.9 Billion km (19.2 AU)",
    habitable: false,
    description: "An ice giant rotating on a radical 98-degree extreme tilt. Uranus' pale blue-green color is caused by atmospheric methane gas absorbing red sunlight, casting an eerie glow over its quiet ring systems and frozen ammonia-water mantle.",
    colors: ["#a5f3fc", "#22d3ee", "#0891b2"],
    radius: 20,
    orbitRadius: 375,
    orbitSpeed: 0.005,
    moonsCount: 28
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    classification: "Ice Giant",
    mass: "1.024 × 10^26 kg (17 Earths)",
    temperature: "-214°C",
    atmosphere: "Hydrogen (80%), Helium (19%), Methane (1.5%)",
    distance: "4.5 Billion km (30.1 AU)",
    habitable: false,
    description: "The windiest world in the Solar System. Neptune is a deep-cobalt ice giant driving supersonic winds up to 2,100 km/h, carrying a high-pressure carbon diamond mantle, and orbited by Triton—a captured retrograde Kuiper Belt moon.",
    colors: ["#74c0fc", "#1c7ed6", "#1864ab"],
    radius: 20,
    orbitRadius: 430,
    orbitSpeed: 0.004,
    moonsCount: 16
  },
  {
    id: "sagittarius_a",
    name: "Sagittarius A*",
    type: "blackhole",
    classification: "Supermassive Black Hole",
    mass: "4.154 Million Solar Masses",
    temperature: "-273.15 °C (Horizon) / Billions of degrees in Accretion Disk",
    atmosphere: "Singularity (Infinite Density)",
    distance: "26,670 Light Years",
    habitable: false,
    description: "The supermassive black hole at the center of our Milky Way Galaxy. It bends light into an Einstein Ring, pulling nearby star clusters into hypersonic orbits, surrounded by a radiant, relativistic accretion plasma disk reflecting space-time frame dragging.",
    colors: ["#000000", "#ff5c00", "#ffffff"],
    radius: 35,
    orbitRadius: 520,
    orbitSpeed: 0.001,
    moonsCount: 0,
    featured: true
  },
  {
    id: "orion_nebula",
    name: "Orion Nebula (M42)",
    type: "nebula",
    classification: "Emission & Reflection Nebula",
    mass: "2,000 Solar Masses",
    temperature: "-260 °C (Dust Clouds) to 10,000 °C (Ionized Gas)",
    atmosphere: "Ionized Hydrogen, Helium, Carbon Dust",
    distance: "1,344 Light Years",
    habitable: false,
    description: "A cosmic star nursery visible to the naked eye. The Orion Nebula is a chaotic interstellar cloud of colorful gas and dust where hundreds of baby stars and protoplanetary accretion discs are actively condensing under gravitational collapses.",
    colors: ["#ff3366", "#aa00ff", "#00ffff"],
    radius: 45,
    orbitRadius: 620,
    orbitSpeed: 0.0005,
    moonsCount: 0,
    featured: true
  }
];

export const SPACE_TECH: SpaceTechEntry[] = [
  {
    id: "apollo_11",
    title: "Apollo 11",
    category: "mission",
    era: "1969",
    description: "The historic US spaceflight that first landed humans on the Moon.",
    specs: {
      "Crew": "Neil Armstrong, Buzz Aldrin, Michael Collins",
      "Lunar Landing": "July 20, 1969",
      "Launch Vehicle": "Saturn V rocket",
      "Lunar Landing Site": "Sea of Tranquility",
      "Sample Collection": "21.5 kg of lunar soil"
    },
    longText: "On July 20, 1969, Neil Armstrong and Buzz Aldrin set foot on the lunar surface while Michael Collins orbited above in the Command Module. This momentous milestone fulfilled President Kennedy's national commitment and symbolized the height of 20th-century orbital technology. The Saturn V rocket remains the largest and most powerful launcher ever successfully commissioned into operational status."
  },
  {
    id: "james_webb",
    title: "James Webb Telescope",
    category: "technology",
    era: "2021",
    description: "The world's most advanced deep space infrared space observatory.",
    specs: {
      "Primary Mirror": "6.5-meter gold-plated beryllium mirror",
      "Target Location": "Sun-Earth L2 Lagrange Point (1.5 million km)",
      "Wavelengths": "Near-infrared and Mid-infrared spectrums",
      "Primary Shield": "5-layer kapton sunshield (size of tennis court)",
      "Core Mission": "Detecting first galaxies and chemical exoplanet atmospheres"
    },
    longText: "As the successor to Hubble, JWST observes the Universe in high-contrast infrared. This allows it to peek inside dusty stellar nurseries, scan atmospheres of distant exoplanets for water or methane molecules, and look back 13.5 billion years to witness the spark of the first primordial stars. Its golden honeycomb design represents modern material science and cryogenic engineering."
  },
  {
    id: "voyager_1",
    title: "Voyager 1",
    category: "pioneer",
    era: "1977",
    description: "The farthest man-made artifact traveling into interstellar space.",
    specs: {
      "Current Distance": "Over 24 Billion km (162 AU)",
      "Payload": "Golden Record of Earth's culture",
      "Power Source": "Plutonium-238 RTG generators",
      "Grand Tour Targets": "Jupiter and Saturn flybys",
      "Interstellar Boundary": "Crossed heliopause in August 2012"
    },
    longText: "Launched to explore the outer gas giants, Voyager 1 captured spectacular imagery of Jupiter's volcanic moon Io and Saturn's ring structures before slingshotting out of the ecliptic plane. It carries a gold-plated copper phonograph record carrying greetings, natural sounds, and music from Earth, serving as a cosmic time capsule to be discovered by future stellar civilizations."
  },
  {
    id: "alcubierre_warp",
    title: "Alcubierre Warp Metric",
    category: "technology",
    era: "Theoretical",
    description: "A theoretical model allowing faster-than-light space-travel.",
    specs: {
      "Concept": "Warping spacetime rather than accelerating through it",
      "Mechanism": "Expanding space behind ship, contracting space in front",
      "Requirement": "Exotic matter with negative energy density",
      "Relativity Status": "Consistent with Einstein's Field Equations",
      "Velocity Limit": "Theoretically infinite (bypasses local light-speed limits)"
    },
    longText: "Proposed by physicist Miguel Alcubierre in 1994, this metric demonstrates that while local acceleration through space cannot exceed the speed of light, spacetime itself can contract and expand at arbitrary speeds. A ship nestled inside a localized 'warp bubble' remains stationary relative to its immediate surroundings, avoiding time dilation and G-force impacts."
  },
  {
    id: "hawking_radiation",
    title: "Hawking Radiation",
    category: "phenomenon",
    era: "1974",
    description: "The quantum process of black hole evaporation.",
    specs: {
      "Theoretical Origin": "Stephen Hawking",
      "Mechanism": "Quantum vacuum fluctuations near event horizons",
      "Particle Fate": "One virtual particle falls in, the other escapes as radiation",
      "Net Result": "Black hole loses mass-energy and eventually explodes",
      "Lifespan": "Supermassive black holes take 10^100 years to evaporate"
    },
    longText: "In 1974, Stephen Hawking combined general relativity and quantum mechanics to show that black holes are not completely black. Virtual particle-antiparticle pairs constantly pop into existence in vacuum fluctuations. At the event horizon, one may be swallowed while the other escapes. The escaping particle manifests as heat radiation, proving that black holes have entropy and evaporate over astronomical timescales."
  }
];
