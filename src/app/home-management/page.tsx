// src/app/home-management/page.tsx
'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bed, Bath, Ruler, Zap, Hammer, FileText, Banknote, Building, Calendar, BarChart, Bell, Home, CheckCircle, Clock, Edit, Calculator, Info, Percent, AlertTriangle, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { QuickStatsDialog, type QuickStats } from "@/components/home-management/quick-stats-dialog";
import { InsuranceDialog, type InsuranceDetails } from "@/components/home-management/insurance-dialog";
import { OverpaymentCalculator } from "@/components/home-management/overpayment-calculator";


const initialPropertyDetails = {
  address: "123 Oak Avenue, Manchester, M1 2AB",
  bedrooms: 3,
  bathrooms: 2,
  size: "1,200 sq ft",
  epcRating: "B",
  councilTaxBand: "D",
  propertyType: 'detached',
  purchaseDate: new Date('2020-06-15'),
  initialMortgage: 300000,
  term: 25, // years
};

const initialQuickStats: QuickStats = {
  mortgageBalance: 270000,
  interestRate: 3.5, // percentage
  renewalDate: new Date('2024-06-01'), // Set to a past date to show the renewal reminder
  lastMonthsBills: 430,
  regularMonthlyPayment: 1340,
  paymentDayOfMonth: 1,
};

const initialInsuranceDetails: InsuranceDetails = {
    buildings: 300,
    contents: 150,
};

const recentActivity = [
  { id: 1, icon: Hammer, text: "Boiler Service completed by ABC Gas Services", time: "2 days ago", color: "text-blue-500" },
  { id: 2, icon: Banknote, text: "Electricity bill payment confirmed (£85)", time: "5 days ago", color: "text-green-500" },
  { id: 3, icon: FileText, text: "Home Insurance Policy uploaded", time: "1 week ago", color: "text-indigo-500" },
];


/**
 * The main page for the Home Management section.
 *
 * @returns {JSX.Element} The HomeManagementPage component.
 */
