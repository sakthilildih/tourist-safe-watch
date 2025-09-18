import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Eye, Phone, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TouristRecord {
  id: string;
  name: string;
  digitalId: string;
  nationality: string;
  itinerary: string[];
  emergencyContact: string;
  status: 'active' | 'inactive' | 'alert';
  lastSeen: string;
  location: string;
}

const mockTouristData: TouristRecord[] = [
  {
    id: '1',
    name: 'John Smith',
    digitalId: 'TID-2024-001',
    nationality: 'USA',
    itinerary: ['Red Fort', 'India Gate', 'Qutub Minar'],
    emergencyContact: '+1-555-0123',
    status: 'active',
    lastSeen: '2 mins ago',
    location: 'Red Fort Area'
  },
  {
    id: '2',
    name: 'Marie Dubois',
    digitalId: 'TID-2024-002',
    nationality: 'France',
    itinerary: ['Lotus Temple', 'Humayun Tomb'],
    emergencyContact: '+33-1-4567-8901',
    status: 'active',
    lastSeen: '15 mins ago',
    location: 'Lotus Temple'
  },
  {
    id: '3',
    name: 'Hiroshi Tanaka',
    digitalId: 'TID-2024-003',
    nationality: 'Japan',
    itinerary: ['India Gate', 'Red Fort', 'Chandni Chowk'],
    emergencyContact: '+81-3-1234-5678',
    status: 'alert',
    lastSeen: '1 hour ago',
    location: 'Chandni Chowk'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    digitalId: 'TID-2024-004',
    nationality: 'UK',
    itinerary: ['Qutub Minar', 'Lodhi Gardens'],
    emergencyContact: '+44-20-7123-4567',
    status: 'inactive',
    lastSeen: '3 hours ago',
    location: 'Lodhi Gardens'
  }
];

export default function DigitalIds() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [nationalityFilter, setNationalityFilter] = useState("all");

  const filteredData = mockTouristData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.digitalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesNationality = nationalityFilter === "all" || record.nationality === nationalityFilter;
    
    return matchesSearch && matchesStatus && matchesNationality;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, className: "bg-success text-success-foreground" },
      inactive: { variant: "secondary" as const, className: "" },
      alert: { variant: "destructive" as const, className: "" }
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const stats = [
    { label: "Total Records", value: mockTouristData.length.toString() },
    { label: "Active Tourists", value: mockTouristData.filter(r => r.status === 'active').length.toString() },
    { label: "Alert Status", value: mockTouristData.filter(r => r.status === 'alert').length.toString() },
    { label: "Nationalities", value: new Set(mockTouristData.map(r => r.nationality)).size.toString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Digital ID Records</h1>
          <p className="text-muted-foreground mt-1">Tourist identification and itinerary management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
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

      {/* Filters and Search */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search & Filter Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
              <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Tourist Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tourist Name</TableHead>
                <TableHead>Digital ID</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Current Itinerary</TableHead>
                <TableHead>Emergency Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell className="font-mono text-sm">{record.digitalId}</TableCell>
                  <TableCell>{record.nationality}</TableCell>
                  <TableCell>
                    <div className="max-w-48">
                      {record.itinerary.slice(0, 2).join(", ")}
                      {record.itinerary.length > 2 && "..."}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {record.emergencyContact}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadge(record.status).variant} 
                      className={getStatusBadge(record.status).className}
                    >
                      {record.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{record.lastSeen}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {record.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}