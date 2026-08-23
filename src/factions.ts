import { PlanetaryFaction } from './types';

export const INITIAL_FACTIONS: PlanetaryFaction[] = [
  {
    id: 'lithoid_guild',
    name: 'Lithoid Mining Consortium',
    race: 'Lithoid (Subterranean Rockfolk)',
    leader: 'High Foreman Brock',
    avatar: '💎',
    color: '#f59e0b',
    description: 'Masters of deep seismic tunneling. They control rich subterranean mineral vaults and trade raw ore for energy.',
    opinion: 35,
    relationship: 'neutral',
    influence: 0,
    tradeActive: false,
    tradeDeal: {
      giveResource: 'energy',
      giveAmount: 2,
      getResource: 'minerals',
      getAmount: 6
    }
  },
  {
    id: 'cyber_enclave',
    name: 'Cybernetic Technocracy',
    race: 'Augmented Cyborgs',
    leader: 'Prime Overseer 7-Omega',
    avatar: '🤖',
    color: '#06b6d4',
    description: 'A computing collective focused on quantum AI and astrophysics. They produce breakthrough science in exchange for minerals.',
    opinion: 45,
    relationship: 'neutral',
    influence: 0,
    tradeActive: false,
    tradeDeal: {
      giveResource: 'minerals',
      giveAmount: 3,
      getResource: 'science',
      getAmount: 3
    }
  },
  {
    id: 'solar_directorate',
    name: 'Solar Spire Ascendancy',
    race: 'Solaris (Avian Star-worshipers)',
    leader: 'Archon Solaria',
    avatar: '☀️',
    color: '#fbbf24',
    description: 'Perched in orbital highlands, their massive prism arrays harvest pure stellar radiation. They trade surplus power for structural alloys.',
    opinion: 25,
    relationship: 'hostile',
    influence: 0,
    tradeActive: false,
    tradeDeal: {
      giveResource: 'alloys',
      giveAmount: 1,
      getResource: 'energy',
      getAmount: 5
    }
  },
  {
    id: 'sylva_clans',
    name: 'Sylva Bio-Dominion',
    race: 'Sylvathi (Plantoid Organics)',
    leader: 'Matriarch Thorn',
    avatar: '🌿',
    color: '#10b981',
    description: 'Organic bio-engineers capable of cultivating living metallic woods. They supply resilient alloys in exchange for scientific research.',
    opinion: 50,
    relationship: 'friendly',
    influence: 0,
    tradeActive: false,
    tradeDeal: {
      giveResource: 'science',
      giveAmount: 2,
      getResource: 'alloys',
      getAmount: 3
    }
  }
];
