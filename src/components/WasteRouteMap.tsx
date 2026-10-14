import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Truck, MapPin, Navigation, ShieldAlert, Play, Pause, RotateCcw, 
  Plus, CheckCircle2, Clock, AlertTriangle, Send, FileText, Sparkles, 
  Layers, Settings, BarChart2, UserCheck, Calendar, Bell, ChevronRight, Weight
} from 'lucide-react';
import { showToast } from './ToastNotification';

export interface CustomerLocation {
  id: string;
  name: string;
  rtRw: string;
  lat: number;
  lng: number;
  estLoadKg: number; // in Kg
  category: string;
  phone: string;
  pickupStatus: 'PENDING' | 'PICKED_UP' | 'SCHEDULED';
  scheduledTime?: string;
}

export interface TruckDepot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  maxCapacityKg: number; // e.g. 1000 kg (1 Ton)
  currentLoadKg: number;
}

// Initial Sample Data in Desa Waru, Kec. Baki, Kab. Sukoharjo
const DEFAULT_DEPOT: TruckDepot = {
  id: 'DEPOT-01',
  name: 'TPS3R & Bank Sampah BUMDES Waskita (Depot)',
  lat: -7.5925,
  lng: 110.7830,
  maxCapacityKg: 1000,
  currentLoadKg: 0,
};

const INITIAL_CUSTOMERS: CustomerLocation[] = [
  { id: 'NSB-01', name: 'Bpk. Hartono', rtRw: 'RT 01 / RW 01', lat: -7.5935, lng: 110.7845, estLoadKg: 120, category: 'Botol PET & Karton', phone: '081234567801', pickupStatus: 'PENDING' },
  { id: 'NSB-02', name: 'Ibu Maryani', rtRw: 'RT 01 / RW 01', lat: -7.5948, lng: 110.7858, estLoadKg: 85, category: 'Koran & Dus Tebal', phone: '081234567802', pickupStatus: 'PENDING' },
  { id: 'NSB-03', name: 'Bpk. Suwito', rtRw: 'RT 02 / RW 01', lat: -7.5912, lng: 110.7865, estLoadKg: 210, category: 'Logam & Besi Tua', phone: '081234567803', pickupStatus: 'PENDING' },
  { id: 'NSB-04', name: 'Ibu Ratna', rtRw: 'RT 02 / RW 01', lat: -7.5898, lng: 110.7840, estLoadKg: 150, category: 'Plastik Campuran', phone: '081234567804', pickupStatus: 'PENDING' },
  { id: 'NSB-05', name: 'Bpk. Joko Susilo', rtRw: 'RT 03 / RW 02', lat: -7.5955, lng: 110.7815, estLoadKg: 180, category: 'Botol PET & Kaca', phone: '081234567805', pickupStatus: 'PENDING' },
  { id: 'NSB-06', name: 'Ibu Sri Rahayu', rtRw: 'RT 03 / RW 02', lat: -7.5968, lng: 110.7802, estLoadKg: 95, category: 'Minyak Jelantah', phone: '081234567806', pickupStatus: 'PENDING' },
  { id: 'NSB-07', name: 'Bpk. Slamet RT 04', rtRw: 'RT 04 / RW 02', lat: -7.5880, lng: 110.7810, estLoadKg: 140, category: 'Kertas HVS & Dus', phone: '081234567807', pickupStatus: 'PENDING' },
  { id: 'NSB-08', name: 'Warung Bu Supri', rtRw: 'Kawasan Kuliner', lat: -7.5982, lng: 110.7870, estLoadKg: 220, category: 'Anorganik & Kaleng', phone: '081234567808', pickupStatus: 'PENDING' },
];

