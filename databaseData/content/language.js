let data = [

    {
        key: 'Arabic',
        nativeName: 'الغربية',        
        twoLetterCode: 'AR'
    },
    {
        key: 'English',
        nativeName: 'English',
        twoLetterCode: 'EN'
    },
    {
        key: 'Hebrew',
        nativeName: 'עברית',
        twoLetterCode: 'HE'
    },

]

module.exports = {
    databaseTableName: 'language',
    data: data,
    index: ['key']
}