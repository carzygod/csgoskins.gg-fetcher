const puppeteer = require('puppeteer-extra') 
var fs = require('fs')
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
puppeteer.use(StealthPlugin()) 

const catalogUrl = 'https://csgoskins.gg/?page='

const url = 'https://csgoskins.gg/items/'

const rawCatalog = require("./data/catalog.json")

async function catalog(pages)
{
    const browser = await puppeteer.launch(
        {
            args: ['--no-sandbox'],
        }
    );
    const page = await browser.newPage();
    await page.goto(catalogUrl+pages);
    await page.waitForTimeout(2000) 
    await page.setViewport({width: 1080, height: 1024});
    const sel = 'div.bg-gray-800.rounded.shadow-md.relative.flex.flex-wrap'
    const eles =  await page.evaluate((sel) => {
        let elements = Array.from(document.querySelectorAll(sel));
        let links = elements.map(element => {
            return element.innerHTML
        })
        return links;
    }, sel);
    var finalData = []
    eles.forEach(e => {
        const name =  e.match(/href\=\"https:\/\/csgoskins.gg\/items\/(\S*)\"/);
        if(name && name.length > 0)
        {
            // console.log(name[1])
            finalData.push(name[1])
        }
    });
    await browser.close();
    return finalData
}

async function main (itemsName)
{
        const browser = await puppeteer.launch(
            {
                args: ['--no-sandbox'],
            }
        );
        const page = await browser.newPage();
        await page.goto(url+itemsName);
        await page.waitForTimeout(2000) 
        await page.setViewport({width: 1080, height: 1024});
        const sel = 'div.bg-gray-800.rounded.shadow-md.relative.flex.items-center.flex-wrap.my-4'
        const eles =  await page.evaluate((sel) => {
            let elements = Array.from(document.querySelectorAll(sel));
            let links = elements.map(element => {
                return element.innerHTML
            })
            return links;
        }, sel);
        var finalData = []
        eles.forEach(e => {
            const exchangeName = e.match(/alt\=\"(\S*)\"/)[1];
            const rawOffers =e.match(/\<span class=\"\"\>(\S*)\<\/span\>/)[1];
            const rawPrice =e.match(/\<span class\=\"font-bold text-xl\"\>(\S*)\<\/span\>/)[1];
            const price = rawPrice.split("$")[1]
            const full = {
                "exchange":exchangeName,
                "offers":rawOffers,
                "price":price,
            }
            finalData.push(full);
        });
        await browser.close();
        return finalData
}

async function init()
{

    //Catalog  fetch

    // fs.appendFileSync('./data/catalog.json',
    // `[`
    // , 'utf8'); 
    // //Get all the catalog
    // for(var i = 1 ; i <198 ; i++)
    // {
    //     const cat = await catalog(i)
    //     cat.forEach(e => {
    //         fs.appendFileSync('./data/catalog.json',
    //         `"${e}",`
    //         , 'utf8'); 
    //     });
    //     console.log(i)
    // }


    //Fetch all the price data 

    fs.appendFileSync('./data/price.json',
    `{`
    , 'utf8'); 
    for(var i = 0 ; i < rawCatalog.length ; i++)
    {
        const ret = await main(rawCatalog[i])
        fs.appendFileSync('./data/price.json',
        `"${rawCatalog[i]}" : ${JSON.stringify(ret)},`
        , 'utf8'); 
    }

}

init()