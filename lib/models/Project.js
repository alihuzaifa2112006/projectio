const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold'],
    default: 'active',
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }],
}, { timestamps: true })

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema)
