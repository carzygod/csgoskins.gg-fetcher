const analyze = require("./data/newprice.json");
var fs = require('fs')

const accept_loss = 0.05

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

function steamBuff()
{
    var ret = []
    const digestData = digest();
    // console.log(digestData)
    digestData.forEach(ele => {
        if(ele.price.Steam && ele.price.BUFF163)
        {
            const priceSub = (Number(ele.price.Steam.price) - Number(ele.price.BUFF163.price)) /  Number(ele.price.Steam.price);
            if(
                (priceSub <= accept_loss && (Number(ele.price.Steam.offers)>500 || (ele.price.Steam.offers.split("k").length > 1))) &&
                (priceSub <= accept_loss && (Number(ele.price.BUFF163.offers)>500 || (ele.price.BUFF163.offers.split("k").length > 1)))
            )
            {
                ret.push (ret)
                console.log(ele)
            }
        }
    });
    // console.log(Object.keys(analyze))
    // console.log(ret.length)
}


function main()
{
    steamBuff();

}


main()
