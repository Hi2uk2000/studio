import { PropertyConfidenceScore } from '../models/PropertyConfidenceScore';

export interface PropertyConfidenceScoreRepositoryInterface {
    save(score: PropertyConfidenceScore): Promise<PropertyConfidenceScore>;
    findLatestByPropertyId(propertyId: string): Promise<PropertyConfidenceScore | null>;
}
