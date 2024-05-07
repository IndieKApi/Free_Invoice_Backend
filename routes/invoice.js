const express = require("express");
const isauth = require("../middleware/check-auth");

const router = express.Router();
const invoiceController = require("../controller/invoice");


router.post("/postinvoicedata",isauth,invoiceController.postInvoiceData);

router.get("/yourinvoices",isauth,invoiceController.getAllInvoiceData);

router.get("/",isauth,invoiceController.getOneInvoice);

module.exports = router;