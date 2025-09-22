
// src/app/documents/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download, MoreVertical, Wrench, Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialDocuments = [
  { id: 1, name: 'Home-Insurance-Policy.pdf', type: 'Insurance', size: '2.3 MB', uploaded: '2024-01-15', maintenanceId: null },
  { id: 2, name: 'Property-Deed.pdf', type: 'Legal', size: '1.1 MB', uploaded: '2024-01-10', maintenanceId: null },
  { id: 3, name: 'Boiler-Manual.pdf', type: 'Manual', size: '5.8 MB', uploaded: '2024-02-20', maintenanceId: 1 },
  { id: 4, name: 'Fridge-Warranty.pdf', type: 'Warranty', size: '0.8 MB', uploaded: '2024-03-05', maintenanceId: null },
  { id: 5, name: 'Electrical-Safety-Cert.pdf', type: 'Certificate', size: '0.5 MB', uploaded: '2024-05-18', maintenanceId: null },
  { id: 6, name: 'Gutter-cleaning-quote.pdf', type: 'Quote', size: '0.2 MB', uploaded: '2024-10-28', maintenanceId: 2 },
  { id: 7, name: 'AC-Service-Report.pdf', type: 'Report', size: '0.4 MB', uploaded: '2024-11-01', maintenanceId: null },
  { id: 8, name: 'Window-Replacement-Contract.pdf', type: 'Contract', size: '0.9 MB', uploaded: '2024-11-05', maintenanceId: null },
];

const maintenanceTasks = [
  { id: 1, title: 'Service Boiler' },
  { id: 2, title: 'Clean Gutters' },
  { id: 3, title: 'Test Smoke Alarms' },
  { id: 4, title: 'Paint Living Room' },
  { id: 5, title: 'Check Roof for Leaks' },
  { id: 6, title: 'Deep Clean Carpets' },
];

const standardGroups = [
  'Insurance', 'Legal', 'Manual', 'Warranty', 'Certificate', 'Quote', 'Report', 'Contract'
];

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  maintenanceId: number | null;
}

/**
 * The main page for managing documents.
 *
 * @returns {JSX.Element} The DocumentsPage component.
 */
export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  const allGroups = [...new Set([...standardGroups, ...documents.map(d => d.type)])].sort();

  /**
   * Handles saving a new or edited document.
   *
   * @param {Omit<Document, 'id' | 'size' | 'uploaded'> & { newGroupName?: string }} formData - The form data for the document.
   */
  const handleSave = (formData: Omit<Document, 'id' | 'size' | 'uploaded'> & { newGroupName?: string }) => {
    const { newGroupName, type, ...rest } = formData;
    const finalType = newGroupName || type;

    if (editingDocument) {
      // Edit
      setDocuments(documents.map(doc => doc.id === editingDocument.id ? { ...editingDocument, ...rest, type: finalType } : doc));
    } else {
      // Add
      const newDoc: Document = {
        ...rest,
        type: finalType,
        id: Math.max(...documents.map(d => d.id)) + 1,
        size: '0.1 MB', // Dummy size
        uploaded: new Date().toISOString().split('T')[0],
      };
      setDocuments([newDoc, ...documents]);
    }
    setIsDialogOpen(false);
    setEditingDocument(null);
  };
  
  /**
   * Handles deleting a document.
   *
   * @param {number} id - The ID of the document to delete.
   */
  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Document Storage</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDocument(null)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DocumentFormDialog
            document={editingDocument}
            onSave={handleSave}
            onClose={() => setIsDialogOpen(false)}
            groups={allGroups}
            maintenanceTasks={maintenanceTasks}
          />
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Linked Task</TableHead>
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
                        <Button variant="link" asChild className="p-0 h-auto">
                           <Link href="/maintenance" className="flex items-center gap-2 text-sm text-primary hover:underline">
                            <Wrench className="h-4 w-4" />
                            {linkedTask.title}
                          </Link>
                        </Button>
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
                          <DropdownMenuItem onSelect={() => { setEditingDocument(doc); setIsDialogOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                           <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(doc.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

/**
 * A dialog for adding or editing a document.
 *
 * @param {object} props - The component's props.
 * @param {Document | null} props.document - The document to edit, or null to add a new document.
 * @param {(data: any) => void} props.onSave - A callback function to be called when the document is saved.
 * @param {() => void} props.onClose - A callback function to be called when the dialog is closed.
 * @param {string[]} props.groups - The available document groups.
 * @param {{id: number, title: string}[]} props.maintenanceTasks - The available maintenance tasks to link to.
 * @returns {JSX.Element} The DocumentFormDialog component.
 */
function DocumentFormDialog({ document, onSave, onClose, groups, maintenanceTasks }: {
  document: Document | null;
  onSave: (data: any) => void;
  onClose: () => void;
  groups: string[];
  maintenanceTasks: {id: number, title: string}[];
}) {
  const [name, setName] = useState(document?.name || '');
  const [type, setType] = useState(document?.type || '');
  const [maintenanceId, setMaintenanceId] = useState<string>(document?.maintenanceId?.toString() || 'none');
  const [newGroupName, setNewGroupName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, type, maintenanceId: maintenanceId === 'none' ? null : parseInt(maintenanceId), newGroupName });
  };
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{document ? 'Edit Document' : 'Add Document'}</DialogTitle>
        <DialogDescription>
          {document ? 'Update the details for your document.' : 'Upload a new document and assign it to a group.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Document Name</Label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Boiler-Manual.pdf" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Group</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
              <SelectItem value="new">Create new group...</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === 'new' && (
          <div className="space-y-2">
            <Label htmlFor="new-group">New Group Name</Label>
            <Input id="new-group" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="e.g., Legal" required />
          </div>
        )}
        
         <div className="space-y-2">
          <Label htmlFor="maintenanceId">Linked Maintenance Task (Optional)</Label>
          <Select value={maintenanceId} onValueChange={setMaintenanceId}>
            <SelectTrigger id="maintenanceId">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {maintenanceTasks.map(task => (
                <SelectItem key={task.id} value={task.id.toString()}>{task.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Document</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
