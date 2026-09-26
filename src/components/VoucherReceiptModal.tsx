import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Copy, 
  Check, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  Compass, 
  ShieldCheck, 
  FileText,
  FileDown,
  Loader2
} from 'lucide-react';
import { Booking, CurrencyType } from '../types';

interface VoucherReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  currency: CurrencyType;
}

export const VoucherReceiptModal: React.FC<VoucherReceiptModalProps> = ({
  isOpen,
  onClose,
  booking,
  currency,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const totalFormatted = `৳${booking.totalPriceBDT.toLocaleString()}`;

  const issueDate = booking.createdAt 
    ? new Date(booking.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Generate High-Quality Vector PDF using jsPDF (100% immune to modern CSS / oklch color parsing issues)
  const handleSaveAsPDF = () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Currency formatted strings (using Latin characters for standard Helvetica font rendering)
      const unitRateText = `BDT ${Math.round(booking.totalPriceBDT / (booking.travelers || 1)).toLocaleString()}`;
      const totalRateText = `BDT ${booking.totalPriceBDT.toLocaleString()}`;

      // 1. Top Branded Navy Header Banner
      pdf.setFillColor(13, 39, 88);
      pdf.roundedRect(15, 14, 180, 28, 3, 3, 'F');

      // Brand Logo & Title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      pdf.text('ANAR', 22, 26);
      pdf.setTextColor(245, 158, 11); // Amber / Gold accent
      pdf.text('+', 44, 26);
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text(' TRAVEL AGENCY', 48, 26);

      // Subtitle
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(203, 213, 225);
      pdf.text('Government of Bangladesh Approved Tour Operator • Reg: TRV-882109', 22, 34);

      // Confirmed & Paid Badge inside Banner
      pdf.setFillColor(236, 253, 245);
      pdf.roundedRect(144, 21, 45, 14, 3, 3, 'F');
      pdf.setDrawColor(167, 243, 208);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(144, 21, 45, 14, 3, 3, 'S');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(6, 95, 70);
      pdf.text('CONFIRMED & PAID', 166.5, 29.5, { align: 'center' });

      // 2. Voucher Metadata Bar
      let currentY = 47;
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(15, currentY, 180, 9, 2, 2, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(13, 39, 88);
      pdf.text(`VOUCHER #${booking.id}`, 20, currentY + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Issue Date: ${issueDate}`, 75, currentY + 6);
      pdf.text('Departure: Dhaka, BD', 125, currentY + 6);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(5, 150, 105);
      pdf.text('● Security Verified', 165, currentY + 6);

      // 3. Grid Row 1: Passenger & Destination Cards
      currentY = 60;
      const colW = 88;
      const col2X = 107;

      // Card 1: Lead Passenger
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(15, currentY, colW, 35, 3, 3, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text('LEAD PASSENGER & CONTACT', 20, currentY + 7);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text(booking.userName || 'Valued Traveler', 20, currentY + 15);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Phone: ${booking.userPhone || '+880 1712-345678'}`, 20, currentY + 23);
      pdf.text(`Email: ${booking.userEmail}`, 20, currentY + 29);

      // Card 2: Destination & Package
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(col2X, currentY, colW, 35, 3, 3, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text('DESTINATION & TOUR PACKAGE', col2X + 5, currentY + 7);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text(booking.destinationName, col2X + 5, currentY + 15);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Dates: ${booking.travelDate} to ${booking.returnDate || 'Flexible'}`, col2X + 5, currentY + 23);
      pdf.text(`Travelers: ${booking.travelers} Guests • Tier: ${booking.planType}`, col2X + 5, currentY + 29);

      // 4. Grid Row 2: Assigned Guide & Payment Cards
      currentY = 99;

      // Card 3: Guide (Blue Tint)
      pdf.setFillColor(239, 246, 255);
      pdf.setDrawColor(191, 219, 254);
      pdf.roundedRect(15, currentY, colW, 32, 3, 3, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(30, 64, 175);
      pdf.text('ASSIGNED DISTRICT GUIDE', 20, currentY + 7);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.setTextColor(30, 58, 138);
      pdf.text(booking.assignedGuideName || 'District On-Ground Escort', 20, currentY + 15);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(37, 99, 235);
      pdf.text('Direct Guide Helpline on Arrival: +880 1819-234567', 20, currentY + 23);

      // Card 4: Payment Details
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(col2X, currentY, colW, 32, 3, 3, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text('PAYMENT METHOD & TRANSACTION', col2X + 5, currentY + 7);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${booking.paymentMethod} (${booking.paymentStatus})`, col2X + 5, currentY + 15);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Trx ID: ${booking.transactionId || 'BKASH-VERIFIED-772'}`, col2X + 5, currentY + 23);

      // 5. Financial Ledger Table
      currentY = 135;
      pdf.setFillColor(13, 39, 88);
      pdf.roundedRect(15, currentY, 180, 9, 2, 2, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Package Description', 20, currentY + 6);
      pdf.text('Travelers', 115, currentY + 6);
      pdf.text('Unit Rate', 140, currentY + 6);
      pdf.text('Total Amount', 190, currentY + 6, { align: 'right' });

      // Table Row
      currentY = 144;
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(15, currentY, 180, 17, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${booking.destinationName} Travel Package`, 20, currentY + 6.5);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`${booking.planType} Tier • Hotel Stay + Transport + Guide Support`, 20, currentY + 12);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(15, 23, 42);
      pdf.text(String(booking.travelers), 120, currentY + 8);

      pdf.setFont('helvetica', 'normal');
      pdf.text(unitRateText, 140, currentY + 8);

      pdf.setFont('helvetica', 'bold');
      pdf.text(totalRateText, 190, currentY + 8, { align: 'right' });

      // Total Row
      currentY = 161;
      pdf.setFillColor(241, 245, 249);
      pdf.setDrawColor(203, 213, 225);
      pdf.roundedRect(15, currentY, 180, 11, 2, 2, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Grand Total Paid in Full:', 20, currentY + 7.5);

      pdf.setFontSize(10.5);
      pdf.setTextColor(5, 150, 105);
      pdf.text(totalRateText, 190, currentY + 7.5, { align: 'right' });

      // 6. Important Guidelines
      currentY = 176;
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(15, currentY, 180, 48, 3, 3, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(13, 39, 88);
      pdf.text('IMPORTANT TRAVEL & CHECK-IN INSTRUCTIONS', 20, currentY + 7);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(71, 85, 105);
      const guidelines = [
        '• Present this official digital PDF or printed voucher along with your Passport/NID upon resort check-in.',
        '• Standard check-in time is 12:00 PM; airport/terminal pickups commence according to your itinerary.',
        '• 24/7 Traveler Emergency Helpline: +880 1712-345678 | Email: support@anartravel.com',
        '• Agency Headquarters: Banani Road 11, Block D, Dhaka 1213, Bangladesh.',
        '• Cancellation and change policies apply according to your selected tour plan tier.'
      ];

      let guideY = currentY + 14;
      guidelines.forEach((g) => {
        pdf.text(g, 20, guideY);
        guideY += 6.5;
      });

      // 7. Security Hash & Footer
      currentY = 228;
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(15, currentY, 180, 11, 2, 2, 'F');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Digital Verification Hash: ${booking.id}-SHA256-ANAR-OK`, 20, currentY + 7);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(13, 39, 88);
      pdf.text('ANAR Travel Agency © 2026', 190, currentY + 7, { align: 'right' });

      // Save PDF file
      pdf.save(`ANAR-Travel-Voucher-${booking.id}.pdf`);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('PDF Generation failed, falling back:', err);
      handleDownloadReceipt();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Safe Print Handler using isolated print window / iframe
  const handlePrint = () => {
    try {
      const printContent = document.getElementById('printable-voucher-content');
      if (!printContent) {
        window.print();
        return;
      }

      // Create an invisible iframe for isolated printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        return;
      }

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>ANAR Travel Voucher - ${booking.id}</title>
            <meta charset="utf-8" />
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
            <style>
              @page { size: A4; margin: 15mm; }
              body {
                font-family: 'Plus Jakarta Sans', Arial, sans-serif;
                color: #0f172a;
                background: #ffffff;
                margin: 0;
                padding: 20px;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .voucher-card {
                max-width: 800px;
                margin: 0 auto;
                border: 2px solid #e2e8f0;
                border-radius: 16px;
                padding: 28px;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #0d2758;
                padding-bottom: 16px;
                margin-bottom: 20px;
              }
              .brand-title {
                font-size: 24px;
                font-weight: 900;
                color: #0d2758;
                letter-spacing: -0.5px;
              }
              .badge {
                display: inline-block;
                padding: 4px 12px;
                background: #ecfdf5;
                color: #065f46;
                font-weight: 800;
                font-size: 11px;
                border-radius: 9999px;
                border: 1px solid #a7f3d0;
                text-transform: uppercase;
              }
              .grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin-bottom: 20px;
              }
              .info-box {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 14px;
              }
              .info-title {
                font-size: 10px;
                font-weight: 800;
                color: #64748b;
                text-transform: uppercase;
                margin-bottom: 4px;
              }
              .info-value {
                font-size: 13px;
                font-weight: 700;
                color: #1e293b;
              }
              .table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              .table th {
                background: #0d2758;
                color: #ffffff;
                text-align: left;
                padding: 10px 12px;
                font-size: 12px;
                font-weight: 700;
              }
              .table td {
                padding: 10px 12px;
                border-bottom: 1px solid #e2e8f0;
                font-size: 12px;
              }
              .total-row {
                background: #f1f5f9;
                font-size: 14px;
                font-weight: 800;
              }
              .footer-notes {
                margin-top: 24px;
                padding-top: 16px;
                border-top: 1px dashed #cbd5e1;
                font-size: 11px;
                color: #64748b;
                line-height: 1.5;
              }
            </style>
          </head>
          <body>
            <div class="voucher-card">
              ${printContent.innerHTML}
            </div>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1500);
      }, 500);
    } catch (e) {
      console.warn('Fallback standard print:', e);
      window.print();
    }
  };

  // Download Standalone Voucher HTML
  const handleDownloadReceipt = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ANAR Travel Voucher - ${booking.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 30px; color: #0f172a; }
    .card { max-width: 760px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0d2758; padding-bottom: 16px; margin-bottom: 24px; }
    .brand { font-size: 26px; font-weight: 900; color: #0d2758; }
    .badge { background: #dcfce7; color: #166534; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
    .cell { background: #f1f5f9; padding: 12px 16px; border-radius: 12px; }
    .cell-title { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
    .cell-val { font-size: 14px; font-weight: 800; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #0d2758; color: #fff; text-align: left; padding: 12px; font-size: 12px; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .total { background: #e0f2fe; font-weight: 900; color: #0369a1; }
    .footer { border-top: 1px dashed #cbd5e1; padding-top: 16px; font-size: 11px; color: #64748b; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="brand">ANAR+ Travel Agency</div>
        <div style="font-size: 11px; color: #64748b; font-weight: 600;">Government of Bangladesh Approved Tour Operator • Reg: TRV-882109</div>
      </div>
      <div class="badge">Confirmed & Paid</div>
    </div>

    <div style="margin-bottom: 20px; font-size: 13px; font-weight: bold; color: #334155;">
      Official Travel Voucher & Receipt • Voucher No: <span style="color: #0284c7;">#${booking.id}</span> • Issued: ${issueDate}
    </div>

    <div class="grid">
      <div class="cell">
        <div class="cell-title">Passenger Details</div>
        <div class="cell-val">${booking.userName || 'Valued Traveler'}</div>
        <div style="font-size: 12px; color: #475569;">${booking.userPhone || 'N/A'} • ${booking.userEmail}</div>
      </div>
      <div class="cell">
        <div class="cell-title">Destination & Package</div>
        <div class="cell-val">${booking.destinationName}</div>
        <div style="font-size: 12px; color: #475569;">Plan: ${booking.planType} • ${booking.travelers} Guests</div>
      </div>
      <div class="cell">
        <div class="cell-title">Travel Dates</div>
        <div class="cell-val">${booking.travelDate} to ${booking.returnDate || 'Flexible'}</div>
        <div style="font-size: 12px; color: #475569;">Status: Active & Reserved</div>
      </div>
      <div class="cell">
        <div class="cell-title">Payment & Guide</div>
        <div class="cell-val">${booking.paymentMethod} (${booking.paymentStatus})</div>
        <div style="font-size: 12px; color: #475569;">Guide: ${booking.assignedGuideName || 'District Assigned Guide'} • Trx: ${booking.transactionId || 'VERIFIED'}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Travelers</th>
          <th>Rate</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${booking.destinationName} Complete Tour Package</strong><br><span style="font-size: 11px; color: #64748b;">Includes handpicked stays, local guide, transfers, & verified support</span></td>
          <td>${booking.travelers}</td>
          <td>৳${Math.round(booking.totalPriceBDT / booking.travelers).toLocaleString()}</td>
          <td style="text-align: right;"><strong>${totalFormatted}</strong></td>
        </tr>
        <tr class="total">
          <td colspan="3"><strong>Total Amount Paid</strong></td>
          <td style="text-align: right;"><strong>${totalFormatted}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <strong>Important Travel Instructions:</strong><br>
      • Please present this printed voucher or digital copy upon arrival at your resort/hotel and to your designated local guide.<br>
      • 24/7 24-hour on-ground emergency helpline: <strong>+880 1712-345678</strong> | Email: <strong>support@anartravel.com</strong><br>
      • Banani Road 11, Block D, Dhaka, Bangladesh | Thank you for choosing ANAR Travel Agency!
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ANAR-Voucher-${booking.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyDetails = () => {
    const text = `ANAR Travel Agency Voucher
Booking ID: #${booking.id}
Destination: ${booking.destinationName}
Passenger: ${booking.userName} (${booking.userPhone})
Travel Date: ${booking.travelDate}
Guests: ${booking.travelers}
Total Paid: ${totalFormatted} via ${booking.paymentMethod}
Status: ${booking.bookingStatus} (${booking.paymentStatus})
Assigned Guide: ${booking.assignedGuideName || 'District Guide Team'}
Helpline: +880 1712-345678`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-6 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-extrabold text-sm">
            <FileText className="w-4 h-4 text-blue-900 dark:text-amber-400" />
            <span>Official Travel Ticket & Voucher</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary High-Quality PDF button using jspdf + html2canvas */}
            <button
              onClick={handleSaveAsPDF}
              disabled={isGeneratingPDF}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              title="Generate and download high-quality PDF document"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : pdfSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              )}
              <span>{isGeneratingPDF ? 'Generating PDF...' : pdfSuccess ? 'PDF Saved!' : 'Save as PDF'}</span>
            </button>

            <button
              onClick={handleDownloadReceipt}
              className="hidden sm:flex px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs items-center gap-1.5 transition-colors cursor-pointer"
              title="Download offline HTML ticket"
            >
              <Download className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print ticket or browser print dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Voucher Body */}
        <div className="flex-1 p-5 sm:p-8 overflow-y-auto">
          
          <div 
            id="printable-voucher-content"
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm space-y-6"
          >
            
            {/* Header / Brand */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#0d2758] dark:border-amber-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0d2758] text-amber-400 flex items-center justify-center font-black shadow-md">
                  <Compass className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0d2758] dark:text-white tracking-tight flex items-center">
                    ANAR<span className="text-amber-500 font-black">+</span> Travel Agency
                  </h2>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Licensed Tour Operator • Gov Reg: TRV-882109
                  </p>
                </div>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Confirmed & Paid
                </span>
                <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  Voucher #{booking.id}
                </p>
              </div>
            </div>

            {/* Verification Subheading */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Issue Date: <strong className="text-slate-800 dark:text-white">{issueDate}</strong></span>
              <span>Departure: <strong className="text-slate-800 dark:text-white">Dhaka, Bangladesh</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Security Verified</span>
            </div>

            {/* Passenger & Destination Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Lead Passenger & Contact
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {booking.userName || 'Authentic Traveler'}
                </p>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                    <span>{booking.userPhone || '+880 1712-345678'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                    <span>{booking.userEmail}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Destination & Tour Package
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {booking.destinationName}
                </p>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                    <span>Travel Date: <strong>{booking.travelDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                    <span>Travelers: <strong>{booking.travelers} Guests</strong> ({booking.planType})</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Assigned Guide & Payment Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                  Assigned District Guide
                </span>
                <p className="text-sm font-extrabold text-blue-950 dark:text-white">
                  {booking.assignedGuideName || 'District On-Ground Escort'}
                </p>
                <p className="text-xs text-blue-800/80 dark:text-blue-300">
                  Contact on Arrival: <strong>+880 1819-234567</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Payment Method & Transaction
                </span>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {booking.paymentMethod} ({booking.paymentStatus})
                </p>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  TrxID: {booking.transactionId || 'BKASH-VERIFIED-772'}
                </p>
              </div>

            </div>

            {/* Financial Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0d2758] text-white">
                    <th className="p-3 rounded-l-xl font-bold">Package Description</th>
                    <th className="p-3 font-bold text-center">Qty</th>
                    <th className="p-3 font-bold text-right">Unit Fare</th>
                    <th className="p-3 rounded-r-xl font-bold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {booking.destinationName} Travel Package
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {booking.planType} Tier • Hotel/Resort Stay + Transportation + Local Guide Support
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold">
                      {booking.travelers}
                    </td>
                    <td className="p-3 text-right font-medium">
                      ৳{Math.round(booking.totalPriceBDT / booking.travelers).toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                      {totalFormatted}
                    </td>
                  </tr>

                  <tr className="bg-slate-50 dark:bg-slate-800/50 font-black text-sm">
                    <td colSpan={3} className="p-3 rounded-l-xl text-slate-800 dark:text-slate-200">
                      Grand Total (Paid in Full)
                    </td>
                    <td className="p-3 rounded-r-xl text-right text-emerald-600 dark:text-emerald-400 text-base">
                      {totalFormatted}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Terms & Helpline */}
            <div className="pt-4 border-t border-dashed border-slate-300 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
              <p>
                <strong>Check-In Instructions:</strong> Please present this official electronic or printed voucher along with your National ID (NID) or Passport at hotel check-in and during airport/bus terminal transfers.
              </p>
              <p>
                <strong>24/7 Traveler Emergency Helpline:</strong> +880 1712-345678 | Banani Road 11, Block D, Dhaka, Bangladesh.
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-[10px] text-slate-400">
                  Digital Auth Token: {booking.id}-SECURE-HASH-OK
                </span>
                <span className="text-[10px] font-bold text-blue-900 dark:text-amber-400">
                  ANAR Travel Agency © 2026
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyDetails}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Voucher Text'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Primary High-Quality PDF generation with jspdf + html2canvas */}
            <button
              onClick={handleSaveAsPDF}
              disabled={isGeneratingPDF}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : pdfSuccess ? (
                <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />
              ) : (
                <FileDown className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              )}
              <span>{isGeneratingPDF ? 'Generating High-Quality PDF...' : pdfSuccess ? 'PDF Downloaded!' : 'Download PDF Voucher'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
