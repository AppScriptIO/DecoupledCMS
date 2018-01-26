let data = [

    {
        label: { name: 'article' }, key: 'article', unitKey: 'article',
        insertionPoint: [
            { key: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, executionType: 'chronological' },
        ],
        children: [
            // { nestedUnit: 'title', pathPointerKey: 'xyz', insertionPosition: { insertionPathPointer: null,  insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ } },
            // { nestedUnit: 'paragraph', pathPointerKey: 'xyz', insertionPosition: { insertionPathPointer: null,  insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ } },
            // { nestedUnit: 'person', pathPointerKey: 'xyz', insertionPosition: { insertionPathPointer: null,  insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ } },
        ],
    },
    { label: { name: 'title' }, key: 'title', unitKey: 'title', },
    { label: { name: 'paragraph' }, key: 'paragraph', unitKey: 'paragraph', },

    {
        label: { name: 'person' }, key: '0c01c061-92d4-44ad-8cda-098352c107ea', unitKey: '',
        insertionPoint: [
            { key: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, executionType: 'chronological' },
        ],
        children: [
            { nestedUnit: 'name', pathPointerKey: 'xyz', insertionPosition: { insertionPathPointer: null,  insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ } },
            { nestedUnit: 'age', pathPointerKey: 'xyz', insertionPosition: { insertionPathPointer: null,  insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ } },
            { nestedUnit: 'article', pathPointerKey: 'xyz', insertionPosition: { insertionPathPointer: null,  insertionPoint: 'de45db35-5e0d-49b1-82bc-659fc787b0c1', order: 1, /* placement: { type: 'after/before', pathPointer: 'KeyXXXX', } */ } },
        ],
    },
    { label: { name: 'name' }, key: 'name', unitKey: 'name', },
    { label: { name: 'age' }, key: 'age', unitKey: 'age', },
    
    { label: { name: '' }, key: '', unitKey: '', },
    { label: { name: '' }, key: '', unitKey: '', },
    { label: { name: '' }, key: '', unitKey: '', },
    { label: { name: '' }, key: '', unitKey: '', },

]

export default data