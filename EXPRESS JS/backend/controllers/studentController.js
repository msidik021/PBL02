const Student = require('../models/studentModel');

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.getAll();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await Student.remove(id);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        res.json({ message: 'Student deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM students WHERE kode_siswa = ?", [id]);
    return rows[0];
};