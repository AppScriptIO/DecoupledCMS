"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

let Request = require('oauth2-server').Request;

let Response = require('oauth2-server').Response;

var _default = async (context, next) => {
  console.log(context.request.body);
  var request = new Request(context.request);
  var response = new Response(context.response);
  let token = await oAuth2Server.authorize(request, response);
  console.log(token);
  await next();
};

exports.default = _default;