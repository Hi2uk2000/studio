import { PropertyConfidenceScoreService } from '../services/PropertyConfidenceScoreService';
import { PropertyConfidenceScoreRepository } from '../repositories/PropertyConfidenceScoreRepository';
import { PropertyConfidenceScore } from '../models/PropertyConfidenceScore';

// =================================================================================
// IMPORTANT: Mock Dependencies
// The repository implementations below (MockPropertyRepository, etc.) are for
// demonstration purposes only. In a production environment, these would be replaced
// with real repository classes that interact with the live database.
// =================================================================================
import { PropertyRepositoryInterface, Property } from '../interfaces/PropertyRepositoryInterface';
import { AssetRepositoryInterface, Asset } from '../interfaces/AssetRepositoryInterface';
import { TaskRepositoryInterface, Task } from '../interfaces/TaskRepositoryInterface';

class MockPropertyRepository implements PropertyRepositoryInterface {
    async findById(propertyId: string): Promise<Property | null> {
        return { id: propertyId, postcode: 'M1 2AB', epcRating: 'B' };
    }
    async findAll(): Promise<Property[]> {
        // Return a list of mock properties to be scored
        return [
            { id: 'prop1', postcode: 'M1 2AB', epcRating: 'B' },
            { id: 'prop2', postcode: 'SW1A 0AA', epcRating: 'C' },
        ];
    }
}

class MockAssetRepository implements AssetRepositoryInterface {
    async findByPropertyId(propertyId: string): Promise<Asset[]> {
        // Return some mock assets for the given property
        return [
            { id: '1', category: 'HVAC', purchaseDate: '2020-01-15', condition: 'good' },
            { id: '2', category: 'Electrical', purchaseDate: '2018-05-20', condition: 'fair' },
        ];
    }
}

class MockTaskRepository implements TaskRepositoryInterface {
    async findByPropertyId(propertyId: string): Promise<Task[]> {
        return []; // No tasks for now
    }
}


export async function runMonthlyScoreCalculation() {
    console.log('Starting monthly property confidence score calculation job...');

    // Instantiate repositories
    const propertyRepository = new MockPropertyRepository();
    const assetRepository = new MockAssetRepository();
    const taskRepository = new MockTaskRepository();
    const scoreRepository = new PropertyConfidenceScoreRepository();

    // Instantiate the service with the repositories
    const scoreService = new PropertyConfidenceScoreService(
        propertyRepository,
        assetRepository,
        taskRepository
    );

    try {
        const properties = await propertyRepository.findAll();
        console.log(`Found ${properties.length} properties to process.`);

        for (const property of properties) {
            console.log(`Calculating score for property ${property.id}...`);

            const { insuranceScore, buyerScore, factors } = await scoreService.calculateForProperty(property.id);

            console.log(`  - Insurance Score: ${insuranceScore}`);
            console.log(`  - Buyer Score: ${buyerScore}`);

            const scoreToSave = new PropertyConfidenceScore({
                propertyId: property.id,
                calculationDate: new Date(),
                insuranceScore,
                buyerScore,
                scoreFactors: factors,
            });

            await scoreRepository.save(scoreToSave);
            console.log(`  - Score saved successfully for property ${property.id}.`);
        }

        console.log('Monthly score calculation job finished successfully.');
    } catch (error) {
        console.error('An error occurred during the monthly score calculation job:', error);
        // In a real application, you would have more robust error handling and notifications.
    }
}

// To run this job from the command line, you could add something like:
// if (require.main === module) {
//     runMonthlyScoreCalculation();
// }
