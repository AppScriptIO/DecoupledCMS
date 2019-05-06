"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = test;
exports.default = void 0;

var _rethinkdb = _interopRequireDefault(require("rethinkdb"));

async function test(context, next) {
  console.log('SZN - Inside <API>/test'); // get universities

  await _rethinkdb.default.table('authors').run(context.rethinkdbConnection).then(cursor => {
    return cursor.toArray();
  }).then(result => {
    context.body = result;
  });
  await next();
}

var _default = {
  test
};
exports.default = _default;