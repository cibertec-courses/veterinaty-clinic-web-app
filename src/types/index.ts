export interface Owner{
    id: number;
    firtsName: string;
    lastName: string;
    fullName: string;
    phone: string;
    email: string;
    createdAt: string;
    petCount: number;
}

export interface CreateOwnerDto{
    firtsName: string;
    lastName: string;
    phone: string;
    email: string;
}

export interface UpdateOwnerDto{
    firtsName: string;
    lastName: string;
    phone: string;
    email: string;
}

export interface Pet{
    id: number;
    name: string;
    species: string;
    breed: string;
    birthDate: string;
    ageInYears: number;
    createdAt: string;
    ownerId: number;
    ownerName: string;   
}

export interface CreatePetDto{
    name: string;
    species: string;
    breed: string;
    birthDate: string; 
    ownerId: number;
}

export interface UpdatePetDto{
    name: string;
    species: string;
    breed: string;
    birthDate: string;
}


export interface Appointment{
    id: number;
    appointmentDate: string;
    reason: string;
    status: string;
    notes: string | null;
    canBeCanceled: boolean;
    createdAt: string;
    petId: number;
    petName: string;
    ownerName: string;
}


export interface CreateAppointmentDto{
    appointmentDate: string;
    reason: string;
    petId: number;
}

export interface UpdateAppointmentDto{
    appointmentDate: string;
    reason: string;
    status: string;
    notes: string | null;
}