export interface PropertyConfidenceScoreServiceInterface {
    calculateForProperty(propertyId: string): Promise<{ insuranceScore: number; buyerScore: number; factors: Record<string, number> }>;
}
