const mongoose = require('mongoose')
const stuctModels = require('./models')

module.exports = ( uri ) => {
    mongoose.connect(uri)
    return stuctModels( mongoose )
}
