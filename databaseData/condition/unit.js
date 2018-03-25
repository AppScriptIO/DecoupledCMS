let data = [

    /**
     * General conditions
     */
    { label: { name: 'Method = POST' }, key: '94765b71-4361-412e-80a0-4e5bfe08f2ed', expectedReturn: 'POST', fileKey: '301ff7c3-e0f7-45be-9ac3-8ce2c88416fe', },
    { label: { name: 'URL: /token/' }, key: 'd3b015b3-e860-4687-83a0-29d28c5c5fe7', expectedReturn: 'token', fileKey: '956a0f0f-437a-4cdf-9bcd-f205fc8336f9', },
    { label: { name: 'URL: /authorize/' }, key: '7d89c2df-c76f-4ad2-aa2f-d9e58271c7eb', expectedReturn: 'authorize', fileKey: '956a0f0f-437a-4cdf-9bcd-f205fc8336f9', },

    /**
     * Content API: /api/v1/
     */
    { label: { name: 'Method = OPTIONS' }, key: '98df-cfa4-4568-a728-afda3415a47d', expectedReturn: 'OPTIONS', fileKey: '301ff7c3-e0f7-45be-9ac3-8ce2c88416fe', },
    { label: { name: '/content/' }, key: '41c1a07a-cfa4-4568-a728-afda3415a47d', expectedReturn: 'content', fileKey: '956a0f0f-437a-4cdf-9bcd-f205fc8336f9', },
    { label: { name: '<>/<level 2 exists>' }, key: 'b62cb56a-1932-42fd-9829-76d8bda4ff12', expectedReturn: true, fileKey: '96196816-a934-4f2c-b625-6ae97514be15', },

    /**
     * Port: StaticContent
     */
    { label: { name: 'URL: /asset:render/' }, key: '4b062262-9ef2-4d15-bc87-7bc6b9fef39b', expectedReturn: 'asset:render', fileKey: '956a0f0f-437a-4cdf-9bcd-f205fc8336f9', },
    { label: { name: 'URL: <...>$function' }, key: '1b062262-9ef2-4d15-bc87-7bc6b9fef391', expectedReturn: true, fileKey: '2cba92fa-14bf-4e58-b875-c3ee3b1f31a8', },
    { label: { name: 'URL: /upload' }, key: 'd78cbbb1-4e46-4abe-8839-3edf9c25ccd4', expectedReturn: 'upload', fileKey: '956a0f0f-437a-4cdf-9bcd-f205fc8336f9', },


    { label: { name: 'URL: /asset/' }, key: 'af30c7db-4d26-4e4c-bab9-a4a5cc666edb', expectedReturn: 'asset', fileKey: '956a0f0f-437a-4cdf-9bcd-f205fc8336f9', },
    { label: { name: 'URL: /serviceWorker.js$' }, key: 'eeace9bc-1ccc-4050-af0b-0aa0f34884e3', expectedReturn: 'serviceWorker.js$', fileKey: '956a0f0f-437a-4cdf-9bcd-f205fc8336f9', },

    /**
     * General conditions
     */
    { label: { name: 'Method = GET' }, key: 'c639cd53-c764-4967-b052-1e1652107923', expectedReturn: 'GET', fileKey: '301ff7c3-e0f7-45be-9ac3-8ce2c88416fe', },
    { label: { name: '<>/<null>' }, key: '3baa9ad3-aff2-4486-a046-0b07ed7882be', expectedReturn: false, fileKey: 'd3b24455-3c21-4b5d-80b6-55bd9cdb98e2', },
    { label: { name: 'If exists URL level 1' }, key: 'e971b884-1b33-4044-9c93-162ee145b807', expectedReturn: true, fileKey: 'a701d0ee-a934-4f2c-b625-6ae97514be15', },

]

export default data