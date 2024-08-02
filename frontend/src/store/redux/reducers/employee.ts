import {createSlice} from "@reduxjs/toolkit";

export const employee = createSlice({
    name: 'employees',
    initialState: {
        employees: [],
        isLoading: false,
        editSuccess: false,
        deleteSuccess: false,
        changesAvailable: false,
        error: {
            isError: false,
            reason: ""
        }
    },
    reducers: {
        getEmployeesFetch: (state, action) => {
            if (action) {}
            state.isLoading = true;
        },
        getEmployeesSuccess: (state, action) => {
            state.employees = action.payload;
            state.isLoading = false;
        },
        getEmployeesFailure: (state, action) => {
            if (action) {}
            state.isLoading = false;
        },
        postEmployeeFetch: (state, action) => {
            if (action) {}
            state.isLoading = true;
            state.editSuccess = false;
            state.error = {
                isError: false,
                reason: ""
            };
        },
        postEmployeeSuccess: (state, action) => {
            if (action) {}
            // state.Employees = action.payload;
            state.editSuccess = true;
            state.isLoading = false;
            state.changesAvailable = false;
        },
        postEmployeeFailure: (state, action) => {
            state.isLoading = false;
            state.error = {
                isError: true,
                reason: action.payload
            };
        },
        putEmployeeFetch: (state, action) => {
            if (action) {}
            state.isLoading = true;
            state.editSuccess = false;
            state.error = {
                isError: false,
                reason: ""
            };
        },
        putEmployeeSuccess: (state, action) => {
            if (action) {}
            // state.Employees = action.payload;
            state.editSuccess = true;
            state.isLoading = false;
            state.changesAvailable = false;
        },
        putEmployeeFailure: (state, action) => {
            state.isLoading = false;
            state.error = {
                isError: true,
                reason: action.payload
            };
        },
        deleteEmployeeFetch: (state, action) => {
            if (action) {}
            state.isLoading = true;
            state.deleteSuccess = false;
            state.error = {
                isError: false,
                reason: ""
            };
        },
        deleteEmployeeSuccess: (state, action) => {
            if (action) {}
            // state.Employees = action.payload;
            state.deleteSuccess = true;
            state.isLoading = false;
        },
        deleteEmployeeFailure: (state, action) => {
            state.isLoading = false;
            state.error = {
                isError: true,
                reason: action.payload
            };
        },
        setChangesAvailability: (state, action) => {
            state.changesAvailable = action.payload;
        }
    }
});

export const {getEmployeesFetch, getEmployeesSuccess, getEmployeesFailure, postEmployeeFetch, postEmployeeSuccess, postEmployeeFailure,
    putEmployeeFetch, putEmployeeSuccess, putEmployeeFailure, deleteEmployeeFetch, deleteEmployeeSuccess, deleteEmployeeFailure, setChangesAvailability} = employee.actions;

export default employee.reducer;