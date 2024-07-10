const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    console.log('getComments function invoked');
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        const filePath = path.resolve('/tmp/comments.txt');
        console.log('Reading comments from:', filePath);
        const comments = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean) : [];
        console.log('Comments read successfully:', comments);

        return {
            statusCode: 200,
            body: JSON.stringify(comments),
        };
    } catch (error) {
        console.error('Error reading comments:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to retrieve comments', error: error.message }),
        };
    }
};
