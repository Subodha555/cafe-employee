import { call, takeEvery, put, all, debounce } from "redux-saga/effects";
import {
    getCafesSuccess,
    postCafeSuccess,
    putCafeSuccess,
    getCafesFailure,
    postCafeFailure,
    putCafeFailure,
    deleteCafeSuccess,
    deleteCafeFailure
} from "../reducers/cafe";

const api = process.env.REACT_APP_API_URL;

const cache: Record<string, Blob> = {};

function* fetchWithCache(url: string): Generator<any, Blob, Blob> {
    if (cache[url]) {
        return cache[url];
    } else {
        const response: any = yield call(fetch, url);
        const data: Blob = yield call([response, response.blob]);

        // Store the response in the cache
        cache[url] = data;

        return data;
    }
}

interface Action<T = any> {
    type: string;
    payload: T;
}

function* workGetCafesFetch(params: Action<{ location?: string }>): Generator<any, void, any> {
    const url = new URL(`${api}/cafe`);

    if (params.payload?.location) {
        url.search = new URLSearchParams(params.payload).toString();
    }

    try {
        const response: Response = yield call(fetch, url.toString());
        const formattedCafes: any[] = yield call([response, response.json]);

        const logoResponses: Blob[] = yield all(formattedCafes.map((cafe) => {
            return call(fetchWithCache, `${api}/cafe/image/${cafe.logo}`);
        }));

        yield put(getCafesSuccess(formattedCafes.map((cafe, index) => {
            return {
                ...cafe,
                logo: URL.createObjectURL(logoResponses[index])
            };
        })));
    } catch (e) {
        yield put(getCafesFailure("Server Error, get cafe"));
    }
}

function* workPostCafeFetch(params: Action<FormData>): Generator<any, void, any> {
    const options: RequestInit = {
        method: 'POST',
        body: params.payload
    };

    try {
        const response: Response = yield call(fetch, `${api}/cafe`, options);

        if (response.status === 201) {
            yield put(postCafeSuccess(""));
        } else {
            yield put(postCafeFailure("Create cafe request failed"));
        }
    } catch (e) {
        yield put(postCafeFailure("Server Error, create cafe"));
    }
}

function* workPutCafeFetch(params: Action<{ reqData: FormData; cafeId: string }>): Generator<any, void, any> {
    const options: RequestInit = {
        method: 'PUT',
        body: params.payload.reqData
    };

    try {
        const response: Response = yield call(fetch, `${api}/cafe/${params.payload.cafeId}`, options);

        if (response.status === 200) {
            yield put(putCafeSuccess(""));
        } else {
            yield put(putCafeFailure("Update cafe request failed"));
        }
    } catch (e) {
        yield put(putCafeFailure("Server Error, update cafe"));
    }
}

function* workDeleteCafeFetch(params: Action<string>): Generator<any, void, any> {
    const options: RequestInit = {
        method: 'DELETE'
    };

    try {
        const response: Response = yield call(fetch, `${api}/cafe/${params.payload}`, options);

        if (response.status === 200) {
            yield put(deleteCafeSuccess(""));
        } else {
            yield put(deleteCafeFailure("Delete cafe request failed"));
        }
    } catch (e) {
        yield put(deleteCafeFailure("Server Error, Delete Cafe"));
    }
}

function* cafeSaga() {
    yield debounce(500, 'cafes/getCafesFetch', workGetCafesFetch);
    yield takeEvery('cafes/postCafeFetch', workPostCafeFetch);
    yield takeEvery('cafes/putCafeFetch', workPutCafeFetch);
    yield takeEvery('cafes/deleteCafeFetch', workDeleteCafeFetch);
}

export default cafeSaga;
