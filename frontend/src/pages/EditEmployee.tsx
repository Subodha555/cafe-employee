import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel
} from "@mui/material";

import TextBox from "../components/ui/TextBox";
import Dropdown from "../components/ui/Dropdown";

import { getCafesFetch } from "../store/redux/reducers/cafe";
import { postEmployeeFetch, putEmployeeFetch, setChangesAvailability } from "../store/redux/reducers/employee";
import { Option, RootState } from "../utils/types";

const EditEmployee = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const cafes = useSelector((state: RootState) => state.cafes.cafes);
    const isRequestPending = useSelector((state: RootState) => state.employees.isLoading);
    const isRequestSuccess = useSelector((state: RootState) => state.employees.editSuccess);
    const isRequestError = useSelector((state: RootState) => state.employees.error.isError);

    const [loading, setLoading] = useState(true);
    const [cafeOptions, setCafeOptions] = useState<Option[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        cafeId: ""
    });

    useEffect(() => {
        dispatch(setChangesAvailability(false));

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dispatch]);

    useEffect(() => {
        if (location.state) {
            setFormValues({
                name: location.state.name,
                email: location.state.email,
                phone: location.state.phone,
                gender: location.state.gender,
                cafeId: location.state.cafeDetails?.cafeId || ""
            });

            setIsEditMode(true);
        }
        setLoading(false);
    }, [location]);

    useEffect(() => {
        if (isRequestSent && isRequestSuccess) {
            window.setTimeout(() => {
                navigate("/employees");
            }, 1000);
        }
    }, [isRequestSuccess, isRequestSent, navigate]);

    useEffect(() => {
        const options = cafes.map((cafe) => ({
            id: cafe.cafeId,
            name: cafe.name
        }));
        setCafeOptions(options);
    }, [cafes]);

    useEffect(() => {
        dispatch(getCafesFetch(""));
    }, [dispatch]);

    const setSelectedFormValue = (id: string, value: string) => {
        setFormValues({
            ...formValues,
            [id]: value
        });

        dispatch(setChangesAvailability(true));
    };

    const onSelectGender = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFormValue("gender", event.target.value);
    };

    const onSelectCafe = (selectedValue: string) => {
        setSelectedFormValue("cafeId", selectedValue);
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (isEditMode) {
            dispatch(putEmployeeFetch({ reqData: formValues, employeeId: location.state.employeeId }));
        } else {
            dispatch(postEmployeeFetch(formValues));
        }

        setIsRequestSent(true);
    };

    const onValidateEmail = (email: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const onValidateSGPhone = (phoneNumber: string) => {
        const regex = /^[89]\d{7}$/;
        return regex.test(phoneNumber);
    };

    return (
        !loading && <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                '& .MuiTextField-root': { m: 2, width: '40ch' },
                '& .MuiFormControl-root': { m: 2, width: '40ch' },
            }}
            autoComplete="off"
            onSubmit={onSubmit}
        >
            <TextBox id="name" defaultValue={formValues.name} label="Employee Name" onBlur={setSelectedFormValue} />
            <TextBox id="email" defaultValue={formValues.email} label="Email" maxCharacters={256} onBlur={setSelectedFormValue} validate={onValidateEmail} validateErrorMessage="Should be a valid email"/>
            <TextBox id="phone" defaultValue={formValues.phone} label="Phone" maxCharacters={256} onBlur={setSelectedFormValue} validate={onValidateSGPhone} validateErrorMessage="Should be a valid SG number"/>
            <FormControl>
                <FormLabel id="gender-label">Gender</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="gender-label"
                    name="row-radio-buttons-group"
                    value={formValues.gender}
                    onChange={onSelectGender}
                >
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
            </FormControl>
            <Dropdown options={cafeOptions} id="cafeDropdown" placeholder="Cafe" onSelect={onSelectCafe} defaultSelectedValue={formValues.cafeId}/>

            {(!isRequestPending && isRequestSent && isRequestError) && <Typography color="error" className="flex items-center">Error in {isEditMode ? "updating" : "creating"}</Typography>}
            {(isRequestSent && isRequestSuccess && !isRequestPending) && <Typography className="flex items-center text-green-600">{isEditMode ? "Edited" : "Added"}  Successfully</Typography>}

            <div className="mt-10">
                <Link to="/employees">
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            marginRight: '5px'
                        }}
                    >
                        Cancel
                    </Button>
                </Link>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        marginLeft: '5px'
                    }}
                    type="submit"
                    disabled={!formValues.name || !formValues.email || !formValues.gender || !formValues.phone}
                >
                    {isEditMode ? "Edit" : "Add"} Employee
                </Button>
            </div>
            {isRequestPending && <CircularProgress className="absolute"/>}
        </Box>
    )
}

export default EditEmployee;