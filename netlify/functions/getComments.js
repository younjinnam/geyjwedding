const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    console.log('getComments function invoked');
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const client = new faunadb.Client({ secret: 'fnAFl9bH_YAARLTlh4DaCl0Ys14Pwn9eVX7y49Oe' });

    try {
        const result = await client.query(
            q.Map(
                q.Paginate(q.Documents(q.Collection('comments'))),
                q.Lambda(x => q.Get(x))
            )
        );

        const comments = result.data.map(entry => entry.data.comment);
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
