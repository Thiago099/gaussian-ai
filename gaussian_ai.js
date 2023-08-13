import { train_epoch } from "./src/train.js";
import { sample_error,predict } from "./src/predict.js";
import { epsilon } from "./src/utils.js";
import { preProcessingList } from "./src/pre_processing.js";
export default GaussianAI
function GaussianAI(x,y,epochs)
{
  var result = new AI(x,y);
  var model = new Array(y[0].length).fill(null)
  for(const preProcessing of preProcessingList)
  {
    var localX = x.map(preProcessing);
    
    for(const index in y[0])
    {
      var localY = y.map(item => [item[index]])


      for(var i = 0; i < epochs; i++)
      {
        var weights = train_epoch(localX, localY)
        const error = sample_error(localX, localY, weights)
  
        if(model[index] == null || error < model[index].error)
        {
          if(model[index] == null)
          {
            model[index] = {}
          }
          model[index].weights = weights
          model[index].preProcessing = preProcessing
          model[index].error = error
        }
      }
    }
  }
  result.model = model
  return result
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
        for(const { weights, preProcessing } of this.model)
        {
          result.push(predict(preProcessing(x),weights))
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



