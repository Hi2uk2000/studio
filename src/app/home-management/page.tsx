// src/app/home-management/page.tsx
'use client';

import { useState } from "react";
import { Bed, Bath, Ruler, Zap, Hammer, FileText, Banknote, Building, Calendar, BarChart, Bell, Home, CheckCircle, Clock, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const initialPropertyDetails = {
  address: "123 Oak Avenue, Manchester, M1 2AB",
  bedrooms: 3,
  bathrooms: 2,
  size: "1,200 sq ft",
  epcRating: "B",
  councilTaxBand: "D",
  propertyType: 'detached'
};

const quickStats = {
  mortgageBalance: "£270,000",
  interestRate: "3.5% (Fixed)",
  renewalDate: "1 Jun 2027",
  insurancePremium: "£450/yr",
  lastMonthsBills: "£430",
};

const recentActivity = [
  { id: 1, icon: Hammer, text: "Boiler Service completed by ABC Gas Services", time: "2 days ago", color: "text-blue-500" },
  { id: 2, icon: Banknote, text: "Electricity bill payment confirmed (£85)", time: "5 days ago", color: "text-green-500" },
  { id: 3, icon: FileText, text: "Home Insurance Policy uploaded", time: "1 week ago", color: "text-indigo-500" },
];


export default function HomeManagementPage() {
  const [propertyDetails, setPropertyDetails] = useState(initialPropertyDetails);
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);

  const handleSavePropertyDetails = (data: any) => {
      console.log('Saving data...', data);
      // In a real app, you'd save this to a database
      // For now, we just update the state
      setPropertyDetails(currentDetails => ({...currentDetails, ...data}));
      setIsPropertyDialogOpen(false);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          {propertyDetails.address}
        </h1>
        <p className="text-muted-foreground">Your central hub for home management.</p>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">
            <Home className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="financials">
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
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Property Details</CardTitle>
                 <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4"/>
                            Edit
                        </Button>
                    </DialogTrigger>
                    <PropertyDetailsDialog 
                        details={propertyDetails}
                        onSave={handleSavePropertyDetails}
                        onClose={() => setIsPropertyDialogOpen(false)}
                    />
                </Dialog>
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
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground"><BarChart className="mr-2 h-5 w-5" /> Mortgage Balance</span>
                    <span className="font-medium">{quickStats.mortgageBalance}</span>
                 </div>
                  <Separator />
                 <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground"><Bell className="mr-2 h-5 w-5" /> Interest Rate</span>
                    <span className="font-medium">{quickStats.interestRate}</span>
                 </div>
                  <Separator />
                 <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground"><Calendar className="mr-2 h-5 w-5" /> Renewal Date</span>
                    <span className="font-medium">{quickStats.renewalDate}</span>
                 </div>
                  <Separator />
                 <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground"><FileText className="mr-2 h-5 w-5" /> Insurance Premium</span>
                    <span className="font-medium">{quickStats.insurancePremium}</span>
                 </div>
                  <Separator />
                 <div className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground"><Banknote className="mr-2 h-5 w-5" /> Last Month's Bills</span>
                    <span className="font-medium">{quickStats.lastMonthsBills}</span>
                 </div>
              </CardContent>
            </Card>
             <Card className="md:col-span-2 lg:col-span-5">
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
          </div>
        </TabsContent>
        <TabsContent value="financials">
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Financials section coming soon!</p>
            </div>
        </TabsContent>
        <TabsContent value="maintenance">
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Maintenance section coming soon!</p>
            </div>
        </TabsContent>
        <TabsContent value="assets">
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Assets section coming soon!</p>
            </div>
        </TabsContent>
        <TabsContent value="documents">
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Documents section coming soon!</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PropertyDetailsDialog({ details, onSave, onClose }: { details: typeof initialPropertyDetails, onSave: (data: any) => void, onClose: () => void }) {
    const [formData, setFormData] = useState(details);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    }
    
    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({...prev, [id]: value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }
    
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Property Details</DialogTitle>
                <DialogDescription>
                    Update the core information about your property.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="address">Property Address</Label>
                  <Input id="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input id="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input id="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="size">Size (sq ft)</Label>
                        <Input id="size" value={formData.size} onChange={handleChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label>Property Type</Label>
                         <Select value={formData.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="detached">Detached House</SelectItem>
                            <SelectItem value="semi-detached">Semi-Detached House</SelectItem>
                            <SelectItem value="terraced">Terraced House</SelectItem>
                            <SelectItem value="flat">Flat / Apartment</SelectItem>
                            <SelectItem value="bungalow">Bungalow</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="epcRating">EPC Rating</Label>
                        <Input id="epcRating" value={formData.epcRating} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="councilTaxBand">Council Tax Band</Label>
                        <Input id="councilTaxBand" value={formData.councilTaxBand} onChange={handleChange} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
