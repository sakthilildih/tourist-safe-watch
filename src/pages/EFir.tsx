import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Plus, Clock, CheckCircle, AlertTriangle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EFIRCase {
  id: string;
  firNumber: string;
  touristId: string;
  touristName: string;
  caseType: 'missing' | 'theft' | 'emergency' | 'accident';
  lastSeen: string;
  location: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
  assignedOfficer: string;
  priority: 'high' | 'medium' | 'low';
}

interface NewEFIRForm {
  touristId: string;
  lastSeen: string;
  location: string;
  description: string;
  caseType: string;
  reporterName: string;
  reporterContact: string;
}

const mockEFIRCases: EFIRCase[] = [
  {
    id: '1',
    firNumber: 'FIR-2024-001',
    touristId: 'TID-2024-005',
    touristName: 'Sarah Johnson',
    caseType: 'missing',
    lastSeen: '2024-01-15 10:30:00',
    location: 'Chandni Chowk Market',
    description: 'Tourist was separated from group in crowded market area. Last seen wearing blue jacket and carrying red backpack.',
    status: 'investigating',
    createdAt: '2024-01-15 11:00:00',
    assignedOfficer: 'Insp. Rajesh Kumar',
    priority: 'high'
  },
  {
    id: '2',
    firNumber: 'FIR-2024-002',
    touristId: 'TID-2024-006',
    touristName: 'Michael Brown',
    caseType: 'theft',
    lastSeen: '2024-01-14 16:15:00',
    location: 'India Gate',
    description: 'Tourist reported theft of passport and wallet while taking photographs near India Gate.',
    status: 'resolved',
    createdAt: '2024-01-14 17:00:00',
    assignedOfficer: 'Const. Priya Sharma',
    priority: 'medium'
  }
];

export default function EFir() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [generatedFIRNumber, setGeneratedFIRNumber] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState<NewEFIRForm>({
    touristId: '',
    lastSeen: '',
    location: '',
    description: '',
    caseType: '',
    reporterName: '',
    reporterContact: ''
  });

  const filteredCases = mockEFIRCases.filter(case_ => {
    return statusFilter === "all" || case_.status === statusFilter;
  });

  const handleInputChange = (field: keyof NewEFIRForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    const firNumber = `FIR-2024-${String(mockEFIRCases.length + 1).padStart(3, '0')}`;
    
    try {
      // Mock API call to /api/efir/generate
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGeneratedFIRNumber(firNumber);
      setIsFormOpen(false);
      setIsConfirmationOpen(true);
      
      toast({
        title: "E-FIR Generated Successfully",
        description: `FIR Number: ${firNumber}`,
      });

      // Reset form
      setFormData({
        touristId: '',
        lastSeen: '',
        location: '',
        description: '',
        caseType: '',
        reporterName: '',
        reporterContact: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate E-FIR. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "outline" as const, className: "text-warning bg-warning/10" },
      investigating: { variant: "default" as const, className: "bg-info text-info-foreground" },
      resolved: { variant: "default" as const, className: "bg-success text-success-foreground" },
      closed: { variant: "secondary" as const, className: "" }
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: "destructive" as const, className: "" },
      medium: { variant: "default" as const, className: "bg-warning text-warning-foreground" },
      low: { variant: "secondary" as const, className: "" }
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const getCaseTypeIcon = (type: string) => {
    switch (type) {
      case 'missing': return '👤';
      case 'theft': return '🚨';
      case 'emergency': return '🆘';
      case 'accident': return '🚑';
      default: return '📋';
    }
  };

  const stats = [
    { label: "Total Cases", value: mockEFIRCases.length.toString() },
    { label: "Active Cases", value: mockEFIRCases.filter(c => c.status === 'investigating' || c.status === 'pending').length.toString() },
    { label: "Resolved Today", value: mockEFIRCases.filter(c => c.status === 'resolved').length.toString() },
    { label: "High Priority", value: mockEFIRCases.filter(c => c.priority === 'high').length.toString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">E-FIR Case Management</h1>
          <p className="text-muted-foreground mt-1">Automated missing person and emergency case generation</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Generate New E-FIR
        </Button>
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

      {/* Cases Table */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              E-FIR Cases
            </CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FIR Number</TableHead>
                <TableHead>Tourist</TableHead>
                <TableHead>Case Type</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Officer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((case_) => (
                <TableRow key={case_.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {case_.firNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{case_.touristName}</div>
                      <div className="text-sm text-muted-foreground">{case_.touristId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCaseTypeIcon(case_.caseType)}</span>
                      <Badge variant="outline" className="text-xs">
                        {case_.caseType.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(case_.lastSeen).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm max-w-32 truncate">
                    {case_.location}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getPriorityBadge(case_.priority).variant} 
                      className={getPriorityBadge(case_.priority).className}
                    >
                      {case_.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadge(case_.status).variant} 
                      className={getStatusBadge(case_.status).className}
                    >
                      {case_.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {case_.assignedOfficer}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* E-FIR Generation Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate New E-FIR</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="touristId">Tourist ID *</Label>
                <Input
                  id="touristId"
                  value={formData.touristId}
                  onChange={(e) => handleInputChange('touristId', e.target.value)}
                  placeholder="TID-2024-XXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseType">Case Type *</Label>
                <Select value={formData.caseType} onValueChange={(value) => handleInputChange('caseType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missing">Missing Person</SelectItem>
                    <SelectItem value="theft">Theft</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="accident">Accident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastSeen">Last Seen Date & Time *</Label>
                <Input
                  id="lastSeen"
                  type="datetime-local"
                  value={formData.lastSeen}
                  onChange={(e) => handleInputChange('lastSeen', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Last Known Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Detailed location description"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterName">Reporter Name *</Label>
                <Input
                  id="reporterName"
                  value={formData.reporterName}
                  onChange={(e) => handleInputChange('reporterName', e.target.value)}
                  placeholder="Person reporting the case"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterContact">Reporter Contact *</Label>
                <Input
                  id="reporterContact"
                  value={formData.reporterContact}
                  onChange={(e) => handleInputChange('reporterContact', e.target.value)}
                  placeholder="Phone number or email"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed information about the case, including physical description, circumstances, etc."
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary-dark">
                Generate E-FIR
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              E-FIR Generated Successfully
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-success/10 border-success/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">FIR Reference Number</h3>
                  <p className="text-2xl font-mono font-bold text-success mt-2">{generatedFIRNumber}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please save this reference number for future correspondence
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> Case has been registered and assigned to investigating officer</p>
              <p><strong>Next Steps:</strong> Investigation team will be notified immediately</p>
              <p><strong>Updates:</strong> You will be contacted for any additional information</p>
            </div>
            <Button 
              onClick={() => setIsConfirmationOpen(false)} 
              className="w-full bg-primary hover:bg-primary-dark"
            >
              Acknowledged
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}