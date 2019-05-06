"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Load configuration settings.
var _default = () => {
  return async (context, next) => {
    // fallback to sending the app index. If not found.
    await next();
    if (404 != context.status) return; // return context.body = 'This is the not found middleware.'
    // return send(context, path.normalize(`${context.instance.config.clientBasePath}/root/entrypoint.html`))
  };
};

exports.default = _default;