const openai = require('openai');

const config = {
    openai: new openai.Configuration({
        basePath: 'https://dbu104-cnsa.openai.azure.com/openai/deployments/gpt3',
        apiKey: '478efebcd3264e02b25506756a07faa8',
    }),
};

module.exports = config;