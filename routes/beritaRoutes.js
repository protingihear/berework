const express = require("express");
const beritaController = require("../controllers/beritaController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", beritaController.getAllBerita);
router.get("/:id", beritaController.getBeritaById);
router.post("/", upload.single("foto"), beritaController.createBerita); 
router.put("/:id", upload.single("foto"), beritaController.updateBerita); 
router.delete("/:id", beritaController.deleteBerita);

module.exports = router;
