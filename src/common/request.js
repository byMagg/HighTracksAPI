const sendJSONresponse = (res, status, content) => {
    if (res === undefined) return;
    res.status(status);
    res.json(content);
};

module.exports = {
    sendJSONresponse
}