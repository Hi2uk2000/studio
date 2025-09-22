import { PropertyConfidenceScoreServiceInterface } from '../interfaces/PropertyConfidenceScoreServiceInterface';
import { PropertyRepositoryInterface, Property } from '../interfaces/PropertyRepositoryInterface';
import { AssetRepositoryInterface, Asset } from '../interfaces/AssetRepositoryInterface';
import { TaskRepositoryInterface, Task } from '../interfaces/TaskRepositoryInterface';

// =================================================================================
// IMPORTANT: Placeholder Logic
// The weights and factor calculation methods below are placeholders for demonstration.
// A full implementation requires input from domain experts and more detailed business logic for each of the 22 factors.
// =================================================================================

// Define the weights for insurance and buyers
// These are placeholders and should be reviewed by a domain expert.
const INSURANCE_WEIGHTS: Record<string, number> = {
    foundationIntegrity: 0.15,
    roofCondition: 0.10,
    hvacCondition: 0.10,
    electricalSystem: 0.12,
    plumbingSystem: 0.12,
    floodRisk: 0.12,
    fireRisk: 0.05,
    crimeRate: 0.02,
    subsidenceRisk: 0.10,
    epcRating: 0.02,
    // TODO: Add weights for the other 12 factors
};

const BUYER_WEIGHTS: Record<string, number> = {
    foundationIntegrity: 0.10,
    roofCondition: 0.08,
    hvacCondition: 0.09,
    electricalSystem: 0.10,
    plumbingSystem: 0.10,
    floodRisk: 0.02,
    localSchools: 0.08,
    transportLinks: 0.08,
    localAmenities: 0.08,
    epcRating: 0.15,
    // TODO: Add weights for the other 12 factors
};

export class PropertyConfidenceScoreService implements PropertyConfidenceScoreServiceInterface {
    constructor(
        private propertyRepository: PropertyRepositoryInterface,
        private assetRepository: AssetRepositoryInterface,
        private taskRepository: TaskRepositoryInterface,
    ) {}

    public async calculateForProperty(propertyId: string): Promise<{ insuranceScore: number, buyerScore: number, factors: Record<string, number> }> {
        const property = await this.propertyRepository.findById(propertyId);
        if (!property) {
            throw new Error(`Property with id ${propertyId} not found`);
        }

        const assets = await this.assetRepository.findByPropertyId(propertyId);
        const tasks = await this.taskRepository.findByPropertyId(propertyId);

        const factors = {
            foundationIntegrity: this.calculateFoundationScore(property),
            roofCondition: this.calculateRoofConditionScore(tasks),
            hvacCondition: this.calculateSystemConditionScore(assets, 'HVAC'),
            electricalSystem: this.calculateSystemConditionScore(assets, 'Electrical'),
            plumbingSystem: this.calculateSystemConditionScore(assets, 'Plumbing'),
            floodRisk: await this.getFloodRiskScore(property.postcode),
            epcRating: this.calculateEpcScore(property.epcRating),
            // TODO: Implement calculation for other factors
            fireRisk: 50,
            crimeRate: 50,
            subsidenceRisk: 50,
            localSchools: 50,
            transportLinks: 50,
            localAmenities: 50,
        };

        let insuranceScoreRaw = 0;
        let buyerScoreRaw = 0;

        for (const key in factors) {
            const factorScore = factors[key as keyof typeof factors];
            insuranceScoreRaw += (factorScore / 100) * (INSURANCE_WEIGHTS[key] || 0);
            buyerScoreRaw += (factorScore / 100) * (BUYER_WEIGHTS[key] || 0);
        }

        const insuranceScore = Math.round(insuranceScoreRaw * 1000);
        const buyerScore = Math.round(buyerScoreRaw * 1000);

        return { insuranceScore, buyerScore, factors };
    }

    private calculateFoundationScore(property: Property): number {
        // Placeholder logic
        return 80;
    }

    private calculateRoofConditionScore(tasks: Task[]): number {
        // Placeholder logic
        return 75;
    }

    private calculateSystemConditionScore(assets: Asset[], categoryName: string): number {
        const systemAssets = assets.filter(a => a.category === categoryName);
        if (systemAssets.length === 0) return 40;

        let totalScore = 0;
        for (const asset of systemAssets) {
            let assetScore = 0;
            const age = new Date().getFullYear() - new Date(asset.purchaseDate).getFullYear();

            assetScore += Math.max(0, 100 - age * 5);

            const conditionScores = { 'excellent': 100, 'good': 80, 'fair': 60, 'poor': 30, 'needs_repair': 10 };
            assetScore += conditionScores[asset.condition] || 50;

            totalScore += assetScore / 2;
        }

        return totalScore / systemAssets.length;
    }

    private async getFloodRiskScore(postcode: string): Promise<number> {
        // In a real implementation, this would call an external API.
        console.log(`Fetching flood risk for ${postcode}...`);
        return new Promise(resolve => setTimeout(() => resolve(98), 500));
    }

    private calculateEpcScore(rating: string | null): number {
        if (!rating) return 30;
        const scores: Record<string, number> = { 'A': 100, 'B': 90, 'C': 80, 'D': 70, 'E': 50, 'F': 30, 'G': 10 };
        return scores[rating.toUpperCase()] || 30;
    }
}
