let _invalidateRequireCacheForFile = function(filePath){
	delete require.cache[require.resolve(filePath)];
};
let requireNoCache =  function(filePath){
	_invalidateRequireCacheForFile(filePath);
	return require(filePath);
};


// List of require without cache modules: 
// • https://github.com/nazomikan/require-without-cache/blob/master/index.js
// • https://www.npmjs.com/package/require-without-cache
// • https://gist.github.com/adam-lynch/11037907
// • https://www.npmjs.com/package/decache
// • http://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
