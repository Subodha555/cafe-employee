import cafeReducer from "./cafe";
import employeeReducer from "./employee";

const rootReducer = {
    cafes: cafeReducer,
    employees: employeeReducer
};

export default rootReducer;