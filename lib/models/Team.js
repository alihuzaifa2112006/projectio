const mongoose = require('mongoose')

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  assignedWork: {
    type: String,
    default: '',
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }],
}, { timestamps: true })

module.exports = mongoose.models.Team || mongoose.model('Team', TeamSchema)
