"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));
var _decoratorUtility = require("@dependency/commonPattern/source/decoratorUtility.js");
var _extendedSubclassPattern = require("@dependency/commonPattern/source/extendedSubclassPattern.js");var _dec, _dec2, _class, _class2, _temp;

const self = (_dec =
(0, _decoratorUtility.execute)({ staticMethod: 'initializeStaticClass' }), _dec2 =
_extendedSubclassPattern.extendedSubclassPattern.Subclass(), _dec(_class = _dec2(_class = (_temp = _class2 = class
StaticContent extends _ApplicationClass.default {






  static initializeStaticClass(self) {
    super.initializeStaticClass();
    self.port = 8081;
    self.url = `${self.config.PROTOCOL}cdn.${self.config.HOST}`;
  }
  constructor() {
    super(true);this.middlewareArray = [];
    this.config = {};
  }}, _class2.middlewareArray = [], _temp)) || _class) || _class);var _default =


self;exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9jbGFzcy9wb3J0L3N0YXRpY0NvbnRlbnQvU3RhdGljQ29udGVudC5jbGFzcy5qcyJdLCJuYW1lcyI6WyJzZWxmIiwic3RhdGljTWV0aG9kIiwiZXh0ZW5kZWRTdWJjbGFzc1BhdHRlcm4iLCJTdWJjbGFzcyIsIlN0YXRpY0NvbnRlbnQiLCJBcHBsaWNhdGlvbiIsImluaXRpYWxpemVTdGF0aWNDbGFzcyIsInBvcnQiLCJ1cmwiLCJjb25maWciLCJQUk9UT0NPTCIsIkhPU1QiLCJjb25zdHJ1Y3RvciIsIm1pZGRsZXdhcmVBcnJheSJdLCJtYXBwaW5ncyI6Ijs7QUFFQTtBQUNBO0FBQ0Esc0c7O0FBRUEsTUFBTUEsSUFBSTtBQUNQLCtCQUFRLEVBQUVDLFlBQVksRUFBRSx1QkFBaEIsRUFBUixDQURPO0FBRVBDLGlEQUF3QkMsUUFBeEIsRUFGTyxrREFDUjtBQUVNQyxhQUZOLFNBRTRCQyx5QkFGNUIsQ0FFd0M7Ozs7Ozs7QUFPdEMsU0FBT0MscUJBQVAsQ0FBNkJOLElBQTdCLEVBQW1DO0FBQ2pDLFVBQU1NLHFCQUFOO0FBQ0FOLElBQUFBLElBQUksQ0FBQ08sSUFBTCxHQUFZLElBQVo7QUFDQVAsSUFBQUEsSUFBSSxDQUFDUSxHQUFMLEdBQVksR0FBRVIsSUFBSSxDQUFDUyxNQUFMLENBQVlDLFFBQVMsT0FBTVYsSUFBSSxDQUFDUyxNQUFMLENBQVlFLElBQUssRUFBMUQ7QUFDRDtBQUNEQyxFQUFBQSxXQUFXLEdBQUc7QUFDWixVQUFNLElBQU4sRUFEWSxLQVBkQyxlQU9jLEdBUEksRUFPSjtBQUVaLFNBQUtKLE1BQUwsR0FBYyxFQUFkO0FBQ0QsR0FmcUMsQ0FIaEMsVUFPQ0ksZUFQRCxHQU9tQixFQVBuQiwrQkFBVixDOzs7QUFxQmViLEkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdGF0aWMgY29udGVudCBzZXJ2ZXIgLSBjb3VsZCBiZSB1cGdyYWRlZCB0byBDb250ZW50IERlbGl2ZXJ5IE5ldHdvcmtcbmltcG9ydCBLb2EgZnJvbSAna29hJyAvLyBLb2EgYXBwbGljYWl0b24gc2VydmVyXG5pbXBvcnQgeyBkZWZhdWx0IGFzIEFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vLi4vQXBwbGljYXRpb24uY2xhc3MuanMnXG5pbXBvcnQgeyBhZGQsIGV4ZWN1dGUsIGFwcGx5TWl4aW4gfSBmcm9tICdAZGVwZW5kZW5jeS9jb21tb25QYXR0ZXJuL3NvdXJjZS9kZWNvcmF0b3JVdGlsaXR5LmpzJ1xuaW1wb3J0IHsgZXh0ZW5kZWRTdWJjbGFzc1BhdHRlcm4gfSBmcm9tICdAZGVwZW5kZW5jeS9jb21tb25QYXR0ZXJuL3NvdXJjZS9leHRlbmRlZFN1YmNsYXNzUGF0dGVybi5qcydcblxuY29uc3Qgc2VsZiA9XG4gIEBleGVjdXRlKHsgc3RhdGljTWV0aG9kOiAnaW5pdGlhbGl6ZVN0YXRpY0NsYXNzJyB9KVxuICBAZXh0ZW5kZWRTdWJjbGFzc1BhdHRlcm4uU3ViY2xhc3MoKVxuICBjbGFzcyBTdGF0aWNDb250ZW50IGV4dGVuZHMgQXBwbGljYXRpb24ge1xuICAgIHN0YXRpYyBzZXJ2ZXJLb2FcbiAgICBzdGF0aWMgcG9ydFxuICAgIHN0YXRpYyB1cmxcbiAgICBzdGF0aWMgbWlkZGxld2FyZUFycmF5ID0gW11cbiAgICBtaWRkbGV3YXJlQXJyYXkgPSBbXVxuXG4gICAgc3RhdGljIGluaXRpYWxpemVTdGF0aWNDbGFzcyhzZWxmKSB7XG4gICAgICBzdXBlci5pbml0aWFsaXplU3RhdGljQ2xhc3MoKVxuICAgICAgc2VsZi5wb3J0ID0gODA4MVxuICAgICAgc2VsZi51cmwgPSBgJHtzZWxmLmNvbmZpZy5QUk9UT0NPTH1jZG4uJHtzZWxmLmNvbmZpZy5IT1NUfWBcbiAgICB9XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcih0cnVlKVxuICAgICAgdGhpcy5jb25maWcgPSB7fSAvLyBwb3B1bGF0ZWQgYnkgdXNlcmFnZW50RGV0ZWN0aW9uIG1vZHVsZS5cbiAgICB9XG4gIH1cblxuZXhwb3J0IGRlZmF1bHQgc2VsZlxuIl19