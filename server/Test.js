const accountSid = 'AC747e2dd2cb4941e299664bf3cdb00429';
const authToken = '96219b7ee380f3244a3574b5556461c7';
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

client.messages
      .create({
         body: 'Hi Basheer Bhai! This is waqar salon app.',
         from: '+18646136162',
         to: '+923331280140'
       })
      .then(message => console.log(message.sid))
      .catch(err => console.log(err));