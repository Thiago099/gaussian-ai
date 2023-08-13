import { multi_shuffle, slice, pad } from "./utils.js"
import { gaussian_elimination } from './gaussian_elimination.js'
import { sample_error } from "./predict.js"
export { train_epoch, cherry_pick }

function get_single_output_weights(x,y,j)
{
  var augmented_matrix = generate_augmented_matrix(x,y,j)
  var solutions = get_solutions(augmented_matrix.result,augmented_matrix.size)
  return cherry_pick(pad(solutions),x,y.map(x=>x[j]))
}

function train_epoch(x,y)
{
  const [xx,yy] = multi_shuffle(x,y)
  return get_weights(xx,yy)
}

function get_weights(x,y)
{
    var result = []
    for(var j = 0; j < y[0].length; j++)
    {
      result.push(get_single_output_weights(x,y,j))
    }
    return result
}

function generate_augmented_matrix(x,y,j)
{
  var result = []
  var size = 0
  for(var i = 0; i < x.length; i++)
  {
    var current = [...x[i],y[i][j]]
    result.push(current)
    size = current.length
  }
  return {result,size}
}

function get_solutions(augmented_matrix,length)
{
  var start = 0
  var solutions = []
  do
  {
    var piece = slice(augmented_matrix, start, length-1)
    gaussian_elimination(piece)
    var current_solution = piece.map(x=>x[x.length-1])
    solutions.push(current_solution)
    start += length
  }
  while(start + length <= augmented_matrix.length)
  return solutions
}

function cherry_pick(list,x,y)
{
  var result = {item:list[0],error:sample_error(x,y,list[0])}
  for(var i = 1; i < list.length; i++)
  {
    var error = sample_error(x,y,list[i])
    if(error < result.error)
    {
      result = {item:list[i],error:error}
    }
  }
  return result.item
}