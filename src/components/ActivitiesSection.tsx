import React from 'react';
import { Trophy, Trees, Calendar, User, ArrowUpRight, Tag } from 'lucide-react';
import { Activity } from '../types';

export default function ActivitiesSection() {
  const activities: Activity[] = [
    {
      id: 'act-penanaman',
      title: 'Gerakan Penanaman Pohon & Konservasi Air',
      date: '12 Juni 2026',
      description: 'BUMDES Waskita Wijaya bekerja sama dengan Karang Taruna Desa Waru menyelenggarakan aksi penanaman 500 bibit pohon sengon dan buah-buahan di sepanjang aliran sungai serta area sawah desa. Aksi nyata pelestarian sirkulasi air dan penghijauan lingkungan.',
      imageUrl: 'penanaman',
      category: 'penanaman'
    },
    {
      id: 'act-badminton',
      title: 'Turnamen Bulutangkis BUMDES Cup 2026',
      date: '04 Juli 2026',
      description: 'Pertandingan bulutangkis tahunan antar dusun se-Desa Waru diselenggarakan meriah di Arena Badminton BUMDES. Turnamen ini memperebutkan Piala Bergilir Waskita Wijaya dan total hadiah jutaan rupiah guna memacu sportivitas serta kerukunan warga.',
      imageUrl: 'bulutangkis',
      category: 'bulutangkis'
    },
    {
      id: 'act-workshop',
      title: 'Workshop Pemilahan Sampah Rumah Tangga',
      date: '18 Mei 2026',
      description: 'Sosialisasi tata cara pemilahan sampah organik basah dan anorganik kering bagi ibu-ibu PKK Desa Waru. Workshop interaktif ini merupakan kick-off integrasi teknologi tabungan sampah digital BUMDES.',
      imageUrl: 'umum',
      category: 'umum'
    }
  ];

  return (
    <section id="kegiatan-section" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Agenda Desa
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kegiatan Terbaru BUMDES
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-500 text-base leading-relaxed">
            Dokumentasi aksi nyata, program pemberdayaan, olahraga, dan keterlibatan aktif warga Desa Waru bersama pengelola BUMDES.
          </p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Visual Header (Custom SVG Card Representation) */}
                <div className="h-52 relative overflow-hidden">
                  {act.category === 'penanaman' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-green-600 flex items-center justify-center text-white">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
                      <div className="text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                          <Trees className="w-9 h-9 text-green-300" />
                        </div>
                        <span className="text-[10px] font-mono tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">PENGHIJAUAN</span>
                      </div>
                    </div>
                  )}

                  {act.category === 'bulutangkis' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-emerald-700 flex items-center justify-center text-white">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
                      <div className="text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                          <Trophy className="w-9 h-9 text-yellow-300" />
                        </div>
                        <span className="text-[10px] font-mono tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">OLAH RAGA</span>
                      </div>
                    </div>
                  )}

                  {act.category === 'umum' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
                      <div className="text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                          <Tag className="w-9 h-9 text-emerald-300" />
                        </div>
                        <span className="text-[10px] font-mono tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">WORKSHOP</span>
                      </div>
                    </div>
                  )}

                  {/* Category Badge overlay */}
                  <span className="absolute top-4 left-4 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 shadow-sm border border-slate-100">
                    <span className={`w-2 h-2 rounded-full ${act.category === 'penanaman' ? 'bg-emerald-500' : act.category === 'bulutangkis' ? 'bg-blue-500' : 'bg-slate-500'}`}></span>
                    <span className="capitalize">{act.category}</span>
                  </span>
                </div>

                {/* Card Info Body */}
                <div className="p-6 space-y-3 text-left">
                  <div className="flex items-center space-x-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{act.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Oleh: Karang Taruna</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              {/* Card Footer action indicator */}
              <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Waru Baki Sukoharjo</span>
                <span className="text-emerald-600 font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Dokumentasi</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
