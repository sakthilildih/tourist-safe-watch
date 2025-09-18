import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, MapPin, Clock, Eye, Phone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Alert {
  id: string;
  touristId: string;
  touristName: string;
  alertType: 'geo-fence' | 'panic' | 'anomaly' | 'emergency';
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
  location: [number, number];
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface LocationData {
  id: string;
  touristId: string;
  location: [number, number];
  timestamp: string;
  accuracy: number;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    touristId: 'TID-2024-003',
    touristName: 'Hiroshi Tanaka',
    alertType: 'geo-fence',
    timestamp: '2024-01-15 14:30:00',
    status: 'active',
    location: [28.6562, 77.2410],
    description: 'Tourist entered restricted area near Red Fort',
    priority: 'high'
  },
  {
    id: '2',
    touristId: 'TID-2024-001',
    touristName: 'John Smith',
    alertType: 'panic',
    timestamp: '2024-01-15 13:15:00',
    status: 'investigating',
    location: [28.6139, 77.2090],
    description: 'Emergency button pressed by tourist',
    priority: 'high'
  },
  {
    id: '3',
    touristId: 'TID-2024-002',
    touristName: 'Marie Dubois',
    alertType: 'anomaly',
    timestamp: '2024-01-15 12:45:00',
    status: 'resolved',
    location: [28.5562, 77.1000],
    description: 'Unusual movement pattern detected',
    priority: 'medium'
  }
];

const mockLocationData: LocationData[] = [
  { id: '1', touristId: 'TID-2024-003', location: [28.6562, 77.2410], timestamp: '2024-01-15 14:35:00', accuracy: 5 },
  { id: '2', touristId: 'TID-2024-001', location: [28.6139, 77.2090], timestamp: '2024-01-15 14:30:00', accuracy: 8 },
  { id: '3', touristId: 'TID-2024-002', location: [28.5562, 77.1000], timestamp: '2024-01-15 14:25:00', accuracy: 3 }
];

export default function Alerts() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 11);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add location markers
    mockLocationData.forEach(location => {
      const alert = mockAlerts.find(a => a.touristId === location.touristId);
      const color = alert?.priority === 'high' ? '#ef4444' : 
                   alert?.priority === 'medium' ? '#f59e0b' : '#10b981';
      
      const marker = L.circleMarker(location.location, {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      const tourist = mockAlerts.find(a => a.touristId === location.touristId);
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${tourist?.touristName || 'Unknown Tourist'}</h3>
          <p><strong>ID:</strong> ${location.touristId}</p>
          <p><strong>Last Update:</strong> ${location.timestamp}</p>
          <p><strong>Accuracy:</strong> ±${location.accuracy}m</p>
        </div>
      `);
    });

    return () => {
      map.remove();
    };
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "destructive" as const, className: "" },
      investigating: { variant: "default" as const, className: "bg-warning text-warning-foreground" },
      resolved: { variant: "default" as const, className: "bg-success text-success-foreground" }
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: "destructive" as const, className: "" },
      medium: { variant: "default" as const, className: "bg-warning text-warning-foreground" },
      low: { variant: "secondary" as const, className: "" }
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'panic':
      case 'emergency':
        return '🚨';
      case 'geo-fence':
        return '🚫';
      case 'anomaly':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const stats = [
    { label: "Active Alerts", value: filteredAlerts.filter(a => a.status === 'active').length.toString() },
    { label: "High Priority", value: filteredAlerts.filter(a => a.priority === 'high').length.toString() },
    { label: "Under Investigation", value: filteredAlerts.filter(a => a.status === 'investigating').length.toString() },
    { label: "Resolved Today", value: filteredAlerts.filter(a => a.status === 'resolved').length.toString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts & Last Known Locations</h1>
          <p className="text-muted-foreground mt-1">Real-time alert monitoring and tourist location tracking</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-destructive bg-destructive/10">
            <div className="w-2 h-2 bg-destructive rounded-full mr-2 animate-pulse"></div>
            {filteredAlerts.filter(a => a.status === 'active').length} Active Alerts
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Table */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Alert History
              </CardTitle>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert</TableHead>
                    <TableHead>Tourist</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow 
                      key={alert.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getAlertIcon(alert.alertType)}</span>
                          <div className="text-sm">
                            <div className="font-medium">{alert.alertType.replace('-', ' ').toUpperCase()}</div>
                            <div className="text-muted-foreground text-xs truncate max-w-32">
                              {alert.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{alert.touristName}</div>
                          <div className="text-muted-foreground text-xs">{alert.touristId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {alert.alertType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getPriorityBadge(alert.priority).variant} 
                          className={getPriorityBadge(alert.priority).className}
                        >
                          {alert.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadge(alert.status).variant} 
                          className={getStatusBadge(alert.status).className}
                        >
                          {alert.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Live Location Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef} 
              className="w-full rounded-lg border border-border"
              style={{ height: '400px' }}
            />
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Low Priority</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Alert Details */}
      {selectedAlert && (
        <Card className="border-border border-l-4 border-l-destructive">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Alert Details - {selectedAlert.touristName}</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(null)}>
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Alert Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Type:</strong> {selectedAlert.alertType.replace('-', ' ').toUpperCase()}</div>
                  <div><strong>Priority:</strong> {selectedAlert.priority.toUpperCase()}</div>
                  <div><strong>Status:</strong> {selectedAlert.status.toUpperCase()}</div>
                  <div><strong>Timestamp:</strong> {selectedAlert.timestamp}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedAlert.description}</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="mr-2">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact Tourist
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    Track Location
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}