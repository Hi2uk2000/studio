import { NextResponse } from 'next/server';
import { PropertyConfidenceScoreRepository } from '@/repositories/PropertyConfidenceScoreRepository';

function getRatingFromScore(score: number): string {
    if (score > 900) return 'Excellent';
    if (score > 800) return 'Very Good';
    if (score > 700) return 'Good';
    if (score > 600) return 'Fair';
    if (score > 500) return 'Poor';
    return 'Very Poor';
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const propertyId = params.id;
        if (!propertyId) {
            return NextResponse.json({ success: false, message: 'Invalid property ID' }, { status: 400 });
        }

        const scoreRepository = new PropertyConfidenceScoreRepository();
        const latestScore = await scoreRepository.findLatestByPropertyId(propertyId);

        if (!latestScore) {
            return NextResponse.json({ success: false, message: 'No confidence score found for this property' }, { status: 404 });
        }

        // The historicalData part is a placeholder as it requires a separate repository method.
        const responseData = {
            propertyId: latestScore.propertyId,
            calculationDate: latestScore.calculationDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            insuranceScore: latestScore.insuranceScore,
            buyerScore: latestScore.buyerScore,
            insuranceRating: getRatingFromScore(latestScore.insuranceScore),
            buyerRating: getRatingFromScore(latestScore.buyerScore),
            historicalData: [
                 // Example data - in a real implementation, this would be fetched from the repository
                { date: "2025-08-22", insuranceScore: 845, buyerScore: 775 },
                { date: "2025-07-22", insuranceScore: 830, buyerScore: 760 }
            ],
            factors: latestScore.scoreFactors,
        };

        return NextResponse.json({ success: true, data: responseData });

    } catch (error) {
        console.error('Error fetching confidence score:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ success: false, message: 'An internal server error occurred', error: errorMessage }, { status: 500 });
    }
}
