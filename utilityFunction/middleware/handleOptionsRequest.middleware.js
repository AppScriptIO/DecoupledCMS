import { default as Application } from '../../class/Application.class.js'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'

export default async (context, next) => {
    let connection = Application.rethinkdbConnection
    context.body = 'OK' // previous middlewares should have already defined cross origin all *.
}
