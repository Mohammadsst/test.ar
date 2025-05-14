import { FC } from "react";

export interface StepComponentProps {
    onNext: () => void;
    onPrev: () => void;
    userData: UserData;
    setUserData: (newState: UserData) => void;
    isLoading: boolean;
}

export interface StepConfig {
    id: number;
    title: string;
    component: FC<StepComponentProps>;
}

export interface User {
    full_name: string;
    email: string;
    password1: string;
    password2: string;
    phone: string;
}

export interface Documents {
    idFront: File | "";
    idBack: File | "";
    taxCard: File | "";
    commercialRecord: File | "";
    bankStatement: File | "";
}

export interface Address {
    country: string;
    state: string;
    city: string;
    postal_code: string;
    address1: string;
    address2: string;
}

export interface UserData {
    user: User;
    documents?: Documents;
    address?: Address;
}
