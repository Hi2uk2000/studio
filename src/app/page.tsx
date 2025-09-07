'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp, Wrench, CreditCard } from "lucide-react";
import EquityChart from '@/components/dashboard/equity-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const upcomingMaintenance = [
  { id: 1, task: 'Service Boiler', due: 'Nov 15, 2023', priority: 'High' },
  { id: 2, task: 'Clean Gutters', due: 'Nov 20, 2023', priority: 'Medium' },
  { id: 3, task: 'Test Smoke Alarms', due: 'Dec 1, 2023', priority: 'High' },
];

const recentExpenses = [
  { id: 1, desc: 'Water Bill', category: 'Utilities', amount: '£45.00' },
  { id: 2, desc: 'Netflix Subscription', category: 'Entertainment', amount: '£10.99' },
  { id: 3, desc: 'IKEA Shopping', category: 'Shopping', amount: '£189.50' },
];

export default function Home() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Home Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£450,230</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Equity Growth</CardTitle>
            <CardDescription>Your home equity over the last 12 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <EquityChart />
          </CardContent>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Upcoming Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {upcomingMaintenance.map(item => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.task}</p>
                    <p className="text-sm text-muted-foreground">{item.due}</p>
                  </div>
                  <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'}>{item.priority}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="xl:col-span-2">
           <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recent Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map(item => (
                   <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.desc}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell className="text-right">{item.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
