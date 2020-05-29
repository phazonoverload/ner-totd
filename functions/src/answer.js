require('dotenv').config()
const airtable = require('airtable-plus')
const base = new airtable({
  baseID: process.env.AIRTABLE_BASE,
  apiKey: process.env.AIRTABLE_KEY,
  tableName: 'Thoughts'
})

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
}

exports.handler = async (event, context) => {
  try {
    console.log('answer endpoint log');
    const thoughts = await base.read({ filterByFormula: '{Today}="Yes"' })
    const ncco = [];
    if(thoughts.length > 0) {
      ncco.push({
        action: 'stream',
        streamUrl: [thoughts[0].fields.File[0].url]
      })
    } else {
      ncco.push({
        action: 'talk',
        text: 'Hello! We do not have a thought of the day yet.'
      })
    }
    return {
      headers: headers,
      statusCode: 200,
      body: JSON.stringify(ncco)
    }
  } catch(error) {
    return {
      headers: headers,
      statusCode: 500,
      body: 'Error: ' + error
    }
  }
}