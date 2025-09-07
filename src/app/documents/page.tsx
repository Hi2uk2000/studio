import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download, MoreVertical, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const documents = [
  { id: 1, name: 'Home-Insurance-Policy.pdf', type: 'Insurance', size: '2.3 MB', uploaded: '2024-01-15', maintenanceId: null },
  { id: 2, name: 'Property-Deed.pdf', type: 'Legal', size: '1.1 MB', uploaded: '2024-01-10', maintenanceId: null },
  { id: 3, name: 'Boiler-Manual.pdf', type: 'Manual', size: '5.8 MB', uploaded: '2024-02-20', maintenanceId: 1 },
  { id: 4, name: 'Fridge-Warranty.pdf', type: 'Warranty', size: '0.8 MB', uploaded: '2024-03-05', maintenanceId: null },
  { id: 5, name: 'Electrical-Safety-Cert.pdf', type: 'Certificate', size: '0.5 MB', uploaded: '2024-05-18', maintenanceId: null },
  { id: 6, name: 'Gutter-cleaning-quote.pdf', type: 'Quote', size: '0.2 MB', uploaded: '2024-10-28', maintenanceId: 2 },
];

const maintenanceTasks = [
  { id: 1, title: 'Service Boiler' },
  { id: 2, title: 'Clean Gutters' },
  { id: 3, title: 'Test Smoke Alarms' },
  { id: 4, title: 'Paint Living Room' },
  { id: 5, title: 'Check Roof for Leaks' },
  { id: 6, title: 'Deep Clean Carpets' },
];

export default function DocumentsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Document Storage</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Linked Asset</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => {
                const linkedTask = doc.maintenanceId ? maintenanceTasks.find(t => t.id === doc.maintenanceId) : null;
                return (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      {doc.name}
                    </TableCell>
                    <TableCell><Badge variant="secondary">{doc.type}</Badge></TableCell>
                    <TableCell>
                      {linkedTask ? (
                        <Link href="/maintenance" className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <Wrench className="h-4 w-4" />
                          {linkedTask.title}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{new Date(doc.uploaded).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}