const puppeteer = require('puppeteer-extra') 
 
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
puppeteer.use(StealthPlugin()) 


const url = 'https://csgoskins.gg/items/'

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
    const ret = await main('glove-case')
    console.log(ret)
}

init()