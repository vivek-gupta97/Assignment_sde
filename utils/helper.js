const { v4: uuidv4 } = require('uuid');
const mail = require('nodemailer');
const { renderFile } = require('ejs');
const fs = require('fs');
const ExcelJS = require('exceljs');
const path = require("path");
const constants = require('../constant/ROPA');

// exports.genUUID = () => {
//   const uuid = uuidv4();
//   return uuid;
// };

// exports.generateOtp = (digit) => {
//   const otp = Math.floor(
//     10 ** (digit - 1) + Math.random() * (10 ** (digit - 1) * 9)
//   );
//   return otp;
// };

// // eslint-disable-next-line no-undef
// transporter = mail.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// // exports.sendMail = (email, sendData, subject, textTemplate) => {
// //   try {
// //     // eslint-disable-next-line no-undef
// //     renderFile(`${appRoot}/public/mailTemplate/${textTemplate}`, sendData, (err, dataTemplate) => {
// //       if (err) {
// //         console.log(err);
// //       } else {
// //         const mainOptions = {
// //           from: process.env.SMTP_EMAIL,
// //           to: email,
// //           subject,
// //           html: dataTemplate
// //         };
// //         // eslint-disable-next-line no-undef
// //         transporter.sendMail(mainOptions, (info) => {
// //           if (err) {
// //             console.log(err);
// //             // return callback(err, null);
// //           }
// //           console.log(info);
// //           // return callback(null, info);
// //         });
// //       }
// //     });
// //   } catch (error) {
// //     console.log('---Email Error--', error);
// //     return false;
// //   }
// // };

// exports.getPagination = (page, size) => {
//   const limit = size || 10;
//   const offset = page ? (page - 1) * limit : 0;
//   return { limit, offset };
// };

// exports.sendMail = async (email, sendData, subject, textTemplate, sender = process.env.SMTP_EMAIL) => {

//   try {
//     console.log("Send Mail==========>", email, "sendData=====>", sendData);
//     return await new Promise((resolve, reject) => {
//       renderFile(path.join(`app/public/mailTemplates/${textTemplate}`), sendData, (err, dataTemplate) => {
//         if (err) {
//           console.log(err);
//         } else {
//           const mainOptions = {
//             from: env.SMTP_EMAIL,
//             to: email,
//             subject,
//             html: dataTemplate,
//           };
//           console.log("mainOptions==========>", mainOptions);

//           transporter.sendMail(mainOptions, (err, success) => {
//             console.log("inside sendMail")
//             if (err) {
//               console.log(err);
//               return reject(err);
//             }
//             console.log("info", success);
//             return resolve(true);
//           });
//         }
//       });
//     })
//   } catch (error) {
//     console.log('---Email Error--', error);
//     return false;
//   }
// }

// exports.getSuccessMsgCode = (req) => {
//   let msgCode;
//   if (req.url.slice(1) === 'signup') {
//     msgCode = 'SIGNUP_SUCCESSFUL';
//   } else {
//     msgCode = 'LOGIN_SUCCESSFUL';
//   }

//   return msgCode;
// };

// exports.getErrorMsgCode = (req) => {
//   let msgCode;
//   if (req?.url.slice(1) === 'signup') {
//     msgCode = 'SIGNUP_FAILED';
//   } else {
//     msgCode = 'LOGIN_FAILED';
//   }

//   return msgCode;
// };

