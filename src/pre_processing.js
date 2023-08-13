export { preProcessingList }

function combine(x, callback)
{
    const result = []
    for(let i = 0; i < x.length; i++)
    {
        for(let j = i + 1; j < x.length; j++)
        {
            result.push(callback(x[i],x[j]))
        }
    }
    return result
}

function add(x) { return combine(x, (a, b) => a + b) }
function subtract(x) { return combine(x, (a, b) => a - b) }
function multiply(x) { return combine(x, (a, b) => a * b) }
function divide(x) { return combine(x, (a, b) => a / b) }
function rest(x) { return combine(x, (a, b) => a % b) }
function left(x) { return combine(x, (a, b) => a << b) }
function right(x) { return combine(x, (a, b) => a >> b) }
function leftn(x) { return combine(x, (a, b) => a >>> b) }
function and(x) { return combine(x, (a, b) => a & b) }
function xor(x) { return combine(x, (a, b) => a ^ b) }
function or(x) { return combine(x, (a, b) => a | b) }
function bypass(x) { return x }
const preProcessingList = [add, subtract, multiply, divide, rest, left, right, leftn, and, xor, or, bypass]