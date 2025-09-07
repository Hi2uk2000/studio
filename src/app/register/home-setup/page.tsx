
// src/app/register/home-setup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Home } from 'lucide-react';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  propertyAddress: z.string().min(5, 'Property address is required.'),
  propertyType: z.string({
    required_error: 'Please select a property type.',
  }),
  purchasePrice: z.coerce.number().positive('Purchase price must be a positive number.'),
  purchaseDate: z.date({
    required_error: 'A purchase date is required.',
  }),
});

type HomeSetupFormValues = z.infer<typeof formSchema>;

export default function HomeSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<HomeSetupFormValues>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: HomeSetupFormValues) {
    setIsLoading(true);
    console.log(data);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Home Profile Created!',
        description: 'Your home profile has been successfully set up.',
      });
      router.push('/');
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-2xl mx-auto mb-4">
        <p className="text-sm text-muted-foreground text-center">Step 2 of 3</p>
        <div className="w-full bg-muted rounded-full h-2.5 mt-2">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: '66%' }}></div>
        </div>
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-2 mb-4">
            <Home className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">AssetStream</h1>
          </div>
          <CardTitle className="text-2xl">Set Up Your Home Profile</CardTitle>
          <CardDescription>
            Let's get some basic information about your property. You can add more details later.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="propertyAddress">Property Address *</Label>
              <Input
                {...form.register('propertyAddress')}
                id="propertyAddress"
                placeholder="e.g., 123 Example Street, London, EC1A 1BB"
              />
              {form.formState.errors.propertyAddress && (
                <p className="text-sm text-destructive">{form.formState.errors.propertyAddress.message}</p>
              )}
               <p className="text-xs text-muted-foreground">We couldn't implement a real address lookup, but in a real app, this would auto-complete.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Property Type *</Label>
                    <Controller
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        )}
                    />
                    {form.formState.errors.propertyType && (
                    <p className="text-sm text-destructive">{form.formState.errors.propertyType.message}</p>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price (£) *</Label>
                    <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input
                        {...form.register('purchasePrice')}
                        id="purchasePrice"
                        type="number"
                        step="0.01"
                        placeholder="250000"
                        className="pl-8"
                    />
                    </div>
                    {form.formState.errors.purchasePrice && (
                    <p className="text-sm text-destructive">{form.formState.errors.purchasePrice.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Purchase Date *</Label>
                    <Controller
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP", { locale: enGB }) : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
                                locale={enGB}
                                captionLayout="dropdown-buttons"
                                fromYear={new Date().getFullYear() - 100}
                                toYear={new Date().getFullYear()}
                            />
                            </PopoverContent>
                        </Popover>
                    )}
                    />
                    {form.formState.errors.purchaseDate && (
                        <p className="text-sm text-destructive">{form.formState.errors.purchaseDate.message}</p>
                    )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'CONTINUE'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
