// src/app/assets/add/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Camera, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  assetName: z.string().min(3, 'Asset name is required.'),
  category: z.string({ required_error: 'Please select a category.' }),
  location: z.string().optional(),
  modelNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.date().optional(),
  warrantyExpiry: z.date().optional(),
});

type AddAssetFormValues = z.infer<typeof formSchema>;

export default function AddAssetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const form = useForm<AddAssetFormValues>({
    resolver: zodResolver(formSchema),
  });
  
  useEffect(() => {
    if (isScanning) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
          setIsScanning(false);
        }
      };
      getCameraPermission();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isScanning, toast]);


  function onSubmit(data: AddAssetFormValues) {
    setIsLoading(true);
    console.log(data);

    setTimeout(() => {
      toast({
        title: 'Asset Added!',
        description: `"${data.assetName}" has been added to your inventory.`,
      });
      router.push('/assets');
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Add a New Asset</CardTitle>
          <CardDescription>
            Scan a barcode for quick entry or fill in the details manually.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Button className="w-full" size="lg" onClick={() => setIsScanning(prev => !prev)}>
                <Camera className="mr-2 h-5 w-5" />
                {isScanning ? 'Stop Scanning' : 'Scan Barcode or QR Code'}
            </Button>
            
            {isScanning && (
                <div className="space-y-2">
                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                     {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}
                    <p className="text-sm text-muted-foreground text-center">Position the barcode or QR code within the frame. In a real app, this would automatically populate the fields below.</p>
                </div>
            )}
           

            <Separator />
            <p className="text-center text-muted-foreground text-sm">Or enter details manually</p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="assetName">Asset Name *</Label>
                    <Input {...form.register('assetName')} id="assetName" placeholder="e.g., Vaillant EcoTec Plus Boiler" />
                    {form.formState.errors.assetName && (
                        <p className="text-sm text-destructive">{form.formState.errors.assetName.message}</p>
                    )}
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label>Category *</Label>
                        <Controller
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="plumbing">Plumbing</SelectItem>
                                        <SelectItem value="electrical">Electrical</SelectItem>
                                        <SelectItem value="appliance">Appliance</SelectItem>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="hvac">HVAC</SelectItem>
                                        <SelectItem value="security">Security</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {form.formState.errors.category && (
                            <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                        )}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="location">Location / Room</Label>
                        <Input {...form.register('location')} id="location" placeholder="e.g., Kitchen" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="modelNumber">Model Number</Label>
                        <Input {...form.register('modelNumber')} id="modelNumber" placeholder="e.g., ETEC-24" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="serialNumber">Serial Number</Label>
                        <Input {...form.register('serialNumber')} id="serialNumber" placeholder="e.g., 211020001018651" />
                    </div>
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Purchase Date</Label>
                        <Controller
                            control={form.control}
                            name="purchaseDate"
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP", { locale: enGB }) : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} locale={enGB} />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Warranty Expiry Date</Label>
                        <Controller
                            control={form.control}
                            name="warrantyExpiry"
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP", { locale: enGB }) : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} locale={enGB} />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>
                </div>

                <Separator />
                
                 <div className="space-y-4">
                    <div>
                        <Label className="text-base font-medium">Photos & Documents</Label>
                        <p className="text-sm text-muted-foreground">Upload receipts, manuals, or photos of the asset.</p>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Button variant="outline"><ImageIcon className="mr-2 h-4 w-4" /> Upload Photo</Button>
                         <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Upload Document</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">In a real app, uploading a receipt would use OCR to extract text and make it searchable.</p>
                </div>


                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" asChild>
                        <Link href="/assets">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Asset'}
                    </Button>
                </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
