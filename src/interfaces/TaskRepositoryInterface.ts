// This is a placeholder. In a real application, this would be a full-fledged model.
export interface Task {
    id: string;
    // other task fields would be defined here based on the schema
}

export interface TaskRepositoryInterface {
    findByPropertyId(propertyId: number): Promise<Task[]>;
}
