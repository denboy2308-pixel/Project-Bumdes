import { Transaction, User } from '../types';

export async function generateTransactionPDF(user: User, transactions: Transaction[]) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Color Palette
  const primaryColor = [16, 185, 129]; // Emerald (10, 117, 85 in darker tone for print)
  const primaryDark = [6, 95, 70]; // Dark Emerald
  const textColor = [51, 65, 85]; // Slate 700
  const lightBg = [248, 250, 252]; // Slate 50
  const borderGrey = [226, 232, 240]; // Slate 200

  // Standard Margins & Dimensions
  const startX = 15;
  const endX = 195;
  const printableWidth = 180;
  let currentY = 15;

  // --- 1. HEADER SECTION ---
  // Decorative top bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(startX, currentY, printableWidth, 3, 'F');
  currentY += 10;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('LAPORAN MUTASI TABUNGAN SAMPAH', startX, currentY);
  currentY += 6;

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('BUMDES WASKITA WIJAYA • UNIT BANK SAMPAH WASKITA WIJAYA UTAMA', startX, currentY);
  
  // Doc ID/Reference
  const refNo = 'REF/BS/' + new Date().getFullYear() + '/' + Math.floor(1000 + Math.random() * 9000);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`No. Dokumen: ${refNo}`, endX, currentY, { align: 'right' });
  currentY += 4;

  // Divider line
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.setLineWidth(0.5);
  doc.line(startX, currentY, endX, currentY);
  currentY += 8;

  // --- 2. ACCOUNT METADATA CARD ---
  // Background card for user info
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(startX, currentY, printableWidth, 28, 'F');
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(startX, currentY, printableWidth, 28, 'D');

  // Metadata labels & values
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate 600

  const nsbNumber = 'NSB-' + Math.floor(100000 + (user.email.charCodeAt(0) * 1000) + (user.email.charCodeAt(user.email.length - 1) * 10));

  // Left Column
  doc.text('INFORMASI NASABAH', startX + 5, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Nama Lengkap :  ${user.email.split('@')[0].toUpperCase()}`, startX + 5, currentY + 12);
  doc.text(`Email Sesi         :  ${user.email}`, startX + 5, currentY + 17);
  doc.text(`Unit Layanan     :  Bank Sampah Waskita Wijaya Utama`, startX + 5, currentY + 22);

  // Right Column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('STATUS REKENING', startX + 110, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`No. Rekening :  ${nsbNumber}`, startX + 110, currentY + 12);
  doc.text(`Tanggal Cetak:  ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB`, startX + 110, currentY + 17);
  
  // Status Pill
  doc.text('Status Akun    :  ', startX + 110, currentY + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('AKTIF', startX + 132, currentY + 22);

  currentY += 36;

  // --- 3. TRANSACTIONS TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('RIWAYAT MUTASI SALDO', startX, currentY);
  currentY += 5;

  // Table Headers
  const colWidths = {
    no: 10,
    tanggal: 25,
    keterangan: 55,
    berat: 25,
    harga: 30,
    total: 35
  };

  const colPositions = {
    no: startX,
    tanggal: startX + colWidths.no,
    keterangan: startX + colWidths.no + colWidths.tanggal,
    berat: startX + colWidths.no + colWidths.tanggal + colWidths.keterangan,
    harga: startX + colWidths.no + colWidths.tanggal + colWidths.keterangan + colWidths.berat,
    total: startX + colWidths.no + colWidths.tanggal + colWidths.keterangan + colWidths.berat + colWidths.harga
  };

  // Draw Header Background
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(startX, currentY, printableWidth, 8, 'F');

  // Text Headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  
  doc.text('No', colPositions.no + 3, currentY + 5.5, { align: 'center' });
  doc.text('Tanggal', colPositions.tanggal + 2, currentY + 5.5);
  doc.text('Kategori Sampah / Kegiatan', colPositions.keterangan + 2, currentY + 5.5);
  doc.text('Berat (Kg)', colPositions.berat + 12.5, currentY + 5.5, { align: 'center' });
  doc.text('Harga / Kg', colPositions.harga + 15, currentY + 5.5, { align: 'center' });
  doc.text('Kredit / Debit', colPositions.total + 32, currentY + 5.5, { align: 'right' });

  currentY += 8;

  // Draw Table Rows
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  let totalCredit = 0;
  let totalDebit = 0;

  transactions.forEach((tx, idx) => {
    // Alternating background colors
    if (idx % 2 === 1) {
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(startX, currentY, printableWidth, 7.5, 'F');
    }

    // Border line under row
    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.setLineWidth(0.15);
    doc.line(startX, currentY + 7.5, endX, currentY + 7.5);

    // Format Values
    const formattedDate = new Date(tx.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedWeight = tx.berat > 0 ? `${tx.berat.toFixed(1)} Kg` : '-';
    const formattedPrice = tx.hargaPerKg > 0 
      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(tx.hargaPerKg) 
      : '-';
    
    const isCredit = tx.jenis === 'Masuk';
    if (isCredit) {
      totalCredit += tx.total;
    } else {
      totalDebit += Math.abs(tx.total);
    }

    const formattedTotal = new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(Math.abs(tx.total));

    const totalText = isCredit ? `+ ${formattedTotal}` : `- ${formattedTotal}`;
    
    // Set text color of total row based on Credit/Debit
    if (isCredit) {
      doc.setTextColor(4, 120, 87); // Emerald 700
    } else {
      doc.setTextColor(190, 24, 74); // Rose 700
    }

    // Draw Texts
    doc.text((idx + 1).toString(), colPositions.no + 3, currentY + 5, { align: 'center' });
    
    // Date/Keterangan text standard color
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(formattedDate, colPositions.tanggal + 2, currentY + 5);
    doc.text(tx.kategori, colPositions.keterangan + 2, currentY + 5);
    doc.text(formattedWeight, colPositions.berat + 12.5, currentY + 5, { align: 'center' });
    doc.text(formattedPrice, colPositions.harga + 15, currentY + 5, { align: 'center' });
    
    // Total column colors
    if (isCredit) {
      doc.setTextColor(4, 120, 87);
    } else {
      doc.setTextColor(190, 24, 74);
    }
    doc.text(totalText, colPositions.total + 32, currentY + 5, { align: 'right' });

    currentY += 7.5;
  });

  currentY += 4;

  // --- 4. SUMMARY SECTION ---
  const summaryBoxWidth = 80;
  const summaryBoxX = endX - summaryBoxWidth;

  // Draw Summary Container Background
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(summaryBoxX, currentY, summaryBoxWidth, 22, 'F');
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(summaryBoxX, currentY, summaryBoxWidth, 22, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  const fmtTotalCredit = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalCredit);
  const fmtTotalDebit = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalDebit);
  const netBalance = totalCredit - totalDebit;
  const fmtNetBalance = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(netBalance);

  doc.text('Total Hasil Setoran (+)', summaryBoxX + 4, currentY + 5.5);
  doc.text(fmtTotalCredit, endX - 4, currentY + 5.5, { align: 'right' });

  doc.text('Total Penarikan Tunai (-)', summaryBoxX + 4, currentY + 11);
  doc.text(fmtTotalDebit, endX - 4, currentY + 11, { align: 'right' });

  // Bold line
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.line(summaryBoxX, currentY + 14.5, endX, currentY + 14.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('SALDO AKHIR', summaryBoxX + 4, currentY + 19);
  doc.text(fmtNetBalance, endX - 4, currentY + 19, { align: 'right' });

  currentY += 28;

  // --- 5. COMPLIANCE & LEGAL NOTICE ---
  doc.setFont('helvetica', 'oblique');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('* Catatan: Mutasi di atas disinkronisasi langsung dari database Unit Usaha "Layanan Pengelolaan Sampah Desa".', startX, currentY);
  doc.text('  Silakan hubungi admin BUMDES jika mendapati perbedaan pencatatan timbangan fisik buku tabungan Anda.', startX, currentY + 3.5);

  currentY += 15;

  // --- 6. SIGNATURE BLOCK ---
  const sigY = currentY;
  
  // Left: Nasabah Signature
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('Menyetujui & Tanda Tangan,', startX + 15, sigY);
  doc.text('Nasabah Bank Sampah', startX + 19, sigY + 4);
  
  doc.setDrawColor(200, 200, 200);
  doc.line(startX + 10, sigY + 22, startX + 60, sigY + 22);
  
  doc.setFont('helvetica', 'bold');
  doc.text(user.email.split('@')[0].toUpperCase(), startX + 15, sigY + 26);

  // Right: Admin / BUMDES Signature with Stamp Circle
  doc.setFont('helvetica', 'normal');
  doc.text('Sukoharjo, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), endX - 55, sigY);
  doc.text('Pengelola Unit Bank Sampah,', endX - 56, sigY + 4);

  // Decorative Digital Stamp Circle
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.6);
  doc.circle(endX - 35, sigY + 15, 7, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('BUMDES', endX - 39, sigY + 14);
  doc.text('LUNAS', endX - 38, sigY + 17);

  // Signature line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(endX - 60, sigY + 22, endX - 10, sigY + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('SUTRISNO, S.Sos.', endX - 48, sigY + 26);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('NIP. BUMD.19841203.01', endX - 49, sigY + 30);

  // Save the PDF
  const filename = `Mutasi_Tabungan_${user.email.split('@')[0]}_${Date.now().toString().slice(-4)}.pdf`;
  doc.save(filename);
}
