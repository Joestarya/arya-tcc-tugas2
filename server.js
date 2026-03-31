const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000; 

app.use(cors()); 
app.use(express.json());

const db = mysql.createConnection({
    host: '104.197.141.224', 
    user: 'arya',                      
    password: 'Rahasia123*', 
    database: 'notes',
    db_port: '3306'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terkoneksi ke database:', err.message);
        return;
    }
    console.log('Berhasil terkoneksi ke database MySQL lokal!');
});

app.get('/', (req, res) => {
    res.send('Server Backend API berjalan lancar!');
});

app.post('/notes', (req, res) => {
    const { judul, isi } = req.body;
    const query = 'INSERT INTO notes (judul, isi) VALUES (?, ?)';
    
    db.query(query, [judul, isi], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal menambah catatan', detail: err.message });
        }
        res.status(201).json({ 
            message: 'Catatan berhasil ditambahkan!', 
            id: results.insertId 
        });
    });
});

// 2. READ: Lihat Semua Catatan
app.get('/notes', (req, res) => {
    const query = 'SELECT * FROM notes ORDER BY tanggal_dibuat DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal mengambil data catatan', detail: err.message });
        }
        res.status(200).json(results);
    });
});

// 3. UPDATE: Edit Catatan Berdasarkan ID
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { judul, isi } = req.body;
    const query = 'UPDATE notes SET judul = ?, isi = ? WHERE id = ?';
    
    db.query(query, [judul, isi, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal mengupdate catatan', detail: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }
        res.status(200).json({ message: 'Catatan berhasil diupdate!' });
    });
});

// 4. DELETE: Hapus Catatan Berdasarkan ID
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM notes WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal menghapus catatan', detail: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        }
        res.status(200).json({ message: 'Catatan berhasil dihapus!' });
    });
});

// Jalankan Server
app.listen(port, () => {
    console.log(`Server Express berjalan di http://localhost:${port}`);
});