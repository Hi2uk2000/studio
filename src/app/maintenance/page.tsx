import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Calendar, Plus } from "lucide-react";

const maintenanceTasks = [
  { id: 1, title: 'Service Boiler', dueDate: '2024-11-15', status: 'Upcoming', priority: 'High' },
  { id: 2, title: 'Clean Gutters', dueDate: '2024-11-20', status: 'Upcoming', priority: 'Medium' },
  { id: 3, title: 'Test Smoke Alarms', dueDate: '2024-12-01', status: 'Upcoming', priority: 'High' },
  { id: 4, title: 'Paint Living Room', dueDate: '2025-01-10', status: 'Scheduled', priority: 'Low' },
  { id: 5, title: 'Check Roof for Leaks', dueDate: '2024-09-30', status: 'Overdue', priority: 'High' },
  { id: 6, title: 'Deep Clean Carpets', dueDate: '2024-10-25', status: 'Upcoming', priority: 'Low' },
];

export default function MaintenancePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Maintenance Schedule</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Task
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {maintenanceTasks.map(task => (
          <Card key={task.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  {task.title}
                </CardTitle>
                <Badge variant={task.priority === 'High' ? 'destructive' : (task.priority === 'Medium' ? 'default' : 'secondary')}>{task.priority}</Badge>
              </div>
              <CardDescription className="flex items-center gap-2 pt-2">
                <Calendar className="h-4 w-4" />
                Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Mark as Complete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
