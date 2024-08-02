import { ChangeEvent, FocusEvent, useState } from "react";
import { TextField } from "@mui/material";

type Props = {
    id: string;
    defaultValue: string;
    label: string;
    minCharacters?: number;
    maxCharacters?: number;
    validateErrorMessage?: string;
    validate?: (value: string) => boolean;
    onBlur: (id: string, value: string) => void;
};

const TextBox = ({
                     id,
                     defaultValue,
                     label,
                     minCharacters,
                     maxCharacters,
                     validateErrorMessage,
                     validate,
                     onBlur,
                 }: Props) => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");
    const [value, setValue] = useState<string>(defaultValue);

    const basicValidate = (event: ChangeEvent<HTMLInputElement>) => {
        let errMessage: string | undefined = undefined;
        const { value } = event.target;

        if (minCharacters && value.length < minCharacters) {
            errMessage = `Enter minimum ${minCharacters} characters`;
        }

        if (maxCharacters && value.length > maxCharacters) {
            errMessage = `Characters should be less than ${maxCharacters}`;
        }

        if (!errMessage && validate && !validate(value)) {
            errMessage = validateErrorMessage;
        }

        setErrorMessage(errMessage);
        setValue(value);

        if (!errorMessage) {
            onBlur(event.target.id, value);
        } else {
            onBlur(event.target.id, "");
        }
    };

    const onBlurText = (event: FocusEvent<HTMLInputElement>) => {
        if (!errorMessage) {
            onBlur(event.target.id, value);
        } else {
            onBlur(event.target.id, "");
        }
    };

    return (
        <TextField
            error={!!errorMessage}
            id={id}
            label={label}
            value={value}
            helperText={errorMessage}
            variant="outlined"
            required
            onBlur={onBlurText}
            onChange={basicValidate}
        />
    );
};

export default TextBox;
