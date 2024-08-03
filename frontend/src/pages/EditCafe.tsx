import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, TextField, CircularProgress, Typography } from "@mui/material";
import CameraIcon from "@mui/icons-material/CameraAlt";

import TextBox from "../components/ui/TextBox";

import { postCafeFetch, putCafeFetch, setChangeAvailability } from "../store/redux/reducers/cafe";
import { RootState } from "../utils/types";

type FormValues = {
    name: string;
    description: string;
    logo: File | null;
    location: string;
};

const EditCafe = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isRequestPending = useSelector((state: RootState) => state.cafes.isLoading);
    const isRequestError = useSelector((state: RootState) => state.cafes.error.isError);
    const isRequestSuccess = useSelector((state: RootState) => state.cafes.editSuccess);

    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [imageErrorMsg, setImageErrorMsg] = useState("");
    const [showUploadedLogo, setShowUploadedLogo] = useState(false);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [formValues, setFormValues] = useState<FormValues>({
        name: "",
        description: "",
        logo: null,
        location: "",
    });

    useEffect(() => {
        dispatch(setChangeAvailability(false));

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [dispatch]);

    useEffect(() => {
        if (location.state) {
            setFormValues({
                name: location.state.name,
                description: location.state.description,
                location: location.state.location,
                logo: null,
            });

            setShowUploadedLogo(true);
            setIsEditMode(true);
        }
        setLoading(false);
    }, [location]);

    useEffect(() => {
        if (isRequestSent && isRequestSuccess) {
            window.setTimeout(() => {
                navigate("/cafes");
            }, 1000);
        }
    }, [isRequestSuccess, isRequestSent, navigate]);

    const onBlurText = (id: string, value: string | File | null) => {
        setFormValues({
            ...formValues,
            [id]: value,
        });

        dispatch(setChangeAvailability(true));
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("description", formValues.description);
        formData.append("location", formValues.location);

        const input = formValues.logo;
        if (input) {
            formData.append("image", input);
        }

        if (isEditMode) {
            dispatch(putCafeFetch({ reqData: formData, cafeId: location.state.cafeId }));
        } else {
            dispatch(postCafeFetch(formData));
        }

        setIsRequestSent(true);
    };

    const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;

        if (selectedFile) {
            setShowUploadedLogo(false);
            const isImage = selectedFile.type.startsWith("image/");
            const isValidSize = selectedFile.size <= 2 * 1024 * 1024;

            if (!isImage) {
                setImageErrorMsg("Selected file must be an image");
                onBlurText("logo", null);
            } else if (!isValidSize) {
                setImageErrorMsg("Selected file must be 2MB or less");
                onBlurText("logo", null);
            } else {
                setImageErrorMsg("");
                onBlurText("logo", selectedFile);
            }
        }
    };

    return (
        !loading && (
            <Box
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    "& .MuiTextField-root": { m: 2, width: "40ch" },
                }}
                autoComplete="off"
                onSubmit={onSubmit}
            >
                <div style={{ position: "relative" }}>
                    <TextField
                        id={"raised-button-file"}
                        sx={showUploadedLogo ? { display: "none" } : {}}
                        error={!!imageErrorMsg}
                        type="file"
                        onChange={onSelectFile}
                        helperText={imageErrorMsg}
                        inputProps={{ accept: "image/*" }}
                    />
                    {!showUploadedLogo && (
                        <label
                            htmlFor="raised-button-file"
                            style={{
                                position: "absolute",
                                left: 0,
                                margin: "16px",
                                width: "40ch",
                                textAlign: "center",
                            }}
                            className="bg-indigo-300 h-[55px] pt-4"
                        >
                            {formValues.logo ? `${formValues.logo.name}` : "Choose Logo"}
                            <CameraIcon color="primary" sx={{ marginLeft: "10px" }} onClick={() => {}} />
                        </label>
                    )}

                    {showUploadedLogo && (
                        <div style={{ position: "relative", width: "140px" }}>
                            <img src={location.state.logo} alt="uploaded-image" height="50px" />
                            <label htmlFor="raised-button-file">
                                <CameraIcon
                                    color="primary"
                                    sx={{ marginRight: "10px", position: "absolute", bottom: "0px", right: "0px" }}
                                    onClick={() => {}}
                                />
                            </label>
                        </div>
                    )}
                </div>
                <TextBox id="name" defaultValue={formValues.name} label="Café Name" minCharacters={6} maxCharacters={10} onBlur={onBlurText} />
                <TextBox id="description" defaultValue={formValues.description} label="Description" maxCharacters={256} onBlur={onBlurText} />
                <TextBox id="location" defaultValue={formValues.location} label="Location" onBlur={onBlurText} />

                {(!isRequestPending && isRequestSent && isRequestError) && (
                    <Typography sx={{}} color="error" className="flex items-center">
                        {isEditMode ? "Edit" : "Add"} failed
                    </Typography>
                )}
                {isRequestSent && isRequestSuccess && !isRequestPending && (
                    <Typography sx={{}} className="flex items-center text-green-600">
                        {isEditMode ? "Edited" : "Added"} Successfully
                    </Typography>
                )}
                <div className="mt-10">
                    <Link to="/cafes">
                        <Button variant="contained" color="error" sx={{ marginRight: "5px" }}>
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginLeft: "5px" }}
                        type="submit"
                        disabled={!formValues.name || !formValues.description || !(formValues.logo || showUploadedLogo) || !formValues.location}
                    >
                        {isEditMode ? "Edit" : "Add"} Café
                    </Button>
                </div>

                {isRequestPending && <CircularProgress className="absolute" />}
            </Box>
        )
    );
};

export default EditCafe;
