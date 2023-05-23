const configuration = require('../config/config');

class TrackRecommendationsService {
    constructor(openAIApi) {
        this.openai = openAIApi;
    }

    async getTrackRecommendations({ tracks }) {
        const completion = await this.openai.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content:
                            "Given a list of tracks suggest 5 new tracks. Reply with only the answer in JSON form and include no other commentary. It is an array of objects called tracks with title, artist, year and reason. Example: {tracks: [{title: '...', artist: '...', year: 2020, reason: '...'}, ...]}",
                    },
                    {
                        role: 'user',
                        content: tracks.join(','),
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

module.exports = TrackRecommendationsService;