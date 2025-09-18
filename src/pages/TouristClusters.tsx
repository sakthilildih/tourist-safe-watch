import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, AlertTriangle, Zap } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ClusterData {
  id: string;
  location: [number, number];
  count: number;
  type: 'high' | 'medium' | 'low';
  area: string;
}

interface HighRiskZone {
  id: string;
  name: string;
  coordinates: [number, number][];
  level: 'critical' | 'high' | 'medium';
}

// Mock data
const mockClusters: ClusterData[] = [
  { id: '1', location: [28.6139, 77.2090], count: 45, type: 'high', area: 'Red Fort Area' },
  { id: '2', location: [28.5562, 77.1000], count: 23, type: 'medium', area: 'Qutub Minar' },
  { id: '3', location: [28.6562, 77.2410], count: 67, type: 'high', area: 'India Gate' },
  { id: '4', location: [28.6273, 77.1716], count: 12, type: 'low', area: 'Karol Bagh' },
];

const mockHighRiskZones: HighRiskZone[] = [
  {
    id: '1',
    name: 'Old Delhi Market',
    coordinates: [[28.6500, 77.2300], [28.6600, 77.2300], [28.6600, 77.2400], [28.6500, 77.2400]],
    level: 'critical'
  }
];

export default function TouristClusters() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 11);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add cluster markers
    mockClusters.forEach(cluster => {
      const color = cluster.type === 'high' ? '#ef4444' : 
                   cluster.type === 'medium' ? '#f59e0b' : '#10b981';
      
      const marker = L.circleMarker(cluster.location, {
        radius: cluster.count / 3 + 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${cluster.area}</h3>
          <p><strong>Tourists:</strong> ${cluster.count}</p>
          <p><strong>Risk Level:</strong> ${cluster.type.toUpperCase()}</p>
        </div>
      `);
    });

    // Add high-risk zones
    mockHighRiskZones.forEach(zone => {
      const polygon = L.polygon(zone.coordinates, {
        color: zone.level === 'critical' ? '#dc2626' : '#f59e0b',
        fillColor: zone.level === 'critical' ? '#dc2626' : '#f59e0b',
        fillOpacity: 0.3
      }).addTo(map);

      polygon.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-red-600">${zone.name}</h3>
          <p><strong>Risk Level:</strong> ${zone.level.toUpperCase()}</p>
        </div>
      `);
    });

    return () => {
      map.remove();
    };
  }, []);

  const stats = [
    { label: "Total Tourists", value: "147", icon: Users, trend: "+12%" },
    { label: "Active Clusters", value: "4", icon: MapPin, trend: "+2" },
    { label: "High Risk Areas", value: "1", icon: AlertTriangle, trend: "0" },
    { label: "Real-time Updates", value: "Live", icon: Zap, trend: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tourist Clusters & Heat Map</h1>
          <p className="text-muted-foreground mt-1">Real-time tourist distribution and risk zones</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-success bg-success/10">
            <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-success font-medium">{stat.trend}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Live Tourist Distribution Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border border-border"
            style={{ height: '500px' }}
          />
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High Density (30+ tourists)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium Density (15-29 tourists)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Low Density (&lt;15 tourists)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 opacity-50"></div>
              <span>High Risk Zones</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}