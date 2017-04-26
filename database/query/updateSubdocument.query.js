r.db("webapp").table("setting").get("conditionImplementation").update({
  conditionImplementation: r.row('conditionImplementation')
  .map(function(condition) {
    return r.branch(condition('expectedReturn').eq('true'),
      condition.merge({this: true}),
      condition)
  })
})