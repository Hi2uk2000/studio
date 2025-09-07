// src/app/assets/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const initialAssets = [
  {
    id: 1,
    name: 'Vaillant EcoTec Plus Boiler',
    category: 'Plumbing',
    location: 'Utility Room',
    purchaseDate: '2021-08-15',
    warrantyExpiry: '2026-08-14',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    imageHint: 'boiler appliance',
  },
  {
    id: 2,
    name: 'Samsung Frame TV 55"',
    category: 'Electronics',
    location: 'Living Room',
    purchaseDate: '2022-11-20',
    warrantyExpiry: '2024-11-19',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    imageHint: 'living room television',
  },
    {
    id: 3,
    name: 'Bosch Serie 6 Fridge Freezer',
    category: 'Appliance',
    location: 'Kitchen',
    purchaseDate: '2021-08-10',
    warrantyExpiry: '2023-08-09',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    imageHint: 'kitchen fridge',
  },
   {
    id: 4,
    name: 'Ring Video Doorbell',
    category: 'Security',
    location: 'Front Door',
    purchaseDate: '2023-01-05',
    warrantyExpiry: '2025-01-04',
    imageUrl: 'https://picsum.photos/600/400?random=4',
    imageHint: 'video doorbell',
  },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState(initialAssets);
  
  const handleDelete = (id: number) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Assets</h1>
        <Button asChild>
          <Link href="/assets/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Asset
          </Link>
        </Button>
      </div>

      {assets.length === 0 ? (
         <Card className="flex flex-col items-center justify-center h-96 border-dashed">
            <CardHeader>
                <CardTitle>No Assets Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Get started by adding your first asset.</p>
                <Button asChild>
                    <Link href="/assets/add">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Asset
                    </Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="flex flex-col">
              <CardHeader className="relative p-0">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background/80">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(asset.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Image
                  src={asset.imageUrl}
                  alt={asset.name}
                  width={600}
                  height={400}
                  data-ai-hint={asset.imageHint}
                  className="object-cover rounded-t-lg aspect-video"
                />
              </CardHeader>
              <CardContent className="pt-4 flex-grow">
                <h3 className="font-semibold text-lg">{asset.name}</h3>
                <p className="text-sm text-muted-foreground">{asset.location}</p>
                <div className="mt-2">
                    <Badge variant="secondary">{asset.category}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-muted-foreground">
                <span>Purchased: {new Date(asset.purchaseDate).toLocaleDateString('en-GB')}</span>
                <span>Warranty: {new Date(asset.warrantyExpiry).toLocaleDateString('en-GB')}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
