const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const commenterName = data.commenterName;
        const commentText = data.commentText;
        const date = new Date().toLocaleString();
        const comment = { commenterName, commentText, date };
        const filePath = path.resolve('/tmp/comments.json');

        let comments = [];
        if (fs.existsSync(filePath)) {
            comments = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        comments.push(comment);
        fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Comment saved' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
