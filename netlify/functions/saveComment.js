const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    console.log('saveComment function invoked');
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
        console.log('Saving comment to:', filePath);
        fs.appendFileSync(filePath, comment + '\n', 'utf8');
        console.log('Comment saved successfully');

        // Read the file to verify the comment was saved
        const comments = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
        console.log('Current comments:', comments);

        return {
            statusCode: 200,
            body: JSON.stringify(comments),
        };
    } catch (error) {
        console.error('Error saving comment:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to save comment', error: error.message }),
        };
    }
};
