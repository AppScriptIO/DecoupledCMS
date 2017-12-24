let data = [
    {
        key: '0d65c113-acce-4f01-8eea-ab6cb7152405',
        label: {
            name: 'entrypointHTML'
        },
        unitKey: '73b661df-2f53-498c-a01b-d3db971f1a3e',
        insertionPoint: [
            {
                key: 'f0c1e26f-e1da-40b0-8084-444366615408',
                name: 'metadata',
                order: 1,
                executionType: 'chronological'
            },
            {
                key: '6b087d33-58df-4edd-aa41-1ffb33af16cf',
                name: 'header',
                order: 2,
                executionType: 'chronological'
            },
            {
                key: 'eeb37eba-5ef4-4a3d-8096-9baeeb31c81d',
                name: 'body',
                order: 3,
                executionType: 'chronological'
            },
        ],
        children: [
            {
                nestedUnit: 'aae51005-60e7-496d-bf54-c5c357cb9846',
                pathPointerKey: '2cca33bf-ac96-4ac0-9a14-e70fc2c867b4',
                insertionPosition: {
                    insertionPathPointer: null, 
                    insertionPoint: 'f0c1e26f-e1da-40b0-8084-444366615408',
                    order: 1,
                    // placement: {
                    //     type: 'after/before', 
                    //     pathPointer: 'KeyXXXX', 
                    // }
                }
            },
            {
                nestedUnit: '558062b7-64cf-4903-84da-e6ac06350a1f',
                pathPointerKey: '06e58b5b-6ca3-469b-b85c-a3954df24741',
                insertionPosition: {
                    insertionPathPointer: null, 
                    insertionPoint: '6b087d33-58df-4edd-aa41-1ffb33af16cf',
                    order: 1,
                    // placement: {
                    //     type: 'after/before', 
                    //     pathPointer: 'KeyXXXX', 
                    // }
                }
            },
        ]
    },

    {
        key: 'aae51005-60e7-496d-bf54-c5c357cb9846',
        label: {
            name: 'metadata'
        },
        unitKey: '10870442-15e9-4b40-b4ba-95cfe437bb77',
        insertionPoint: [
        ],
        children: [
        ]
    },

    {
        key: '558062b7-64cf-4903-84da-e6ac06350a1f',
        label: {
            name: 'entrypointJavascript'
        },
        unitKey: '4e485c9f-ad08-4117-b668-83aba51dac70',
        insertionPoint: [
        ],
        children: [
        ]
    }


];

export default data