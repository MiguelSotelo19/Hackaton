const express = require("express");
const { authMiddleware, requireRole } = require("../middleware/auth");
const {
  getParcelas,
  getParcelaById,
  createParcela,
  updateParcela,
  deleteParcela
} = require("../controller/parcela.controller");

const router = express.Router();

router.get("/", getParcelas);

router.get("/:id", authMiddleware, getParcelaById);

router.post("/", authMiddleware, requireRole("agricultor"), createParcela);

router.put("/:id", authMiddleware, requireRole("agricultor"), updateParcela);

router.delete("/:id", authMiddleware, requireRole("agricultor"), deleteParcela);

module.exports = router;
