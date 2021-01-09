let request = require("request");
let cheerio = require("cheerio");
const fs = require('fs');
const { default: axios } = require("axios");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const iconv = require('iconv-lite');

let url = "https://www.avito.ru/ekaterinburg/kvartiry/prodam/vtorichka-ASgBAQICAUSSA8YQAUDmBxSMUg?cd=1";

const parse = async () => {
  const getHTMl = async (url) => {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  }
  const $ = await getHTMl(url);
  const pageNumber = $('span.pagination-item-1WyVp').eq(-2).text();
  console.log(pageNumber);
  let res = [];
  for (let i = 1; i <= 2/* pageNumber */; i++) {
    const selector = await getHTMl(
      `https://www.avito.ru/ekaterinburg/kvartiry/prodam/vtorichka-ASgBAQICAUSSA8YQAUDmBxSMUg?cd=1&p=${i}`
    );
    selector('div.iva-item-content-m2FiN')
      .each((i, element) => {

        //const title = iconv.encode(selector(element).find("div.iva-item-titleStep-2bjuh").text(), 'UTF-16').toString();
        const title = selector(element).find("div.iva-item-titleStep-2bjuh").text();
        const address = selector(element).find("div.iva-item-developmentNameStep-1hr7p").text();
        const price = selector(element).find("div.iva-item-priceStep-2qRpg").text();
        const aboutDate = selector(element).find("div.iva-item-dateStep-pZ3hT").text();
        const link = selector(element).find("a.iva-item-sliderLink-2hFV_").attr('href');
        if (title != '') {
          res.push({
            title: title,
            address: address,
            price: price,
            aboutDate: aboutDate,
            link: `https://www.avito.ru${link}`
          });
          fs.appendFileSync('./1.txt', `${title} & ${address} & ${price} & ${aboutDate} & https://www.avito.ru${link}\n`)
          res.push({
            title: title,
            address: address,
            price: price,
            aboutDate: aboutDate,
            link: `https://www.avito.ru${link}`
          });
        }
      });
  }
  /* const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      { id: 'title', title: 'Title' },
      { id: 'address', title: 'Address' },
      { id: 'price', title: 'Price' },
      { id: 'aboutDate', title: 'AboutDate' },
      { id: 'link', title: 'Link' },
    ],
    fieldDelimiter: ';',
    encoding: 'utf8'
  });
  csvWriter.writeRecords(res)
    .then(() => console.log('записано'));
  console.log(res); */
}


parse();














/* request(url, function (error, response, body) {
  if (!error) {
    let $ = cheerio.load(body);
    let data = $('span.title-root-395AQ.iva-item-title-1Rmmj.title-listRedesign-3RaU2.title-root_maxHeight-3obWc.text-text-1PdBw.text-size-s-1PUdo.text-bold-3R9dt').html();
    console.log('data', data);
  } else {
    console.log('error', error);
  }
}); */