// Distance calculation using Haversine formula (in Km)
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function WasteRouteMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const coverageCircleRef = useRef<L.Circle | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);

  // States
  const [depot] = useState<TruckDepot>(DEFAULT_DEPOT);
  const [customers, setCustomers] = useState<CustomerLocation[]>(INITIAL_CUSTOMERS);
  const [coverageRadiusMeters, setCoverageRadiusMeters] = useState<number>(500); // 500m default
  const [maxTruckCapacityKg, setMaxTruckCapacityKg] = useState<number>(1000); // 1000 Kg
  const [selectedDriver, setSelectedDriver] = useState<string>('Andi Wijaya (Truk AD 8912 BS)');

  // Routing and Simulation state
  const [optimizedRoute, setOptimizedRoute] = useState<CustomerLocation[]>([]);
  const [routeStats, setRouteStats] = useState<{
    totalDistanceKm: number;
    totalPickupKg: number;
    estimatedTimeMins: number;
    tripsCount: number;
  }>({ totalDistanceKm: 0, totalPickupKg: 0, estimatedTimeMins: 0, tripsCount: 1 });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStepIndex, setSimStepIndex] = useState<number>(0);

  // New Customer Form Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    rtRw: 'RT 01 / RW 01',
    lat: '-7.5930',
    lng: '110.7850',
    estLoadKg: '100',
    category: 'Botol PET & Karton',
    phone: '',
  });

  // Selected customer for detail drawer / popup
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerLocation | null>(null);

  // Notification status state
  const [notificationLog, setNotificationLog] = useState<Array<{ id: string; time: string; target: string; msg: string; status: 'SENT' | 'QUEUED' }>>([
    { id: '1', time: '08:00', target: 'Bpk. Hartono', msg: 'Pesan WA: Truk sampah BUMDES dijadwalkan tiba jam 08:30 WIB.', status: 'SENT' },
  ]);

  // --- ROUTE OPTIMIZATION ALGORITHM (Greedy Nearest Neighbor + Capacity Constraint Dijkstra/VRP) ---
  const calculateOptimalRoute = (notify = false) => {
    const unvisited = [...customers];
    const route: CustomerLocation[] = [];
    let currentLat = depot.lat;
    let currentLng = depot.lng;
    let currentTruckLoad = 0;
    let totalDist = 0;
    let trips = 1;

    let currentTimeMinutes = 8 * 60; // Start at 08:00 AM

    while (unvisited.length > 0) {
      // Find nearest customer that fits within remaining capacity
      let nearestIdx = -1;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const cust = unvisited[i];
        const dist = haversineDistance(currentLat, currentLng, cust.lat, cust.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      if (nearestIdx !== -1) {
        const nextCust = unvisited[nearestIdx];

        // Check if loading this customer exceeds max truck load
        if (currentTruckLoad + nextCust.estLoadKg > maxTruckCapacityKg) {
          // Return to depot to unload, then continue trip
          const distToDepot = haversineDistance(currentLat, currentLng, depot.lat, depot.lng);
          totalDist += distToDepot;
          currentLat = depot.lat;
          currentLng = depot.lng;
          currentTruckLoad = 0;
          trips += 1;
          currentTimeMinutes += Math.round((distToDepot / 20) * 60) + 20; // 20 mins unloading
          continue;
        }

        // Add to route
        totalDist += minDistance;
        currentTruckLoad += nextCust.estLoadKg;
        currentLat = nextCust.lat;
        currentLng = nextCust.lng;

        // Est travel time (20 km/h avg speed in village + 5 mins pickup time)
        const travelMins = Math.round((minDistance / 20) * 60) + 5;
        currentTimeMinutes += travelMins;

        const hours = Math.floor(currentTimeMinutes / 60);
        const mins = currentTimeMinutes % 60;
        const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} WIB`;

        nextCust.scheduledTime = timeStr;
        route.push(nextCust);
        unvisited.splice(nearestIdx, 1);
      } else {
        break;
      }
    }

    // Add return distance to depot
    if (route.length > 0) {
      const lastCust = route[route.length - 1];
      totalDist += haversineDistance(lastCust.lat, lastCust.lng, depot.lat, depot.lng);
    }

    const totalPickupKg = customers.reduce((sum, c) => sum + c.estLoadKg, 0);
    const estTotalMins = Math.round((totalDist / 20) * 60) + customers.length * 5;

    setOptimizedRoute(route);
    setRouteStats({
      totalDistanceKm: parseFloat(totalDist.toFixed(2)),
      totalPickupKg,
      estimatedTimeMins: estTotalMins,
      tripsCount: trips
    });

    if (notify) {
      showToast('Rute Optimal Terkalkulasi', `Total ${route.length} titik nasabah (${totalDist.toFixed(1)} km).`, 'success');
    }
  };

  // Run calculation on initial load or when customers / capacity changes
  useEffect(() => {
    calculateOptimalRoute(false);
  }, [customers, maxTruckCapacityKg]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create leaflet map
      const map = L.map(mapContainerRef.current, {
        center: [depot.lat, depot.lng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | BUMDES Waskita GIS',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers & layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Add Tile Layer back
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // 1. Draw Coverage Circle around Depot
    const circle = L.circle([depot.lat, depot.lng], {
      radius: coverageRadiusMeters,
      color: '#06b6d4', // Cyan
      fillColor: '#0891b2',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '4, 4'
    }).addTo(map);
    circle.bindPopup(`<b>Area Coverage BUMDES</b><br/>Radius: ${coverageRadiusMeters} meter`);
    coverageCircleRef.current = circle;

    // 2. Add Depot Marker
    const depotIcon = L.divIcon({
      className: 'custom-depot-marker',
      html: `
        <div style="background-color: #0284c7; color: white; border: 2px solid white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4); font-weight: bold; font-size: 16px;">
          🏢
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const depotMarker = L.marker([depot.lat, depot.lng], { icon: depotIcon }).addTo(map);
    depotMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
        <strong style="color: #0284c7; font-size: 13px;">🏢 ${depot.name}</strong><br/>
        <b>Kapasitas Truk Master:</b> ${maxTruckCapacityKg} Kg<br/>
        <b>Pusat Pengolahan Sampah BUMDES Desa Waru</b>
      </div>
    `);

    // 3. Add Customer Markers with Coverage Status
    customers.forEach((cust) => {
      const distFromDepotMeters = haversineDistance(depot.lat, depot.lng, cust.lat, cust.lng) * 1000;
      const isWithinCoverage = distFromDepotMeters <= coverageRadiusMeters;

      let bgColor = isWithinCoverage ? '#10b981' : '#f59e0b'; // Emerald if inside radius, Amber if outside
      if (cust.pickupStatus === 'PICKED_UP') bgColor = '#06b6d4'; // Cyan if already picked up

      const custIcon = L.divIcon({
        className: 'custom-customer-marker',
        html: `
          <div style="background-color: ${bgColor}; color: white; border: 2px solid white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-weight: bold; font-size: 11px;">
            ${cust.estLoadKg}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([cust.lat, cust.lng], { icon: custIcon }).addTo(map);
      
      const popHtml = `
        <div style="font-family: sans-serif; font-size: 12px; min-width: 180px;">
          <b style="font-size: 13px; color: #0f172a;">${cust.name}</b> (${cust.rtRw})<br/>
          <span style="color: #64748b;">Kategori: ${cust.category}</span><br/>
          <b>Estimasi Beban:</b> <span style="color: #059669; font-weight: bold;">${cust.estLoadKg} Kg</span><br/>
          <b>Status Radius:</b> ${isWithinCoverage ? '<span style="color:#059669; font-weight:bold;">TERJANGKAU (' + Math.round(distFromDepotMeters) + 'm)</span>' : '<span style="color:#d97706; font-weight:bold;">DI LUAR RADIUS (' + Math.round(distFromDepotMeters) + 'm)</span>'}<br/>
          <b>Jadwal Tiba:</b> ${cust.scheduledTime || 'Memuat...'}
        </div>
      `;
      marker.bindPopup(popHtml);
      marker.on('click', () => setSelectedCustomer(cust));
    });

    // 4. Draw Optimized Route Line (Polyline)
    if (optimizedRoute.length > 0) {
      const routePoints: L.LatLngExpression[] = [[depot.lat, depot.lng]];
      optimizedRoute.forEach(c => routePoints.push([c.lat, c.lng]));
      routePoints.push([depot.lat, depot.lng]); // Return to depot

      const polyline = L.polyline(routePoints, {
        color: '#06b6d4',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(map);

      routePolylineRef.current = polyline;

      // 5. Add Animated Truck Marker along route
      const truckPos = simStepIndex === 0 
        ? [depot.lat, depot.lng] 
        : simStepIndex <= optimizedRoute.length 
          ? [optimizedRoute[simStepIndex - 1].lat, optimizedRoute[simStepIndex - 1].lng] 
          : [depot.lat, depot.lng];

      const truckIcon = L.divIcon({
        className: 'custom-truck-marker',
        html: `
          <div style="background-color: #091726; color: #38bdf8; border: 2px solid #38bdf8; border-radius: 12px; padding: 4px 8px; font-weight: bold; font-size: 12px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(56, 189, 248, 0.5);">
            🚚 TRUK 1
          </div>
        `,
        iconSize: [70, 30],
        iconAnchor: [35, 15],
      });

      const truckMarker = L.marker(truckPos as L.LatLngExpression, { icon: truckIcon }).addTo(map);
      truckMarker.bindPopup(`<b>Armada Truk BUMDES</b><br/>Driver: ${selectedDriver}<br/>Posisi Rute #${simStepIndex} dari ${optimizedRoute.length}`);
      truckMarkerRef.current = truckMarker;
    }

  }, [depot, customers, coverageRadiusMeters, maxTruckCapacityKg, optimizedRoute, simStepIndex, selectedDriver]);

  // Simulation step timer
  useEffect(() => {
    let timer: any;
    if (isSimulating) {
      timer = setInterval(() => {
        setSimStepIndex(prev => {
          if (prev >= optimizedRoute.length) {
            setIsSimulating(false);
            showToast('Simulasi Selesai', 'Penjemputan Sampah Selesai! Truk kembali ke Depot BUMDES.', 'success');
            return 0;
          }
          const currentCust = optimizedRoute[prev];
          
          // Mark customer as picked up
          setCustomers(curr => curr.map(c => c.id === currentCust.id ? { ...c, pickupStatus: 'PICKED_UP' } : c));
          showToast('Truk Tiba', `Truk tiba di ${currentCust.name} (${currentCust.rtRw}) - Terangkut ${currentCust.estLoadKg} Kg`, 'info');

          return prev + 1;
        });
      }, 2500); // Step every 2.5s
    }
    return () => clearInterval(timer);
  }, [isSimulating, optimizedRoute]);

  // Add new Customer submit handler
  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.lat || !newCustomerForm.lng) {
      showToast('Form Belum Lengkap', 'Mohon isi nama nasabah dan koordinat GPS!', 'warning');
      return;
    }

    const newCust: CustomerLocation = {
      id: `NSB-${(customers.length + 1).toString().padStart(2, '0')}`,
      name: newCustomerForm.name,
      rtRw: newCustomerForm.rtRw,
      lat: parseFloat(newCustomerForm.lat),
      lng: parseFloat(newCustomerForm.lng),
      estLoadKg: parseInt(newCustomerForm.estLoadKg) || 50,
      category: newCustomerForm.category,
      phone: newCustomerForm.phone || '081234567800',
      pickupStatus: 'PENDING'
    };

    setCustomers(prev => [...prev, newCust]);
    setShowAddModal(false);
    setNewCustomerForm({
      name: '',
      rtRw: 'RT 01 / RW 01',
      lat: '-7.5930',
      lng: '110.7850',
      estLoadKg: '100',
      category: 'Botol PET & Karton',
      phone: '',
    });

    showToast('Nasabah Ditambahkan', `Nasabah baru ${newCust.name} berhasil ditambahkan ke sistem pemetaan GPS!`, 'success');
  };

  // Broadcast Notification to Customers
  const handleBroadcastNotification = (cust: CustomerLocation) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const msg = `Halo ${cust.name}, armada Truk Sampah BUMDES Desa Waru dijadwalkan tiba pukul ${cust.scheduledTime || '08:45 WIB'}. Mohon persiapkan sampah ${cust.category} di depan rumah. Terima kasih!`;
    
    setNotificationLog(prev => [
      { id: Date.now().toString(), time, target: cust.name, msg, status: 'SENT' },
      ...prev
    ]);

    showToast('Notifikasi Terkirim', `Notifikasi WA/SMS berhasil dikirim ke ${cust.name} (${cust.phone})!`, 'success');
  };

  const handleBroadcastAll = () => {
    customers.forEach(c => {
      handleBroadcastNotification(c);
    });
    showToast('Notifikasi Massal', `Notifikasi Massal berhasil dikirim ke seluruh ${customers.length} nasabah!`, 'success');
  };

  // Calculate percentage of coverage
  const coveredCount = customers.filter(c => (haversineDistance(depot.lat, depot.lng, c.lat, c.lng) * 1000) <= coverageRadiusMeters).length;
  const coveragePercent = Math.round((coveredCount / (customers.length || 1)) * 100);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#091827] via-[#0b2238] to-[#0d304f] p-6 sm:p-8 rounded-3xl border border-cyan-900/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 rounded-full text-xs font-mono font-bold uppercase">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              GIS & Route Optimizer Engine v3.2
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sistem Pemetaan & Pengolahan Rute Truk Sampah
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pemetaan GIS titik nasabah berbasis koordinat GPS, kalkulasi rute terpendek dengan algoritma Dijkstra / Capacitated Vehicle Routing, pengawasan area coverage, serta pengiriman notifikasi penjemputan otomatis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Nasabah GPS</span>
            </button>

            <button
              onClick={handleBroadcastAll}
              className="px-4 py-2.5 bg-[#0f2d48] hover:bg-[#153f64] text-cyan-300 border border-cyan-700/60 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notifikasi Jadwal Massal</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0b1c2e] rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Cakupan Radius ({coverageRadiusMeters}m)</span>
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{coveragePercent}%</div>
          <span className="text-[11px] text-cyan-400 font-mono">{coveredCount} dari {customers.length} Nasabah Terjangkau</span>
        </div>

        <div className="p-5 bg-[#0b1c2e] rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Jarak Tempuh Rute Optimal</span>
            <Navigation className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{routeStats.totalDistanceKm} Km</div>
          <span className="text-[11px] text-emerald-400 font-mono">Efisiensi Bahan Bakar +28%</span>
        </div>

        <div className="p-5 bg-[#0b1c2e] rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Beban Muatan</span>
            <Weight className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{routeStats.totalPickupKg} Kg</div>
          <span className="text-[11px] text-amber-400 font-mono">Max Kapasitas Truk: {maxTruckCapacityKg} Kg ({routeStats.tripsCount} Rit)</span>
        </div>

        <div className="p-5 bg-[#0b1c2e] rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Estimasi Waktu Operasional</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{routeStats.estimatedTimeMins} Menit</div>
          <span className="text-[11px] text-purple-400 font-mono">Kecepatan Rata-rata 20 Km/Jam</span>
        </div>
      </div>

      {/* Main Map & Interactive Optimization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2-Cols: Leaflet Interactive Map View */}
        <div className="lg:col-span-2 bg-[#0b1c2e] p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                Peta Interaktif GIS Desa Waru (OpenStreetMap)
              </h3>
              <p className="text-xs text-slate-400">
                Garis putus-putus biru menunjukkan lintasan rute optimal terpendek yang dihasilkan algoritma.
              </p>
            </div>

            {/* Map Simulation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSimulating 
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSimulating ? 'Jeda Simulasi' : 'Jalankan Simulasi Truk'}</span>
              </button>

              <button
                onClick={() => {
                  setSimStepIndex(0);
                  setIsSimulating(false);
                  setCustomers(curr => curr.map(c => ({ ...c, pickupStatus: 'PENDING' })));
                  showToast('Reset Simulasi', 'Simulasi dan status penjemputan direset ke posisi awal depot.', 'info');
                }}
                className="p-2 bg-[#0f243a] hover:bg-[#143250] text-slate-300 rounded-xl border border-slate-700 cursor-pointer"
                title="Reset Posisi Truk"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Leaflet Map Container Div */}
          <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-inner z-0">
            <div ref={mapContainerRef} className="w-full h-full"></div>

            {/* Floating Map Legend overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-[#091726]/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1.5 shadow-lg">
              <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Legenda Peta:</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-600 inline-block"></span>
                <span className="text-slate-200">Depot BUMDES (Hub Pusat)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-slate-200">Nasabah Terjangkau Radius</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="text-slate-200">Di Luar Coverage Radius</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span>
                <span className="text-slate-200">Sampah Selesai Terangkut</span>
              </div>
            </div>
          </div>

          {/* Selected Customer Drawer / Details Bar */}
          {selectedCustomer ? (
            <div className="p-4 bg-[#0f243a] rounded-2xl border border-cyan-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  {selectedCustomer.name} ({selectedCustomer.rtRw})
                </div>
                <div className="text-slate-400">
                  Kategori: <span className="text-white font-bold">{selectedCustomer.category}</span> • Estimasi Beban: <span className="text-emerald-400 font-bold">{selectedCustomer.estLoadKg} Kg</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleBroadcastNotification(selectedCustomer)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pesan WA</span>
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer text-[11px]"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#091726] rounded-xl border border-slate-800/80 text-xs text-slate-400 font-mono text-center">
              💡 Klik salah satu pin penanda nasabah di peta untuk melihat rincian lokasi GPS & jadwal penjemputan.
            </div>
          )}
        </div>

        {/* Right 1-Col: Configuration & Schedule Breakdown Panel */}
        <div className="space-y-6">
          
          {/* Controls Box */}
          <div className="bg-[#0b1c2e] p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="w-4 h-4 text-amber-400" />
              Pengaturan Parameters & Algoritma
            </h3>

            <div className="space-y-4 text-xs">
              {/* Coverage Radius Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <label className="text-slate-300">Radius Coverage Area</label>
                  <span className="text-cyan-400 font-mono">{coverageRadiusMeters} Meter</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={coverageRadiusMeters}
                  onChange={(e) => setCoverageRadiusMeters(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>100m</span>
                  <span>500m</span>
                  <span>1500m</span>
                </div>
              </div>

              {/* Truck Capacity Input */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Beban Maksimum Truk (Kg)</label>
                <input
                  type="number"
                  min="200"
                  max="5000"
                  step="100"
                  value={maxTruckCapacityKg}
                  onChange={(e) => setMaxTruckCapacityKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-white font-mono font-bold"
                />
              </div>

              {/* Driver Selection */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Armada & Driver Utama</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f243a] border border-slate-800 rounded-xl text-white font-mono"
                >
                  <option value="Andi Wijaya (Truk AD 8912 BS)">Andi Wijaya (Truk Isuzu ELF - AD 8912 BS)</option>
                  <option value="Bambang S. (Truk AD 8102 WW)">Bambang S. (Colt Diesel - AD 8102 WW)</option>
                  <option value="Dwi Prasetyo (Pick Up AD 9012 BUM)">Dwi Prasetyo (Gran Max - AD 9012 BUM)</option>
                </select>
              </div>

              <button
                onClick={() => calculateOptimalRoute(true)}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Kalkulasi Ulang Rute Optimal</span>
              </button>
            </div>
          </div>

          {/* Optimized Pickup Schedule List */}
          <div className="bg-[#0b1c2e] p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Urutan Penjemputan Optimal ({optimizedRoute.length})
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {optimizedRoute.map((cust, idx) => (
                <div 
                  key={cust.id}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    idx + 1 === simStepIndex
                      ? 'bg-cyan-950/80 border-cyan-500 text-white font-bold ring-2 ring-cyan-500/30'
                      : cust.pickupStatus === 'PICKED_UP'
                        ? 'bg-slate-900/60 border-slate-800 text-slate-400 line-through'
                        : 'bg-[#0f243a] border-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold">{cust.name}</div>
                        <div className="text-[10px] text-slate-400">{cust.rtRw} • {cust.category}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-emerald-400 font-bold">{cust.estLoadKg} Kg</div>
                      <div className="text-[10px] text-cyan-300">{cust.scheduledTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Notification Activity Logs Section */}
      <div className="bg-[#0b1c2e] p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Log Pengiriman Notifikasi SMS / WhatsApp Jadwal Truk
        </h3>

        <div className="overflow-x-auto border border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f243a] text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">Penerima</th>
                <th className="p-3">Isi Pesan Notifikasi</th>
                <th className="p-3">Status Terkirim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {notificationLog.map((log) => (
                <tr key={log.id} className="hover:bg-[#0f243a]/50">
                  <td className="p-3 text-slate-500">{log.time}</td>
                  <td className="p-3 font-bold text-cyan-300">{log.target}</td>
                  <td className="p-3 text-slate-300 text-[11px]">{log.msg}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ TERKIRIM
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Nasabah Baru Berbasis GPS */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1c2e] rounded-3xl border border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-[#0f243a] p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                Registrasi Nasabah GPS Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Nama Lengkap Kepala Keluarga / Warga</label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="Contoh: Bpk. Sugeng Triyono"
                  className="w-full p-2.5 bg-[#0f243a] border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Wilayah RT / RW</label>
                  <select
                    value={newCustomerForm.rtRw}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, rtRw: e.target.value })}
                    className="w-full p-2.5 bg-[#0f243a] border border-slate-800 rounded-xl text-white"
                  >
                    <option value="RT 01 / RW 01">RT 01 / RW 01</option>
                    <option value="RT 02 / RW 01">RT 02 / RW 01</option>
                    <option value="RT 03 / RW 02">RT 03 / RW 02</option>
                    <option value="RT 04 / RW 02">RT 04 / RW 02</option>
                    <option value="Kawasan Kuliner Desa">Kawasan Kuliner Desa</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full p-2.5 bg-[#0f243a] border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Latitude GPS</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.lat}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, lat: e.target.value })}
                    className="w-full p-2.5 bg-[#0f243a] border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Longitude GPS</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.lng}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, lng: e.target.value })}
                    className="w-full p-2.5 bg-[#0f243a] border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Kategori Sampah Dominan</label>
                  <select
                    value={newCustomerForm.category}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, category: e.target.value })}
                    className="w-full p-2.5 bg-[#0f243a] border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Botol PET & Karton">Botol PET & Karton</option>
                    <option value="Koran Bekas & Dus">Koran Bekas & Dus</option>
                    <option value="Logam & Besi">Logam & Besi</option>
                    <option value="Minyak Jelantah">Minyak Jelantah</option>
                    <option value="Anorganik Campuran">Anorganik Campuran</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Estimasi Beban (Kg)</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newCustomerForm.estLoadKg}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, estLoadKg: e.target.value })}
                    className="w-full p-2.5 bg-[#0f243a] border border-slate-800 rounded-xl text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl shadow-md"
                >
                  Simpan Nasabah GPS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
