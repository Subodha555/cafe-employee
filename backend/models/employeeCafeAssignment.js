const mongoose = require('mongoose');

const employeeCafeAssignmentSchema = new mongoose.Schema({
    employeeId: { type: String, ref: 'Employee' },
    cafeId: { type: String, ref: 'Cafe' },
    startDate: Date
});

employeeCafeAssignmentSchema.index({ employeeId: 1 }, { unique: true });

module.exports = mongoose.model('EmployeeCafeAssignment', employeeCafeAssignmentSchema);