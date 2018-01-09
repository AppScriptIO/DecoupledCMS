import path from 'path'
import { default as Application } from './class/Application.class.js'
import { microservice } from "./microservice";

// Important: Exporting Application and another module that imports 'appscript' would could infinite loop. e.g. exporting also microservice.
//            To prevent such behavior all modules in 'appscript' module should call each other using relative paths.
export { Application as default, microservice as microservice }
// __________________________________

// // Conneciton ports:
// if (!module.parent || module.parent) { // Dummy for future use // if loaded as a standart script.
// }
