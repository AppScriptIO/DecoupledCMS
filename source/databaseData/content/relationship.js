let data = [
  { key: 'relationshipxyz', language: { documentKey: 'English' }, article: { documentKey: '2' } },
  { key: 'relationshipx2yz', language: { documentKey: 'Arabic' }, article: { documentKey: '1' } },
  { key: 'relationshipx1yz', language: { documentKey: 'Arabic' }, article: { documentKey: '3' } },
  { key: 'relationshipx4yz', language: { documentKey: 'English' }, article: { documentKey: '4' } },
  { key: 'relationshipx5yz', language: { documentKey: 'Arabic' }, article: { documentKey: '5' } },
  { key: 'relationshipx6yz', language: { documentKey: 'English' }, article: { documentKey: '6' } },

  { key: 'relationshipx622z', language: { documentKey: 'Arabic' }, ui: { documentKey: 't1' } },
  { key: 'relationshipx123', language: { documentKey: 'English' }, ui: { documentKey: 't2' } },
  { key: 'relationshipx622z', language: { documentKey: 'Hebrew' }, ui: { documentKey: 't3' } },
  { key: 'relationshipx622z', language: { documentKey: 'Arabic' }, ui: { documentKey: 'd1' } },
  { key: 'relationshipx123', language: { documentKey: 'English' }, ui: { documentKey: 'd2' } },
  { key: 'relationshipx622z', language: { documentKey: 'Hebrew' }, ui: { documentKey: 'd3' } },

  { key: 'relationshas342235sdf', language: { documentKey: 'Arabic' }, personalInfo: { documentKey: 'ac2' } },
  { key: 'relationsh245f', language: { documentKey: 'Arabic' }, personalInfo: { documentKey: 'ac6' } },
  { key: 'relationsha543646', language: { documentKey: 'English' }, personalInfo: { documentKey: 'ac5' } },
  { key: 'relation456asdf', language: { documentKey: 'English' }, personalInfo: { documentKey: 'ac1' } },

  { key: 'relationshas342235sdf', language: { documentKey: 'Arabic' }, ui: { documentKey: 'n1' } },
  { key: 'relationsh245f', language: { documentKey: 'English' }, ui: { documentKey: 'n2' } },
  { key: 'relationsha543646', language: { documentKey: 'Hebrew' }, ui: { documentKey: 'n3' } },

  { key: 'relationshas342235sdf', language: { documentKey: 'Arabic' }, ui: { documentKey: 's1' } },
  { key: 'relationsh245f', language: { documentKey: 'English' }, ui: { documentKey: 's2' } },
  { key: 'relationsha543646', language: { documentKey: 'Hebrew' }, ui: { documentKey: 's3' } },
]

export default {
  //  many-to-many relationship between documents
  databaseTableName: 'relationship',
  data: data,
}
