import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, Heart, CheckCircle2 } from 'lucide-react';
import { ContactFormInput } from '../types';
import FaqSection from './FaqSection';
import LocationMapSection from './LocationMapSection';

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormInput>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="kontak-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Hubungi Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Pengelola & Peta Lokasi
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-500 text-base leading-relaxed">
            Punya pertanyaan seputar iuran sampah, sewa gedung serbaguna, atau pendaftaran anggota bank sampah? Ajukan lewat form di bawah atau langsung kunjungi kantor kami.
          </p>
        </div>

        {/* Main Grid: Form, Info & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Column: Info & Social Handles */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Kantor Sekretariat BUMDES</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kantor BUMDES Waskita Wijaya beroperasi setiap hari Senin s.d Sabtu. Silakan menghubungi petugas kami pada jam kerja untuk konsultasi atau penyerahan berkas fisik.
              </p>
            </div>

            {/* Direct Contact Info List */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Alamat Kantor</h4>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                    Jl. Kyai Waru No. 12, Desa Waru, Kecamatan Baki, Kabupaten Sukoharjo, Jawa Tengah, 57556.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Saluran Whatsapp Petugas</h4>
                  <p className="text-slate-500 text-xs mt-0.5 font-mono">
                    +62 821-3456-7890 (Admin Utama)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Alamat Surel (Email)</h4>
                  <p className="text-slate-500 text-xs mt-0.5 font-mono">
                    bumdes.waskitawijaya@waru.desa.id
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm">Ikuti Media Sosial Kami:</h4>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                
                <a
                  href="https://wa.me/6282134567890"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/60 hover:border-emerald-200 transition-colors"
                >
                  <span className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-white font-bold text-[10px]">WA</span>
                  <span className="font-semibold text-slate-700">Whatsapp</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-200 transition-colors"
                >
                  <span className="w-6 h-6 rounded-md bg-rose-500 flex items-center justify-center text-white font-bold text-[10px]">IG</span>
                  <span className="font-semibold text-slate-700">Instagram</span>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/60 hover:border-blue-200 transition-colors"
                >
                  <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">FB</span>
                  <span className="font-semibold text-slate-700">Facebook</span>
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-200 border border-slate-200/60 hover:border-slate-300 transition-colors"
                >
                  <span className="w-6 h-6 rounded-md bg-black flex items-center justify-center text-white font-bold text-[10px]">TT</span>
                  <span className="font-semibold text-slate-700">TikTok</span>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-2 flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-200 transition-colors"
                >
                  <span className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center text-white font-bold text-[10px]">YT</span>
                  <span className="font-semibold text-slate-700">YouTube Channel Resmi</span>
                </a>

              </div>
            </div>
          </div>

          {/* Right Column: Contact Request Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm text-left">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Kirim Permintaan Informasi</span>
            </h3>
            <p className="text-slate-500 text-xs mb-6">
              Isi data lengkap Anda di bawah ini. Tim administrasi BUMDES Waskita Wijaya akan menjawab keluhan atau pertanyaan Anda secepat mungkin.
            </p>

            {submitted ? (
              <div id="contact-success-box" className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-lg">Pesan Berhasil Terkirim!</h4>
                  <p className="text-xs text-slate-600 leading-normal max-w-sm mx-auto">
                    Terima kasih telah menghubungi kami. Formulir Anda telah tercatat secara resmi di server BUMDES, dan petugas akan merespons melalui Whatsapp atau email dalam kurun waktu 1x24 jam.
                  </p>
                </div>
                <button
                  id="btn-contact-reset"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700">Nama Lengkap *</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700">Alamat Email *</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="contoh@surel.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="text-xs font-semibold text-slate-700">No. Whatsapp (HP) *</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      required
                      placeholder="contoh: 08123456789"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700">Subjek Hubungan *</label>
                    <input
                      type="text"
                      id="contact-subject"
                      name="subject"
                      required
                      placeholder="Contoh: Sewa Lapangan Badminton"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700">Isi Pesan Detail *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tuliskan pertanyaan atau pengajuan sewa Anda secara detail..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-contact-submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-200 transition-colors disabled:opacity-75 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Sekarang'}</span>
                </button>

              </form>
            )}
          </div>

        </div>

        {/* Map Section */}
        <div id="map-section" className="pt-4">
          <LocationMapSection />
        </div>

        {/* Interactive FAQ Section */}
        <FaqSection />

      </div>
    </section>
  );
}
