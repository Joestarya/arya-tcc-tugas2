const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '104.197.141.224',
    user: 'arya',
    password: 'Rahasia123*',
    database: 'notes'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terkoneksi:', err.message);
        process.exit(1);
    }
    console.log('Terkoneksi ke database');

    // Buat table jika belum ada
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        judul VARCHAR(255) NOT NULL,
        isi TEXT NOT NULL,
        tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Gagal membuat table:', err.message);
            process.exit(1);
        }
        console.log('✓ Table notes sudah siap!');
        db.end();
    });
});
