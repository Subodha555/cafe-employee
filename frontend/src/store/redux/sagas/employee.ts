import { call, takeEvery, put, debounce } from "redux-saga/effects";
import {
    getEmployeesSuccess,
    getEmployeesFailure,
    postEmployeeFailure,
    postEmployeeSuccess,
    putEmployeeFailure,
    putEmployeeSuccess,
    deleteEmployeeFailure,
    deleteEmployeeSuccess
} from "../reducers/employee";

const api = process.env.REACT_APP_API_URL;

interface Action<T = any> {
    type: string;
    payload: T;
}

function* workGetEmployeesFetch(params: Action<{ cafeId?: string }>): Generator<any, void, any> {
    const url = new URL(`${api}/employee`);

    if (params.payload?.cafeId) {
        url.search = new URLSearchParams(params.payload).toString();
    }

    try {
        const response: Response = yield call(fetch, url.toString());
        const formattedEmployees: any[] = yield call([response, response.json]);
        yield put(getEmployeesSuccess(formattedEmployees));
    } catch (e) {
        yield put(getEmployeesFailure("Server Error, get employees"));
    }
}

function* workPostEmployeeFetch(params: Action<any>): Generator<any, void, any> {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params.payload)
    };

    try {
        const response: Response = yield call(fetch, `${api}/employee`, options);
        console.log("create employee", response.status);

        if (response.status === 201) {
            yield put(postEmployeeSuccess(""));
        } else {
            yield put(postEmployeeFailure("Create employee request failed"));
        }
    } catch (e) {
        yield put(postEmployeeFailure("Server Error, create employee"));
    }
}

function* workPutEmployeeFetch(params: Action<{ reqData: any; employeeId: string }>): Generator<any, void, any> {
    const options: RequestInit = {
        method: 'PUT',
        body: JSON.stringify(params.payload.reqData),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response: Response = yield call(fetch, `${api}/employee/${params.payload.employeeId}`, options);

        if (response.status === 200) {
            yield put(putEmployeeSuccess(""));
        } else {
            yield put(putEmployeeFailure("Update employee request failed"));
        }
    } catch (e) {
        yield put(putEmployeeFailure("Server Error, update employee"));
    }
}

function* workDeleteEmployeeFetch(params: Action<string>): Generator<any, void, any> {
    const options: RequestInit = {
        method: 'DELETE'
    };

    try {
        const response: Response = yield call(fetch, `${api}/employee/${params.payload}`, options);

        if (response.status === 200) {
            yield put(deleteEmployeeSuccess(""));
        } else {
            yield put(deleteEmployeeFailure("Delete employee request failed"));
        }
    } catch (e) {
        yield put(deleteEmployeeFailure("Server Error, delete employee"));
    }
}

function* employeeSaga() {
    yield debounce(500, 'employees/getEmployeesFetch', workGetEmployeesFetch);
    yield takeEvery('employees/postEmployeeFetch', workPostEmployeeFetch);
    yield takeEvery('employees/putEmployeeFetch', workPutEmployeeFetch);
    yield takeEvery('employees/deleteEmployeeFetch', workDeleteEmployeeFetch);
}

export default employeeSaga;
