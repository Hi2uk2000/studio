// src/components/home-management/quick-stats-dialog.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

export interface QuickStats {
    mortgageBalance: number;
    interestRate: number;
    renewalDate: Date;
    lastMonthsBills: number;
    regularMonthlyPayment: number;
    paymentDayOfMonth: number;
}

interface QuickStatsDialogProps {
  stats: QuickStats;
  onSave: (data: QuickStats) => void;
  onClose: () => void;
}

export function QuickStatsDialog({ stats, onSave, onClose }: QuickStatsDialogProps) {
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
                                <CalendarIcon className="mr-2 h-4 w-4" />
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
