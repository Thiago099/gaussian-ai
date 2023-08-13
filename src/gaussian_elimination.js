export { gaussian_elimination }
import { epsilon } from "./utils.js";

function gaussian_elimination(input) {
  let i = 0;
  let doneLines = [];
  while (i < input[0].length-1) {

      let minZeros = Infinity;
      let minLine = 0;
      for (let j = 0; j < input.length; j++) {
          let k;
          for (k = i; k < input[j].length-1; k++) {
              if (Math.abs(input[j][k]) > epsilon) {
                  break;
              }
          }
          if (k < minZeros && !doneLines.includes(j)) {
              minZeros = k;
              minLine = j;
          }
      }

      doneLines.push(minLine);

      
      i = minZeros;
      if (minZeros == Infinity) break;
      if (Math.abs(input[minLine][i]) < epsilon) {
        continue;
      }
      normalize(input[minLine][i], input[minLine]);
      for (let j = 0; j < input.length; j++) {
        if (j != minLine) {
          nullify(input[j][i], input[minLine], input[j]);
        }
      }
      i += 1;
    }
  }


  function normalize(value, line) {
    for (let i = 0; i < line.length; i++) {
        line[i] /= value;
    }
  }
  
  function nullify(value, source, target) {
    for (let i = 0; i < source.length; i++) {
        target[i] -= source[i] * value;
    }
  }


