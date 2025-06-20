export class Review {
    id: number; 
    userId: string; 
    trackId: string; 
    rate: number;
    comment?: string;
    createdAt: Date;
}