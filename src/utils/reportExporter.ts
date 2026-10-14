export interface ReportMetric {
  label: string;
  value: string;
  subtext?: string;
}

export interface ReportData {
  id: string;
  title: string;
  subtitle: string;
  refNo: string;
  printedBy: string;
  datePeriod: string;
  metrics: ReportMetric[];
  tableHeaders: string[];
  tableRows: string[][];
  notes?: string;
  signatureTitle?: string;
  signatureName?: string;
}

export async function exportReportToPDF(report: ReportData) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const startX = 15;
  const endX = 195;
  const printableWidth = 180;
  let currentY = 15;

  // Colors
  const primaryColor = [15, 118, 110]; // Teal 700
  const primaryDark = [13, 78, 73];
  const textColor = [51, 65, 85]; // Slate 700
  const lightBg = [248, 250, 252]; // Slate 50
  const borderGrey = [226, 232, 240]; // Slate 200

  // 1. Decorative Top Bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(startX, currentY, printableWidth, 3, 'F');
  currentY += 8;

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text(report.title.toUpperCase(), startX, currentY);
  currentY += 5;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`${report.subtitle} • BUMDESA WASKITA WIJAYA WARU`, startX, currentY);

  // Doc Ref & Date
  doc.setFontSize(8);
  doc.text(`No. Dokumen: ${report.refNo}`, endX, currentY - 5, { align: 'right' });
  doc.text(`Periode: ${report.datePeriod}`, endX, currentY, { align: 'right' });
  currentY += 5;

  // Divider Line
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.setLineWidth(0.5);
  doc.line(startX, currentY, endX, currentY);
  currentY += 8;

  // 2. Metrics Cards Grid (3 or 4 columns)
  if (report.metrics && report.metrics.length > 0) {
    const cardWidth = (printableWidth - (report.metrics.length - 1) * 4) / report.metrics.length;
    const cardHeight = 18;

    report.metrics.forEach((m, idx) => {
      const cardX = startX + idx * (cardWidth + 4);
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(cardX, currentY, cardWidth, cardHeight, 'F');
      doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
      doc.rect(cardX, currentY, cardWidth, cardHeight, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label.toUpperCase(), cardX + 3, currentY + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.text(m.value, cardX + 3, currentY + 11);

      if (m.subtext) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(m.subtext, cardX + 3, currentY + 15);
      }
    });

    currentY += cardHeight + 8;
  }

  // 3. Data Table Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('RINCIAN DATA LAPORAN REAL-TIME', startX, currentY);
  currentY += 5;

  const colCount = report.tableHeaders.length;
  const colWidth = printableWidth / colCount;

  // Table Header Fill
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(startX, currentY, printableWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);

  report.tableHeaders.forEach((header, idx) => {
    doc.text(header, startX + idx * colWidth + 3, currentY + 4.8);
  });

  currentY += 7;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  report.tableRows.forEach((row, rowIdx) => {
    if (currentY > 260) {
      doc.addPage();
      currentY = 15;
    }

    if (rowIdx % 2 === 1) {
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(startX, currentY, printableWidth, 7, 'F');
    }

    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.setLineWidth(0.15);
    doc.line(startX, currentY + 7, endX, currentY + 7);

    row.forEach((cell, colIdx) => {
      doc.text(String(cell), startX + colIdx * colWidth + 3, currentY + 4.8);
    });

    currentY += 7;
  });

  currentY += 8;

  // 4. Notes & Legal Notice
  if (report.notes) {
    doc.setFont('helvetica', 'oblique');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`* ${report.notes}`, startX, currentY);
    currentY += 10;
  }

  // 5. Signature & Digital Stamp Block
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  const sigY = currentY;
  const nowStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Left side signature
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('Dicetak Oleh System Admin:', startX + 10, sigY);
  doc.text(report.printedBy, startX + 10, sigY + 4);

  doc.setDrawColor(200, 200, 200);
  doc.line(startX + 10, sigY + 20, startX + 60, sigY + 20);
  doc.setFont('helvetica', 'bold');
  doc.text('SUPER ADMIN BUMDES', startX + 10, sigY + 24);

  // Right side signature & stamp
  doc.setFont('helvetica', 'normal');
  doc.text(`Sukoharjo, ${nowStr}`, endX - 60, sigY);
  doc.text(report.signatureTitle || 'Direktur Utama BUMDESA Waskita,', endX - 60, sigY + 4);

  // Digital stamp circle
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.6);
  doc.circle(endX - 35, sigY + 13, 7, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('BUMDESA', endX - 39, sigY + 12);
  doc.text('VERIFIED', endX - 39, sigY + 15);

  // Line
  doc.setDrawColor(200, 200, 200);
  doc.line(endX - 60, sigY + 20, endX - 10, sigY + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(report.signatureName || 'SUTRISNO, S.Sos.', endX - 60, sigY + 24);

  // Save PDF
  const filename = `Laporan_${report.id}_${Date.now().toString().slice(-4)}.pdf`;
  doc.save(filename);
}

/**
 * Generate and download a high-resolution JPG image report using HTML5 Canvas
 */
export function exportReportToJPG(report: ReportData) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1200;
  // Calculate dynamic height based on row count
  const baseHeight = 1000;
  const rowHeight = 45;
  const totalHeight = baseHeight + (report.tableRows.length * rowHeight);

  canvas.width = width;
  canvas.height = totalHeight;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, totalHeight);

  // Top Header Banner Gradient
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#0f766e');
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 140);

  // Header Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(report.title.toUpperCase(), 50, 60);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px sans-serif';
  ctx.fillText(`${report.subtitle} • BUMDESA WASKITA WIJAYA`, 50, 95);

  // Doc Ref Right
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`NO. DOK: ${report.refNo}`, width - 50, 60);
  ctx.font = '16px sans-serif';
  ctx.fillText(`PERIODE: ${report.datePeriod}`, width - 50, 95);

  ctx.textAlign = 'left';
  let currentY = 180;

  // Metrics Section
  if (report.metrics && report.metrics.length > 0) {
    const cardGap = 20;
    const cardWidth = (width - 100 - (cardGap * (report.metrics.length - 1))) / report.metrics.length;
    const cardHeight = 110;

    report.metrics.forEach((m, idx) => {
      const cardX = 50 + idx * (cardWidth + cardGap);
      
      // Card Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cardX, currentY, cardWidth, cardHeight);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX, currentY, cardWidth, cardHeight);

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(m.label.toUpperCase(), cardX + 20, currentY + 35);

      // Value
      ctx.fillStyle = '#0f766e';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(m.value, cardX + 20, currentY + 70);

      // Subtext
      if (m.subtext) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.fillText(m.subtext, cardX + 20, currentY + 95);
      }
    });

    currentY += cardHeight + 40;
  }

  // Table Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('RINCIAN DATA REAL-TIME', 50, currentY);
  currentY += 20;

  // Table Header Background
  const tableX = 50;
  const tableWidth = width - 100;
  const colCount = report.tableHeaders.length;
  const colWidth = tableWidth / colCount;

  ctx.fillStyle = '#0f766e';
  ctx.fillRect(tableX, currentY, tableWidth, 50);

  // Header Cells
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  report.tableHeaders.forEach((h, idx) => {
    ctx.fillText(h, tableX + (idx * colWidth) + 15, currentY + 32);
  });

  currentY += 50;

  // Table Rows
  ctx.font = '18px sans-serif';
  report.tableRows.forEach((row, rowIdx) => {
    if (rowIdx % 2 === 1) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(tableX, currentY, tableWidth, rowHeight);
    }

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tableX, currentY + rowHeight);
    ctx.lineTo(tableX + tableWidth, currentY + rowHeight);
    ctx.stroke();

    ctx.fillStyle = '#334155';
    row.forEach((cell, colIdx) => {
      ctx.fillText(String(cell), tableX + (colIdx * colWidth) + 15, currentY + 28);
    });

    currentY += rowHeight;
  });

  currentY += 40;

  // Notes
  if (report.notes) {
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText(`* Catatan: ${report.notes}`, 50, currentY);
    currentY += 50;
  }

  // Footer Signatures & Stamp
  const sigY = currentY + 20;
  const nowStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Left Signature
  ctx.fillStyle = '#334155';
  ctx.font = '18px sans-serif';
  ctx.fillText('Dicetak Oleh:', 50, sigY);
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(report.printedBy, 50, sigY + 25);

  ctx.strokeStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(50, sigY + 100);
  ctx.lineTo(350, sigY + 100);
  ctx.stroke();

  ctx.fillText('SUPER ADMIN BUMDES', 50, sigY + 125);

  // Right Signature
  ctx.textAlign = 'right';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Sukoharjo, ${nowStr}`, width - 50, sigY);
  ctx.fillText(report.signatureTitle || 'Direktur Utama BUMDESA Waskita,', width - 50, sigY + 25);

  // Stamp Circle
  ctx.strokeStyle = '#0f766e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width - 200, sigY + 65, 40, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#0f766e';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BUMDESA', width - 200, sigY + 60);
  ctx.fillText('VERIFIED', width - 200, sigY + 75);

  ctx.textAlign = 'right';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width - 350, sigY + 100);
  ctx.lineTo(width - 50, sigY + 100);
  ctx.stroke();

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText(report.signatureName || 'SUTRISNO, S.Sos.', width - 50, sigY + 125);

  // Convert Canvas to JPG and trigger download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_${report.id}_${Date.now().toString().slice(-4)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/jpeg', 0.95);
}
