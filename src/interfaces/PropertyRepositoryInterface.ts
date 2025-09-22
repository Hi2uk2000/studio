// This is a placeholder. In a real application, this would be a full-fledged model.
export interface Property {
    id: string; // Changed to string to align with Firestore document IDs
    postcode: string;
    epcRating: string | null;
    // other property fields would be defined here based on the schema
}

export interface PropertyRepositoryInterface {
    findById(propertyId: string): Promise<Property | null>;
    findAll(): Promise<Property[]>;
}
