const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Employee = require('../models/employee');
const EmployeeCafeAssignment = require('../models/employeeCafeAssignment');

function generateEmployeeId() {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'UI';
    for (let i = 0; i < 7; i++) {
        id += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    return id;
}

router.get('/', async (req, res) => {
    const cafeId = req.query.cafeId;
    try {
        let match = {};
        if (cafeId) {
            match = {cafeId};
        }

        const employees = await Employee.aggregate([
            {
                $lookup: {
                    from: "employeecafeassignments",
                    let: { employeeId: "$employeeId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$employeeId", "$$employeeId"] } } },
                        { $match: match }
                    ],
                    as: "assignments"
                }
            },
            { $unwind: { path: "$assignments", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "cafes",
                    localField: "assignments.cafeId",
                    foreignField: "cafeId",
                    as: "cafeDetails"
                }
            },
            { $unwind: { path: "$cafeDetails", preserveNullAndEmptyArrays: true } },
            {
                $match: cafeId ? { "assignments.cafeId": cafeId } : {}
            },
            {
                $project: {
                    _id: 0,
                    employeeId: 1,
                    name: 1,
                    email: "$email_address",
                    phone: "$phone_number",
                    gender: 1,
                    cafeDetails: 1,
                    daysWorked: {
                        $cond: {
                            if: { $gt: ["$assignments.startDate", null] },
                            then: {
                                $floor: {
                                    $divide: [
                                        { $subtract: [new Date(), "$assignments.startDate"] },
                                        1000 * 60 * 60 * 24
                                    ]
                                }
                            },
                            else: null
                        }
                    }
                }
            },
            { $sort: { daysWorked: -1 } }
        ]);

        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { email: email_address, phone: phone_number, name, gender, cafeId } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const generatedEmployeeId = generateEmployeeId();
        const employee = new Employee({ employeeId: generatedEmployeeId, name, email_address, phone_number, gender });
        await employee.save({ session });

        if (cafeId) {
            const startDate = new Date().getTime();
            const assignment = new EmployeeCafeAssignment({ employeeId: generatedEmployeeId, cafeId, startDate});
            await assignment.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(employee);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { email: email_address, phone: phone_number, name, gender, cafeId } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Find the employee by ID
        let employee = await Employee.findOne({ employeeId: req.params.id }).session(session);
        if (!employee) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'Employee not found' });
        }

        let empCafeAssignment = await EmployeeCafeAssignment.findOne({ employeeId: employee.employeeId }).session(session);
        let isCafeChanged = false;

        if (empCafeAssignment) {
            isCafeChanged = cafeId !== empCafeAssignment.cafeId;
        } else if (cafeId) {
            isCafeChanged = true;
        }

        const startDate = isCafeChanged ? new Date().getTime() : (empCafeAssignment ? empCafeAssignment.startDate : new Date().getTime());

        // Update employee details
        employee.name = name;
        employee.email_address = email_address;
        employee.phone_number = phone_number;
        employee.gender = gender;
        await employee.save({ session });

        // Update or create the employee cafe assignment
        if (empCafeAssignment) {
            empCafeAssignment.cafeId = cafeId;
            empCafeAssignment.startDate = startDate;
            await empCafeAssignment.save({ session });
        } else {
            empCafeAssignment = new EmployeeCafeAssignment({
                employeeId: employee.employeeId,
                cafeId: cafeId,
                startDate: startDate
            });
            await empCafeAssignment.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.json(employee);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findOneAndDelete({ employeeId: req.params.id });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        await EmployeeCafeAssignment.findOneAndDelete({ employeeId: employee.employeeId });

        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;