export default function HomeManagementPage() {
  const router = useRouter();
  const [propertyDetails, setPropertyDetails] = useState(initialPropertyDetails);
  const [quickStats, setQuickStats] = useState<QuickStats>(initialQuickStats);
  const [insuranceDetails, setInsuranceDetails] = useState<InsuranceDetails>(initialInsuranceDetails);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [isInsuranceDialogOpen, setIsInsuranceDialogOpen] = useState(false);

  const isRenewalDue = new Date() > quickStats.renewalDate;
  
  const totalInsurancePremium = useMemo(() => {
    return Object.values(insuranceDetails).reduce((acc, val) => acc + (val || 0), 0);
  }, [insuranceDetails]);

  /**
   * Handles the tab change by navigating to the corresponding page.
   *
   * @param {string} value - The value of the selected tab.
   */
  const handleTabChange = (value: string) => {
    router.push(`/${value}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          {propertyDetails.address}
        </h1>
        <p className="text-muted-foreground">Your central hub for home management.</p>
      </div>
      <Tabs defaultValue="home-management" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="home-management">
            <Home className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <Banknote className="mr-2 h-4 w-4" />
            Financials
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Hammer className="mr-2 h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="assets">
            <Building className="mr-2 h-4 w-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home-management" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                 <Card className="lg:col-span-full">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>A log of recent events related to your property.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                        {recentActivity.map(item => (
                            <li key={item.id} className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <item.icon className={`h-6 w-6 ${item.color}`} />
                                </div>
                            <div className="flex-grow">
                                <p className="font-medium">{item.text}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">{item.time}</p>
                            </div>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                </Card>

                {isRenewalDue && (
                <Card className="lg:col-span-full bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <AlertTriangle className="h-8 w-8 text-amber-500" />
                        <div>
                            <CardTitle className="text-amber-900 dark:text-amber-300">High Priority: Mortgage Renewal Due</CardTitle>
                            <CardDescription className="text-amber-800 dark:text-amber-400">
                            Your fixed term may have ended. Update your mortgage details to ensure your calculations are accurate.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                            <Button onClick={() => setIsStatsDialogOpen(true)}>Update Mortgage Details</Button>
                    </CardContent>
                </Card>
                )}
            
                <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Property Details</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/home-management/edit">
                            <Edit className="mr-2 h-4 w-4"/>
                            Edit
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Bed className="mr-2 h-5 w-5" /> Bedrooms</span>
                        <span className="font-medium">{propertyDetails.bedrooms}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Bath className="mr-2 h-5 w-5" /> Bathrooms</span>
                        <span className="font-medium">{propertyDetails.bathrooms}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Ruler className="mr-2 h-5 w-5" /> Size</span>
                        <span className="font-medium">{propertyDetails.size}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Zap className="mr-2 h-5 w-5" /> EPC Rating</span>
                        <Badge variant="secondary">{propertyDetails.epcRating}</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Banknote className="mr-2 h-5 w-5" /> Council Tax</span>
                        <Badge variant="secondary">Band {propertyDetails.councilTaxBand}</Badge>
                    </div>
                </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Quick Stats</CardTitle>
                    <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4"/>
                                Edit
                            </Button>
                        </DialogTrigger>
                        <QuickStatsDialog
                            stats={quickStats}
                            onSave={(newStats) => {
                                setQuickStats(newStats);
                                setIsStatsDialogOpen(false);
                            }}
                            onClose={() => setIsStatsDialogOpen(false)}
                        />
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><BarChart className="mr-2 h-5 w-5" /> Mortgage Balance</span>
                        <span className="font-medium">£{quickStats.mortgageBalance.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Bell className="mr-2 h-5 w-5" /> Interest Rate</span>
                        <span className="font-medium">{quickStats.interestRate}% (Fixed)</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Calendar className="mr-2 h-5 w-5" /> Renewal Date</span>
                        <span className="font-medium">{new Date(quickStats.renewalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Banknote className="mr-2 h-5 w-5" /> Last Month's Bills</span>
                        <span className="font-medium">£{quickStats.lastMonthsBills.toLocaleString()}</span>
                    </div>
                </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary"/>
                            Mortgage Overpayment Calculator
                        </CardTitle>
                        <CardDescription>See how overpayments could affect your mortgage.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OverpaymentCalculator 
                            mortgageBalance={quickStats.mortgageBalance}
                            interestRate={quickStats.interestRate}
                            purchaseDate={propertyDetails.purchaseDate}
                            originalTerm={propertyDetails.term}
                            regularMonthlyPayment={quickStats.regularMonthlyPayment}
                        />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary"/>
                        Insurance Details
                    </CardTitle>
                    <Dialog open={isInsuranceDialogOpen} onOpenChange={setIsInsuranceDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4"/>
                                Edit
                            </Button>
                        </DialogTrigger>
                        <InsuranceDialog
                            details={insuranceDetails}
                            onSave={(newDetails) => {
                                setInsuranceDetails(newDetails);
                                setIsInsuranceDialogOpen(false);
                            }}
                            onClose={() => setIsInsuranceDialogOpen(false)}
                        />
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Buildings Insurance</span>
                        <span className="font-medium">£{insuranceDetails.buildings.toLocaleString()}/yr</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Contents Insurance</span>
                        <span className="font-medium">£{insuranceDetails.contents.toLocaleString()}/yr</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-bold">
                        <span>Total Premium</span>
                        <span>£{totalInsurancePremium.toLocaleString()}/yr</span>
                    </div>
                </CardContent>
                </Card>
            </div>
        </TabsContent>
        {/* The content for other tabs are placeholders as they will navigate away */}
        <TabsContent value="expenses"></TabsContent>
        <TabsContent value="maintenance"></TabsContent>
        <TabsContent value="assets"></TabsContent>
        <TabsContent value="documents"></TabsContent>
      </Tabs>
    </div>
  );
}
