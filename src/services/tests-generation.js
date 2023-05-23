const e = require('express');
const configuration = require('../config/config');

class TestGenerationService {
    constructor(openAIApi) {
        this.openai = openAIApi;
    }

    async getTestGeneration({ endpoint, implementation }) {
        console.log('Tracks:', endpoint, implementation);
        const completion = await this.openai.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content:
                            "Given a list of Endpoint in Express Node.js new Tests with supertest. Reply with only the answer and include no other commentary ONLY CODE using supertest, basically jest. Example: Request - {\"endpoint\":\"/search/:search\",\"implementation\":\"/*GETapi/search/:name*/consttracksSearchSpotify=async(req,res)=>{try{constoffset=req.query.offset||0;constresponse=awaitaxios.get(`https://api.spotify.com/v1/search?type=track&q=${req.params.search}&limit=20&offset=${offset}`,{headers:{Authorization:`Bearer${config.TOKEN_SECRET_SPOTIFY}`,},});sendJSONresponse(res,200,response.data);}catch(error){console.error(`Erroralobtenerlainformacióndelacanción:${error.message}`);console.error(error);sendJSONresponse(res,400,{error:{code:'400',message:'Lasolicitudesincorrecta.Verifiquequelainformaciónproporcionadaseaválidayestécompleta.',},});}};\"}",
                    },
                    {
                        role: 'user',
                        content: implementation
                    },
                ],
            },
            {
                headers: {
                    'api-key': configuration.openai.apiKey,
                },
                params: {
                    'api-version': '2023-03-15-preview',
                },
            }
        );
        console.log(completion.data.choices[0].message.content);

        return this.extractJSON(completion.data.choices[0].message.content);
    }

    extractJSON(text) {
        const jsonStart = text.indexOf('```json');
        if (jsonStart === -1) {
            try {
                const tracks = JSON.parse(text);
                return tracks.tracks ? tracks : { tracks };
            } catch (error) {
                return;
            }
        }
        const jsonEnd = text.indexOf('```', jsonStart + 1);
        const json = text.substring(jsonStart + 7, jsonEnd);
        return JSON.parse(json);
    }
}

module.exports = TestGenerationService;
