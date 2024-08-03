export type Option = {
    id: string;
    name: string;
};

export type Cafe = {
    cafeId: string,
    name: string;
    description: string;
    logo: string;
    location: string;
    employeeCount: number
}

export type Employee = {
    employeeId: string,
    name: string;
    email: string;
    phone: string;
    gender: string;
    daysWorked: string;
    cafeDetails: {
        name: string;
    }
}

export type CafeState = {
    cafes: Cafe[];
    isLoading: boolean;
    editSuccess: boolean;
    deleteSuccess: boolean;
    changesAvailable: boolean;
    error: {
        isError: boolean;
        reason: string;
    }
}

export type EmployeeState =  {
    employees: Employee[],
    isLoading: boolean,
    editSuccess: boolean,
    deleteSuccess: boolean,
    changesAvailable: boolean,
    error: {
        isError: boolean,
        reason: string
    }
}

export type RootState = {
    cafes: CafeState;
    employees: EmployeeState
}