import { train_epoch } from "./src/train.js";
import { sample_error_prediction,predict } from "./src/predict.js";
import { epsilon } from "./src/utils.js";
import { preProcessingList } from "./src/pre_processing.js";

import {combine,buildMap} from './src/combine.js'

export default GaussianAI
function GaussianAI(x,y,epochs)
{
  var result = new AI(x,y);

  const baseLayer = layer(x,y,epochs, [])

  // console.log(baseLayer.model[0].error)
  // console.log(y)

  const processed = []
  for(const preProcessing of preProcessingList)
  {
    processed.push({fn:preProcessing, value:x.map(preProcessing)});
  }

  const processedBatch = batch(processed)


  const best = y[0].map(x=>{return{
    error: 99999
  }})

  for(const index in processedBatch.data[0])
  {
    const current = processedBatch.data.map(x=>x[index].value)
    const currentTraining = layer(current, y, epochs)
    for(const mindex in currentTraining.model)
    {
      const model = currentTraining.model[mindex]
      if(model.error < best[mindex].error)
      {
        best[mindex].error = model.error
        best[mindex].weights = model.weights
        best[mindex].map = processedBatch.data[0][index].map
      }
    }
    // console.log(currentTraining)
    // if(currentTraining.error < best.error)
    // {
    //   best.error = currentTraining.error
    //   best.weights = currentTraining.model.map(x=>x.weights)
    //   best.map = processedBatch.data[0][index].map
    // }
  }
  console.log(JSON.stringify(best,null,4))
  // console.log(processed.map(x=>x.fn))
  result.model = {
    data: best,
    fn:processed.map(x=>x.fn)
  }
  return result
}
function batch(collection)
{
  const result = {}
  result.functions = collection.map(x=>x.fn)
  result.data = []
  const map = buildMap(collection.map(x=>x.value[0].length))

  for(var i = 0; i< collection[0].value.length; i++)
  {
    const current = collection.map(x=>x.value[i])
    const combined = combine(map, current)
    result.data.push(combined)
  }
  return result
}
function layer(x,y, epochs)
{
  var model = new Array(y[0].length).fill(null)

  for(const index in y[0])
  {
    var localY = y.map(item => [item[index]])

    for(var i = 0; i < epochs; i++)
    {
      var weights = train_epoch(x, localY)
      const {error,prediction} = sample_error_prediction(x, localY, weights)

      if(model[index] == null || error < model[index].error)
      {
        if(model[index] == null)
        {
          model[index] = {}
        }
        model[index].weights = weights
        model[index].error = error
        model[index].prediction = prediction
      }
    }
  }
  return {model, error: model.reduce((prev, current)=>prev+current.error, 0) / y[0].length}
}
class AI
{

  get description()
  {
    return this.model.map(x=>{return{weights:x.weights, preProcessing:x.preProcessing.name}})
  }
  predict(x)
  {
    return x.map(x=>
      {
        const result = []

        let all = []
        for(const item of this.model.fn)
        {
          all.push(item(x))
        }

        for(const { weights, map } of this.model.data)
        {
          result.push(predict(map.map((x,i)=>all[x][i]),weights))
        }
        return result
      }
    )
  }
  
  accuracy(x,y)
  {
    var prediction = this.predict(x)
    var correct = Array(prediction[0].length).fill(0)
    for(var i = 0; i < prediction.length; i++)
    {
      for(var j = 0; j < prediction[i].length; j++)
      {
        if(Math.abs(prediction[i][j] - y[i][j]) < epsilon)
        {
          correct[j] += 1
        }
      }
    }
    var per_output = correct.map(x=>x/prediction.length*100)
    var total = per_output.reduce((a,b)=>a+b,0) / per_output.length + "%"
    per_output = per_output.map(x=>x+"%")
    return {total,per_output}
  }
}