exports.createExcelFile = async (data, basicInfoData, date, customerName, deptName, procName) => {

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Introduction');

  sheet.columns = [
    { header: '', key: 'category', width: 10 },
    { header: '', key: 'title', width: 10 },
    { header: '', key: 'description', width: 10 },
    { header: '', key: 'sub_question', width: 10 },
    { header: '', key: 'answer', width: 10 },
    { header: '', key: 'attachment', width: 10 },
    { header: '', key: 'answer1', width: 10 },
    { header: '', key: 'attachment1', width: 90 }
  ];

  // Merge cells for the confidential note (adjusted)
  sheet.mergeCells('F12:H14'); // Merging vertically to give more space
  const noteCell = sheet.getCell('F12');
  noteCell.value = 'This document should be treated as CONFIDENTIAL. If you have not been explicitly authorized to review the contents of this document, kindly delete the document and any copy of it.';
  noteCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Added wrapText to handle longer text
  noteCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: '000000' }

  };

  // Merge cells for the date (adjusted)
  sheet.mergeCells('F15:H15');
  const dateCell = sheet.getCell('H15');
  dateCell.value = `${date}`;
  dateCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  dateCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: '000000' }

  };

  sheet.mergeCells('F17:H20');

  const imageId = workbook.addImage({
    filename: 'app/public/GoTrust logo (navy blue).png',
    extension: 'png',
  });

  sheet.addImage(imageId, {
    tl: { col: 7, row: 16 }, // F17's position (0-indexed)
    ext: { width: 500, height: 150 }, // Adjust the size as needed
  });


  // Merge cells for the footer (adjusted)
  sheet.mergeCells('F25:H25');
  const footerCell = sheet.getCell('F25');

  let ropaName = '';
  if (deptName && procName) {
    ropaName = `${deptName} - ${procName}`;
  } else if (deptName) {
    ropaName = deptName;
  }

  footerCell.value = `${customerName}: Record of Processing Activity - ${ropaName}`;
  footerCell.font = { size: 14, bold: true, color: { argb: '0202A1' } };
  footerCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  footerCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: '000000' }

  };

  // Fill all cells with white background color
  for (let row = 1; row <= 60; row++) {  // Adjust the range as needed
    for (let col = 1; col <= 60; col++) { // Adjust the range as needed
      const cell = sheet.getCell(row, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' },
      };
    }
  }
  const glossarySheet = workbook.addWorksheet('Glossary');
  const sheet1 = workbook.addWorksheet('Information Gathering');
  const sheet2 = workbook.addWorksheet('Vendors');
  const sheet3 = workbook.addWorksheet('Third Parties');
  const sheet4 = workbook.addWorksheet('Data Mapping');

  const jsonFilePath = 'app/public/glossary.json';

  // Read the JSON file containing glossary data
  const glossaryData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

  // Add a row for the table name "Glossary" before defining columns
  glossarySheet.addRow(['Glossary']);
  // Style the table name header
  glossarySheet.getRow(1).getCell(1).font = { bold: true, size: 14 };
  glossarySheet.mergeCells(1, 1, 1, 3); // Merge cells for the table name to span across the table width

  glossarySheet.columns = [
    { key: 'A', width: 20 }, // Adjust width as needed
    { key: 'B', width: 35 }, // Adjust width as needed
    { key: 'C', width: 50 }  // Adjust width as needed
  ];

  glossarySheet.addRow(['S. No', 'Acronyms', 'Full Form']);

  function addAcronyms(sheet, acronyms) {
    acronyms.forEach(acronym => {
      sheet.addRow([acronym["S. No."], acronym["Acronym"], acronym["Full form"]]);
    });
  }

  // Function to add rows for "Definitions"
  function addDefinitions(sheet, definitions, startRow) {
    definitions.forEach((definition, index) => {
      const rowNumber = startRow + index;
      sheet.getRow(rowNumber).values = [definition["S. No."], definition["Term"], definition["Definition"]];
    });
  }

  // Add Acronyms to the sheet
  addAcronyms(glossarySheet, glossaryData.Acronyms);

  glossarySheet.eachRow((row, rowNumber) => {
    if (rowNumber >= 3) {
      row.eachCell((cell, cellNumber) => {
        cell.font = { name: 'Poppins', size: 12 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
          color: { argb: '000000' }
        };
        if (cellNumber === 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
    }
  })

  // Add a row to separate the tables visually (optional)
  glossarySheet.addRow([]);

  // Adjust the starting row for the second table "Definitions" to account for the new table name row
  let definitionsStartRow = glossarySheet.lastRow.number + 2; // +2 to include the table name row

  // Add a row for the table name "Definitions" before adding headers
  glossarySheet.getRow(definitionsStartRow - 1).values = ['Definitions'];
  // Style the table name header for "Definitions"
  glossarySheet.getRow(definitionsStartRow - 1).getCell(1).font = { bold: true, size: 14 };
  glossarySheet.mergeCells(definitionsStartRow - 1, 1, definitionsStartRow - 1, 3); // Merge cells for the table name

  // Add headers manually for the second table "Definitions"
  glossarySheet.getRow(definitionsStartRow).values = ['S. No', 'Terms', 'Definitions'];

  // Apply styles to the headers of both tables
  [glossarySheet.getRow(1), glossarySheet.getRow(definitionsStartRow - 1)].forEach(headerRow => {
    headerRow.eachCell(cell => {
      cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: 'FFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000080' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: '000000' }
      };
    });
  });

  // Apply styles to headers of both tables
  [glossarySheet.getRow(2), glossarySheet.getRow(definitionsStartRow)].forEach(headerRow => {
    headerRow.eachCell(cell => {
      cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '9CC2FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: '000000' }
      };
    });
  });

  // Add Definitions to the sheet
  addDefinitions(glossarySheet, glossaryData.Definitions, definitionsStartRow + 1);

  glossarySheet.eachRow((row, rowNumber) => {
    if (rowNumber >= definitionsStartRow + 1) {
      row.eachCell((cell, cellNumber) => {
        cell.font = { name: 'Poppins', size: 12 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
          color: { argb: '000000' }
        };
        if (cellNumber === 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        }
      });
      row.height = 180;
    }
  });

  // Define the columns for the worksheet
  sheet1.columns = [
    { header: 'Domain', key: 'category', width: 45 },
    { header: 'Question', key: 'title', width: 90 },
    { header: 'Explanation', key: 'description', width: 90 },
    { header: 'Sub-Question', key: 'sub_question', width: 90 },
    { header: 'Response', key: 'answer', width: 90 },
    { header: 'Attachment', key: 'attachment', width: 90 },
  ];
  // Add the first row with the report title
  const spaceRow = sheet1.addRow({});
  // Apply alignment to the merged cell
  spaceRow.getCell(1).alignment = { horizontal: 'center' };
  // Merge the first row across all columns
  sheet1.mergeCells('A1:F1'); // Adjust the range to cover all columns in your sheet
  // Optionally, add a title to the merged cells and style it
  const titleCell = sheet1.getCell('A1');
  titleCell.value = 'Privacy Questionnaire - RoPA';
  titleCell.font = { name: 'Poppins', size: 32, bold: true, color: { argb: 'FFFFFF' } }; // White font color for better contrast
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000080' }, // Navy blue color
  };
  titleCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: 'FFFFFF' }

  };
  const titleRow = sheet1.getRow(1);
  titleRow.height = 60;

  sheet1.mergeCells('A2:F2'); // Adjust the range to cover all columns in your sheet
  const basicInfoCell = sheet1.getCell('A2');
  basicInfoCell.value = 'Basic Information';
  basicInfoCell.font = { name: 'Poppins', size: 20, bold: true, color: { argb: 'FFFFFF' } };
  basicInfoCell.alignment = { vertical: 'middle', horizontal: 'center' };
  basicInfoCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '0202A1' }, // purple color
  };
  basicInfoCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: 'FFFFFF' }

  };
  const basicInfoRow = sheet1.getRow(2);
  basicInfoRow.height = 60;

  // Assuming basicInfoData is an array of objects with 'question' and 'answer' properties
  basicInfoData.forEach((item, index) => {
    let rowIndex = 3 + index; // Starting from row 4
    let row = sheet1.insertRow(rowIndex, []);

    // Set question in the first cell
    let questionCell = row.getCell(1);
    questionCell.value = item.question;
    questionCell.font = {
      bold: true
    };
    questionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9CC2FF' } // Blue color
    };
    questionCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
      color: { argb: '000000' }
    }

    // Set answer in the second cell
    let answerCell = row.getCell(2);
    answerCell.value = item.answer;
  });

  // Continue with the rest of the code to add headers and apply styles...

  // Add headers
  const headerRowNum = basicInfoData.length + 4; // Adjust the starting row index
  const headerRowSheet1 = sheet1.getRow(headerRowNum);
  headerRowSheet1.values = ['Domain ', 'Question', 'Explanation', 'Sub-Question', 'Response', 'Attachment'];

  // Apply styles to each cell in the header row individually
  headerRowSheet1.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= 6) { // Apply styles only up to column F
      cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: 'FFFFFF' } }; // White font color
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0202A1' } // Purple color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: 'FFFFFF' }

      };
    }
  });


  let currentRowSheet2 = 1; // Starting row index
  sheet2.columns = [
    { header: 'Domain', key: 'category', width: 45 },
    { header: 'Question', key: 'title', width: 90 },
    { header: 'Response', key: 'answer', width: 35 },
    { header: '', key: 'services', width: 35 },
    { header: '', key: 'dept', width: 35 },
    { header: '', key: 'location', width: 35 },
    { header: '', key: 'data', width: 35 }
    // { header: 'Attachment', key: 'attachment', width: 90 },
  ];
  // Add the first row with the report title
  const spaceRow2 = sheet2.addRow({});
  currentRowSheet2++;
  // Apply alignment to the merged cell
  spaceRow2.getCell(1).alignment = { horizontal: 'center' };
  // Merge the first row across all columns
  sheet2.mergeCells('A1:G1'); // Adjust the range to cover all columns in your sheet
  // Optionally, add a title to the merged cells and style it
  const titleCell2 = sheet2.getCell('A1');
  titleCell2.value = 'Privacy Questionnaire - RoPA';
  titleCell2.font = { name: 'Poppins', size: 32, bold: true, color: { argb: 'FFFFFF' } }; // White font color for better contrast
  titleCell2.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell2.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000080' }, // Navy blue color
  };
  titleCell2.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: 'FFFFFF' }

  };

  const titleRow2 = sheet2.getRow(1);
  titleRow2.height = 60;

  // Add headers
  const headerRowSheet2 = sheet2.getRow(3);
  headerRowSheet2.values = ['Domain ', 'Question', 'Response', '', '', '', ''];

  // Apply styles to each cell in the header row individually
  headerRowSheet2.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= 7) { // Apply styles only up to column F
      cell.font = { name: 'Poppins', bold: true, color: { argb: 'FFFFFF' } }; // White font color
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0202A1' } // Navy blue color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: 'FFFFFF' }

      };
    }
  });


  let currentRowSheet3 = 1; // Starting row index
  sheet3.columns = [
    { header: 'Domain', key: 'category', width: 45 },
    { header: 'Question', key: 'title', width: 90 },
    { header: 'Response', key: 'answer', width: 50 },
    { header: '', key: 'purpose', width: 50 },
    { header: '', key: 'third_party', width: 50 },
    { header: '', key: 'name', width: 50 },
    { header: '', key: 'location', width: 50 }
  ];

  // Add the first row with the report title
  const spaceRow3 = sheet3.addRow({});
  currentRowSheet3++
  // Apply alignment to the merged cell
  spaceRow3.getCell(1).alignment = { horizontal: 'center' };
  // Merge the first row across all columns
  sheet3.mergeCells('A1:G1'); // Adjust the range to cover all columns in your sheet
  // Optionally, add a title to the merged cells and style it
  const titleCell3 = sheet3.getCell('A1');
  titleCell3.value = 'Privacy Questionnaire - RoPA';
  titleCell3.font = { name: 'Poppins', size: 32, bold: true, color: { argb: 'FFFFFF' } }; // White font color for better contrast
  titleCell3.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell3.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000080' }, // Navy blue color
  };
  titleCell3.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: 'FFFFFF' }

  };
  const titleRow3 = sheet3.getRow(1);
  titleRow3.height = 60;

  // Add headers
  const headerRowSheet3 = sheet3.getRow(3);
  headerRowSheet3.values = ['Domain ', 'Question', 'Response', '', '', '', ''];

  // Apply styles to each cell in the header row individually
  headerRowSheet3.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= 7) { // Apply styles only up to column F
      cell.font = { name: 'Poppins', bold: true, color: { argb: 'FFFFFF' } }; // White font color
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0202A1' } // Navy blue color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: 'FFFFFF' }
      };
    }
  });

  sheet4.columns = [
    { header: 'Name the Processing Activity (e.g.: Payroll, Onboarding, Talent Acquisition, etc.)', key: 'processing_activity_name', width: 35 },
    { header: 'Provide a brief description of the processing activity (please provide a brief summary)', key: 'processing_activity_description', width: 35 },
    { header: 'What is the purpose of the processing activity', key: 'processing_activity_purpose', width: 35 },
    { header: 'List the Personal Data attributes that are processed (e.g.: name, e-mail id, etc.) (Please mention each data attribute in a different row and fill the sheet for the same accordingly)', key: 'personal_data_attributes', width: 35 },
    { header: 'Select the Lawful Basis of the collection of different categories of Personal Data', key: 'lawful_basis', width: 35 },
    { header: 'Specify the purpose of collecting Personal Data', key: 'purpose_collecting_personal_data', width: 35 },
    { header: 'Select the category of data that is processed', key: 'data_category', width: 35 },
    { header: 'What is the mode of collection of this Personal Data (e.g.: web form, cookies, e-mail, etc.)', key: 'data_collection_mode', width: 35 },
    { header: 'Is this Data Collection specified in the Privacy Policy?', key: 'data_collection_privacy_policy', width: 35 },
    { header: 'Is the Data Transferred to any other country?', key: 'data_transfer', width: 35 },
    { header: 'Mention the name of the Country/ Countries', key: 'transfer_countries', width: 35 },
    { header: 'What is the frequency of sharing the data', key: 'sharing_frequency', width: 35 },
    { header: 'Are there Data Protection agreements in place?', key: 'data_protection_agreements', width: 35 },
    { header: 'What is the purpose of such transfer', key: 'transfer_purpose', width: 35 },
    { header: 'Is the retention period for the Data defined?', key: 'data_retention_defined', width: 35 },
    { header: 'What is the retention period for the Data collected?', key: 'data_retention_period', width: 35 },
    { header: 'Is the Data deleted after the retention period?', key: 'data_deletion_post_retention', width: 35 },
    { header: 'What are the disposal methods?', key: 'data_disposal_methods', width: 35 },
    { header: 'Please mention the technical organizational measures used to secure the data', key: 'data_security_measures', width: 35 }
  ];

  // Add the first row with the report title
  const spaceRow4 = sheet4.addRow({});
  // Apply alignment to the merged cell
  spaceRow4.getCell(1).alignment = { horizontal: 'center' };
  // Merge the first row across all columns
  sheet4.mergeCells('A1:S1'); // Adjust the range to cover all columns in your sheet
  // Optionally, add a title to the merged cells and style it
  const titleCell4 = sheet4.getCell('A1');
  titleCell4.value = 'Processing Activity';
  titleCell4.font = { name: 'Poppins', size: 32, bold: true, color: { argb: 'FFFFFF' } }; // White font color for better contrast
  titleCell4.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell4.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000080' }, // Navy blue color
  };
  titleCell4.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: '000000' }

  };
  const titleRow4 = sheet4.getRow(1);
  titleRow4.height = 60;

  // Step 1: Add a new row for the categories
  const categoriesRow = sheet4.getRow(2);

  // Step 2: Merge cells as per the categories
  // A-C: Description of the Processing Activity
  sheet4.mergeCells('A2:C2');
  // D-I: Data Collection
  sheet4.mergeCells('D2:I2');
  // J-N: Cross-Border Data Transfer
  sheet4.mergeCells('J2:N2');
  // O-R: Data Retention & Deletion
  sheet4.mergeCells('O2:R2');
  // S: Data Security (No need to merge as it's a single cell)

  // Step 3: Set the values for each merged cell range
  categoriesRow.getCell(1).value = 'Description of the Processing Activity';
  categoriesRow.getCell(4).value = 'Data Collection';
  categoriesRow.getCell(10).value = 'Cross-Border Data Transfer';
  categoriesRow.getCell(15).value = 'Data Retention & Deletion';
  categoriesRow.getCell(19).value = 'Data Security';

  // Optional: Apply styles to the new row, similar to the header row styles
  categoriesRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: 'FFFFFF' } }; // Example style
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0202A1' } // Example fill color
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Center align text
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
      color: { argb: '000000' }
    };
  });

  categoriesRow.height = 60; // Adjust the height as needed

  // Add headers
  const headerRowSheet4 = sheet4.getRow(3);
  headerRowSheet4.values = ['Name the Processing Activity (e.g.: Payroll, Onboarding, Talent Acquisition, etc.)', 'Provide a brief description of the processing activity (please provide a brief summary)', 'What is the purpose of the processing activity', 'List the Personal Data attributes that are processed (e.g.: name, e-mail id, etc.) (Please mention each data attribute in a different row and fill the sheet for the same accordingly)', 'Select the Lawful Basis of the collection of different categories of Personal Data', 'Specify the purpose of collecting Personal Data', 'Select the category of data that is processed', 'What is the mode of collection of this Personal Data (e.g.: web form, cookies, e-mail, etc.)', 'Is this Data Collection specified in the Privacy Policy?', 'Is the Data Transferred to any other country?', 'Mention the name of the Country/ Countries', 'What is the frequency of sharing the data', 'Are there Data Protection agreements in place?', 'What is the purpose of such transfer', 'Is the retention period for the Data defined?', 'What is the retention period for the Data collected?', 'Is the Data deleted after the retention period?', 'What are the disposal methods?', 'Please mention the technical organizational measures used to secure the data'];
  headerRowSheet4.height = 120;
  // Apply styles to each cell in the header row individually
  headerRowSheet4.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= 19) { // Apply styles only up to column F
      cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // White font color
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '9CC2FF' } // Navy blue color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: '000000' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    }
  });

  // Add data rows

  const personalDataAttributes = [];
  const sheet4Data = {
    processing_activity_name: procName || deptName,
    processing_activity_description: null,
    processing_activity_purpose: null,
    personal_data_attributes: null,
    lawful_basis: null,
    purpose_collecting_personal_data: null,
    data_category: null,
    data_collection_mode: null,
    data_collection_privacy_policy: null,
    data_transfer: null,
    transfer_countries: null,
    sharing_frequency: null,
    data_protection_agreements: null,
    transfer_purpose: null,
    data_retention_defined: null,
    data_retention_period: null,
    data_deletion_post_retention: null,
    data_disposal_methods: null,
    data_security_measures: null
  }

  data.forEach(item => {
    if (item.category === 'Vendors' && item.artifact_type === 'table') {
      const vendorRow = sheet2.addRow([item.category, item.title, "Table: Vendor Details"]);
      vendorRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
      });
      currentRowSheet2++; // Increment for the next row

      const headerRow = sheet2.addRow(["", "", 'Name', 'Services', 'Department', 'Location', 'Personal Data Involved']);
      headerRow.eachCell((cell, number) => {
        cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } }; // Apply Poppins font, bold for header
        if (number >= 3) { // Apply fill starting from the third cell
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '9CC2FF' } // Navy blue color
          };
        }
      });
      currentRowSheet2++; // Increment for the next row

      const ans = item.answer[0];
      const comments = item.answer[1];
      ans.forEach(ans => {
        const ansRow = sheet2.addRow(["", "", ans["Name"], ans["Services"], deptName, ans["Location"], ans["Personal Data Involved"]]);
        ansRow.eachCell(cell => {
          cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
        });
        currentRowSheet2++; // Increment for the next row
      });

      const commentsRow = sheet2.addRow(["", "", "Comments:", comments]);
      commentsRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } }; // Apply Poppins font, bold for comments
      });
      currentRowSheet2++; // Increment

    } else if (item.category === 'System/Portal/Application used' && item.artifact_type === 'table') {
      const systemRow = sheet3.addRow([item.category, item.title, "Table: System/Portal/Application Details"]);
      systemRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
      });
      currentRowSheet3++; // Increment for the next row

      const systemHeaderRow = sheet3.addRow(["", "", 'Details of systems/portals/applications used', 'Purpose', 'Is this a in-house or third party tool?', 'Name of third party', 'Location of third party']);
      systemHeaderRow.eachCell((cell, number) => {
        cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } }; // Apply Poppins font, bold for header
        if (number >= 3) { // Apply fill starting from the third cell
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '9CC2FF' } // Navy blue color
          };
        }
      });
      currentRowSheet3++; // Increment for the next row

      const ans = item.answer[0];
      const comments = item.answer[1];
      ans.forEach(ans => {
        const ansSystemRow = sheet3.addRow(["", "", ans["Details of systems/portals/applications used"], ans["Purpose"], ans["Is this a in-house or third party tool?"], ans["Name of third party"], ans["Location of third party"]]);
        ansSystemRow.eachCell(cell => {
          cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
        });
        currentRowSheet3++; // Increment for the next row
      });

      const commentsSystemRow = sheet3.addRow(["", "", "Comments:", comments]);
      commentsSystemRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } }; // Apply Poppins font, bold for comments
      });
      currentRowSheet3++; // Increment

    } else {
      const otherRow = sheet1.addRow(item);
      otherRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      });
      otherRow.height = 60;

      switch (item.sub_question) {
        case constants.excelQues.PERSONAL_DATA:
          const personalData = item.answer.split(" , ");
          personalData.forEach(data => {
            personalDataAttributes.push(data);
          });
          break;
        case constants.excelQues.SENSITIVE_DATA:
          const sensitiveData = item.answer.split(" , ");
          sensitiveData.forEach(data => {
            personalDataAttributes.push(data);
          });
          break;
      }

      switch (item.title) {
        case constants.excelQues.LAWFUL_BASIS:
          sheet4Data.lawful_basis = item.answer;
          break;
        case constants.excelQues.PURPOSE:
          sheet4Data.purpose_collecting_personal_data = item.answer;
          break;
        case constants.excelQues.CATEGORY_OF_DATA:
          sheet4Data.data_category = item.answer;
          break;
        case constants.excelQues.MODE_OF_COLLECTION:
          sheet4Data.data_collection_mode = item.answer;
          break;
        case constants.excelQues.PRIVACY_NOTICE:
          sheet4Data.data_collection_privacy_policy = item.answer;
          break;
        case constants.excelQues.CROSS_BORDER_DATA_TRANSFER:
          sheet4Data.data_transfer = item.answer;
          break;
        case constants.excelQues.COUNTRY_NAMES:
          sheet4Data.transfer_countries = item.answer;
          break;
        case constants.excelQues.FREQUENCY:
          sheet4Data.sharing_frequency = item.answer;
          break;
        case constants.excelQues.DATA_PROTECTION_AGREEEMENT:
          sheet4Data.data_protection_agreements = item.answer;
          break;
        case constants.excelQues.PURPOSE_OF_TRANSFER:
          sheet4Data.transfer_purpose = item.answer;
          break;
        case constants.excelQues.RETENTION_PERIOD_DEFINED:
          sheet4Data.data_retention_defined = item.answer;
          break;
        case constants.excelQues.RETENTION_PERIOD:
          sheet4Data.data_retention_period = item.answer;
          break;
        case constants.excelQues.DATA_DELETED:
          sheet4Data.data_deletion_post_retention = item.answer;
          break;
        case constants.excelQues.DATA_DESTRUCTION:
          sheet4Data.data_disposal_methods = item.answer;
          break;
        case constants.excelQues.DATA_SECURITY:
          sheet4Data.data_security_measures = item.answer;
          break;
      }
    }
  });

  for (let i = 0; i < personalDataAttributes.length; i++) {
    sheet4Data.personal_data_attributes = personalDataAttributes[i];
    const dataRow = sheet4.addRow(sheet4Data);
    dataRow.eachCell(cell => {
      cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
    });
  }

  let startRowIndex = headerRowNum + 1;
  let endRowIndex = data.length + headerRowNum - 2; // Get the actual count of rows with data

  let currentMergeStart = startRowIndex;
  for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
    let currentValue = sheet1.getRow(rowIndex).getCell(1).value;
    let nextValue = rowIndex < endRowIndex ? sheet1.getRow(rowIndex + 1).getCell(1).value : null;

    // Apply styling to every cell, regardless of merging
    let cell = sheet1.getRow(rowIndex).getCell(1);
    cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9CC2FF' } // Blue color
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };

    // If the next value is different, check if we have more than one cell to merge
    if (currentValue !== nextValue) {
      if (rowIndex > currentMergeStart) { // We have at least two cells with the same value
        // Merge cells from currentMergeStart to rowIndex for column 1 (A)
        sheet1.mergeCells(currentMergeStart, 1, rowIndex, 1);
      }
      currentMergeStart = rowIndex + 1; // Update the start for the next potential merge
    }
  }

  const fileName = `ROPA DATA - ${Date.now()}.xlsx`;

  // Save the workbook to a file
  // Specify the directory for the Excel file
  const excelDir = path.join(__dirname, 'excel'); // Example directory name
  const filePath = path.join(excelDir, fileName);
  await workbook.xlsx.writeFile(filePath);
  console.log("file generated");
  return filePath;
};

