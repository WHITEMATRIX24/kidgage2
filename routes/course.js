const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Route to add a course
router.post('/addcourse', async (req, res) => {
    try {
        const { providerId, name, duration, durationUnit, startDate, endDate, description, feeAmount, feeType, days, timeSlots, location, hashtags } = req.body;

        const newCourse = new Course({
            providerId,
            name,
            duration,
            durationUnit,
            startDate,
            endDate,
            description,
            feeAmount,
            feeType,
            days,
            timeSlots,
            location,
            hashtags // Include this field
        });

        await newCourse.save();
        res.status(201).json({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to search for a course by name
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;

        // Find course by name (case-insensitive search)
        const course = await Course.findOne({ name: { $regex: new RegExp(name, 'i') } });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update a course
router.put('/update/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a course
router.delete('/delete/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Route to get courses by provider IDs
router.get('/by-providers', async (req, res) => {
    const { providerIds } = req.query;

    try {
        const courses = await Course.find({ providerId: { $in: providerIds } });
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/course/:id', async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
module.exports = router;
