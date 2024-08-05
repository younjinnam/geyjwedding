const faunadb = require('faunadb');
const q = faunadb.query;

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

    const client = new faunadb.Client({ secret: 'fnAFl9bH_YAARLTlh4DaCl0Ys14Pwn9eVX7y49Oe' });

    try {
        await client.query(
            q.Create(
                q.Collection('comments'),
                { data: { comment: comment } }
            )
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Comment saved successfully' }),
        };
    } catch (error) {
        console.error('Error saving comment:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to save comment', error: error.message }),
        };
    }
};