exports.createAssessmentExcelFile = async (data, assessmentType, date, customerName, deptName, procName) => {

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Introduction');

  sheet.columns = [
    { header: '', key: 'category', width: 10 },
    { header: '', key: 'title', width: 10 },
    { header: '', key: 'description', width: 10 },
    { header: '', key: 'sub_question', width: 10 },
    { header: '', key: 'answer', width: 10 },
    { header: '', key: 'attachment', width: 10 },
    { header: '', key: 'answer1', width: 10 },
    { header: '', key: 'attachment1', width: 90 }
  ];

  // Merge cells for the confidential note (adjusted)
  sheet.mergeCells('F12:H14'); // Merging vertically to give more space
  const noteCell = sheet.getCell('F12');
  noteCell.value = 'This document should be treated as CONFIDENTIAL. If you have not been explicitly authorized to review the contents of this document, kindly delete the document and any copy of it.';
  noteCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; // Added wrapText to handle longer text
  noteCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: '000000' }

  };

  // Merge cells for the date (adjusted)
  sheet.mergeCells('F15:H15');
  const dateCell = sheet.getCell('H15');
  dateCell.value = `${date}`;
  dateCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  dateCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: '000000' }

  };

  sheet.mergeCells('F17:H20');

  const imageId = workbook.addImage({
    filename: 'app/public/GoTrust logo (navy blue).png',
    extension: 'png',
  });

  sheet.addImage(imageId, {
    tl: { col: 7, row: 16 }, // F17's position (0-indexed)
    ext: { width: 500, height: 150 }, // Adjust the size as needed
  });


  // Merge cells for the footer (adjusted)
  sheet.mergeCells('F25:H25');
  const footerCell = sheet.getCell('F25');

  let assessmentName = '';
  if (deptName && procName) {
    assessmentName = `${deptName} - ${procName}`;
  } else if (deptName) {
    assessmentName = deptName;
  }

  footerCell.value = `${customerName}: ${assessmentType} - ${assessmentName}`;
  footerCell.font = { size: 14, bold: true, color: { argb: '0202A1' } };
  footerCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  footerCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: '000000' }

  };

  // Fill all cells with white background color
  for (let row = 1; row <= 60; row++) {  // Adjust the range as needed
    for (let col = 1; col <= 60; col++) { // Adjust the range as needed
      const cell = sheet.getCell(row, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' },
      };
    }
  }
  const glossarySheet = workbook.addWorksheet('Glossary');
  const sheet1 = workbook.addWorksheet('Information Gathering');
  const sheet2 = workbook.addWorksheet('Vendors');
  const sheet3 = workbook.addWorksheet('Third Parties');
  // const sheet4 = workbook.addWorksheet('Data Mapping');

  const jsonFilePath = 'app/public/glossary.json';

  // Read the JSON file containing glossary data
  const glossaryData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

  // Add a row for the table name "Glossary" before defining columns
  glossarySheet.addRow(['Glossary']);
  // Style the table name header
  glossarySheet.getRow(1).getCell(1).font = { bold: true, size: 14 };
  glossarySheet.mergeCells(1, 1, 1, 3); // Merge cells for the table name to span across the table width

  glossarySheet.columns = [
    { key: 'A', width: 20 }, // Adjust width as needed
    { key: 'B', width: 35 }, // Adjust width as needed
    { key: 'C', width: 50 }  // Adjust width as needed
  ];

  glossarySheet.addRow(['S. No', 'Acronyms', 'Full Form']);

  function addAcronyms(sheet, acronyms) {
    acronyms.forEach(acronym => {
      sheet.addRow([acronym["S. No."], acronym["Acronym"], acronym["Full form"]]);
    });
  }

  // Function to add rows for "Definitions"
  function addDefinitions(sheet, definitions, startRow) {
    definitions.forEach((definition, index) => {
      const rowNumber = startRow + index;
      sheet.getRow(rowNumber).values = [definition["S. No."], definition["Term"], definition["Definition"]];
    });
  }

  // Add Acronyms to the sheet
  addAcronyms(glossarySheet, glossaryData.Acronyms);

  glossarySheet.eachRow((row, rowNumber) => {
    if (rowNumber >= 3) {
      row.eachCell((cell, cellNumber) => {
        cell.font = { name: 'Poppins', size: 12 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
          color: { argb: '000000' }
        };
        if (cellNumber === 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
    }
  })

  // Add a row to separate the tables visually (optional)
  glossarySheet.addRow([]);

  // Adjust the starting row for the second table "Definitions" to account for the new table name row
  let definitionsStartRow = glossarySheet.lastRow.number + 2; // +2 to include the table name row

  // Add a row for the table name "Definitions" before adding headers
  glossarySheet.getRow(definitionsStartRow - 1).values = ['Definitions'];
  // Style the table name header for "Definitions"
  glossarySheet.getRow(definitionsStartRow - 1).getCell(1).font = { bold: true, size: 14 };
  glossarySheet.mergeCells(definitionsStartRow - 1, 1, definitionsStartRow - 1, 3); // Merge cells for the table name

  // Add headers manually for the second table "Definitions"
  glossarySheet.getRow(definitionsStartRow).values = ['S. No', 'Terms', 'Definitions'];

  // Apply styles to the headers of both tables
  [glossarySheet.getRow(1), glossarySheet.getRow(definitionsStartRow - 1)].forEach(headerRow => {
    headerRow.eachCell(cell => {
      cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: 'FFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000080' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: '000000' }
      };
    });
  });

  // Apply styles to headers of both tables
  [glossarySheet.getRow(2), glossarySheet.getRow(definitionsStartRow)].forEach(headerRow => {
    headerRow.eachCell(cell => {
      cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '9CC2FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: '000000' }
      };
    });
  });

  // Add Definitions to the sheet
  addDefinitions(glossarySheet, glossaryData.Definitions, definitionsStartRow + 1);

  glossarySheet.eachRow((row, rowNumber) => {
    if (rowNumber >= definitionsStartRow + 1) {
      row.eachCell((cell, cellNumber) => {
        cell.font = { name: 'Poppins', size: 12 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
          color: { argb: '000000' }
        };
        if (cellNumber === 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        }
      });
      row.height = 180;
    }
  });

  // Define the columns for the worksheet
  sheet1.columns = [
    { header: 'Domain', key: 'category', width: 45 },
    { header: 'Question', key: 'title', width: 90 },
    { header: 'Explanation', key: 'description', width: 90 },
    { header: 'Sub-Question', key: 'sub_question', width: 90 },
    { header: 'Response', key: 'answer', width: 90 },
    { header: 'Attachment', key: 'attachment', width: 90 },
  ];
  // Add the first row with the report title
  const spaceRow = sheet1.addRow({});
  // Apply alignment to the merged cell
  spaceRow.getCell(1).alignment = { horizontal: 'center' };
  // Merge the first row across all columns
  sheet1.mergeCells('A1:F1'); // Adjust the range to cover all columns in your sheet
  // Optionally, add a title to the merged cells and style it
  const titleCell = sheet1.getCell('A1');
  titleCell.value = `Privacy Questionnaire - ${assessmentType}`;
  titleCell.font = { name: 'Poppins', size: 32, bold: true, color: { argb: 'FFFFFF' } }; // White font color for better contrast
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000080' }, // Navy blue color
  };
  titleCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: 'FFFFFF' }

  };
  const titleRow = sheet1.getRow(1);
  titleRow.height = 60;

  // Continue with the rest of the code to add headers and apply styles...

  // Add headers
  const headerRowNum = 3;  //basicInfoData.length + 4; // Adjust the starting row index
  const headerRowSheet1 = sheet1.getRow(headerRowNum);
  headerRowSheet1.values = ['Domain ', 'Question', 'Explanation', 'Sub-Question', 'Response', 'Attachment'];

  // Apply styles to each cell in the header row individually
  headerRowSheet1.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= 6) { // Apply styles only up to column F
      cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: 'FFFFFF' } }; // White font color
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0202A1' } // Purple color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: 'FFFFFF' }

      };
    }
  });


  let currentRowSheet2 = 1; // Starting row index
  sheet2.columns = [
    { header: 'Domain', key: 'category', width: 45 },
    { header: 'Question', key: 'title', width: 90 },
    { header: 'Response', key: 'answer', width: 35 },
    { header: '', key: 'services', width: 35 },
    { header: '', key: 'dept', width: 35 },
    { header: '', key: 'location', width: 35 },
    { header: '', key: 'data', width: 35 }
    // { header: 'Attachment', key: 'attachment', width: 90 },
  ];
  // Add the first row with the report title
  const spaceRow2 = sheet2.addRow({});
  currentRowSheet2++;
  // Apply alignment to the merged cell
  spaceRow2.getCell(1).alignment = { horizontal: 'center' };
  // Merge the first row across all columns
  sheet2.mergeCells('A1:G1'); // Adjust the range to cover all columns in your sheet
  // Optionally, add a title to the merged cells and style it
  const titleCell2 = sheet2.getCell('A1');
  titleCell2.value = `Privacy Questionnaire - ${assessmentType}`;
  titleCell2.font = { name: 'Poppins', size: 32, bold: true, color: { argb: 'FFFFFF' } }; // White font color for better contrast
  titleCell2.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell2.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000080' }, // Navy blue color
  };
  titleCell2.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: 'FFFFFF' }

  };

  const titleRow2 = sheet2.getRow(1);
  titleRow2.height = 60;

  // Add headers
  const headerRowSheet2 = sheet2.getRow(3);
  headerRowSheet2.values = ['Domain ', 'Question', 'Response', '', '', '', ''];

  // Apply styles to each cell in the header row individually
  headerRowSheet2.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= 7) { // Apply styles only up to column F
      cell.font = { name: 'Poppins', bold: true, color: { argb: 'FFFFFF' } }; // White font color
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0202A1' } // Navy blue color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: 'FFFFFF' }

      };
    }
  });


  let currentRowSheet3 = 1; // Starting row index
  sheet3.columns = [
    { header: 'Domain', key: 'category', width: 45 },
    { header: 'Question', key: 'title', width: 90 },
    { header: 'Response', key: 'answer', width: 50 },
    { header: '', key: 'purpose', width: 50 },
    { header: '', key: 'third_party', width: 50 },
    { header: '', key: 'name', width: 50 },
    { header: '', key: 'location', width: 50 }
  ];

  // Add the first row with the report title
  const spaceRow3 = sheet3.addRow({});
  currentRowSheet3++
  // Apply alignment to the merged cell
  spaceRow3.getCell(1).alignment = { horizontal: 'center' };
  // Merge the first row across all columns
  sheet3.mergeCells('A1:G1'); // Adjust the range to cover all columns in your sheet
  // Optionally, add a title to the merged cells and style it
  const titleCell3 = sheet3.getCell('A1');
  titleCell3.value = `Privacy Questionnaire - ${assessmentType}`;
  titleCell3.font = { name: 'Poppins', size: 32, bold: true, color: { argb: 'FFFFFF' } }; // White font color for better contrast
  titleCell3.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell3.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000080' }, // Navy blue color
  };
  titleCell3.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
    color: { argb: 'FFFFFF' }

  };
  const titleRow3 = sheet3.getRow(1);
  titleRow3.height = 60;

  // Add headers
  const headerRowSheet3 = sheet3.getRow(3);
  headerRowSheet3.values = ['Domain ', 'Question', 'Response', '', '', '', ''];

  // Apply styles to each cell in the header row individually
  headerRowSheet3.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    if (colNumber <= 7) { // Apply styles only up to column F
      cell.font = { name: 'Poppins', bold: true, color: { argb: 'FFFFFF' } }; // White font color
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0202A1' } // Navy blue color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        color: { argb: 'FFFFFF' }
      };
    }
  });

  // sheet4.columns = [
  //   { header: 'Name the Processing Activity (e.g.: Payroll, Onboarding, Talent Acquisition, etc.)', key: 'processing_activity_name', width: 35 },
  //   { header: 'Provide a brief description of the processing activity (please provide a brief summary)', key: 'processing_activity_description', width: 35 },
  //   { header: 'What is the purpose of the processing activity', key: 'processing_activity_purpose', width: 35 },
  //   { header: 'List the Personal Data attributes that are processed (e.g.: name, e-mail id, etc.) (Please mention each data attribute in a different row and fill the sheet for the same accordingly)', key: 'personal_data_attributes', width: 35 },
  //   { header: 'Select the Lawful Basis of the collection of different categories of Personal Data', key: 'lawful_basis', width: 35 },
  //   { header: 'Specify the purpose of collecting Personal Data', key: 'purpose_collecting_personal_data', width: 35 },
  //   { header: 'Select the category of data that is processed', key: 'data_category', width: 35 },
  //   { header: 'What is the mode of collection of this Personal Data (e.g.: web form, cookies, e-mail, etc.)', key: 'data_collection_mode', width: 35 },
  //   { header: 'Is this Data Collection specified in the Privacy Policy?', key: 'data_collection_privacy_policy', width: 35 },
  //   { header: 'Is the Data Transferred to any other country?', key: 'data_transfer', width: 35 },
  //   { header: 'Mention the name of the Country/ Countries', key: 'transfer_countries', width: 35 },
  //   { header: 'What is the frequency of sharing the data', key: 'sharing_frequency', width: 35 },
  //   { header: 'Are there Data Protection agreements in place?', key: 'data_protection_agreements', width: 35 },
  //   { header: 'What is the purpose of such transfer', key: 'transfer_purpose', width: 35 },
  //   { header: 'Is the retention period for the Data defined?', key: 'data_retention_defined', width: 35 },
  //   { header: 'What is the retention period for the Data collected?', key: 'data_retention_period', width: 35 },
  //   { header: 'Is the Data deleted after the retention period?', key: 'data_deletion_post_retention', width: 35 },
  //   { header: 'What are the disposal methods?', key: 'data_disposal_methods', width: 35 },
  //   { header: 'Please mention the technical organizational measures used to secure the data', key: 'data_security_measures', width: 35 }
  // ];

  // // Add the first row with the report title
  // const spaceRow4 = sheet4.addRow({});
  // // Apply alignment to the merged cell
  // spaceRow4.getCell(1).alignment = { horizontal: 'center' };
  // // Merge the first row across all columns
  // sheet4.mergeCells('A1:S1'); // Adjust the range to cover all columns in your sheet
  // // Optionally, add a title to the merged cells and style it
  // const titleCell4 = sheet4.getCell('A1');
  // titleCell4.value = 'Processing Activity';
  // titleCell4.font = { name: 'Poppins', size: 32, bold: true, color: { argb: 'FFFFFF' } }; // White font color for better contrast
  // titleCell4.alignment = { vertical: 'middle', horizontal: 'center' };
  // titleCell4.fill = {
  //   type: 'pattern',
  //   pattern: 'solid',
  //   fgColor: { argb: '000080' }, // Navy blue color
  // };
  // titleCell4.border = {
  //   top: { style: 'thin' },
  //   left: { style: 'thin' },
  //   bottom: { style: 'thin' },
  //   right: { style: 'thin' },
  //   color: { argb: '000000' }

  // };
  // const titleRow4 = sheet4.getRow(1);
  // titleRow4.height = 60;

  // // Step 1: Add a new row for the categories
  // const categoriesRow = sheet4.getRow(2);

  // // Step 2: Merge cells as per the categories
  // // A-C: Description of the Processing Activity
  // sheet4.mergeCells('A2:C2');
  // // D-I: Data Collection
  // sheet4.mergeCells('D2:I2');
  // // J-N: Cross-Border Data Transfer
  // sheet4.mergeCells('J2:N2');
  // // O-R: Data Retention & Deletion
  // sheet4.mergeCells('O2:R2');
  // // S: Data Security (No need to merge as it's a single cell)

  // // Step 3: Set the values for each merged cell range
  // categoriesRow.getCell(1).value = 'Description of the Processing Activity';
  // categoriesRow.getCell(4).value = 'Data Collection';
  // categoriesRow.getCell(10).value = 'Cross-Border Data Transfer';
  // categoriesRow.getCell(15).value = 'Data Retention & Deletion';
  // categoriesRow.getCell(19).value = 'Data Security';

  // // Optional: Apply styles to the new row, similar to the header row styles
  // categoriesRow.eachCell({ includeEmpty: true }, (cell) => {
  //   cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: 'FFFFFF' } }; // Example style
  //   cell.fill = {
  //     type: 'pattern',
  //     pattern: 'solid',
  //     fgColor: { argb: '0202A1' } // Example fill color
  //   };
  //   cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Center align text
  //   cell.border = {
  //     top: { style: 'thin' },
  //     left: { style: 'thin' },
  //     bottom: { style: 'thin' },
  //     right: { style: 'thin' },
  //     color: { argb: '000000' }
  //   };
  // });

  // categoriesRow.height = 60; // Adjust the height as needed

  // Add headers
  // const headerRowSheet4 = sheet4.getRow(3);
  // headerRowSheet4.values = ['Name the Processing Activity (e.g.: Payroll, Onboarding, Talent Acquisition, etc.)', 'Provide a brief description of the processing activity (please provide a brief summary)', 'What is the purpose of the processing activity', 'List the Personal Data attributes that are processed (e.g.: name, e-mail id, etc.) (Please mention each data attribute in a different row and fill the sheet for the same accordingly)', 'Select the Lawful Basis of the collection of different categories of Personal Data', 'Specify the purpose of collecting Personal Data', 'Select the category of data that is processed', 'What is the mode of collection of this Personal Data (e.g.: web form, cookies, e-mail, etc.)', 'Is this Data Collection specified in the Privacy Policy?', 'Is the Data Transferred to any other country?', 'Mention the name of the Country/ Countries', 'What is the frequency of sharing the data', 'Are there Data Protection agreements in place?', 'What is the purpose of such transfer', 'Is the retention period for the Data defined?', 'What is the retention period for the Data collected?', 'Is the Data deleted after the retention period?', 'What are the disposal methods?', 'Please mention the technical organizational measures used to secure the data'];
  // headerRowSheet4.height = 120;
  // // Apply styles to each cell in the header row individually
  // headerRowSheet4.eachCell({ includeEmpty: true }, (cell, colNumber) => {
  //   if (colNumber <= 19) { // Apply styles only up to column F
  //     cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // White font color
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: '9CC2FF' } // Navy blue color
  //     };
  //     cell.border = {
  //       top: { style: 'thin' },
  //       left: { style: 'thin' },
  //       bottom: { style: 'thin' },
  //       right: { style: 'thin' },
  //       color: { argb: '000000' }
  //     };
  //     cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  //   }
  // });

  // Add data rows

  // const personalDataAttributes = [];
  // const sheet4Data = {
  //   processing_activity_name: procName || deptName,
  //   processing_activity_description: null,
  //   processing_activity_purpose: null,
  //   personal_data_attributes: null,
  //   lawful_basis: null,
  //   purpose_collecting_personal_data: null,
  //   data_category: null,
  //   data_collection_mode: null,
  //   data_collection_privacy_policy: null,
  //   data_transfer: null,
  //   transfer_countries: null,
  //   sharing_frequency: null,
  //   data_protection_agreements: null,
  //   transfer_purpose: null,
  //   data_retention_defined: null,
  //   data_retention_period: null,
  //   data_deletion_post_retention: null,
  //   data_disposal_methods: null,
  //   data_security_measures: null
  // }

  data.forEach(item => {
    if (item.category === 'Vendors' && item.artifact_type === 'table') {
      const vendorRow = sheet2.addRow([item.category, item.title, "Table: Vendor Details"]);
      vendorRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
      });
      currentRowSheet2++; // Increment for the next row

      const headerRow = sheet2.addRow(["", "", 'Name', 'Services', 'Department', 'Location', 'Personal Data Involved']);
      headerRow.eachCell((cell, number) => {
        cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } }; // Apply Poppins font, bold for header
        if (number >= 3) { // Apply fill starting from the third cell
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '9CC2FF' } // Navy blue color
          };
        }
      });
      currentRowSheet2++; // Increment for the next row

      const ans = item.answer[0];
      const comments = item.answer[1];
      ans.forEach(ans => {
        const ansRow = sheet2.addRow(["", "", ans["Name"], ans["Services"], deptName, ans["Location"], ans["Personal Data Involved"]]);
        ansRow.eachCell(cell => {
          cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
        });
        currentRowSheet2++; // Increment for the next row
      });

      const commentsRow = sheet2.addRow(["", "", "Comments:", comments]);
      commentsRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } }; // Apply Poppins font, bold for comments
      });
      currentRowSheet2++; // Increment

    } else if (item.category === 'System/Portal/Application used' && item.artifact_type === 'table') {
      const systemRow = sheet3.addRow([item.category, item.title, "Table: System/Portal/Application Details"]);
      systemRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
      });
      currentRowSheet3++; // Increment for the next row

      const systemHeaderRow = sheet3.addRow(["", "", 'Details of systems/portals/applications used', 'Purpose', 'Is this a in-house or third party tool?', 'Name of third party', 'Location of third party']);
      systemHeaderRow.eachCell((cell, number) => {
        cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } }; // Apply Poppins font, bold for header
        if (number >= 3) { // Apply fill starting from the third cell
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '9CC2FF' } // Navy blue color
          };
        }
      });
      currentRowSheet3++; // Increment for the next row

      const ans = item.answer[0];
      const comments = item.answer[1];
      ans.forEach(ans => {
        const ansSystemRow = sheet3.addRow(["", "", ans["Details of systems/portals/applications used"], ans["Purpose"], ans["Is this a in-house or third party tool?"], ans["Name of third party"], ans["Location of third party"]]);
        ansSystemRow.eachCell(cell => {
          cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
        });
        currentRowSheet3++; // Increment for the next row
      });

      const commentsSystemRow = sheet3.addRow(["", "", "Comments:", comments]);
      commentsSystemRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } }; // Apply Poppins font, bold for comments
      });
      currentRowSheet3++; // Increment

    } else {
      const otherRow = sheet1.addRow(item);
      otherRow.eachCell(cell => {
        cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      });
      otherRow.height = 60;

      switch (item.sub_question) {
        case constants.excelQues.PERSONAL_DATA:
          const personalData = item.answer.split(" , ");
          personalData.forEach(data => {
            personalDataAttributes.push(data);
          });
          break;
        case constants.excelQues.SENSITIVE_DATA:
          const sensitiveData = item.answer.split(" , ");
          sensitiveData.forEach(data => {
            personalDataAttributes.push(data);
          });
          break;
      }

      //     switch (item.title) {
      //       case constants.excelQues.LAWFUL_BASIS:
      //         sheet4Data.lawful_basis = item.answer;
      //         break;
      //       case constants.excelQues.PURPOSE:
      //         sheet4Data.purpose_collecting_personal_data = item.answer;
      //         break;
      //       case constants.excelQues.CATEGORY_OF_DATA:
      //         sheet4Data.data_category = item.answer;
      //         break;
      //       case constants.excelQues.MODE_OF_COLLECTION:
      //         sheet4Data.data_collection_mode = item.answer;
      //         break;
      //       case constants.excelQues.PRIVACY_NOTICE:
      //         sheet4Data.data_collection_privacy_policy = item.answer;
      //         break;
      //       case constants.excelQues.CROSS_BORDER_DATA_TRANSFER:
      //         sheet4Data.data_transfer = item.answer;
      //         break;
      //       case constants.excelQues.COUNTRY_NAMES:
      //         sheet4Data.transfer_countries = item.answer;
      //         break;
      //       case constants.excelQues.FREQUENCY:
      //         sheet4Data.sharing_frequency = item.answer;
      //         break;
      //       case constants.excelQues.DATA_PROTECTION_AGREEEMENT:
      //         sheet4Data.data_protection_agreements = item.answer;
      //         break;
      //       case constants.excelQues.PURPOSE_OF_TRANSFER:
      //         sheet4Data.transfer_purpose = item.answer;
      //         break;
      //       case constants.excelQues.RETENTION_PERIOD_DEFINED:
      //         sheet4Data.data_retention_defined = item.answer;
      //         break;
      //       case constants.excelQues.RETENTION_PERIOD:
      //         sheet4Data.data_retention_period = item.answer;
      //         break;
      //       case constants.excelQues.DATA_DELETED:
      //         sheet4Data.data_deletion_post_retention = item.answer;
      //         break;
      //       case constants.excelQues.DATA_DESTRUCTION:
      //         sheet4Data.data_disposal_methods = item.answer;
      //         break;
      //       case constants.excelQues.DATA_SECURITY:
      //         sheet4Data.data_security_measures = item.answer;
      //         break;
      //     }
    }
  });

  // for (let i = 0; i < personalDataAttributes.length; i++) {
  //   sheet4Data.personal_data_attributes = personalDataAttributes[i];
  //   const dataRow = sheet4.addRow(sheet4Data);
  //   dataRow.eachCell(cell => {
  //     cell.font = { name: 'Poppins', size: 12, bold: false, color: { argb: '000000' } }; // Apply Poppins font
  //   });
  // }

  let startRowIndex = headerRowNum + 1;
  let endRowIndex = data.length + headerRowNum; // Get the actual count of rows with data

  let currentMergeStart = startRowIndex;
  for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
    let currentValue = sheet1.getRow(rowIndex).getCell(1).value;
    let nextValue = rowIndex < endRowIndex ? sheet1.getRow(rowIndex + 1).getCell(1).value : null;

    // Apply styling to every cell, regardless of merging
    let cell = sheet1.getRow(rowIndex).getCell(1);
    cell.font = { name: 'Poppins', size: 12, bold: true, color: { argb: '000000' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9CC2FF' } // Blue color
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };

    // If the next value is different, check if we have more than one cell to merge
    if (currentValue !== nextValue) {
      if (rowIndex > currentMergeStart) { // We have at least two cells with the same value
        // Merge cells from currentMergeStart to rowIndex for column 1 (A)
        sheet1.mergeCells(currentMergeStart, 1, rowIndex, 1);
      }
      currentMergeStart = rowIndex + 1; // Update the start for the next potential merge
    }
  }

  const fileName = `${assessmentType} DATA - ${Date.now()}.xlsx`;

  // Save the workbook to a file
  // Specify the directory for the Excel file
  const excelDir = path.join(__dirname, 'excel'); // Example directory name
  const filePath = path.join(excelDir, fileName);
  await workbook.xlsx.writeFile(filePath);
  console.log("file generated");
  return filePath;
};


