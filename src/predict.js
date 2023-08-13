export { sample_error, predict }
function sample_error(x, y, weights)
{
  var prediction = x.map(x=>predict(x,weights))
  var error = prediction.map((x,i)=>Math.pow(x[0] - y[i],2)).reduce((a,b)=>a+b,0)
  return error
}
function predict(x,weights)
{
  var result = []
  for(var i = 0; i < weights.length; i++)
  {
    var sum = 0
    for(var j = 0; j < x.length; j++)
    {
      sum += x[j] * weights[i][j]
    }
    result.push(sum)
  }
  return result
}

