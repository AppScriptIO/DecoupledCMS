import { default as Application } from '../../class/Application.class.js'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'

export default async (context, next) => {
    let connection = Application.rethinkdbConnection
    context.body = 'Provide an entrypoint for the api schema.'
}
