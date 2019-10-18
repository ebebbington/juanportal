exports.sendResponse = function (res, viewName, data) {
    // check if status code is in the 500 range
    if (/^5\d{2}$/.test(data.statusCode)) {
        res.status(500)
        return res.render(viewName, {title: data.statusCode})
    }
    // check if status code is in the 400 range
    if (/^4\d{2}$/.test(data.statusCode)) {
        res.status(404)
        return res.render(viewName, {title: data.statusCode})
    }
    return res.render(viewName, data)
}