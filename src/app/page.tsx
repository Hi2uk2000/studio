
'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { TrendingUp, Wrench, CreditCard, Calendar, Plus, BarChart, AlertTriangle, CheckCircle, CircleDot, Building } from "lucide-react";
import EquityChart from '@/components/dashboard/equity-chart';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useAuth } from "@/hooks/use-auth";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const upcomingReminders = [
  { id: 1, event: 'Boiler Service Due', dueIn: 'In 12 days', dueDate: '1 Oct 2025', icon: AlertTriangle, color: 'text-amber-500', href: '/maintenance' },
  { id: 2, event: 'Council Tax Payment', dueIn: 'In 18 days', dueDate: '7 Oct 2025', icon: CheckCircle, color: 'text-green-500', href: '/expenses' },
  { id: 3, event: 'Home Insurance Renewal', dueIn: 'In 35 days', dueDate: '24 Oct 2025', icon: CircleDot, color: 'text-blue-500', href: '/home-management' },
];


export default function Home() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Welcome back, {user?.displayName?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-muted-foreground">{getGreeting()} ☀️</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Financial Snapshot Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HOME VALUE</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£425,000</div>
            <p className="text-xs text-green-500">+8.2% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EQUITY</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£125,730</div>
            <p className="text-xs text-green-500">+1.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EXPENSES</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£1,850</div>
            <p className="text-xs text-red-500">-3.2% from last month</p>
          </CardContent>
          <CardFooter className="pt-0">
             <Button asChild size="sm" variant="link" className="px-0">
                <Link href="/expenses">View detailed report</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <Card className="flex flex-col items-center justify-center bg-muted/40 border-dashed">
            <div className="space-y-4 text-center">
                <h3 className="font-semibold">Quick Actions</h3>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button asChild size="sm">
                        <Link href="/expenses"><Plus/> Expense</Link>
                    </Button>
                    <Button asChild variant="secondary" size="sm">
                        <Link href="/maintenance"><Plus/> Maintenance</Link>
                    </Button>
                     <Button asChild variant="secondary" size="sm">
                        <Link href="/assets/add"><Plus/> Asset</Link>
                    </Button>
                </div>
            </div>
        </Card>
        
        {/* Equity Growth and Mortgage */}
        <Card className="lg:col-span-2 xl:col-span-2">
          <CardHeader>
            <CardTitle>Equity Growth</CardTitle>
            <CardDescription>Your home equity over the last 12 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <EquityChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 xl:col-span-2">
           <CardHeader>
            <CardTitle>Mortgage Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Progress value={35} />
              <div className="flex justify-between text-sm font-medium">
                  <span>Paid Off</span>
                  <span>35%</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
                You've paid off an estimated £87,500 of your £250,000 mortgage.
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card className="lg:col-span-full xl:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-0">
              {upcomingReminders.map(item => (
                 <li key={item.id}>
                  <Link href={item.href} className="flex items-center gap-4 p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <item.icon className={cn("h-6 w-6", item.color)} />
                      </div>
                    <div className="flex-grow">
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-muted-foreground">{item.dueIn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.dueDate}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
           <CardFooter>
            <Button variant="link" className="w-full" asChild>
                <Link href="/maintenance">
                    View all reminders
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
