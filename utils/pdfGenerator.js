const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

// Define common fonts
const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};

// Common styles
const styles = {
    dateStyle: {
        fontSize: 12,
        bold: false,
        margin: [0, 5, 0, 10]
    },
    header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
    },
    subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
    },
    subheaderProductSold: {
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 5]
    },
    companyName: {
        fontSize: 20,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 0]
    }
};

const generateDailySalesPdf = (data) => {
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
            { text: 'Daily Sales Report', style: 'header', alignment: 'center' },
            { text: `Total Sales: Rs.${data.totalSales.toFixed(2)}`, style: 'subheader' },
            { text: `Total Orders: ${data.totalOrders}`, style: 'subheader' },
            { text: 'Daily Sales Details:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['10%', '13%', '17%', '20%', '11%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Date', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Price at Time', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        ...data.dailySales.flatMap((sale, index) => {
                            // Get date and sales data
                            const date = sale.date || '';
                            const totalSales = typeof sale.totalSales === 'number' ? sale.totalSales : 0;
                            
                            return sale.OrderItems.map(item => [
                                { text: date, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerName || 'N/A', alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerPhone || 'N/A', alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${item.priceAtTime.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${totalSales.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ]);
                        })
                    ]
                }
            },
            { text: 'Total Products Sold:', style: 'subheaderProductSold', },
            {
                table: {
                    headerRows: 1,
                    widths: ['40%', '30%', '30%'],
                    body: [
                        [
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Quantity Sold', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales Amount', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                        ],
                        ...data.totalProductsSold.map((sold, index) => {
                            return [
                                { text: sold.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sold.totalQuantitySold, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${sold.totalSalesAmount.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ];
                        })
                    ]
                }
            },
        ],
        styles
    };

    return printer.createPdfKitDocument(docDefinition);
};

const generateWeeklySalesPdf = (data) => {
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
            { text: 'Weekly Sales Report', style: 'header', alignment: 'center' },
            { text: `Total Sales: Rs.${data.totalSales.toFixed(2)}`, style: 'subheader' },
            { text: `Total Orders: ${data.totalOrders}`, style: 'subheader' },
            { text: 'Weekly Sales Details:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['10%', '13%', '17%', '20%', '11%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Week', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Price at Time', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        ...data.weeklySales.flatMap((sale, index) => {
                            // Get week and sales data
                            const week = sale.week ? 
                                (typeof sale.week.toISOString === 'function' ? 
                                    sale.week.toISOString().slice(0, 10) : 
                                    String(sale.week)) : 
                                'N/A';
                            
                            const totalSales = typeof sale.totalSales === 'number' ? sale.totalSales : 0;
                            
                            return sale.OrderItems.map(item => [
                                { text: week, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerName || 'N/A', alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerPhone || 'N/A', alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${item.priceAtTime.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${totalSales.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ]);
                        })
                    ]
                }
            },
            { text: 'Total Products Sold:', style: 'subheaderProductSold', },
            {
                table: {
                    headerRows: 1,
                    widths: ['40%', '30%', '30%'],
                    body: [
                        [
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Quantity Sold', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales Amount', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                        ],
                        ...data.totalProductsSold.map((sold, index) => {
                            return [
                                { text: sold.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sold.totalQuantitySold, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${sold.totalSalesAmount.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ];
                        })
                    ]
                }
            },
        ],
        styles
    };

    return printer.createPdfKitDocument(docDefinition);
};

const generateMonthlySalesPdf = (data) => {
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
            { text: 'Monthly Sales Report', style: 'header', alignment: 'center' },
            { text: `Total Sales: Rs.${data.totalSales.toFixed(2)}`, style: 'subheader' },
            { text: `Total Orders: ${data.totalOrders}`, style: 'subheader' },
            { text: 'Monthly Sales Details:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['10%', '13%', '17%', '20%', '11%', '15%', '15%'],
                    body: [
                        [
                            { text: 'Month', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Price at Time', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        ...data.monthlySales.flatMap((sale, index) => {
                            // Get month and sales data
                            const month = sale.month ? 
                                (typeof sale.month.toISOString === 'function' ? 
                                    sale.month.toISOString().slice(0, 7) : 
                                    String(sale.month)) : 
                                'N/A';
                            
                            const totalSales = typeof sale.totalSales === 'number' ? sale.totalSales : 0;
                            
                            return sale.OrderItems.map(item => [
                                { text: month, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerName || 'N/A', alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerPhone || 'N/A', alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${item.priceAtTime.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${totalSales.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ]);
                        })
                    ]
                }
            },
            { text: 'Total Products Sold:', style: 'subheaderProductSold', },
            {
                table: {
                    headerRows: 1,
                    widths: ['40%', '30%', '30%'],
                    body: [
                        [
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Quantity Sold', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales Amount', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                        ],
                        ...data.totalProductsSold.map((sold, index) => {
                            return [
                                { text: sold.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sold.totalQuantitySold, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${sold.totalSalesAmount.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ];
                        })
                    ]
                }
            },
        ],
        styles
    };

    return printer.createPdfKitDocument(docDefinition);
};

const generateCustomPdf = (data) => {
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
            { text: 'Custom Sales Report', style: 'header', alignment: 'center' },
            { text: `From ${data.startDate.toDateString()} to ${data.endDate.toDateString()}`, style: 'subheader' },
            { text: `Total Sales: Rs.${data.totalSales.toFixed(2)}`, style: 'subheader' },
            { text: `Total Orders: ${data.totalOrders}`, style: 'subheader' },
            { text: 'Sales and Order Details:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['10%', '13%', '17%', '20%', '11%', '15%', '15%'], // Dynamic widths
                    body: [
                        [
                            { text: 'Date', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Customer Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Price at Time', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        ...data.customSales.flatMap((sale, index) => {
                            // Get date and sales data
                            const date = sale.date || '';
                            const totalSales = typeof sale.totalSales === 'number' ? sale.totalSales : 0;
                            
                            return sale.OrderItems.map(item => [
                                { text: date, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerName || 'N/A', alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sale.customerPhone || 'N/A', alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${item.priceAtTime.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${totalSales.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null }
                            ]);
                        })
                    ]
                },
                layout: {
                    fillColor: (rowIndex) => (rowIndex === 0 ? '#eeeeee' : null) // Ensures header row has background color
                }
            },
            { text: 'Total Products Sold:', style: 'subheaderProductSold', },
            {
                table: {
                    headerRows: 1,
                    widths: ['40%', '30%', '30%'],
                    body: [
                        [
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Quantity Sold', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total Sales Amount', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                        ],
                        ...data.totalProductsSold.map((sold, index) => {
                            return [
                                { text: sold.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: sold.totalQuantitySold, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                                { text: `Rs.${sold.totalSalesAmount.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            ];
                        })
                    ]
                }
            },
        ],
        styles
    };

    return printer.createPdfKitDocument(docDefinition);
};

// const generateInventoryPurchasePdf = (purchase) => {
//     const printer = new PdfPrinter(fonts);

//     // Base64-encoded logo (replace with your actual base64 string)
//     // const logoBase64 = 'iVBORw0KGgoAAAANSUhEUgAA...'; // Replace with your base64 string
//     const imagePath = path.join(__dirname, '../utils/logo.png');
//     const logoBase64 = imageToBase64(imagePath);

//     const docDefinition = {
//         content: [
//             {
//                 text: 'Point of Sale System', // Company name in the center
//                 style: 'companyName',
//                 alignment: 'center'
//             },
//             { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
//             { text: 'Inventory Purchase Report', style: 'header', alignment: 'left' },
//             { text: `Purchase Order ID: ${purchase.id}`, style: 'subheader' },
//             { text: `Supplier Details`, style: 'subheader' },
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ['20%', '30%', '20%', '30%'],
//                     body: [
//                         [
//                             { text: 'Supplier Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Contact Person', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Email', bold: true, fillColor: '#eeeeee', alignment: 'center' }
//                         ],
//                         [
//                             { text: purchase.Supplier.supplierName, alignment: 'center' },
//                             { text: purchase.Supplier.contactPerson, alignment: 'center' },
//                             { text: purchase.Supplier.phone, alignment: 'center' },
//                             { text: purchase.Supplier.email, alignment: 'center' }
//                         ]
//                     ]
//                 }
//             },
//             { text: 'Purchase Items', style: 'subheader' },
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ['20%', '30%', '15%', '15%', '20%'],
//                     body: [
//                         [
//                             { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Description', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Price', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Total', bold: true, fillColor: '#eeeeee', alignment: 'center' }
//                         ],
//                         ...purchase.PurchaseOrderItems.map((item, index) => [
//                             { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
//                             { text: item.Product.productDescription, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
//                             { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
//                             { text: `$${item.Product.price.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
//                             { text: `$${(item.quantity * item.Product.price).toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null }
//                         ])
//                     ]
//                 }
//             },
//             { text: `Total Purchase Amount: $${purchase.PurchaseOrderItems.reduce((total, item) => total + (item.quantity * item.Product.price), 0).toFixed(2)}`, style: 'subheader' }
//         ],
//         footer: function (currentPage, pageCount) {
//             return [
//                 {
//                     text: [
//                         { text: 'Company Name: InvoZone\n', fontSize: 10 },
//                         { text: 'Address: 123 Main St, City, Country\n', fontSize: 10 },
//                         { text: 'Phone: +123 456 7890 | Email: info@yourcompany.com\n', fontSize: 10 },
//                         { text: `Page ${currentPage} of ${pageCount}`, fontSize: 10, alignment: 'right' }
//                     ],
//                     alignment: 'center',
//                     margin: [0, 10, 40, 0]
//                 }
//             ];
//         },
//         // set page A4
//         pageSize: 'A4',
//         // set the origin of the pdf content
//         pageOrientation: 'A4',
//         // add a background image
//         background: () => {

//             return {
//                 image: `${logoBase64}`,
//                 width: 500,
//                 alignment: 'center',
//                 y: 20,
//                 opacity: 0.2
//             };

//         },
//         styles,
//     };

//     return printer.createPdfKitDocument(docDefinition);
// };

// const generateInventoryPurchasePdf = (purchase) => {
//     const printer = new PdfPrinter(fonts);

//     // Convert the image to base64
//     const imagePath = path.join(__dirname, '../utils/logo.png');
//     const logoBase64 = imageToBase64(imagePath);

//     const docDefinition = {
//         content: [
//             {
//                 text: 'Point of Sale System', // Company name in the center
//                 style: 'companyName',
//                 alignment: 'center'
//             },
//             { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
//             { text: 'Inventory Purchase Report', style: 'header', alignment: 'left' },
//             { text: `Purchase Order ID: ${purchase.id}`, style: 'subheader' },
//             { text: `Supplier Details`, style: 'subheader' },
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ['20%', '30%', '20%', '30%'],
//                     body: [
//                         [
//                             { text: 'Supplier Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Contact Person', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Email', bold: true, fillColor: '#eeeeee', alignment: 'center' }
//                         ],
//                         [
//                             { text: purchase.Supplier.supplierName, alignment: 'center' },
//                             { text: purchase.Supplier.contactPerson, alignment: 'center' },
//                             { text: purchase.Supplier.phone, alignment: 'center' },
//                             { text: purchase.Supplier.email, alignment: 'center' }
//                         ]
//                     ]
//                 }
//             },
//             { text: 'Purchase Items', style: 'subheader' },
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ['20%', '30%', '15%', '15%', '20%'],
//                     body: [
//                         [
//                             { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Description', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Price', bold: true, fillColor: '#eeeeee', alignment: 'center' },
//                             { text: 'Total', bold: true, fillColor: '#eeeeee', alignment: 'center' }
//                         ],
//                         ...purchase.PurchaseOrderItems.map((item, index) => [
//                             { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
//                             { text: item.Product.productDescription, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
//                             { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
//                             { text: `$${item.Product.price.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
//                             { text: `$${(item.quantity * item.Product.price).toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null }
//                         ])
//                     ]
//                 }
//             },
//             { text: `Total Purchase Amount: $${purchase.PurchaseOrderItems.reduce((total, item) => total + (item.quantity * item.Product.price), 0).toFixed(2)}`, style: 'subheader' }
//         ],
//         footer: function (currentPage, pageCount) {
//             return [
//                 {  
//                     columns: [
//                         {
//                             text: [
//                                 { text: 'Company Name: InvoZone\n', fontSize: 10 },
//                                 { text: 'Address: 123 Main St, City, Country | Phone: +123 456 7890\n', fontSize: 10 },
//                                 { text: 'Email: info@yourcompany.com\n', fontSize: 10 }
//                             ],
//                             alignment: 'left',
//                             width: '*'
//                         },
//                         {
//                             text: `Page ${currentPage} of ${pageCount}`,
//                             alignment: 'right',
//                             fontSize: 10,
//                             margin: [0, 10, 40, 0]
//                         }
//                     ],
//                     margin: [40, 0, 0, 0], // Adjust margins as needed
//                     padding: 20
//                 }
//             ];
//         },
//         pageSize: 'A4',
//         pageOrientation: 'portrait',
//         background: [
//             {
//                 image: `${logoBase64}`,
//                 width: 500,
//                 alignment: 'center',
//                 opacity: 0.2,
//                 marginTop: 60
//             }
//         ],
//         styles: {
//             header: {
//                 fontSize: 18,
//                 bold: true,
//                 margin: [0, 0, 0, 10]
//             },
//             subheader: {
//                 fontSize: 14,
//                 bold: true,
//                 margin: [0, 10, 0, 5]
//             },
//             dateStyle: {
//                 fontSize: 10,
//                 margin: [0, 0, 0, 10]
//             },
//             companyName: {
//                 fontSize: 20,
//                 bold: true,
//                 alignment: 'center',
//                 margin: [0, 10, 0, 0]
//             }
//         }
//     };

//     return printer.createPdfKitDocument(docDefinition);
// };

const generateInventoryPurchasePdf = (purchase) => {
    const printer = new PdfPrinter(fonts);

    // Convert the image to base64
    const imagePath = path.join(__dirname, '../utils/logo.png');
    const logoBase64 = imageToBase64(imagePath);

    const docDefinition = {
        content: [
            {
                text: 'Point of Sale System', // Company name in the center
                style: 'companyName',
                alignment: 'center'
            },
            { text: 'Report Date: ' + new Date().toLocaleDateString(), style: 'dateStyle', alignment: 'right' },
            { text: 'Inventory Purchase Report', style: 'header', alignment: 'left' },
            { text: `Purchase Order ID: ${purchase.id}`, style: 'subheader' },
            { text: `Supplier Details`, style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['20%', '30%', '20%', '30%'],
                    body: [
                        [
                            { text: 'Supplier Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Contact Person', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Phone', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Email', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        [
                            { text: purchase.Supplier.supplierName, alignment: 'center' },
                            { text: purchase.Supplier.contactPerson, alignment: 'center' },
                            { text: purchase.Supplier.phone, alignment: 'center' },
                            { text: purchase.Supplier.email, alignment: 'center' }
                        ]
                    ]
                }
            },
            { text: 'Purchase Items', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['20%', '30%', '15%', '15%', '20%'],
                    body: [
                        [
                            { text: 'Product Name', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Description', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Quantity', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Price', bold: true, fillColor: '#eeeeee', alignment: 'center' },
                            { text: 'Total', bold: true, fillColor: '#eeeeee', alignment: 'center' }
                        ],
                        ...purchase.PurchaseOrderItems.map((item, index) => [
                            { text: item.Product.productName, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            { text: item.Product.productDescription, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            { text: item.quantity, alignment: 'center', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            { text: `Rs.${item.Product.price.toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null },
                            { text: `Rs.${(item.quantity * item.Product.price).toFixed(2)}`, alignment: 'right', fillColor: index % 2 === 0 ? '#f9f9f9' : null }
                        ])
                    ]
                }
            },
            { text: `Total Purchase Amount: Rs.${purchase.PurchaseOrderItems.reduce((total, item) => total + (item.quantity * item.Product.price), 0).toFixed(2)}`, style: 'subheader' }
        ],
        footer: function (currentPage, pageCount) {
            return {
                table: {
                    widths: ['*'], // Full width
                    body: [
                        [
                            {
                                text: [
                                    { text: 'Point of Sale System\n', fontSize: 8 },
                                    { text: 'Address: 123 Main St, City, Country\n', fontSize: 6 },
                                    { text: 'Phone: +123 456 7890 | Email: info@yourcompany.com\n', fontSize: 6 },
                                    { text: `Page ${currentPage} of ${pageCount}`, fontSize: 6, alignment: 'right' }
                                ],
                                fillColor: '#f2f2f2', // Background color for the footer
                                margin: [40, 2, 40, 0] // Adjust margins as needed
                            }
                        ]
                    ],
                },
                layout: 'noBorders' // Remove table borders
            };
        },
        pageSize: 'A4',
        pageOrientation: 'portrait',
        background: [
            {
                image: `${logoBase64}`,
                width: 500,
                alignment: 'center',
                opacity: 0.2,
                marginTop: 60,
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            dateStyle: {
                fontSize: 10,
                margin: [0, 0, 0, 10]
            },
            companyName: {
                fontSize: 20,
                bold: true,
                alignment: 'center',
                margin: [0, 10, 0, 0]
            }
        }
    };

    return printer.createPdfKitDocument(docDefinition);
};

/**
 * Converts an image file to a base64 string.
 * @param {string} filePath - The path to the image file.
 * @returns {string} - The base64-encoded string of the image.
 */
const imageToBase64 = (filePath) => {
    try {
        // Read the file synchronously
        const fileData = fs.readFileSync(filePath);

        // Convert the file data to a base64 string
        const base64String = fileData.toString('base64');

        // Return the base64 string with the appropriate data URI prefix
        const mimeType = getMimeType(filePath); // Get the MIME type based on the file extension
        return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
        console.error('Error converting image to base64:', error.message);
        throw error;
    }
};

/**
 * Determines the MIME type based on the file extension.
 * @param {string} filePath - The path to the file.
 * @returns {string} - The MIME type.
 */
const getMimeType = (filePath) => {
    const extension = path.extname(filePath).toLowerCase();
    switch (extension) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.bmp':
            return 'image/bmp';
        case '.webp':
            return 'image/webp';
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
}



module.exports = {
    generateCustomPdf,
    generateMonthlySalesPdf,
    generateWeeklySalesPdf,
    generateDailySalesPdf,
    generateInventoryPurchasePdf,
}