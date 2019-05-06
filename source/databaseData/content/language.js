"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
let data = [{
  key: 'Arabic',
  nativeName: 'الغربية',
  twoLetterCode: 'AR'
}, {
  key: 'English',
  nativeName: 'English',
  twoLetterCode: 'EN'
}, {
  key: 'Hebrew',
  nativeName: 'עברית',
  twoLetterCode: 'HE'
}];
var _default = {
  databaseTableName: 'language',
  data: data,
  index: ['key']
};
exports.default = _default;