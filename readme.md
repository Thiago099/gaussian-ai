This is a artificial intelligence that instead of gradient descent, it uses Gaussian elimination.

you can install it by
```text
npm i gaussian-ai
```
then you can use it like so:
```js

import GaussianAI from 'gaussian-ai'

// Example of rule to fit
// only 0s and 1s
// if the last input is 0 return the first two inputs
// otherwise reverse them 

const x = [
    [1,0,0],
    [0,1,0],
    [1,0,1],
    [0,1,1],
]


const y = [
    [1,0],
    [0,1],
    [0,1],
    [1,0],
]


var model = GaussianAI(x,y,10)

console.log(model.accuracy(x,y))

console.log(model.predict([[0,1,1]]))

```

```text
{ total: '100%', per_output: [ '100%', '100%' ] }
[ [ [ 1 ], [ 0 ] ] ]
```