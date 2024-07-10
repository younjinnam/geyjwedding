const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const data = JSON.parse(event.body);
    const comment = data.comment;

    if (!comment) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Comment is required' }),
        };
    }

    try {
        const filePath = path.resolve('/tmp/comments.txt');
        fs.appendFileSync(filePath, comment + '\n', 'utf8');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Comment saved successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to save comment', error: error.message }),
        };
    }
};
