
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

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

const initialQuickStats = {
  mortgageBalance: 270000,
  interestRate: 3.5, // percentage
  renewalDate: new Date('2024-06-01'), // Set to a past date to show the renewal reminder
  lastMonthsBills: 430,
  regularMonthlyPayment: 1340,
  paymentDayOfMonth: 1,
};

const initialInsuranceDetails = {
    buildings: 300,
    contents: 150,
};

const recentActivity = [
  { id: 1, icon: Hammer, text: "Boiler Service completed by ABC Gas Services", time: "2 days ago", color: "text-blue-500" },
  { id: 2, icon: Banknote, text: "Electricity bill payment confirmed (£85)", time: "5 days ago", color: "text-green-500" },
  { id: 3, icon: FileText, text: "Home Insurance Policy uploaded", time: "1 week ago", color: "text-indigo-500" },
];


export default function HomeManagementPage() {
  const router = useRouter();
  const [propertyDetails, setPropertyDetails] = useState(initialPropertyDetails);
  const [quickStats, setQuickStats] = useState(initialQuickStats);
  const [insuranceDetails, setInsuranceDetails] = useState(initialInsuranceDetails);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [isInsuranceDialogOpen, setIsInsuranceDialogOpen] = useState(false);

  const isRenewalDue = new Date() > quickStats.renewalDate;
  
  const totalInsurancePremium = useMemo(() => {
    return Object.values(insuranceDetails).reduce((acc, val) => acc + (val || 0), 0);
  }, [insuranceDetails]);

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
                        <span className="font-medium">{format(quickStats.renewalDate, 'd MMM yyyy', { locale: enGB })}</span>
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

function QuickStatsDialog({ stats, onSave, onClose }: {
  stats: typeof initialQuickStats;
  onSave: (data: typeof initialQuickStats) => void;
  onClose: () => void;
}) {
    const [currentStats, setCurrentStats] = useState(stats);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(currentStats);
    };

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setCurrentStats(prev => ({ ...prev, renewalDate: date }));
        }
    };

    return (
        <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                <DialogTitle>Edit Quick Stats</DialogTitle>
                <DialogDescription>
                    Update your financial statistics here.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="mortgageBalance">Mortgage Balance (£)</Label>
                        <Input id="mortgageBalance" type="number" value={currentStats.mortgageBalance} onChange={e => setCurrentStats(prev => ({ ...prev, mortgageBalance: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="interestRate">Interest Rate (%)</Label>
                        <Input id="interestRate" type="number" step="0.01" value={currentStats.interestRate} onChange={e => setCurrentStats(prev => ({ ...prev, interestRate: Number(e.target.value) }))} />
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="regularMonthlyPayment">Regular Monthly Payment (£)</Label>
                        <Input id="regularMonthlyPayment" type="number" value={currentStats.regularMonthlyPayment} onChange={e => setCurrentStats(prev => ({ ...prev, regularMonthlyPayment: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paymentDayOfMonth">Payment Day of Month</Label>
                        <Input id="paymentDayOfMonth" type="number" min="1" max="31" value={currentStats.paymentDayOfMonth} onChange={e => setCurrentStats(prev => ({ ...prev, paymentDayOfMonth: Number(e.target.value) }))} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Renewal Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                                <Calendar className="mr-2 h-4 w-4" />
                                {currentStats.renewalDate ? format(currentStats.renewalDate, "PPP", { locale: enGB }) : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={currentStats.renewalDate} onSelect={handleDateChange} locale={enGB} />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastMonthsBills">Last Month's Bills (£)</Label>
                    <Input id="lastMonthsBills" type="number" value={currentStats.lastMonthsBills} onChange={e => setCurrentStats(prev => ({ ...prev, lastMonthsBills: Number(e.target.value) }))} />
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}

function InsuranceDialog({ details, onSave, onClose }: {
  details: typeof initialInsuranceDetails;
  onSave: (data: typeof initialInsuranceDetails) => void;
  onClose: () => void;
}) {
    const [currentDetails, setCurrentDetails] = useState(details);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(currentDetails);
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Insurance Premiums</DialogTitle>
                <DialogDescription>
                    Update your annual insurance premium costs here.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="buildings">Buildings Insurance (£/yr)</Label>
                    <Input id="buildings" type="number" value={currentDetails.buildings} onChange={e => setCurrentDetails(prev => ({ ...prev, buildings: Number(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contents">Contents Insurance (£/yr)</Label>
                    <Input id="contents" type="number" value={currentDetails.contents} onChange={e => setCurrentDetails(prev => ({ ...prev, contents: Number(e.target.value) }))} />
                </div>
                {/* Add other insurance types here as needed */}
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}

function OverpaymentCalculator({ mortgageBalance, interestRate, purchaseDate, originalTerm, regularMonthlyPayment }: {
    mortgageBalance: number;
    interestRate: number;
    purchaseDate: Date;
    originalTerm: number;
    regularMonthlyPayment: number;
}) {
    const [monthlyOverpayment, setMonthlyOverpayment] = useState(0);
    const [lumpSumOverpayment, setLumpSumOverpayment] = useState(0);

    const [result, setResult] = useState<{
        newEndDate: string,
        interestSaved: number,
        overpaymentPercentage: number
    } | null>(null);

    const { remainingTermMonths } = useMemo(() => {
        const monthsElapsed = (new Date().getFullYear() - purchaseDate.getFullYear()) * 12 + (new Date().getMonth() - purchaseDate.getMonth());
        const remainingTerm = originalTerm * 12 - monthsElapsed;
        
        if (remainingTerm <= 0 || mortgageBalance <= 0) return { remainingTermMonths: 0 };
        
        return {
            remainingTermMonths: remainingTerm
        };
    }, [mortgageBalance, purchaseDate, originalTerm]);

    const calculate = () => {
        if (regularMonthlyPayment <= 0) return;

        const monthlyRate = interestRate / 100 / 12;
        const balanceAfterLumpSum = mortgageBalance - lumpSumOverpayment;
        const totalMonthlyPayment = regularMonthlyPayment + monthlyOverpayment;

        // Calculate original term details
        const originalTotalInterest = (regularMonthlyPayment * remainingTermMonths) - mortgageBalance;

        // Calculate new term with overpayments
        let newTermMonths = 0;
        if (balanceAfterLumpSum > 0 && totalMonthlyPayment > balanceAfterLumpSum * monthlyRate) {
           newTermMonths = -Math.log(1 - (balanceAfterLumpSum * monthlyRate) / totalMonthlyPayment) / Math.log(1 + monthlyRate);
        }
        
        const newTotalInterest = (totalMonthlyPayment * newTermMonths) - balanceAfterLumpSum;
        const interestSaved = originalTotalInterest - newTotalInterest;
        
        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + Math.ceil(newTermMonths));

        const totalOverpayment = lumpSumOverpayment + (monthlyOverpayment > 0 ? monthlyOverpayment * 12 : 0);
        const overpaymentPercentage = (totalOverpayment / mortgageBalance) * 100;

        setResult({
            newEndDate: format(newEndDate, 'MMM yyyy'),
            interestSaved: Math.round(interestSaved),
            overpaymentPercentage: Math.round(overpaymentPercentage * 10) / 10
        });
    };
    
    return (
        <div className="space-y-4">
             {regularMonthlyPayment > 0 && (
                <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Your Regular Monthly Payment</p>
                    <p className="text-lg font-bold">£{regularMonthlyPayment.toFixed(2)}</p>
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="monthly-overpayment">Additional Monthly Overpayment (£)</Label>
                <Input
                    id="monthly-overpayment"
                    type="number"
                    value={monthlyOverpayment}
                    onChange={(e) => setMonthlyOverpayment(Number(e.target.value))}
                    placeholder="e.g., 100"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lump-sum-overpayment">One-off Overpayment (£)</Label>
                <Input
                    id="lump-sum-overpayment"
                    type="number"
                    value={lumpSumOverpayment}
                    onChange={(e) => setLumpSumOverpayment(Number(e.target.value))}
                    placeholder="e.g., 5000"
                />
            </div>
            <Button onClick={calculate} className="w-full" disabled={(monthlyOverpayment <= 0 && lumpSumOverpayment <= 0) || regularMonthlyPayment <= 0}>Calculate</Button>

            {result && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-semibold text-center">Calculation Result</h4>
                     <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground text-sm"><Calendar className="mr-2 h-4 w-4" /> New Mortgage End Date</span>
                        <span className="font-medium">{result.newEndDate}</span>
                     </div>
                      <Separator />
                     <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground text-sm"><Banknote className="mr-2 h-4 w-4" /> Total Interest Saved</span>
                        <span className="font-medium text-green-500">£{result.interestSaved.toLocaleString()}</span>
                     </div>
                     <Separator />
                     <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground text-sm"><Percent className="mr-2 h-4 w-4" /> Annual Overpayment</span>
                        <span className="font-medium">{result.overpaymentPercentage.toFixed(1)}%</span>
                     </div>
                </div>
            )}
        </div>
    );
}
