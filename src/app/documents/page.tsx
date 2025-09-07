import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const documents = [
  { id: 1, name: 'Home-Insurance-Policy.pdf', type: 'Insurance', size: '2.3 MB', uploaded: '2024-01-15' },
  { id: 2, name: 'Property-Deed.pdf', type: 'Legal', size: '1.1 MB', uploaded: '2024-01-10' },
  { id: 3, name: 'Boiler-Manual.pdf', type: 'Manual', size: '5.8 MB', uploaded: '2024-02-20' },
  { id: 4, name: 'Fridge-Warranty.pdf', type: 'Warranty', size: '0.8 MB', uploaded: '2024-03-05' },
  { id: 5, name: 'Electrical-Safety-Cert.pdf', type: 'Certificate', size: '0.5 MB', uploaded: '2024-05-18' },
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
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    {doc.name}
                  </TableCell>
                  <TableCell><Badge variant="secondary">{doc.type}</Badge></TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
