const analyze = require("./data/price.json");
var fs = require('fs')

function digest()
{
    const d = [];
    const k = Object.keys(analyze)
    for(var i = 0 ; i < k.length ; i++)
    {
        const skin = k[i]
        const seed = analyze[skin]

        var ret = {
            skin : skin,
            price : {}
        }

        seed.forEach(ele => {
            ret.price[ele.exchange] = ele
        });
        d.push(ret)
        // console.log(ret)
    }
    return d ; 
}

function main()
{
    const digestData = digest();
    // console.log(digestData)
    digestData.forEach(ele => {
        if(ele.price.Steam && ele.price.BUFF163)
        {
            const priceSub = (Number(ele.price.Steam.price) - Number(ele.price.BUFF163.price)) /  Number(ele.price.Steam.price);
            if(priceSub <= -0.1)
            {
                console.log(ele)
            }
        }
    });
    // console.log(Object.keys(analyze))
}


main()
