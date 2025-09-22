// src/components/home-management/overpayment-calculator.tsx
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar, Banknote, Percent } from 'lucide-react';
import { format } from 'date-fns';

interface OverpaymentCalculatorProps {
    mortgageBalance: number;
    interestRate: number;
    purchaseDate: Date;
    originalTerm: number;
    regularMonthlyPayment: number;
}

/**
 * A calculator to determine the impact of mortgage overpayments.
 * It calculates the new mortgage end date, total interest saved, and the annual overpayment percentage.
 *
 * @param {object} props - The component's props.
 * @param {number} props.mortgageBalance - The current mortgage balance.
 * @param {number} props.interestRate - The annual interest rate.
 * @param {Date} props.purchaseDate - The original purchase date of the property.
 * @param {number} props.originalTerm - The original mortgage term in years.
 * @param {number} props.regularMonthlyPayment - The regular monthly mortgage payment.
 * @returns {JSX.Element} The OverpaymentCalculator component.
 */
export function OverpaymentCalculator({ mortgageBalance, interestRate, purchaseDate, originalTerm, regularMonthlyPayment }: OverpaymentCalculatorProps) {
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

    /**
     * Calculates the effect of overpayments and updates the result state.
     */
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