// // Function to create the Excel file
// exports.createExcelFile = async (data) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Screening Questionnaire');

//   // Set up columns
//   worksheet.columns = [
//     { header: 'Question', key: 'question', width: 70 },
//     { header: 'Description', key: 'description', width: 70 },
//     { header: 'Answer', key: 'answer', width: 10 }
//   ];

//   // Adding data to the worksheet
//   data.forEach(item => {
//     const row = worksheet.addRow({
//       question: item.title,
//       description: item.description,
//       answer: item.answer
//     });
//     row.getCell(1).font = { bold: true }; // Bold for question titles
//     row.getCell(3).alignment = { horizontal: 'center' }; // Center alignment for answers
//   });

//   // Applying color based on the answer
//   worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
//     if (rowNumber > 1) { // Skip header row
//       const answerCell = row.getCell(3);
//       switch (answerCell.value) {
//         case 'Yes':
//           answerCell.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'FF00FF00' } // Green for 'Yes'
//           };
//           break;
//         case 'No':
//           answerCell.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'FFFF0000' } // Red for 'No'
//           };
//           break;
//       }
//       // Set height for better visibility
//       row.height = 30;
//       // Enable text wrapping
//       row.getCell(2).alignment = { wrapText: true };
//     }
//   });

//   // Save the workbook
//   await workbook.xlsx.writeFile('Screening_Questionnaire.xlsx');
//   console.log('Workbook has been created successfully!');

