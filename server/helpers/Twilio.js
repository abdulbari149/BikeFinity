const twilio = require('twilio');
const accountSid = 'AC5c5f39fa964e7efdef6d9a143da1d0b2';
const authToken = '10f4b2f86334cd086578c337d2e78ff3';

const client = new twilio(accountSid, authToken);

const sendMessage = async (body, to) => {

    let result = await client.messages.create({
        body: body,
        to: "+92" + to,
        from: '+17066053042',
    });
    
    return result
}

module.exports = sendMessage;