const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const { PassThrough } = require('stream');

const sendCertificate = async (userEmail, userName, courseTitle) => {
  try {
    // 1. التحقق من صحة المدخلات وتنظيفها
    const cleanUserName = String(userName || '').trim();
    const cleanCourseTitle = String(courseTitle || '').trim();
    const cleanUserEmail = String(userEmail || '').trim();

    if (!cleanUserName) throw new Error('User name is required');
    if (!cleanCourseTitle) throw new Error('Course title is required');
    if (!cleanUserEmail.includes('@')) throw new Error('Invalid email address');

    console.log('Input Data:', {
      userEmail: cleanUserEmail,
      userName: cleanUserName,
      courseTitle: cleanCourseTitle
    });

    // 2. إنشاء مستند PDF
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 50,
      bufferPages: true
    });

    // 3. إعداد الخطوط
    doc.registerFont('Standard', 'Helvetica');
    doc.registerFont('Bold', 'Helvetica-Bold');

    // 4. تصميم الخلفية
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f8f9fa");
    doc.strokeColor('#3498db')
      .lineWidth(15)
      .roundedRect(40, 40, doc.page.width - 80, doc.page.height - 80, 20)
      .stroke();

    // 5. كتابة محتوى الشهادة
    doc.font('Bold')
      .fontSize(36)
      .fillColor('#2c3e50')
      .text("CERTIFICATE OF COMPLETION", {
        align: "center",
        underline: true,
        lineGap: 20
      });

    doc.moveDown(1.5)
      .font('Standard')
      .fontSize(20)
      .fillColor('#495057')
      .text("This is to certify that", { align: "center" });

    doc.moveDown(1)
      .font('Bold')
      .fontSize(28)
      .fillColor('#e63946')
      .text(cleanUserName, { align: "center" });

    doc.moveDown(1)
      .font('Standard')
      .fontSize(20)
      .fillColor('#495057')
      .text("has successfully completed the course", { align: "center" });

    doc.moveDown(1)
      .font('Bold')
      .fontSize(24)
      .fillColor('#1d3557')
      .text(`"${cleanCourseTitle}"`, { align: "center" });

    // 6. إضافة التاريخ
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.moveDown(2)
      .font('Standard')
      .fontSize(16)
      .fillColor('#6c757d')
      .text(`Awarded on: ${formattedDate}`, { align: "center" });

    // 7. إنشاء ملف PDF
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    const pdfBuffer = await new Promise((resolve) => {
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      doc.end();
    });

    // 8. إرسال البريد الإلكتروني
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Education Platform" <${process.env.EMAIL_USER}>`,
      to: cleanUserEmail,
      subject: `Your Certificate for ${cleanCourseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2c3e50;">Congratulations, ${cleanUserName}!</h2>
          <p>Please find attached your certificate for completing:</p>
          <p style="font-size: 1.2em; font-weight: bold; color: #1d3557;">${cleanCourseTitle}</p>
          <p>Best regards,<br>The Education Team</p>
        </div>
      `,
      attachments: [{
        filename: `Certificate_${cleanCourseTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      }],
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Certificate sent successfully" };
  } catch (error) {
    console.error("Certificate generation error:", error);
    throw new Error("Failed to generate certificate: " + error.message);
  }
};

module.exports = sendCertificate;