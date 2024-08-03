import {useState, forwardRef, useImperativeHandle} from "react";
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
    SelectChangeEvent,
} from "@mui/material";
import type { Option } from "../../utils/types";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

type Props = {
    id: string;
    placeholder: string;
    options: Option[];
    defaultSelectedValue: string;
    onSelect: (value: string) => void;
};

const Dropdown = forwardRef(
    ({ id, placeholder, options, defaultSelectedValue, onSelect }: Props, ref) => {
        const [selectedValue, setSelectedValue] = useState<string>(defaultSelectedValue);

        useImperativeHandle(ref, () => ({
            resetSelection() {
                setSelectedValue("");
                onSelect("");
            },
        }));

        const onChangeValue = (e: SelectChangeEvent<string>) => {
            const value = e.target.value;
            setSelectedValue(value);
            onSelect(value);
        };

        return (
            <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id={`${id}-label`}>{placeholder}</InputLabel>
                <Select
                    labelId={`${id}-label`}
                    value={selectedValue}
                    onChange={onChangeValue}
                    input={<OutlinedInput label={placeholder} />}
                    MenuProps={MenuProps}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {options.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
);

export default Dropdown;