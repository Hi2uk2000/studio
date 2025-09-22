// src/app/home-management/edit/page.tsx
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
import { Calendar as CalendarIcon, Home, Zap, Banknote as BanknoteIcon, Bed, Bath, Ruler } from 'lucide-react';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  propertyAddress: z.string().min(5, 'Property address is required.'),
  propertyType: z.string({
    required_error: 'Please select a property type.',
  }),
  bedrooms: z.coerce.number().positive(),
  bathrooms: z.coerce.number().positive(),
  size: z.string().min(1, 'Size is required'),
  purchasePrice: z.coerce.number().positive('Purchase price must be a positive number.'),
  purchaseDate: z.date({
    required_error: 'A purchase date is required.',
  }),
  epcRating: z.string().optional(),
  councilTaxBand: z.string().optional(),
});

type HomeSetupFormValues = z.infer<typeof formSchema>;

const initialPropertyDetails = {
  propertyAddress: "123 Oak Avenue, Manchester, M1 2AB",
  bedrooms: 3,
  bathrooms: 2,
  size: "1,200 sq ft",
  epcRating: "B",
  councilTaxBand: "D",
  propertyType: 'detached',
  purchasePrice: 350000,
  purchaseDate: new Date('2020-06-15'),
};

/**
 * The page for editing the home profile.
 *
 * @returns {JSX.Element} The EditHomeManagementPage component.
 */
export default function EditHomeManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<HomeSetupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialPropertyDetails,
  });

  /**
   * Handles the form submission.
   *
   * @param {HomeSetupFormValues} data - The form data.
   */
  function onSubmit(data: HomeSetupFormValues) {
    setIsLoading(true);
    console.log(data);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Profile Updated!',
        description: 'Your home profile has been successfully updated.',
      });
      router.push('/home-management');
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Your Home Profile</CardTitle>
          <CardDescription>
            Update the core details of your property here.
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
                    <Label htmlFor="size">Size (sq ft) *</Label>
                     <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...form.register('size')} id="size" placeholder="1,200" className="pl-10" />
                    </div>
                    {form.formState.errors.size && (
                        <p className="text-sm text-destructive">{form.formState.errors.size.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <div className="relative">
                        <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...form.register('bedrooms')} type="number" id="bedrooms" placeholder="3" className="pl-10" />
                    </div>
                    {form.formState.errors.bedrooms && (
                        <p className="text-sm text-destructive">{form.formState.errors.bedrooms.message}</p>
                    )}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <div className="relative">
                        <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...form.register('bathrooms')} type="number" id="bathrooms" placeholder="2" className="pl-10" />
                    </div>
                    {form.formState.errors.bathrooms && (
                        <p className="text-sm text-destructive">{form.formState.errors.bathrooms.message}</p>
                    )}
                </div>
            </div>
            
            <Separator />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="epcRating">EPC Rating</Label>
                     <div className="relative">
                        <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...form.register('epcRating')} id="epcRating" placeholder="B" className="pl-10" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="councilTaxBand">Council Tax Band</Label>
                     <div className="relative">
                        <BanknoteIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...form.register('councilTaxBand')} id="councilTaxBand" placeholder="D" className="pl-10" />
                    </div>
                </div>
            </div>
            
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
             <Button type="button" variant="ghost" asChild>
                <Link href="/home-management">Cancel</Link>
             </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