// }


exports.deleteExcelFile = async (filePath) => {
  console.log("filePath:", filePath)
  await fs.unlink(filePath);
};

// create excel file
exports.exportRopa = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');

  // Add headers
  const headerRow = sheet.addRow(['ROPA Level', 'Category', 'Title', 'Explanation', 'Artifact Type', 'Question', 'Fields', 'Has Attachment', 'Extra Input Required', 'Extra Input Type', 'Extra Input Fields']);

  // Set header styles (blue background, bold text, etc.)
  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0000FF' }, // Set header background color (blue)
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' }, // Set header font color (white for contrast)
    };
    cell.alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' }; // Center alignment with wrapping for header
  });

  // Add data rows
  sheet.addRows(data);

  // Set wrap text for all data rows
  data?.forEach((row, rowIndex) => {
    const dataRow = sheet.getRow(rowIndex + 2); // Offset by 2 to account for the header row
    dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.alignment = { wrapText: true }; // Enable text wrapping for each cell in the data row
    });
  });

  // Define column widths (optional, but helps with wrapping)
  sheet.columns = [
    { width: 15 }, // ROPA Level
    { width: 20 }, // Category
    { width: 25 }, // Title
    { width: 30 }, // Explanation
    { width: 15 }, // Artifact Type
    { width: 30 }, // Question
    { width: 20 }, // Fields
    { width: 15 }, // Has Attachment
    { width: 25 }, // Extra Input Required
    { width: 20 }, // Extra Input Type
    { width: 30 }, // Extra Input Fields
  ];

  // Save the workbook to a file
  const fileName = `output-${Date.now()}.xlsx`;
  const excelDir = path.join(__dirname, 'excel'); // Example directory name
  const filePath = path.join(excelDir, fileName);

  await workbook.xlsx.writeFile(filePath);

  return filePath;
}


