var generateOTP = async () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 5; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
}

module.exports = { generateOTP }; 