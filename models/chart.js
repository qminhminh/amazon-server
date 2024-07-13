const mongoose = require('mongoose');
const { listmoneySchema } = require('./list_money');

const chartSchema = mongoose.Schema({
    id :{
        type: String,
        default: '',
    },
    
    moneys:[listmoneySchema],
});

const Chart = mongoose.model("Chart",chartSchema);
module.exports = Chart;

