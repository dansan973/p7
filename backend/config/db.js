const mongoose = require("mongoose")

mongoose
    .connect('mongodb+srv://' + process.env.DB_CONNECTION + '/P7?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,




    })
    .then(() => console.log('connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB', err))