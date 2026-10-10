import {API_URL} from "./api";
const RequestPaths = {
    getEventsFromCity: (city) => `${API_URL}/events/city/${city}`
};

export default RequestPaths;