import {createSlice} from "@reduxjs/toolkit";
import {CafeState} from "../../../utils/types";

const initialState: CafeState = {
    cafes: [],
    isLoading: false,
    editSuccess: false,
    deleteSuccess: false,
    changesAvailable: false,
    error: {
        isError: false,
        reason: ""
    }
};

export const cafeSlice = createSlice({
    name: 'cafes',
    initialState: initialState,
    reducers: {
        getCafesFetch: (state, action) => {
            if (action) {}
            state.isLoading = true;
            state.error = {
                isError: false,
                reason: ""
            };
        },
        getCafesSuccess: (state, action) => {
            state.cafes = action.payload;
            state.isLoading = false;
        },
        getCafesFailure: (state, action) => {
            state.isLoading = false;
            state.error = {
                isError: true,
                reason: action.payload
            };
        },
        postCafeFetch: (state, action) => {
            if (action) {}
            state.isLoading = true;
            state.editSuccess = false;
            state.error = {
                isError: false,
                reason: ""
            };
        },
        postCafeSuccess: (state, action) => {
            if (action) {}
            // state.cafes = action.payload;
            state.editSuccess = true;
            state.isLoading = false;
            state.changesAvailable = false;
        },
        postCafeFailure: (state, action) => {
            if (action) {}
            state.isLoading = false;
            state.error = {
                isError: true,
                reason: action.payload
            };
        },
        putCafeFetch: (state, action) => {
            if (action) {}
            state.isLoading = true;
            state.editSuccess = false;
            state.error = {
                isError: false,
                reason: ""
            };
        },
        putCafeSuccess: (state, action) => {
            if (action) {}
            // state.cafes = action.payload;
            state.editSuccess = true;
            state.isLoading = false;
            state.changesAvailable = false;
        },
        putCafeFailure: (state, action) => {
            state.isLoading = false;
            state.error = {
                isError: true,
                reason: action.payload
            };
        },
        deleteCafeFetch: (state, action) => {
            if (action) {}
            state.isLoading = true;
            state.deleteSuccess = false;
            state.error = {
                isError: false,
                reason: ""
            };
        },
        deleteCafeSuccess: (state, action) => {
            if (action) {}
            // state.cafes = action.payload;
            state.deleteSuccess = true;
            state.isLoading = false;
        },
        deleteCafeFailure: (state, action) => {
            if (action) {}
            state.isLoading = false;
            state.error = {
                isError: true,
                reason: action.payload
            };
        },
        setChangeAvailability: (state, action) => {
            state.changesAvailable = action.payload;
        }
    }
});

export const {getCafesFetch, getCafesSuccess, getCafesFailure, postCafeFetch, postCafeSuccess, postCafeFailure,
    putCafeFetch, putCafeSuccess, putCafeFailure, deleteCafeFetch, deleteCafeSuccess, deleteCafeFailure, setChangeAvailability} = cafeSlice.actions;

export default cafeSlice.reducer;