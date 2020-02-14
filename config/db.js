if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://alexx-gsm:25L10i1979@ds219459.mlab.com:19459/vidjot',
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot',
    }
}
