// src/components/home-management/insurance-dialog.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InsuranceDetails {
    buildings: number;
    contents: number;
}

interface InsuranceDialogProps {
  details: InsuranceDetails;
  onSave: (data: InsuranceDetails) => void;
  onClose: () => void;
}

export function InsuranceDialog({ details, onSave, onClose }: InsuranceDialogProps) {
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
