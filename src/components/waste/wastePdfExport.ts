import { MonthlyReportData, PicWilayah } from './wasteTypes';

export async function generateWasteMonthlyReportPdf(
  report: MonthlyReportData,
  picList: PicWilayah[]
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header / Kop Surat
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('BADAN USAHA MILIK DESA "WASKITA WIJAYA"', pageWidth / 2, y, { align: 'center' });
  
  y += 6;
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.text('UNIT USAHA LAYANAN PENGELOLAAN SAMPAH', pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Kantor: Jl. Raya Waru-Baki No. 12, Desa Waru, Kec. Baki, Kab. Sukoharjo • Telp: 0821-3456-7890', pageWidth / 2, y, { align: 'center' });

  y += 4;
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  doc.line(15, y, pageWidth - 15, y);
  y += 1.5;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(15, y, pageWidth - 15, y);

  y += 9;
  // Judul Dokumen
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`LAPORAN KEUANGAN & OPERASIONAL BULANAN`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Periode: ${report.month} ${report.year} | Kode Dokumen: RPT-SAMP-${report.year}-${report.month.toUpperCase()}`, pageWidth / 2, y, { align: 'center' });

  // Section 1: Ringkasan Eksekutif (Cards / Matrix)
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('I. RINGKASAN KINERJA RETRIBUSI & KAS WARGA', 15, y);

  y += 5;
  const leftX = 15;
  const colWidth = 88;
  const rowHeight = 7;

  // Box 1 (Left)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(leftX, y, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(leftX, y, colWidth, 42, 2, 2, 'D');

  let boxY = y + 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const leftItems = [
    ['Total Rumah Tangga Terdaftar', `${report.totalRumahTangga} KK`],
    ['Total Pelaku Usaha / UMKM', `${report.totalUmkm} Usaha`],
    ['Total Sampah Terkelola', `${report.totalTonase} Ton`],
    ['Tarif Iuran Rumah Tangga', 'Rp 25.000 / KK / Bln'],
    ['Alokasi Cashback Kas RT/RW', 'Rp 5.000 / KK / Bln']
  ];

  leftItems.forEach(([label, val]) => {
    doc.text(label, leftX + 4, boxY);
    doc.setFont('helvetica', 'bold');
    doc.text(val, leftX + colWidth - 4, boxY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    boxY += 7;
  });

  // Box 2 (Right - Keuangan)
  const rightX = 107;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(rightX, y, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightX, y, colWidth, 42, 2, 2, 'D');

  boxY = y + 6;
  const rightItems = [
    ['Total Penerimaan Iuran RT', `Rp ${report.penerimaanIuranRt.toLocaleString('id-ID')}`],
    ['Total Retribusi Pelaku Usaha', `Rp ${report.penerimaanIuranUmkm.toLocaleString('id-ID')}`],
    ['Cashback Tersalurkan ke Kas RT', `Rp ${report.totalCashbackKasRt.toLocaleString('id-ID')}`],
    ['Biaya Operasional Armada & BBM', `Rp ${report.biayaOperasionalBbmDanServis.toLocaleString('id-ID')}`],
    ['Gaji Tim Armada Kebersihan', `Rp ${report.gajiPetugasKebersihan.toLocaleString('id-ID')}`]
  ];

  rightItems.forEach(([label, val]) => {
    doc.text(label, rightX + 4, boxY);
    doc.setFont('helvetica', 'bold');
    doc.text(val, rightX + colWidth - 4, boxY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    boxY += 7;
  });

  // Net Income Banner
  y += 46;
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.roundedRect(15, y, pageWidth - 30, 11, 2, 2, 'F');
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(15, y, pageWidth - 30, 11, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text('SISA HASIL USAHA (PADes Bersih Desa Waru):', 20, y + 7.5);
  doc.setFontSize(11);
  doc.text(`Rp ${report.padesBersih.toLocaleString('id-ID')}`, pageWidth - 20, y + 7.5, { align: 'right' });

  // Section 2: Realisasi Cashback Kas RT per Wilayah
  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('II. PENYALURAN CASHBACK KAS RT/RW DARI IURAN WARGA (Rp 5.000 / KK)', 15, y);

  y += 5;
  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);

  doc.text('NO', 18, y + 5);
  doc.text('WILAYAH / DUKUH', 28, y + 5);
  doc.text('NAMA PIC WILAYAH', 75, y + 5);
  doc.text('KK BAYAR', 120, y + 5);
  doc.text('TOTAL CASHBACK', 145, y + 5);
  doc.text('STATUS DANA', 178, y + 5);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  picList.forEach((item, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, pageWidth - 30, 6.5, 'F');
    }
    doc.text(`${idx + 1}`, 18, y + 4.5);
    doc.text(`${item.rt} / ${item.rw} (${item.dukuh})`, 28, y + 4.5);
    doc.text(item.picName, 75, y + 4.5);
    doc.text(`${item.totalKkAktifBayar} KK`, 120, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rp ${item.accumulatedCashbackThisMonth.toLocaleString('id-ID')}`, 145, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.text(item.statusPenyaluran, 178, y + 4.5);
    y += 6.5;
  });

  // Section 3: Catatan & Tanda Tangan
  y += 8;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('* Catatan: Seluruh data telah diverifikasi bersama bendahara BUMDES dan ketua RT/RW setempat.', 15, y);
  doc.text('* Dana cashback Rp 5.000 per nasabah ditransfer langsung ke kas warga untuk pemeliharaan lingkungan masing-masing.', 15, y + 4);

  y += 14;
  const signDate = `Waru, 31 ${report.month} ${report.year}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  // Sign Left: Kepala Unit
  doc.text('Mengetahui / Menyusun,', 25, y);
  doc.text('Kepala Unit Pengelolaan Sampah', 25, y + 4);
  doc.setFont('helvetica', 'bold');
  doc.text('Budi Santoso, S.T.', 25, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('NIP. BUMDES-2024-008', 25, y + 28);

  // Sign Right: Direktur
  doc.setFontSize(8.5);
  doc.text(signDate, pageWidth - 65, y);
  doc.text('Direktur BUMDES Waskita Wijaya', pageWidth - 65, y + 4);
  doc.setFont('helvetica', 'bold');
  doc.text('Drs. Joko Susilo, M.Si.', pageWidth - 65, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('NIP. BUMDES-2022-001', pageWidth - 65, y + 28);

  // Save to file
  doc.save(`Laporan_Layanan_Sampah_BUMDES_Waru_${report.month}_${report.year}.pdf`);
}
