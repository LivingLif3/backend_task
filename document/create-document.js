const path = require('path')

module.exports = (firstName, lastName, image) => {
    console.log(path.resolve(__dirname, '..', 'static', image), 'here')
    return(
        `
        <!doctype html>
        <html>
        <head>
        <meta charset="utf-8">
        <title>PDF Result Template</title>
        </head>
        <body>
        <div>firstName : ${firstName}</div>
        <div>lastName : ${lastName}</div>
        <img src="${path.resolve(__dirname, '..', 'static', image)}" />
        </body>
        </html>
        `
    )
}