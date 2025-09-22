// src/app/properties/page.tsx
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PlusCircle } from "lucide-react";
import { AddPropertyForm } from "@/components/properties/add-property-form";
import { Property } from "@/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";


export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      if (user) {
        setIsLoading(true);
        const q = query(collection(db, "properties"), where("ownerIds", "array-contains", user.uid));
        const querySnapshot = await getDocs(q);
        const props: Property[] = [];
        querySnapshot.forEach((doc) => {
          props.push({ id: doc.id, ...doc.data() } as Property);
        });
        setProperties(props);
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [user]);


  const handleSaveProperty = async (data) => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "properties"), {
        ...data,
        ownerIds: [user.uid],
        purchaseDate: new Date(data.purchaseDate),
      });
      console.log("Document written with ID: ", docRef.id);
      setProperties([...properties, { id: docRef.id, ...data, ownerIds: [user.uid] }]);
      setIsAddPropertyDialogOpen(false);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
            Your Properties
          </h1>
          <p className="text-muted-foreground">
            A list of all your managed properties.
          </p>
        </div>
        <Dialog open={isAddPropertyDialogOpen} onOpenChange={setIsAddPropertyDialogOpen}>
            <Button onClick={() => setIsAddPropertyDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Property
            </Button>
            <DialogContent className="sm:max-w-[800px]">
                <AddPropertyForm
                    onSave={handleSaveProperty}
                    onClose={() => setIsAddPropertyDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>No Properties Found</CardTitle>
            <CardDescription>
              You haven't added any properties yet. Get started by adding your first one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsAddPropertyDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id}>
                <CardHeader>
                    <CardTitle>{`${property.address.line1}, ${property.address.city}, ${property.address.postcode}`}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{property.propertyType}</p>
                    <p>{property.bedrooms} beds, {property.bathrooms} baths</p>
                    <p>{property.sizeSqFt} sq ft</p>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
