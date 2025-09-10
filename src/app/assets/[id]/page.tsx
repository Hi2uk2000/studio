
// src/app/assets/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Wrench, Shield, FileText, Upload, Plus, HardHat, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

// Mock data - in a real app this would come from a database
const initialAssets = [
  {
    id: 1,
    name: 'Vaillant EcoTec Plus Boiler',
    category: 'Plumbing',
    location: 'Utility Room',
    purchaseDate: '2021-08-15',
    warrantyExpiry: '2026-08-14',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    imageHint: 'boiler appliance',
    modelNumber: 'ETEC-24',
    serialNumber: '211020001018651',
    status: 'Operational',
    priority: 'Low',
  },
  {
    id: 2,
    name: 'Samsung Frame TV 55"',
    category: 'Electronics',
    location: 'Living Room',
    purchaseDate: '2022-11-20',
    warrantyExpiry: '2024-11-19',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    imageHint: 'living room television',
    modelNumber: 'QN55LS03AAFXZA',
    serialNumber: '0H1J3K4L5M6N7P8R',
    status: 'Operational',
    priority: 'Low',
  },
    {
    id: 3,
    name: 'Bosch Serie 6 Fridge Freezer',
    category: 'Appliance',
    location: 'Kitchen',
    purchaseDate: '2021-08-10',
    warrantyExpiry: '2023-08-09',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    imageHint: 'kitchen fridge',
    modelNumber: 'KGN39VWEAG',
    serialNumber: 'BD1234567890',
    status: 'Requires Attention',
    priority: 'Medium',
  },
   {
    id: 4,
    name: 'Ring Video Doorbell',
    category: 'Security',
    location: 'Front Door',
    purchaseDate: '2023-01-05',
    warrantyExpiry: '2025-01-04',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    imageHint: 'video doorbell',
    modelNumber: 'Ring4Pro',
    serialNumber: 'GHY6789IKL',
    status: 'Offline',
    priority: 'High',
  },
];

const serviceHistory = [
    { id: 1, assetId: 1, date: '2023-11-18', service: 'Annual Service', cost: '£95', contractor: 'ABC Gas Services', status: 'Completed', signedOffBy: 'Jane Doe' },
    { id: 2, assetId: 1, date: '2022-11-15', service: 'Annual Service', cost: '£90', contractor: 'ABC Gas Services', status: 'Completed', signedOffBy: 'Jane Doe' },
    { id: 3, assetId: 2, date: '2023-01-10', service: 'Wall Mount Installation', cost: '£150', contractor: 'Tech Installs Ltd', status: 'Completed', signedOffBy: 'Jane Doe' },
];

const relatedDocuments = [
    { id: 1, assetId: 1, name: 'Boiler-Manual.pdf', type: 'Manual' },
    { id: 2, assetId: 1, name: 'Boiler-Warranty.pdf', type: 'Warranty' },
    { id: 3, assetId: 1, name: 'Installation-Certificate.pdf', type: 'Certificate' },
];

const getPriorityVariant = (priority: string) => {
    switch (priority) {
        case 'High': return 'destructive';
        case 'Medium': return 'default';
        case 'Low': return 'secondary';
        default: return 'secondary';
    }
}

export default function AssetDetailPage() {
  const params = useParams();
  const assetId = params.id ? parseInt(params.id as string, 10) : null;
  const asset = initialAssets.find(a => a.id === assetId);

  const assetServiceHistory = serviceHistory.filter(s => s.assetId === assetId);
  const assetDocuments = relatedDocuments.filter(d => d.assetId === assetId);

  if (!asset) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-2xl font-bold">Asset not found</h1>
        <p className="text-muted-foreground">The asset you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/assets">Back to Assets</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
       <div className="flex items-center justify-between">
        <div>
            <Button variant="link" asChild className="p-0 text-muted-foreground">
                <Link href="/assets">← Back to all assets</Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline">{asset.name}</h1>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service Record
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
             <Card>
                <CardContent className="p-0">
                    <Image
                        src={asset.imageUrl}
                        alt={asset.name}
                        width={800}
                        height={600}
                        data-ai-hint={asset.imageHint}
                        className="object-cover rounded-t-lg aspect-video"
                    />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><HardHat className="h-5 w-5 text-primary" /> Service History</CardTitle>
                    <CardDescription>A log of all maintenance, repairs, and user sign-offs for this asset.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Contractor</TableHead>
                                <TableHead>Signed Off By</TableHead>
                                <TableHead className="text-right">Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assetServiceHistory.length > 0 ? (
                                assetServiceHistory.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{new Date(item.date).toLocaleDateString('en-GB')}</TableCell>
                                        <TableCell className="font-medium">{item.service}</TableCell>
                                        <TableCell className="text-muted-foreground">{item.contractor}</TableCell>
                                        <TableCell className="text-muted-foreground">{item.signedOffBy}</TableCell>
                                        <TableCell className="text-right font-mono">{item.cost}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">No service history recorded.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" />Asset Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Current Status</span>
                        <span className="font-medium">{asset.status}</span>
                    </div>
                     <Separator />
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Issue Priority</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Badge variant={getPriorityVariant(asset.priority)}>{asset.priority}</Badge>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Low</DropdownMenuItem>
                                <DropdownMenuItem>Medium</DropdownMenuItem>
                                <DropdownMenuItem>High</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Asset Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="secondary">{asset.category}</Badge>
                    </div>
                     <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{asset.location}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Model No.</span>
                        <span className="font-medium">{asset.modelNumber}</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Serial No.</span>
                        <span className="font-medium">{asset.serialNumber}</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary"/> Purchase & Warranty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Purchase Date</span>
                        <span className="font-medium">{new Date(asset.purchaseDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Warranty Expiry</span>
                        <span className="font-medium">{new Date(asset.warrantyExpiry).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/> Documents</CardTitle>
                    <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4"/>
                        Upload
                    </Button>
                </CardHeader>
                <CardContent>
                    {assetDocuments.length > 0 ? (
                        <ul className="space-y-3">
                            {assetDocuments.map(doc => (
                                <li key={doc.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{doc.name}</p>
                                        <p className="text-xs text-muted-foreground">{doc.type}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">...</Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <div className="text-center text-sm text-muted-foreground py-4">
                            No documents linked to this asset.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
