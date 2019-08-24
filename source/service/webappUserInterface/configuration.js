export default {
  serviceName: 'webappUserInterface',
  underscore: { evaluate: /\{\%(.+?)\%\}/g, interpolate: /\{\%=(.+?)\%\}/g, escape: /\{\%-(.+?)\%\}/g }, // initial underscore template settings on first import gets applied on the rest.
}
