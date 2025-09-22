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

/**
 * A dialog component for editing insurance premium details.
 *
 * @param {object} props - The component's props.
 * @param {InsuranceDetails} props.details - The current insurance details.
 * @param {(data: InsuranceDetails) => void} props.onSave - A callback function to be called when the details are saved.
 * @param {() => void} props.onClose - A callback function to be called when the dialog is closed.
 * @returns {JSX.Element} The InsuranceDialog component.
 */
export function InsuranceDialog({ details, onSave, onClose }: InsuranceDialogProps) {
    const [currentDetails, setCurrentDetails] = useState(details);

    /**
     * Handles the form submission.
     *
     * @param {React.FormEvent} e - The form event.
     */
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
