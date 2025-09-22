export class PropertyConfidenceScore {
    public scoreId?: string; // Changed to string for Firestore
    public propertyId: string; // Changed to string
    public calculationDate: Date;
    public insuranceScore: number;
    public buyerScore: number;
    public scoreFactors: Record<string, number>;

    constructor(params: {
        propertyId: string;
        calculationDate: Date;
        insuranceScore: number;
        buyerScore: number;
        scoreFactors: Record<string, number>;
        scoreId?: string; // Changed to string
    }) {
        this.propertyId = params.propertyId;
        this.calculationDate = params.calculationDate;
        this.insuranceScore = params.insuranceScore;
        this.buyerScore = params.buyerScore;
        this.scoreFactors = params.scoreFactors;
        this.scoreId = params.scoreId;
    }
}
