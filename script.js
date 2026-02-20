// Nama-nama yang akan dimasukkan ke dalam dropdown
const names = [
    "Widiastuti",
    "Dhea Alfrianti",
    "Hikmatunnazilah",
    "Marsia Yohana Apriani Loblar",
    "Ragmar Faikar Eka",
    "Tim 1",
    "Tim 2",
    "Tim 3"
];

// Mengurutkan nama secara alfabetis
names.sort();

// Mengisi dropdown Nama dengan nama-nama yang telah diurutkan
const nameSelect = document.getElementById("name");

// Menambahkan opsi kosong di awal
const firstOption = document.createElement("option");
firstOption.value = "";
firstOption.textContent = "Pilih Nama";
firstOption.disabled = true;
firstOption.selected = true;
nameSelect.appendChild(firstOption);

// Menambahkan nama-nama lainnya setelah opsi kosong
names.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    nameSelect.appendChild(option);
});

// Mengambil data absensi dari localStorage dan menampilkannya
const loadAttendance = () => {
    const attendanceList = JSON.parse(localStorage.getItem("attendance")) || [];
    const listElement = document.getElementById("attendanceList");
    listElement.innerHTML = ""; // Clear the list before rendering

    attendanceList.forEach((entry, index) => {
        const listItem = document.createElement("tr");

        listItem.innerHTML = `
            <td>${entry.name}</td>
            <td>${entry.date}</td>
            <td>${entry.status}</td>
            <td>
                <button class="edit-btn" onclick="editAttendance(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteAttendance(${index})">Hapus</button>
            </td>
        `;
        listElement.appendChild(listItem);
    });
};

// Menyimpan data absensi ke localStorage
const saveAttendance = (attendanceData) => {
    const attendanceList = JSON.parse(localStorage.getItem("attendance")) || [];
    attendanceList.unshift(attendanceData);  // Menambahkan data terbaru ke awal array
    localStorage.setItem("attendance", JSON.stringify(attendanceList));
};

// Memperbarui data absensi di localStorage
const updateAttendance = (index, updatedData) => {
    const attendanceList = JSON.parse(localStorage.getItem("attendance")) || [];
    attendanceList[index] = updatedData;
    localStorage.setItem("attendance", JSON.stringify(attendanceList));
};

// Menghapus data absensi dari localStorage
const deleteAttendance = (index) => {
    const attendanceList = JSON.parse(localStorage.getItem("attendance")) || [];
    attendanceList.splice(index, 1); // Menghapus entri berdasarkan indeks
    localStorage.setItem("attendance", JSON.stringify(attendanceList));
    loadAttendance(); // Muat ulang daftar absensi setelah penghapusan
};

// Menangani form submit
document.getElementById("attendanceForm").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;

    if (name && date && status) {
        const attendanceData = { name, date, status };
        saveAttendance(attendanceData);
        loadAttendance();
    } else {
        alert("Semua kolom harus diisi!");
    }

    document.getElementById("attendanceForm").reset();
});

// Edit data absensi
const editAttendance = (index) => {
    const attendanceList = JSON.parse(localStorage.getItem("attendance"));
    const entry = attendanceList[index];

    // Isi form dengan data yang akan diedit
    document.getElementById("name").value = entry.name;
    document.getElementById("date").value = entry.date;
    document.getElementById("status").value = entry.status;

    // Hapus data yang lama dan ganti tombol kirim dengan tombol update
    const form = document.getElementById("attendanceForm");
    const submitButton = form.querySelector("button");
    submitButton.textContent = "Update Absensi";

    // Update form dengan tombol update
    form.onsubmit = (event) => {
        event.preventDefault();
        const updatedData = {
            name: document.getElementById("name").value,
            date: document.getElementById("date").value,
            status: document.getElementById("status").value,
        };
        updateAttendance(index, updatedData);
        loadAttendance();

        // Kembalikan tombol ke "Kirim Absensi"
        submitButton.textContent = "Kirim Absensi";
        form.reset();
        form.onsubmit = (event) => {
            event.preventDefault();
            const name = document.getElementById("name").value;
            const date = document.getElementById("date").value;
            const status = document.getElementById("status").value;
            if (name && date && status) {
                const attendanceData = { name, date, status };
                saveAttendance(attendanceData);
                loadAttendance();
            } else {
                alert("Semua kolom harus diisi!");
            }
            form.reset();
        };
    };
};

// Fungsi untuk mengunduh laporan absensi per bulan
const downloadReport = () => {
    const attendanceList = JSON.parse(localStorage.getItem("attendance")) || [];
    const month = prompt("Masukkan bulan (Format: YYYY-MM, contoh: 2022-03):");

    if (!month) {
        alert("Bulan tidak boleh kosong!");
        return;
    }

    // Filter data absensi per bulan
    const filteredAttendance = attendanceList.filter(entry => entry.date.startsWith(month));

    if (filteredAttendance.length === 0) {
        alert("Tidak ada data absensi untuk bulan ini.");
        return;
    }

    // Membuat file CSV
    const csvContent = "Nama,Tanggal,Status\n" +
        filteredAttendance.map(entry => `${entry.name},${entry.date},${entry.status}`).join("\n");

    // Membuat link unduh
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `absensi_${month}.csv`;
    link.click();
};

// Memuat daftar absensi saat halaman dimuat
window.onload = loadAttendance;

// Tambahkan tombol untuk mengunduh laporan
document.getElementById("downloadReportButton").addEventListener("click", downloadReport);