processAnswers = (fields, answerArray) => {
  const names = answerArray.map(answerId => {
    const field = fields.find(f => f.id.toString() === answerId);
    return field ? field.name : null;
  }).filter(name => name !== null);

  return names.join(" , ");
}

processTableAnswers = (fields, answers) => {
  // Parse the answers to JSON objects
  const parsedAnswers = answers.map(answer => JSON.parse(answer));

  // Map the parsed answers to the desired format
  const formattedAnswers = parsedAnswers.map(answer => {
    const formattedAnswer = {};
    fields.forEach(field => {
      formattedAnswer[field.name] = answer[field.id];
    });
    return formattedAnswer;
  });
  return formattedAnswers;
}

exports.transformData = (data) => {
  return data.map((item) => {
    let results = [];
    if (!item.children || item.children.length === 0) {
      if (item.artifact_type === 'select' || item.artifact_type === 'radio' || item.artifact_type === 'input') {
        item.ans = processAnswers(item.fields, item.Answer.answer);
      }
      else if (item.artifact_type === 'textarea') {
        item.ans = item.Answer.answer[0];
      }
      else if (item.artifact_type === 'table') {
        item.ans = processTableAnswers(item.fields, item.Answer.answer);
      }
      if (item.extra_input === true) {
        if (item.artifact_type === 'table') {
          item.ans = [item.ans, item.Answer.extra_answer]

        } else if (item.Answer.extra_answer) {
          item.ans = item.ans + " , " + item.Answer.extra_answer;
        }
      }

      const result = {
        category: item.Category.name,
        title: item.title,
        description: item.description,
        artifact_type: item.artifact_type,
        answer: item.ans
      };
      if (item.is_attachment && item.Answer.attachment_link) {
        result.attachment = item.Answer.attachment_link;
      }
      // return result;
      results.push(result);

    }
    else {
      // Add parent info first
      results.push({
        category: item.Category.name,
        title: item.title,
        description: item.description,
      });
      const childrenData = item.children.map((child) => {
        if (child.artifact_type === 'select' || child.artifact_type === 'radio' || child.artifact_type === 'checkbox') {
          child.ans = processAnswers(child.fields, child.Answer.answer);
        }
        else if (child.artifact_type === 'textarea') {
          child.ans = child.Answer.answer[0];
        }
        else if (child.artifact_type === 'table') {
          child.ans = processTableAnswers(child.fields, child.Answer.answer);
        }
        if (child.extra_input === true && child.Answer.extra_answer) {
          child.ans = child.ans + " , " + child.Answer.extra_answer;
        }


        const result = {
          category: child.Category.name,
          sub_question: child.question,
          artifact_type: child.artifact_type,
          answer: child.ans
        };
        if (child.is_attachment && child.Answer.attachment_link) {
          result.attachment = child.Answer.attachment_link;
        }
        return result;
      });

      // return childrenData;
      results = results.concat(childrenData);
    }
    return results;
  }).flat().filter(item => item !== undefined);
}

