import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    DocumentData,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PropertyConfidenceScoreRepositoryInterface } from '../interfaces/PropertyConfidenceScoreRepositoryInterface';
import { PropertyConfidenceScore } from '../models/PropertyConfidenceScore';

export class PropertyConfidenceScoreRepository implements PropertyConfidenceScoreRepositoryInterface {
    private scoresCollection = collection(db, 'property_confidence_scores');

    async save(score: PropertyConfidenceScore): Promise<PropertyConfidenceScore> {
        const docRef = await addDoc(this.scoresCollection, {
            propertyId: score.propertyId,
            calculationDate: Timestamp.fromDate(score.calculationDate),
            insuranceScore: score.insuranceScore,
            buyerScore: score.buyerScore,
            scoreFactors: score.scoreFactors,
            createdAt: Timestamp.now(),
        });
        score.scoreId = docRef.id;
        return score;
    }

    async findLatestByPropertyId(propertyId: string): Promise<PropertyConfidenceScore | null> {
        const q = query(
            this.scoresCollection,
            where('propertyId', '==', propertyId),
            orderBy('calculationDate', 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return this.mapToModel(doc.data(), doc.id);
    }

    private mapToModel(data: DocumentData, id: string): PropertyConfidenceScore {
        return new PropertyConfidenceScore({
            scoreId: id,
            propertyId: data.propertyId,
            calculationDate: (data.calculationDate as Timestamp).toDate(),
            insuranceScore: data.insuranceScore,
            buyerScore: data.buyerScore,
            scoreFactors: data.scoreFactors,
        });
    }
}
