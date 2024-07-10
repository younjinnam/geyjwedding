const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        const filePath = path.join(__dirname, 'comments.txt');
        const comments = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);

        return {
            statusCode: 200,
            body: JSON.stringify(comments),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to retrieve comments', error: error.message }),
        };
    }
};
