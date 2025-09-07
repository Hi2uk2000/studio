
// src/app/maintenance/page.tsx
'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Calendar, Plus, FileText, Paperclip, MoreVertical, Edit, Trash2, Bot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';


const initialTasks = [
  { id: 1, title: 'Service Boiler', dueDate: '2024-11-15', status: 'Upcoming', priority: 'High', frequency: 'Annually' },
  { id: 2, title: 'Clean Gutters', dueDate: '2024-11-20', status: 'Upcoming', priority: 'Medium', frequency: 'Annually' },
  { id: 3, title: 'Test Smoke Alarms', dueDate: '2024-12-01', status: 'Upcoming', priority: 'High', frequency: 'Monthly' },
  { id: 4, title: 'Paint Living Room', dueDate: '2025-01-10', status: 'Scheduled', priority: 'Low', frequency: 'One-off' },
  { id: 5, title: 'Check Roof for Leaks', dueDate: '2024-09-30', status: 'Overdue', priority: 'High', frequency: 'Every 5 years' },
  { id: 6, title: 'Deep Clean Carpets', dueDate: '2024-10-25', status: 'Upcoming', priority: 'Low', frequency: 'Annually' },
];

const documents = [
  { id: 1, name: 'Home-Insurance-Policy.pdf', type: 'Insurance', size: '2.3 MB', uploaded: '2024-01-15', maintenanceId: null },
  { id: 2, name: 'Property-Deed.pdf', type: 'Legal', size: '1.1 MB', uploaded: '2024-01-10', maintenanceId: null },
  { id: 3, name: 'Boiler-Manual.pdf', type: 'Manual', size: '5.8 MB', uploaded: '2024-02-20', maintenanceId: 1 },
  { id: 4, name: 'Fridge-Warranty.pdf', type: 'Warranty', size: '0.8 MB', uploaded: '2024-03-05', maintenanceId: null },
  { id: 5, name: 'Electrical-Safety-Cert.pdf', type: 'Certificate', size: '0.5 MB', uploaded: '2024-05-18', maintenanceId: null },
  { id: 6, name: 'Gutter-cleaning-quote.pdf', type: 'Quote', size: '0.2 MB', uploaded: '2024-10-28', maintenanceId: 2 },
];

const getStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);

    if (due < today) return 'Overdue';
    if (due <= oneWeekFromNow) return 'Due Soon';
    return 'Upcoming';
}

const getPriorityVariant = (priority: string) => {
    switch (priority) {
        case 'High': return 'destructive';
        case 'Medium': return 'default';
        case 'Low': return 'secondary';
        default: return 'secondary';
    }
}

export default function MaintenancePage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  const handleSave = (formData: any) => {
    if (editingTask) {
        setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, ...formData, status: getStatus(formData.dueDate) } : task));
    } else {
        const newTask = {
            ...formData,
            id: Math.max(...tasks.map(t => t.id), 0) + 1,
            status: getStatus(formData.dueDate),
        };
        setTasks([newTask, ...tasks]);
    }
    setIsDialogOpen(false);
    setEditingTask(null);
  };
  
  const handleDelete = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Maintenance Planner</h1>
         <div className="flex gap-2">
            <Button variant="outline">
                <Bot className="mr-2 h-4 w-4" />
                Get AI Schedule
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setEditingTask(null)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                </DialogTrigger>
                <TaskFormDialog
                    task={editingTask}
                    onSave={handleSave}
                    onClose={() => setIsDialogOpen(false)}
                />
            </Dialog>
         </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(task => {
          const linkedDocuments = documents.filter(doc => doc.maintenanceId === task.id);
          const status = getStatus(task.dueDate);
          return (
            <Card key={task.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-start gap-2">
                    <Wrench className="h-5 w-5 text-primary mt-1" />
                    <div className="flex flex-col">
                        <span>{task.title}</span>
                         <span className="text-sm font-normal text-muted-foreground">{task.frequency}</span>
                    </div>
                  </CardTitle>
                   <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => { setEditingTask(task); setIsDialogOpen(true); }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(task.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                 <div className="flex items-center gap-4 pt-2">
                    <Badge variant={getPriorityVariant(task.priority)}>{task.priority} Priority</Badge>
                     <Badge variant={status === 'Overdue' ? 'destructive' : 'outline'}>{status}</Badge>
                 </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                 <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                {linkedDocuments.length > 0 && (
                  <div>
                    <Separator className="my-2" />
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Paperclip className="h-4 w-4" />
                      Linked Documents
                    </h4>
                    <ul className="space-y-2">
                      {linkedDocuments.map(doc => (
                        <li key={doc.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{doc.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Mark as Complete</Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}


function TaskFormDialog({ task, onSave, onClose }: {
  task: any | null;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task?.title || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(task ? new Date(task.dueDate) : undefined);
  const [priority, setPriority] = useState(task?.priority || 'Medium');
  const [frequency, setFrequency] = useState(task?.frequency || 'One-off');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, dueDate: dueDate?.toISOString().split('T')[0], priority, frequency });
  };
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{task ? 'Edit Task' : 'Add Maintenance Task'}</DialogTitle>
        <DialogDescription>
          {task ? 'Update the details for your maintenance task.' : 'Schedule a new one-off or recurring maintenance task.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Service Boiler" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <CalendarPicker
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        
         <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger id="frequency"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="One-off">One-off</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Annually">Annually</SelectItem>
              <SelectItem value="Every 2 years">Every 2 years</SelectItem>
              <SelectItem value="Every 5 years">Every 5 years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Task</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

    

    