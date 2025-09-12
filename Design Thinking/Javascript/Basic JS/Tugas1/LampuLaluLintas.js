const warnaLampu = prompt("Masukkan warna lampu lalu lintas (merah, kuning, atau hijau):");
const outputElement = document.getElementById("output-status");
if (warnaLampu === "merah") {
  // Jika inputnya "merah", ubah konten elemen output.
  outputElement.innerHTML = "Kendaraan berhenti. Jangan maju nanti ketabrak";
  // Mengubah warna teks output menjadi merah
  outputElement.style.color = "red";
} else if (warnaLampu === "kuning") {
  // Jika inputnya "kuning", ubah konten elemen output.
  outputElement.innerHTML = "Kendaraan berhati-hati. Hati2 juga bisa ketabrak orang, Jangan lupa berdoa";
  // Mengubah warna teks output menjadi kuning
  outputElement.style.color = "orange";
} else if (warnaLampu === "hijau") {
  // Jika inputnya "hijau", ubah konten elemen output.
  outputElement.innerHTML = "Kendaraan berjalan. Maju terus pantang mundur";
  // Mengubah warna teks output menjadi hijau
  outputElement.style.color = "green";
} else
  // Jika inputnya tidak sesuai, berikan pesan error.
  outputElement.innerHTML = "Input tidak valid. Mohon masukkan 'merah', 'kuning', atau 'hijau'.";
  outputElement.style.color = "black";