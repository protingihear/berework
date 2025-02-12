const Berita = require("../models/berita");

// Menampilkan semua berita
exports.getAllBerita = async (req, res) => {
  try {
    const berita = await Berita.findAll();
    res.json(berita);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// Menampilkan berita berdasarkan ID
exports.getBeritaById = async (req, res) => {
  try {
    const berita = await Berita.findByPk(req.params.id);
    if (!berita) return res.status(404).json({ message: "News not found" });
    res.json(berita);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// Menambah berita baru dengan upload gambar (Base64)
exports.createBerita = async (req, res) => {
  try {
    const { judul, isi, tanggal } = req.body;
    const foto = req.file ? req.file.buffer.toString("base64") : null; // Konversi file ke Base64
    
    const berita = await Berita.create({ judul, isi, foto, tanggal });
    res.status(201).json({ message: "News added", berita });
  } catch (error) {
    res.status(500).json({ message: "Error adding news", error });
  }
};

// Mengupdate berita dengan upload gambar (Base64)
exports.updateBerita = async (req, res) => {
  try {
    const { judul, isi, tanggal } = req.body;
    const berita = await Berita.findByPk(req.params.id);
    if (!berita) return res.status(404).json({ message: "News not found" });

    const foto = req.file ? req.file.buffer.toString("base64") : berita.foto; // Gunakan foto baru jika ada

    await berita.update({ judul, isi, foto, tanggal });
    res.json({ message: "News updated", berita });
  } catch (error) {
    res.status(500).json({ message: "Error updating news", error });
  }
};

// Menghapus berita berdasarkan ID
exports.deleteBerita = async (req, res) => {
  try {
    const berita = await Berita.findByPk(req.params.id);
    if (!berita) return res.status(404).json({ message: "News not found" });

    await berita.destroy();
    res.json({ message: "News deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news", error });
  }
};

