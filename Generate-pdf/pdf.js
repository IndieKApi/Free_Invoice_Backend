const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateInvoice =  function (invoiceData, path) {
    let doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(path));
    
    generateHeader(doc, invoiceData);
    generateCustomerInformation(doc, invoiceData);
    generateInvoiceTable(doc, invoiceData);
    generateFooter(doc);

    doc.end();

    
}

function generateHeader(doc, invoiceData) {
    doc
        // .image('logo.png', 50, 45, { width: 50 })  // Ensure you have a logo.png in the root or adjust the path
        .fillColor("#444444")
        .fontSize(30)
        .text(invoiceData.companyName, 50, 57)
        .fontSize(20)
        .text(invoiceData.companyAddress, 200, 65, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoiceData) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc.fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoiceData._id, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(new Date().toLocaleDateString(), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            invoiceData.invoiceItems.reduce((sum, item) => sum + item.price, 0),
            150,
            customerInformationTop + 30
        )

        .text("Customer Name:", 300, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoiceData.customerName, 400, customerInformationTop)
        .font("Helvetica")
        .text("Customer Address:", 300, customerInformationTop + 15)
        .text(invoiceData.customerAddress, 400, customerInformationTop + 15)

        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoiceData) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Quantity",
        "Unit Cost",
        "Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    let position;
    for (i = 0; i < invoiceData.invoiceItems.length; i++) {
        const item = invoiceData.invoiceItems[i];
        position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.name,
            item.quantity,
            item.price,
            item.quantity * item.price
        );

        generateHr(doc, position + 20);
    }

    doc.moveDown();
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Payment is due within 15 days. Thank you for your business.",
            50,
            500,
            { align: "center", width: 500 }
        );
}

function generateTableRow(doc, y, item, quantity, unitCost, lineTotal) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(quantity, 280, y, { width: 90, align: "right" })
        .text(unitCost, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

// Example of data you provided
const invoiceData = {
    "companyName": "Colder Beer",
    "companyAddress": "Seoni",
    "customerName": "shubham",
    "customerAddress": "Delhi",
    "invoiceItems": [
        { "name": "nokia", "quantity": 1, "price": 200 },
        { "name": "microsoft", "quantity": 1, "price": 200 },
        { "name": "apple", "quantity": 1, "price": 200 },
        { "name": "google", "quantity": 1, "price": 200 }
    ],
    "_id": "66352ba03187ab8617fed29b"
};

// Generate PDF


module.exports = generateInvoice;
