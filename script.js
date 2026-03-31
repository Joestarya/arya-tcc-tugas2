const apiUrl = 'http://34.29.230.68:3000/notes';

// Fungsi 1: Mengambil dan Menampilkan Data (READ)
async function ambilCatatan() {
    try {
        const response = await fetch(apiUrl);
        const notes = await response.json();
        
        const container = document.getElementById('daftar-catatan');
        container.innerHTML = ''; // Kosongkan dulu sebelum diisi ulang

        notes.forEach(note => {
            container.innerHTML += `
                <div class="note-card">
                    <h3>${note.judul}</h3>
                    <small>Dibuat: ${new Date(note.tanggal_dibuat).toLocaleString('id-ID')}</small>
                    <p>${note.isi}</p>
                    <button class="btn-edit" onclick="siapkanEdit(${note.id}, '${note.judul}', '${note.isi}')">Edit</button>
                    <button class="btn-hapus" onclick="hapusCatatan(${note.id})">Hapus</button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Gagal mengambil data:', error);
    }
}

// Fungsi 2: Simpan atau Update Data (CREATE & UPDATE)
async function simpanCatatan() {
    const id = document.getElementById('note-id').value;
    const judul = document.getElementById('judul').value;
    const isi = document.getElementById('isi').value;

    if (!judul || !isi) return alert('Judul dan isi tidak boleh kosong!');

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });

        // Reset form setelah simpan
        batalEdit();
        ambilCatatan(); // Refresh daftar catatan
    } catch (error) {
        console.error('Gagal menyimpan data:', error);
    }
}

// Fungsi 3: Hapus Data (DELETE)
async function hapusCatatan(id) {
    if (!confirm('Yakin ingin menghapus catatan ini?')) return;

    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        ambilCatatan(); // Refresh daftar catatan
    } catch (error) {
        console.error('Gagal menghapus data:', error);
    }
}

// Fungsi Bantuan: Menyiapkan form untuk mode Edit
function siapkanEdit(id, judul, isi) {
    document.getElementById('note-id').value = id;
    document.getElementById('judul').value = judul;
    document.getElementById('isi').value = isi;
    document.getElementById('btn-simpan').innerText = 'Update Catatan';
    document.getElementById('btn-batal').style.display = 'inline-block';
}

// Fungsi Bantuan: Mengembalikan form ke mode Tambah (Batal Edit)
function batalEdit() {
    document.getElementById('note-id').value = '';
    document.getElementById('judul').value = '';
    document.getElementById('isi').value = '';
    document.getElementById('btn-simpan').innerText = 'Simpan Catatan';
    document.getElementById('btn-batal').style.display = 'none';
}

// Jalankan ambilCatatan pertama kali saat halaman dibuka
ambilCatatan();