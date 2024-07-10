const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const filePath = path.resolve('/tmp/comments.json');
        const comments = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '[]';

        return {
            statusCode: 200,
            body: comments,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
