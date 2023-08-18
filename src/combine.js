export { combine, buildMap }
function combine(map, items)
{
    
    let data = items

    var result = []
    for(const item of map)
    {
        const current = []
        result.push({value:current, map:item})
        for(const part in item)
        {
            current.push(data[item[part]][part])
        }
    }
    return result
}
function buildMap(items)
{
    return combinations(items.reduce((prev,current)=>Math.max(prev, current), 0), items.map(x=>x))
}
function combinations(n, items)
{
    if(n == 0)
    {
        return [[]]
    }
    else
    {
        const prev = combinations(n-1,items)
        const result = []

        for(const index in items)
        {
            if(n <= items[index])
            {
                for(const row of prev)
                {
                    result.push([...row, Number(index)])
                }
            }
        }

        return result
    }
}