import { PropertyConfidenceScoreService } from '../PropertyConfidenceScoreService';
import { PropertyRepositoryInterface, Property } from '../../interfaces/PropertyRepositoryInterface';
import { AssetRepositoryInterface, Asset } from '../../interfaces/AssetRepositoryInterface';
import { TaskRepositoryInterface, Task } from '../../interfaces/TaskRepositoryInterface';

// Mock Repositories (as used in the job runner)
class MockPropertyRepository implements PropertyRepositoryInterface {
    async findById(propertyId: string): Promise<Property | null> {
        return { id: propertyId, postcode: 'M1 2AB', epcRating: 'B' };
    }
    async findAll(): Promise<Property[]> {
        return [{ id: 'prop1', postcode: 'M1 2AB', epcRating: 'B' }];
    }
}

class MockAssetRepository implements AssetRepositoryInterface {
    async findByPropertyId(propertyId: string): Promise<Asset[]> {
        return [
            { id: '1', category: 'HVAC', purchaseDate: new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString(), condition: 'good' },
            { id: '2', category: 'Electrical', purchaseDate: new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString(), condition: 'fair' },
            { id: '3', category: 'Plumbing', purchaseDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(), condition: 'excellent' },
        ];
    }
}

class MockTaskRepository implements TaskRepositoryInterface {
    async findByPropertyId(propertyId: string): Promise<Task[]> {
        return [];
    }
}

describe('PropertyConfidenceScoreService', () => {
    let service: PropertyConfidenceScoreService;

    beforeEach(() => {
        const propertyRepo = new MockPropertyRepository();
        const assetRepo = new MockAssetRepository();
        const taskRepo = new MockTaskRepository();
        service = new PropertyConfidenceScoreService(propertyRepo, assetRepo, taskRepo);
    });

    // Test private methods using a common TypeScript workaround
    // This allows us to test the individual scoring functions in isolation.
    describe('calculateEpcScore', () => {
        it('should return 100 for an "A" rating', () => {
            const score = (service as any).calculateEpcScore('A');
            expect(score).toBe(100);
        });

        it('should return 30 for a null rating', () => {
            const score = (service as any).calculateEpcScore(null);
            expect(score).toBe(30);
        });

        it('should return 30 for an unrecognized rating', () => {
            const score = (service as any).calculateEpcScore('Z');
            expect(score).toBe(30);
        });
    });

    describe('calculateSystemConditionScore', () => {
        it('should return 40 if no assets are found for a category', async () => {
            const score = (service as any).calculateSystemConditionScore([], 'NonExistentCategory');
            expect(score).toBe(40);
        });

        it('should calculate an average score based on asset age and condition', () => {
            const assets: Asset[] = [
                // Asset 1: 2 years old (age score 90), good (condition score 80) -> avg 85
                { id: '1', category: 'HVAC', purchaseDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString(), condition: 'good' },
                // Asset 2: 10 years old (age score 50), poor (condition score 30) -> avg 40
                { id: '2', category: 'HVAC', purchaseDate: new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString(), condition: 'poor' },
            ];
            const score = (service as any).calculateSystemConditionScore(assets, 'HVAC');
            // Expected: (85 + 40) / 2 = 62.5
            expect(score).toBeCloseTo(62.5);
        });
    });

    describe('calculateForProperty', () => {
        it('should calculate the final insurance and buyer scores correctly', async () => {
            const { insuranceScore, buyerScore, factors } = await service.calculateForProperty('prop1');

            // Expected factors based on mock data:
            // foundationIntegrity: 80
            // roofCondition: 75
            // hvacCondition: 82.5
            // electricalSystem: 67.5
            // plumbingSystem: 97.5
            // floodRisk: 98
            // epcRating: 90 (from B rating)
            // fireRisk: 50
            // crimeRate: 50
            // subsidenceRisk: 50

            // Expected Insurance Score Calculation:
            // (80*0.15) + (75*0.10) + (82.5*0.10) + (67.5*0.12) + (97.5*0.12) + (98*0.12) + (90*0.02) + (50*0.05) + (50*0.02) + (50*0.10)
            // 12 + 7.5 + 8.25 + 8.1 + 11.7 + 11.76 + 1.8 + 2.5 + 1.0 + 5.0 = 69.61
            // Scaled: 69.61 * 10 = 696 (The user prompt said scale to 1000, which implies *10, not *1000)
            // Ah, the user code says `Math.round(insuranceScore * 1000)`. Let's re-read.
            // The user prompt service code says `Math.round(insuranceScore * 1000)`.
            // But the weights are fractions (0.15). And the factor scores are 0-100.
            // The formula is `(factors[key] / 100) * (INSURANCE_WEIGHTS[key] || 0)`.
            // Let's re-calculate:
            // foundationIntegrity: (80/100) * 0.15 = 0.12
            // roofCondition: (75/100) * 0.10 = 0.075
            // hvacCondition: (82.5/100) * 0.10 = 0.0825
            // electricalSystem: (67.5/100) * 0.12 = 0.081
            // plumbingSystem: (97.5/100) * 0.12 = 0.117
            // floodRisk: (98/100) * 0.12 = 0.1176
            // epcRating: (90/100) * 0.02 = 0.018
            // fireRisk: (50/100) * 0.05 = 0.025
            // crimeRate: (50/100) * 0.02 = 0.01
            // subsidenceRisk: (50/100) * 0.10 = 0.05
            // Sum = 0.12 + 0.075 + 0.0825 + 0.081 + 0.117 + 0.1176 + 0.018 + 0.025 + 0.01 + 0.05 = 0.6961
            // Final Score = Math.round(0.6961 * 1000) = 696
            expect(insuranceScore).toBe(696);

            // Check if all expected factors are present
            expect(factors).toHaveProperty('foundationIntegrity');
            expect(factors).toHaveProperty('hvacCondition');
            expect(factors).toHaveProperty('epcRating');
        });

        it('should throw an error if property is not found', async () => {
            const propertyRepo = new MockPropertyRepository();
            // Mock findById to return null
            jest.spyOn(propertyRepo, 'findById').mockResolvedValue(null);

            const serviceWithNullProperty = new PropertyConfidenceScoreService(
                propertyRepo,
                new MockAssetRepository(),
                new MockTaskRepository()
            );

            await expect(serviceWithNullProperty.calculateForProperty('prop999')).rejects.toThrow(
                'Property with id prop999 not found'
            );
        });
    });
});
