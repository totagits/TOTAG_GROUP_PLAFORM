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
      { name: 'Klay', clans: ['Klay Central', 'Mana Clan', 'Gola Clan', 'Tubmanburg South'] },
      { name: 'Dewein', clans: ['Dewein Central', 'Jene Wonde', 'Bolea'] },
      { name: 'Senjeh', clans: ['Senjeh Chiefdom', 'Tubmanburg Urban', 'Beafinie'] },
      { name: 'Seimavula', clans: ['Seimavula West', 'Upper Bomi', 'Gbonyea'] }
    ]
  },
  {
    name: 'Bong',
    code: 'BG',
    capital: 'Gbarnga',
    center: [6.9944, -9.5786],
    districts: [
      { name: 'Jorquelleh', clans: ['Gbarnga Central', 'Jorquelleh #1', 'Jorquelleh #2', 'Leleypaye'] },
      { name: 'Fuamah', clans: ['Dobli Clan', 'Bong Mines Urban', 'Lain'] },
      { name: 'Suakoko', clans: ['Suakoko Central', 'Cuttington', 'Kpaai'] },
      { name: 'Salala', clans: ['Salala Central', 'Totota', 'Sanoyea Border'] },
      { name: 'Sanoyea', clans: ['Sanoyea Urban', 'Walapolu', 'Gola Clan'] },
      { name: 'Zota', clans: ['Zota Central', 'Nyanfor Clan', 'Belefanai'] },
      { name: 'Kokoyah', clans: ['Kokoyah Statutory', 'Botota', 'Togbata'] },
      { name: 'Yellequelleh', clans: ['Yellequelleh North', 'Gbanqua', 'Kpaai'] },
      { name: 'Kpaii', clans: ['Kpaii Central', 'Palala', 'Gbartala'] },
      { name: 'Boinsen', clans: ['Boinsen Central', 'Bendu Clan'] }
    ]
  },
  {
    name: 'Gbarpolu',
    code: 'GB',
    capital: 'Bopolu',
    center: [7.5253, -10.0469],
    districts: [
      { name: 'Bopolu', clans: ['Bopolu City', 'Bopolu North', 'Yoma'] },
      { name: 'Bokomu', clans: ['Bokomu Central', 'Farwenta', 'Tumu'] },
      { name: 'Gbarma', clans: ['Gbarma Town', 'Weasua', 'Kungba'] },
      { name: 'Kongba', clans: ['Kongba West', 'Normon', 'Zuie'] },
      { name: 'Gou Nwolaila', clans: ['Gou Nwolaila Central', 'Lofa Border'] }
    ]
  },
  {
    name: 'Grand Bassa',
    code: 'GBA',
    capital: 'Buchanan',
    center: [6.1558, -9.9706],
    districts: [
      { name: 'Commonwealth (Buchanan)', clans: ['Buchanan City Central', 'Fairground', 'Kilby Town'] },
      { name: 'District #1', clans: ['Lloydsville', 'Owensgrove', 'Frank Town'] },
      { name: 'District #2', clans: ['Compound #2', 'Gbee', 'Barconnie'] },
      { name: 'District #3', clans: ['Compound #3', 'Harmonsville', 'St. John River'] },
      { name: 'District #4', clans: ['Compound #4', 'Neekreen', 'Gorblee'] },
      { name: 'Neekreen', clans: ['Neekreen Central', 'Bassa Coast'] },
      { name: 'Owensgrove', clans: ['Owensgrove Urban', 'Edina'] }
    ]
  },
  {
    name: 'Grand Cape Mount',
    code: 'GCM',
    capital: 'Robertsport',
    center: [7.1333, -11.0833],
    districts: [
      { name: 'Garwula', clans: ['Sinje', 'Garwula Central', 'Kaidii', 'Manoballa'] },
      { name: 'Golakonneh (Gola Konneh)', clans: ['Gola North', 'Mana Clan', 'Lofa Tower', 'Pokpa Border'] },
      { name: 'Porkpa', clans: ['Dambala', 'Sokpo', 'Porkpa Central', 'Bamballa'] },
      { name: 'Commonwealth Robertsport', clans: ['Robertsport Urban', 'Fishermen Clan', 'Kru Town', 'Lake Piso'] },
      { name: 'Tewor', clans: ['Tewor Central', 'Bo Waterside', 'Robor', 'Mendemassa', 'Tia'] }
    ]
  },
  {
    name: 'Grand Gedeh',
    code: 'GG',
    capital: 'Zwedru',
    center: [5.9231, -8.1356],
    districts: [
      { name: 'Tchien', clans: ['Zwedru Urban', 'Tchien North', 'Puh'] },
      { name: 'Gbarzon', clans: ['Gbarzon Central', 'Tobli', 'Gorbo'] },
      { name: 'Konobo', clans: ['Konobo East', 'Zai Town', 'Glia'] },
      { name: 'Cavalla', clans: ['Cavalla Main', 'Ziah Town'] },
      { name: 'Glio-Twarbo', clans: ['Glio', 'Twarbo'] },
      { name: 'B\'hai', clans: ['B\'hai Central', 'Toe Town'] }
    ]
  },
  {
    name: 'Grand Kru',
    code: 'GK',
    capital: 'Barclayville',
    center: [4.7175, -8.2289],
    districts: [
      { name: 'Barclayville', clans: ['Barclayville City', 'Kru Coast', 'Topoh'] },
      { name: 'Forpoh', clans: ['Forpoh Central', 'Parluken'] },
      { name: 'Garraway', clans: ['Garraway Beach', 'Po River'] },
      { name: 'Grand Cess', clans: ['Grand Cess Urban', 'Wropluken'] },
      { name: 'Kpi', clans: ['Kpi Central', 'Nwabey'] },
      { name: 'Sasstown', clans: ['Sasstown Urban', 'Picnicess', 'Filorken'] },
      { name: 'Trehn', clans: ['Trehn Central', 'Wedabo'] }
    ]
  },
  {
    name: 'Lofa',
    code: 'LF',
    capital: 'Voinjama',
    center: [8.4219, -9.7478],
    districts: [
      { name: 'Voinjama', clans: ['Voinjama City', 'Voinjama Rural', 'Koli Clan', 'Lola Clan'] },
      { name: 'Foya', clans: ['Foya Central', 'Shello Clan', 'Tengia', 'Kpasagizia'] },
      { name: 'Kolahun', clans: ['Kolahun Town', 'Lukasu', 'Wassakor', 'Tahn'] },
      { name: 'Zorzor', clans: ['Zorzor Central', 'Fisibu', 'Kpai', 'Borkeza'] },
      { name: 'Salayea', clans: ['Salayea Town', 'Ganglota', 'Yeala'] },
      { name: 'Quardu Gboni', clans: ['Barkedu', 'Quardu Gboni Central'] },
      { name: 'Lukambeh', clans: ['Lukambeh Central', 'Kolahun East'] }
    ]
  },
  {
    name: 'Margibi',
    code: 'MG',
    capital: 'Kakata',
    center: [6.5317, -10.3533],
    districts: [
      { name: 'Kakata', clans: ['Kakata City', 'Chugbor', 'E.J. Roye', 'Weala'] },
      { name: 'Firestone', clans: ['Harbel', 'Division 1-10', 'Division 11-45'] },
      { name: 'Mambah-Kaba', clans: ['Marshall', 'Smell-No-Taste', 'Kaba Chiefdom'] },
      { name: 'Gibi', clans: ['Gibi North', 'Bendu', 'Borlor'] }
    ]
  },
  {
    name: 'Maryland',
    code: 'MY',
    capital: 'Harper',
    center: [4.5828, -7.7169],
    districts: [
      { name: 'Harper', clans: ['Harper City', 'Cavalla', 'Cape Palmas', 'Hoffman'] },
      { name: 'Pleebo/Sodeken', clans: ['Pleebo Urban', 'Sodeken', 'Gbolobo', 'Old Sodoken'] },
      { name: 'Karluway #1', clans: ['Karloken', 'Manolu', 'Yobloke'] },
      { name: 'Karluway #2', clans: ['Karluway West', 'Pedebo'] },
      { name: 'Barrobo', clans: ['Barrobo Central', 'Whojah', 'Subroken'] }
    ]
  },
  {
    name: 'Montserrado',
    code: 'MO',
    capital: 'Bensonville',
    center: [6.4527, -10.6019],
    districts: [
      { name: 'Greater Monrovia', clans: ['Sinkor', 'Bushrod Island', 'Congotown', 'Paynesville', 'Gardnersville'] },
      { name: 'Careysburg', clans: ['Careysburg City', 'Mount Barclay', 'Crozierville'] },
      { name: 'Todee', clans: ['Nyenhn Clan', 'Bensonville Rural', 'Gobahn Clan'] },
      { name: 'St. Paul River', clans: ['Caldwell', 'Louisiana', 'Clay-Ashland', 'Virginia'] }
    ]
  },
  {
    name: 'Nimba',
    code: 'NI',
    capital: 'Sanniquellie',
    center: [6.8600, -8.7100],
    districts: [
      { name: 'Sanniquellie-Mah', clans: ['Sanniquellie Urban', 'Yarmein', 'Gparblee'] },
      { name: 'Ganta / Bain-Garr', clans: ['Ganta City', 'Gbao', 'Gbi & Duru', 'Bain'] },
      { name: 'Saclepea-Mah', clans: ['Saclepea Urban', 'Zao', 'Dao', 'Gbehlay-Geh'] },
      { name: 'Tappita', clans: ['Tappita City', 'Zuluyee', 'Gbao', 'Neezoin'] },
      { name: 'Zoegeh', clans: ['Karnplay', 'Bhai', 'Gbor Clan'] },
      { name: 'Yarwein Mehnsonnoh', clans: ['Yarwein', 'Mehnsonnoh', 'Zualay'] },
      { name: 'Gbee & Duru', clans: ['Gbee', 'Duru'] },
      { name: 'Buu-Yao', clans: ['Buu', 'Yao'] }
    ]
  },
  {
    name: 'River Cess',
    code: 'RC',
    capital: 'Cestos City',
    center: [5.7333, -9.4333],
    districts: [
      { name: 'Cestos / Jo River', clans: ['Cestos City', 'Fen River', 'Jo River Central'] },
      { name: 'Timbo', clans: ['Yarpah Town', 'Timbo Central', 'Gbaboe'] },
      { name: 'Neezuoin', clans: ['Neezuoin North', 'Gbaingbasia', 'Zahn'] },
      { name: 'Central River Cess', clans: ['Kploh', 'Monweh'] },
      { name: 'Doar River', clans: ['Doar River North', 'Sehnchia'] }
    ]
  },
  {
    name: 'River Gee',
    code: 'RG',
    capital: 'Fish Town',
    center: [5.2611, -7.8767],
    districts: [
      { name: 'Fish Town / Tienpo', clans: ['Fish Town Urban', 'Tienpo East', 'Gelepo'] },
      { name: 'Chedepo', clans: ['Kilmako', 'Kanweake', 'Tuobo'] },
      { name: 'Gbeapo', clans: ['Gbeapo Central', 'Sarbo', 'Paleken'] },
      { name: 'Webbo', clans: ['Webbo Main', 'Flebo'] },
      { name: 'Karforh', clans: ['Karforh Main', 'Gelepo South'] }
    ]
  },
  {
    name: 'Sinoe',
    code: 'SN',
    capital: 'Greenville',
    center: [5.3408, -8.9669],
    districts: [
      { name: 'Greenville', clans: ['Greenville City', 'Mississippi in Africa', 'Farmer Town'] },
      { name: 'Juarzon', clans: ['Juarzon Town', 'Kabu', 'Bawor'] },
      { name: 'Kpanyan', clans: ['Tajuowon', 'Kanyan West', 'Kabada'] },
      { name: 'Sanquin District #1', clans: ['Sanquin River', 'Numopoh'] },
      { name: 'Sanquin District #2', clans: ['Sanquin Central', 'Pynes'] },
      { name: 'Dugbe River', clans: ['Dugbe Main', 'Seton'] },
      { name: 'Jaedae', clans: ['Jaedae Town', 'Kulu'] }
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
