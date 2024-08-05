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
    const myname = data.myname; // 'name' 대신 'myname' 사용
    const comment = data.comment;

    if (!myname || !comment) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Name and comment are required' }),
        };
    }

    const client = new faunadb.Client({ secret: 'YOUR_FAUNADB_SECRET' });

    try {
        await client.query(
            q.Create(
                q.Collection('comments'),
                { data: { myname: myname, comment: comment } }  // myname과 comment를 함께 저장
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
