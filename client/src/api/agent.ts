import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../app/router/Routes";
import { PaginatedResponse } from "../app/models/pagination";
import { store } from "../app/store/configureStore";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials= true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep();
    const pagination = response.headers["pagination"];
    if(pagination) {
        response.data = new PaginatedResponse(response.data,JSON.parse(pagination));
        return response;
    }
    return response;
}, (error: AxiosError) => {
    const {data, status} = error.response as AxiosResponse;
    switch(status){
        case 400:
            if(data.errors) {
                const modelStateErrors: string[] =[];
                for (const key in data.errors) {
                    if(data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;    
        case 500:
            router.navigate("/server-error",{state: {error:data}});
            break;
        default:
            break;                    
    }
    return Promise.reject(error.response);
});

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url,{params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const TestErrors = {
    get400Error: () => requests.get("buggy/bad-request"),
    get401Error: () => requests.get("buggy/unauthorized"),
    get404Error: () => requests.get("buggy/not-found"),
    get500Error: () => requests.get("buggy/server-error"),
    getValidationError: () => requests.get("buggy/validation-error"),
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get("products",params),
    details: (id: number) => requests.get(`products/${id}`),
    fethFilters: () => requests.get("products/filters")
} 

const Basket = {
    get: () => requests.get("basket"),
    addItem: (id: number, quantity: number) => requests.post(`basket?productId=${id}&quantity=${quantity}`,{}),
    removeItem: (id: number, quantity: number) => requests.delete(`basket?productId=${id}&quantity=${quantity}`),
}

const Account = {
    login: (values: any) => requests.post("account/login",values),
    register: (values: any) => requests.post("account/register",values),
    currentUser: () => requests.get("account/currentUser"),
    fetchAddress: () => requests.get("account/savedAddress"),
}

const Orders = {
    list: () => requests.get("orders"),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post("orders",values)
}

const agent = {
    Catalog,
    TestErrors,
    Basket, 
    Account,
    Orders
}

export default agent;