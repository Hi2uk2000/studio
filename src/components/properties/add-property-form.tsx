// src/components/properties/add-property-form.tsx
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
import { Calendar as CalendarIcon, Bed, Bath, Ruler } from 'lucide-react';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Property } from '@/types';

const formSchema = z.object({
  address: z.object({
    line1: z.string().min(5, 'Address line 1 is required.'),
    city: z.string().min(2, 'City is required.'),
    postcode: z.string().min(5, 'Postcode is required.'),
  }),
  propertyType: z.string({
    required_error: 'Please select a property type.',
  }),
  bedrooms: z.coerce.number().positive(),
  bathrooms: z.coerce.number().positive(),
  sizeSqFt: z.coerce.number().positive(),
  purchasePrice: z.coerce.number().positive('Purchase price must be a positive number.'),
  purchaseDate: z.date({
    required_error: 'A purchase date is required.',
  }),
  yearBuilt: z.coerce.number().optional(),
  lotSizeSqFt: z.coerce.number().optional(),
});

type AddPropertyFormValues = z.infer<typeof formSchema>;

interface AddPropertyFormProps {
    onSave: (data: AddPropertyFormValues) => void;
    onClose: () => void;
}

export function AddPropertyForm({ onSave, onClose }: AddPropertyFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddPropertyFormValues>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: AddPropertyFormValues) {
    setIsLoading(true);
    console.log(data);
    onSave(data);
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Add a New Property</CardTitle>
          <CardDescription>
            Enter the details of the new property.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address.line1">Address Line 1 *</Label>
              <Input
                {...form.register('address.line1')}
                id="address.line1"
                placeholder="e.g., 123 Example Street"
              />
              {form.formState.errors.address?.line1 && (
                <p className="text-sm text-destructive">{form.formState.errors.address.line1.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="address.city">City *</Label>
                    <Input
                        {...form.register('address.city')}
                        id="address.city"
                        placeholder="e.g., London"
                    />
                    {form.formState.errors.address?.city && (
                        <p className="text-sm text-destructive">{form.formState.errors.address.city.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address.postcode">Postcode *</Label>
                    <Input
                        {...form.register('address.postcode')}
                        id="address.postcode"
                        placeholder="e.g., EC1A 1BB"
                    />
                    {form.formState.errors.address?.postcode && (
                        <p className="text-sm text-destructive">{form.formState.errors.address.postcode.message}</p>
                    )}
                </div>
            </div>

            <Separator />

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
                    <Label htmlFor="sizeSqFt">Size (sq ft) *</Label>
                     <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...form.register('sizeSqFt')} id="sizeSqFt" placeholder="1200" className="pl-10" type="number" />
                    </div>
                    {form.formState.errors.sizeSqFt && (
                        <p className="text-sm text-destructive">{form.formState.errors.sizeSqFt.message}</p>
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
                    <Label htmlFor="yearBuilt">Year Built</Label>
                     <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...form.register('yearBuilt')} id="yearBuilt" placeholder="1985" className="pl-10" type="number" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="lotSizeSqFt">Lot Size (sq ft)</Label>
                     <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input {...form.register('lotSizeSqFt')} id="lotSizeSqFt" placeholder="5000" className="pl-10" type="number" />
                    </div>
                </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
             <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
             </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Property'}
            </Button>
          </CardFooter>
        </form>
      </Card>
  );
}
