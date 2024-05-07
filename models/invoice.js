const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const invoices = new Schema({
    userid: {
        type: mongoose.Types.ObjectId
    },

    invoice: [
        {
            companyName: {
                type: String
            },
            companyAddress: {
                type: String
            },
            customerName: {
                type: String
            },
            customerAddress: {
                type: String
            },
            invoiceItems: [
                {
                    name: {
                        type: String
                    },
                    quantity: {
                        type: Number
                    },
                    price: {
                        type: Number
                    }
                }
            ]
        }
    ]

    

});


module.exports = mongoose.model("invoices",invoices);

