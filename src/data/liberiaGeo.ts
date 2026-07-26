export interface LiberianCounty {
  name: string;
  code: string;
  capital: string;
  center: [number, number]; // [lat, lng]
  districts: {
    name: string;
    clans: string[];
  }[];
}

export const LIBERIA_COUNTIES: LiberianCounty[] = [
  {
    name: 'Bomi',
    code: 'BM',
    capital: 'Tubmanburg',
    center: [6.8687, -10.7567],
    districts: [
      { name: 'Klay', clans: ['Klay Central', 'Mana Clan', 'Gola Clan'] },
      { name: 'Dewein', clans: ['Dewein Central', 'Jene Wonde'] },
      { name: 'Senjeh', clans: ['Senjeh Chiefdom', 'Tubmanburg Urban'] },
      { name: 'Seimavula', clans: ['Seimavula West', 'Upper Bomi'] }
    ]
  },
  {
    name: 'Bong',
    code: 'BG',
    capital: 'Gbarnga',
    center: [6.9944, -9.5786],
    districts: [
      { name: 'Jorquelleh', clans: ['Gbarnga Central', 'Jorquelleh #1', 'Jorquelleh #2'] },
      { name: 'Fuamah', clans: ['Dobli Clan', 'Bong Mines Urban'] },
      { name: 'Suakoko', clans: ['Suakoko Central', 'Cuttington'] },
      { name: 'Salala', clans: ['Salala Central', 'Totota'] },
      { name: 'Zota', clans: ['Zota Central', 'Nyanfor Clan'] }
    ]
  },
  {
    name: 'Gbarpolu',
    code: 'GB',
    capital: 'Bopolu',
    center: [7.5253, -10.0469],
    districts: [
      { name: 'Bopolu', clans: ['Bopolu City', 'Bopolu North'] },
      { name: 'Bokomu', clans: ['Bokomu Central', 'Farwenta'] },
      { name: 'Gbarma', clans: ['Gbarma Town', 'Weasua'] },
      { name: 'Kongba', clans: ['Kongba West', 'Normon'] }
    ]
  },
  {
    name: 'Grand Bassa',
    code: 'GBA',
    capital: 'Buchanan',
    center: [6.1558, -9.9706],
    districts: [
      { name: 'District #1', clans: ['Lloydsville', 'Owensgrove'] },
      { name: 'District #2', clans: ['Compound #2', 'Gbee'] },
      { name: 'District #3', clans: ['Buchanan City', 'Harmonsville'] },
      { name: 'District #4', clans: ['Compound #4', 'Neekreen'] }
    ]
  },
  {
    name: 'Grand Cape Mount',
    code: 'GCM',
    capital: 'Robertsport',
    center: [7.1333, -11.0833],
    districts: [
      { name: 'Garwula', clans: ['Sinje', 'Garwula Central'] },
      { name: 'Gola Konneh', clans: ['Tewor', 'Gola North'] },
      { name: 'Porkpa', clans: ['Bo Waterside', 'Dambala'] },
      { name: 'Porkpa West', clans: ['Robertsport Coastal', 'Fishermen Clan'] }
    ]
  },
  {
    name: 'Grand Gedeh',
    code: 'GG',
    capital: 'Zwedru',
    center: [5.9231, -8.1356],
    districts: [
      { name: 'Tchien', clans: ['Zwedru Urban', 'Tchien North'] },
      { name: 'Gbarzon', clans: ['Gbarzon Central', 'Tobli'] },
      { name: 'Konobo', clans: ['Konobo East', 'Zai Town'] }
    ]
  },
  {
    name: 'Grand Kru',
    code: 'GK',
    capital: 'Barclayville',
    center: [4.7175, -8.2289],
    districts: [
      { name: 'Barclayville', clans: ['Barclayville City', 'Kru Coast'] },
      { name: 'Trehn', clans: ['Grand Cess', 'Trehn Central'] },
      { name: 'Sasstown', clans: ['Sasstown Urban', 'Picnicess'] }
    ]
  },
  {
    name: 'Lofa',
    code: 'LF',
    capital: 'Voinjama',
    center: [8.4219, -9.7478],
    districts: [
      { name: 'Voinjama', clans: ['Voinjama City', 'Voinjama Rural', 'Koli Clan'] },
      { name: 'Foya', clans: ['Foya Central', 'Shello Clan', 'Tengia'] },
      { name: 'Kolahun', clans: ['Kolahun Town', 'Lukasu', 'Wassakor'] },
      { name: 'Zorzor', clans: ['Zorzor Central', 'Fisibu', 'Kpai'] },
      { name: 'Salayea', clans: ['Salayea Town', 'Ganglota'] }
    ]
  },
  {
    name: 'Margibi',
    code: 'MG',
    capital: 'Kakata',
    center: [6.5317, -10.3533],
    districts: [
      { name: 'Kakata', clans: ['Kakata City', 'Chugbor', 'E.J. Roye'] },
      { name: 'Firestone', clans: ['Harbel', 'Division 1-10'] },
      { name: 'Mambah-Kaba', clans: ['Marshall', 'Smell-No-Taste'] },
      { name: 'Gibi', clans: ['Gibi North', 'Bendu'] }
    ]
  },
  {
    name: 'Maryland',
    code: 'MY',
    capital: 'Harper',
    center: [4.5828, -7.7169],
    districts: [
      { name: 'Harper', clans: ['Harper City', 'Cavalla', 'Cape Palmas'] },
      { name: 'Pleebo/Sodeken', clans: ['Pleebo Urban', 'Sodeken', 'Gbolobo'] },
      { name: 'Karluway #1', clans: ['Karloken', 'Manolu'] }
    ]
  },
  {
    name: 'Montserrado',
    code: 'MO',
    capital: 'Bensonville',
    center: [6.4527, -10.6019],
    districts: [
      { name: 'Careysburg', clans: ['Careysburg City', 'Mount Barclay'] },
      { name: 'Todee', clans: ['Nyenhn Clan', 'Bensonville Rural'] },
      { name: 'St. Paul River', clans: ['Caldwell', 'Louisiana', 'Clay-Ashland'] },
      { name: 'Greater Monrovia', clans: ['Paynesville Rural', 'Gardnersville Outskirts'] }
    ]
  },
  {
    name: 'Nimba',
    code: 'NI',
    capital: 'Sanniquellie',
    center: [6.8600, -8.7100],
    districts: [
      { name: 'Sanniquellie-Mah', clans: ['Sanniquellie Urban', 'Yarmein'] },
      { name: 'Ganta / Leewehpea', clans: ['Ganta City', 'Gbao', 'Gbi & Duru'] },
      { name: 'Saclepea-Mah', clans: ['Saclepea Urban', 'Zao', 'Dao'] },
      { name: 'Tappita', clans: ['Tappita City', 'Zuluyee', 'Gbao'] },
      { name: 'Zoegeh', clans: ['Karnplay', 'Bhai'] }
    ]
  },
  {
    name: 'River Cess',
    code: 'RC',
    capital: 'Cestos City',
    center: [5.7333, -9.4333],
    districts: [
      { name: 'Cestos', clans: ['Cestos City', 'Fen River'] },
      { name: 'Timbo', clans: ['Yarpah Town', 'Timbo Central'] },
      { name: 'Neezuoin', clans: ['Neezuoin North', 'Gbaingbasia'] }
    ]
  },
  {
    name: 'River Gee',
    code: 'RG',
    capital: 'Fish Town',
    center: [5.2611, -7.8767],
    districts: [
      { name: 'Tienpo', clans: ['Fish Town Urban', 'Tienpo East'] },
      { name: 'Chedepo', clans: ['Kilmako', 'Kanweake'] },
      { name: 'Gbeapo', clans: ['Gbeapo Central', 'Sarbo'] }
    ]
  },
  {
    name: 'Sinoe',
    code: 'SN',
    capital: 'Greenville',
    center: [5.3408, -8.9669],
    districts: [
      { name: 'Greenville', clans: ['Greenville City', 'Mississippi in Africa'] },
      { name: 'Juarzon', clans: ['Juarzon Town', 'Kabu'] },
      { name: 'Kpanyan', clans: ['Tajuowon', 'Kanyan West'] },
      { name: 'Sanquin', clans: ['Sanquin River', 'Numopoh'] }
    ]
  }
];

export const LIBERIAN_CROPS = [
  'Rice (Lowland Paddy)',
  'Rice (Upland)',
  'Cassava',
  'Cocoa',
  'Oil Palm',
  'Rubber',
  'Vegetables (Pepper, Bitter Ball, Okra)',
  'Corn / Maize',
  'Plantain / Banana',
  'Sweet Potato & Yams',
  'Coffee',
  'Sugarcane'
];

export const LIBERIAN_LIVESTOCK = [
  'Poultry (Broilers & Layers)',
  'Goats',
  'Sheep',
  'Pigs / Swine',
  'Cattle',
  'Rabbits'
];

export const LIBERIAN_FISHERIES = [
  'Artisanal Marine Fishing',
  'Freshwater Inland Fishing',
  'Aquaculture Fish Ponds (Tilapia/Catfish)',
  'Fish Processing & Smoking'
];
