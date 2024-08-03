const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const { GridFSBucket } = require('mongodb');
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const Cafe = require('../models/cafe');
const EmployeeCafeAssignment = require('../models/employeeCafeAssignment');

const conn = mongoose.connection;

const storage = new GridFsStorage({
    url: process.env.DB_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                try {
                    if (err) {
                        console.log("error", err);
                        return reject(err);
                    }

                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads' // Collection name in MongoDB
                    };
                    resolve(fileInfo);
                } catch (e) {
                    console.error("error in saving", e);
                }
            });
        });
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    const location = req.query.location;
    try {
        let cafes;
        if (location) {
            cafes = await Cafe.find({ location: new RegExp(location, 'i') }).lean();
            if (!cafes.length) {
                return res.json([]);
            }
        } else {
            cafes = await Cafe.find().lean();
        }

        const cafeEmployeeCount = await EmployeeCafeAssignment.aggregate([
            { $group: { _id: "$cafeId", employeeCount: { $sum: 1 } } },
            { $sort: { employeeCount: -1 } }
        ]);

        const cafeMap = new Map(cafeEmployeeCount.map(c => [c._id.toString(), c.employeeCount]));
        cafes.forEach(cafe => {
            cafe.employeeCount = cafeMap.get(cafe.cafeId) || 0;
        });

        cafes.sort((a, b) => b.employeeCount - a.employeeCount);

        res.json(cafes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(500).send('File upload failed');
        }

        const cafe = new Cafe({
            cafeId: uuidv4(),
            name: req.body.name,
            description: req.body.description,
            logo: file.id,
            location: req.body.location
        });
        await cafe.save();
        res.status(201).json(cafe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            console.log("image not updated");
        } else {
            // Find the cafe and delete the old image
            const cafe = await Cafe.findOne({ cafeId: req.params.id });
            if (cafe && cafe.logo) {
                const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
                await bucket.delete(new mongoose.Types.ObjectId(cafe.logo));
            }
            req.body.logo = file.id;
        }

        const cafe = await Cafe.findOneAndUpdate({ cafeId: req.params.id }, req.body, { new: true });
        if (!cafe) return res.status(404).json({ error: 'Cafe not found' });
        res.json(cafe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const cafe = await Cafe.findOneAndDelete({ cafeId: req.params.id }, { session });
        if (!cafe) return res.status(404).json({ error: 'Cafe not found' });

        await EmployeeCafeAssignment.deleteMany({ cafeId: cafe.cafeId }, { session });

        if (cafe && cafe.logo) {
            const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
            await bucket.delete(new mongoose.Types.ObjectId(cafe.logo));
        }

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Cafe and associated employees deleted' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
});

conn.once('open', () => {
    console.log('MongoDB connection established successfully');
});

router.get('/image/:id', async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const bucket = new GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });
        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on('error', (error) => {
            console.error('Error during download stream:', error);
            res.status(404).send({ error: 'Image not found' });
        });

        downloadStream.pipe(res).on('finish', () => {
            console.log('Image fetch completed');
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send({ error: 'Failed to fetch image' });
    }
});

module.exports = router;