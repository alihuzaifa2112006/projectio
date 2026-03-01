const mongoose = require('mongoose')

const BillingRecordSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  managerConfirmed: {
    type: Boolean,
    default: false,
  },
  employeeConfirmed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

BillingRecordSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true })

module.exports = mongoose.models.BillingRecord || mongoose.model('BillingRecord', BillingRecordSchema)
