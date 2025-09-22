// This file will contain all the type definitions for the application.

export interface User {
    uid: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    photoURL?: string;
    address?: {
        line1: string;
        city: string;
        postcode: string;
    };
    role: 'homeowner' | 'landlord' | 'tenant' | 'propertyManager';
    preferences: {
        theme: 'light' | 'dark';
        notifications: {
            maintenance: boolean;
            warranty: boolean;
        };
    };
    emergencyContacts?: {
        name: string;
        relationship: string;
        phone: string;
    }[];
}

export interface Property {
    ownerIds: string[];
    address: {
        line1: string;
        city: string;
        postcode: string;
    };
    propertyType: 'detached' | 'flat' | 'other';
    yearBuilt?: number;
    lotSizeSqFt?: number;
    sizeSqFt: number;
    bedrooms: number;
    bathrooms: number;
    purchasePrice: number;
    purchaseDate: string;
    images?: {
        url: string;
        caption?: string;
    }[];
}

export interface Asset {
    name: string;
    category: 'Appliance' | 'Plumbing' | 'Other';
    location: string;
    condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    purchasePrice?: number;
    currentValue?: number;
    imageUrl?: string;
    modelNumber?: string;
    serialNumber?: string;
    purchaseDate?: string;
    warrantyExpiry?: string;
}

export interface MaintenanceTask {
    title: string;
    assetId?: string;
    contractorId?: string;
    status: 'Scheduled' | 'In Progress' | 'Completed';
    priority: 'High' | 'Medium' | 'Low';
    frequency: 'Annually' | 'Monthly' | 'Once';
    scheduledDate: string;
    estimatedCost?: number;
    actualCost?: number;
    beforeAfterImages?: string[];
}

export interface Document {
    name: string;
    type: 'Manual' | 'Warranty' | 'Insurance' | 'Other';
    linkedAssetId?: string;
    linkedTaskId?: string;
}

export interface Expense {
    description: string;
    amount: number;
    category: 'Mortgage' | 'Utilities' | 'Groceries' | 'Other';
    date: string;
    paymentMethod?: 'Credit Card' | 'Bank Transfer' | 'Direct Debit' | 'Other';
    vendor?: string;
    taxDeductible: boolean;
    receiptUrl?: string;
    isRecurring: boolean;
    recurringDetails?: {
        frequency: 'monthly' | 'yearly';
        startDate: string;
    };
}

export interface Contractor {
    name: string;
    specialization: 'Plumbing' | 'Electrical' | 'Other';
    contactPerson?: string;
    phone: string;
    email?: string;
    address?: {
        line1: string;
        city: string;
        postcode: string;
    };
    notes?: string;
}
