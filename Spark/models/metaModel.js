var mongoose = require('mongoose')
var Schema = mongoose.Schema

var MetaSchema = new Schema({
    appName: { type: String, unique: true, required: true},
    help: {},
    description: {type:String},
    type : {type:String},
    username : {type: String}
})

var Meta = mongoose.model('Meta', MetaSchema)

module.exports = {
    Meta : Meta
}