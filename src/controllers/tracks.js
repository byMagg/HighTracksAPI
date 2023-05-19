const mongoose = require('mongoose');
const axios = require('axios')
const Track = mongoose.model('Track');
const config = require('../common/config');
const { sendJSONresponse } = require('../common/request')
const { ObjectId } = mongoose.Types;

/* GET api/search/:name */
const tracksSearchSpotify = async (req, res) => {
    try {
        const offset = req.query.offset || 0;
        const response = await axios.get(`https://api.spotify.com/v1/search?type=track&q=${req.params.search}&limit=20&offset=${offset}`, {
            headers: {
                Authorization: `Bearer ${config.TOKEN_SECRET_SPOTIFY}`
            }
        })
        sendJSONresponse(res, 200, response.data)
    } catch (error) {
        console.error(`Error al obtener la información de la canción: ${error.message}`);
        console.error(error);
        sendJSONresponse(res, 400, {
            "error": {
                "code": "400",
                "message": "La solicitud es incorrecta. Verifique que la información proporcionada sea válida y esté completa."
            }
        })
    }
};

/* GET api/tracks/search */
const trackSearchByField = async (req, res) => {
    try {
        const artist = req.query.artist;
        const name = req.query.name;
        const date = req.query.date;
        let track = {};
        if (artist) {
            const regex = new RegExp(artist, "i");
            track = await Track.find({ "album.artists.name": regex });
        }
        if (name) {
            const regex = new RegExp(name, "i");
            track = await Track.find({ name: regex });
        }
        if (date) {
            const regex = new RegExp(date, "i");
            track = await Track.find({ "album.release_date": regex });

        }
        if (!track) {
            return sendJSONresponse(res, 404, 'No se encontró la pista con la búsqueda especificada.');
        }
        sendJSONresponse(res, 200, track)
    } catch (err) {
        sendJSONresponse(res, 500, err)
    }
};

/* GET api/tracks/:id */
const trackGetOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const track = await Track.findById(id);
        if (!track) {
            return sendJSONresponse(res, 404, 'No se encontró la pista con el id especificado.');
        }
        sendJSONresponse(res, 200, track)
    } catch (err) {
        sendJSONresponse(res, 500, err)
    }
};

/* GET api/tracks */
const trackGetAll = async (req, res) => {
    try {
        const track = await Track.find({});

        if (!track) {
            return sendJSONresponse(res, 404, 'No se encontró la pista con el nombre especificado.');
        }
        sendJSONresponse(res, 200, track)
    } catch (err) {
        sendJSONresponse(res, 500, err)
    }
};

/* POST api/tracks/ */
const trackInsertMany = async (req, res) => {
    try {

        let tracks = req.body;

        if (!Array.isArray(tracks)) {
            tracks = [tracks];
        }

        tracks = tracks.map(track => {
            return {
                _id: track.id,
                ...track
            }
        });
        await Track.insertMany(tracks);
        sendJSONresponse(res, 201, tracks)
    } catch (err) {
        if (err.code === 11000) {
            sendJSONresponse(res, 400, 'Ya existe una pista con el ID especificado.');
            return;
        }
        console.log(err);
        sendJSONresponse(res, 400, err)
    }
};

/* PUT api/tracks/ */
const trackUpdate = async (req, res) => {
    try {
        const trackId = req.params.id;
        const updatedTrack = await Track.findOneAndUpdate({ _id: trackId }, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedTrack) {
            return sendJSONresponse(res, 404, 'No se encontró la pista con el ID especificado.');
        }
        sendJSONresponse(res, 200, updatedTrack)
    } catch (err) {
        sendJSONresponse(res, 500, err)
    }
};

/* DELETE api/tracks/ */
const trackDelete = async (req, res) => {
    try {
        const trackId = req.params.id;
        const deletedTrack = await Track.findOneAndDelete({ _id: trackId });
        if (!deletedTrack) {
            return sendJSONresponse(res, 404, 'No se encontró la pista con el ID especificado.');
        }
        sendJSONresponse(res, 200, deletedTrack)
    } catch (err) {
        sendJSONresponse(res, 500, err)
    }
};

/* POST api/tracks/:id/comments */
const trackInsertComment = async (req, res) => {
    try {
        const trackId = req.params.id;

        const track = await Track.findById(trackId);
        if (!track) {
            return sendJSONresponse(res, 404, 'No se encontró la pista con el ID especificado.');
        }

        const { author, text, score, location } = req.body;
        const comment = { author, text, score, location };
        track.comments.push(comment);

        await track.save();
        sendJSONresponse(res, 201, comment);
    } catch (error) {
        sendJSONresponse(res, 500, error)
    }
}

/* PUT api/tracks/:id/comments/:commentId */
const commentDeleteOne = async (req, res) => {
    try {
        const trackId = req.params.id;
        const commentId = req.params.commentId;

        const track = await Track.findById(trackId);
        if (!track) {
            return sendJSONresponse(res, 404, 'No se encontró la pista con el ID especificado.');
        }
        track.comments.id(commentId).remove();
        await track.save();
        sendJSONresponse(res, 200, track.comments);
    } catch (error) {
        sendJSONresponse(res, 500, error)
    }
}

/* GET api/tracks/:id/comments */
const commentGetAll = async (req, res) => {
    try {
        const trackId = req.params.id;

        const track = await Track.findById(trackId);
        if (!track) {
            return sendJSONresponse(res, 404, 'No se encontró la pista con el ID especificado.');
        }
        sendJSONresponse(res, 200, track.comments);
    } catch (error) {
        sendJSONresponse(res, 500, error)
    }
}

module.exports = {
    tracksSearchSpotify,
    trackSearchByField,
    trackInsertComment,
    commentGetAll,
    commentDeleteOne,
    trackInsertMany,
    trackGetOneById,
    trackGetAll,
    trackUpdate,
    trackDelete
};