const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    designation:{
        type: String,
        required: true,
    },
    salary:{
        type: Number,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
  