const path = require("path");
const fs =  require('fs');
const { v4: uuidv4 } = require("uuid")

const invoice = require("../models/invoice");
const invoiceDataBase = require("../models/invoice");
const pdf = require("../Generate-pdf/pdf");

exports.postInvoiceData = (req, res, next) => {
  const companyName = req.body.companyName;
  const companyAddress = req.body.companyAddress;

  const customerName = req.body.customerName;
  const customerAddress = req.body.customerAddress;

  const invoiceItems = req.body.invoiceItems;

  const userId = req.get("userId");

  const invoiceObject = new invoiceDataBase({
    userid: userId,

    invoice: [
      {
        companyName: companyName,
        companyAddress: companyAddress,
        customerName: customerName,
        customerAddress: customerAddress,
        invoiceItems: invoiceItems,
      },
    ],
  });

  invoiceDataBase
    .findOne({ userid: userId })
    .then((user) => {
    

      if (!user) {
        // console.log("User Not Exist");
        invoiceObject.save()
        .then((results) => {
          res.status(201).json({
            message: "Data posted Succfully" 
          });
        });
      } 
      
      else {
        let allinvoices = [...user.invoice];
        allinvoices = [...allinvoices, ...invoiceObject.invoice];

        invoiceDataBase
          .updateOne({ userid: userId }, { invoice: allinvoices })
          .then((results) => {

            //generate pdf and send to user
            res.status(201).json({
              message: "Data posted Succfully"
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllInvoiceData = async (req,res,next) => {
    const userId = req.get("userId");
    console.log(userId);
    const InvoiceDoc = await invoiceDataBase.find({userid:userId});

    
    
    if(InvoiceDoc.length == 0)
      {
        const error = new Error("No Invoices found");
        error.statusCode = 404;
        next(error);

      }

      else
      {
        res.status(201).json({
          message: "all data",
          data: InvoiceDoc[0].invoice
    
        })
      }

    
};

exports.getOneInvoice = async (req,res,next) => {

  try
  {

  
  const userId = req.get("userId");

  const specificInvoiceId = req.query.invoiceid;
  console.log(specificInvoiceId);

  const SpecificInvoiceDoc = await invoiceDataBase.findOne({userid: userId});

  //console.log(SpecificInvoiceDoc.invoice);
  let invoice = SpecificInvoiceDoc.invoice.find(obj => obj._id == specificInvoiceId);
  
  if(!invoice)
    {
      const error = new Error("Invoice not found");
      error.statusCode = 404;
      next(error);
    }


  //const pdfname = `${userId}-${Date.now()}`;

  const alterpdfname = `${userId}-${Date.now()}`;

  console.log(alterpdfname);

  const pdfpath = path.join(__dirname,"..","Generate-pdf",`${alterpdfname}.pdf`);

    console.log(pdfpath);

    await pdf(invoice, pdfpath);
    
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${alterpdfname}`);

    // Stream the file to the response
    const stream = fs.createReadStream(pdfpath);
    
    stream.on('open', () => {
        stream.pipe(res);
    });

    // Handle errors
    stream.on('error', (err) => {
        console.error('Error streaming PDF:', err);
        res.status(500).send('Error streaming PDF');
    });

    // Remove the file after streaming
    stream.on('end', () => {
        fs.unlinkSync(pdfpath);
    });


  //   res.sendFile(pdfpath, (err) => {
  //     if (err) {
  //         console.log(err);
  //         res.status(err.status).end();
  //     } else {
  //         console.log('File sent successfully.');
  //     }
  // });

  // const stream = fs.createReadStream(pdfPath);
  //       stream.pipe(res);

  //       // Remove the file after streaming
  //       stream.on('end', () => {
  //           fs.unlinkSync(pdfPath);
  //       });

  }

  catch(err)
  {
    const error = new Error("Internal Server Error");
    error.statusCode = 500;
    next(error);


  }
};