exports.transformBasicInfo = (data) => {
  const qaPairs = data.map((item) => {
    const question = item.question;
    if (item.artifact_type === 'select' || item.artifact_type === 'radio' || item.artifact_type === 'checkbox') {
      item.ans = processAnswers(item.fields, item.BasicInfoAnswer.answer);
    } else if (item.artifact_type === 'input' || item.artifact_type === 'textarea') {
      item.ans = item.BasicInfoAnswer.answer[0];
    }
    const answer = item.ans;
    return { question, answer };
  });
  return qaPairs;
};

// core engine

exports.createTree = (nodes) => {
  const tree = [];
  const nodeMap = {};

  // Create a map of nodes using their IDs
  nodes.forEach(node => {
    // node.children = [];
    nodeMap[node.id] = node;
  });

  // Iterate over each node and assign children to their parent
  nodes.forEach(node => {
    const { id, parent_id } = node;

    if (parent_id === null || parent_id === undefined) {
      // If a node doesn't have a parent, it is a root node
      tree.push(node);
    } else {
      // If a node has a parent, add it as a child of the parent node
      const parent = nodeMap[parent_id];
      if (parent) {
        parent.children.push(node);
      } else {
        // If the parent node doesn't exist, add it as a root node
        tree.push(node);
      }
    }
  });

  return tree;
}

exports.createGroupTree = (nodes) => {
  const tree = [];
  const nodeMap = {};

  // Create a map of nodes using their IDs
  nodes.forEach(node => {
    node.children = [];
    nodeMap[node.id] = node;
  });

  // Iterate over each node and assign children to their parent
  nodes.forEach(node => {
    const { id, parent_id } = node;

    if (parent_id === null || parent_id === undefined) {
      // If a node doesn't have a parent, it is a root node
      tree.push(node);
    } else {
      // If a node has a parent, add it as a child of the parent node
      const parent = nodeMap[parent_id];
      if (parent) {
        parent.children.push(node);
      } else {
        // If the parent node doesn't exist, add it as a root node
        tree.push(node);
      }
    }
  });

  return tree;
}

exports.buildHierarchy = (data, parentGroupId = null) => {
  const hierarchy = [];
  data.forEach(item => {
    if (item.group_id === parentGroupId) {
      const children = item.children ? buildHierarchy(item.children, item.id) : [];
      if (children.length) {
        item.childrens = children;
      }
      hierarchy.push(item);
    }
  });
  return hierarchy;
}


// createAssessmentExcelFile();
