let data = [

    {    key: 'relationshipxyz', 'language': { documentKey: 'English' }, 'article': { documentKey: '2' }    },
    {    key: 'relationshipx2yz', 'language': { documentKey: 'Arabic' }, 'article': { documentKey: '1' }    },
    {    key: 'relationshipx1yz', 'language': { documentKey: 'Arabic' }, 'article': { documentKey: '3' }    },
    {    key: 'relationshipx4yz', 'language': { documentKey: 'English' }, 'article': { documentKey: '4' }    },
    {    key: 'relationshipx5yz', 'language': { documentKey: 'Arabic' }, 'article': { documentKey: '5' }    },
    {    key: 'relationshipx6yz', 'language': { documentKey: 'English' }, 'article': { documentKey: '6' }    },

]

module.exports = { //  many-to-many relationship between documents
    databaseTableName: 'relationship',
    data: data
}