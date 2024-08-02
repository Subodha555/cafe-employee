import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCafesFetch, deleteCafeFetch } from "../store/redux/reducers/cafe";
import { useNavigate } from "react-router-dom";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

import EditDelete from "../components/EditDelete";
import { RootState, Cafe } from "../utils/types";
import {CellClickedEvent, ColDef} from "ag-grid-community";

type Props = {
    data: {
        logo: string;
    }
};

type DialogType = { open: boolean; data: { cafeId: string; name?: string; employeeCount?: number } };

const CustomImageComponent = (props: Props) => {
    return <img src={props.data.logo} alt="logo" className="object-contain h-full" />;
};

const Cafes = () => {
    const cafes = useSelector((state: RootState) => state.cafes.cafes);
    const deleteSuccess = useSelector((state: RootState) => state.cafes.deleteSuccess);
    const isLoading = useSelector((state: RootState) => state.cafes.isLoading);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rowData, setRowData] = useState<Cafe[]>([]);
    const [dialog, setDialog] = useState<DialogType>({ open: false, data: { cafeId: "" } });

    const onCellClicked = (event: CellClickedEvent<Cafe, any>) => {
        navigate(`/employees`, { state: { cafeId: event.data?.cafeId, cafeName: event.data?.name } });
    };

    const onClickDelete = (data: Cafe) => {
        setDialog({ open: true, data: data });
    };

    const onClickEdit = (data: Cafe) => {
        navigate(`editCafe`, { state: data });
    };

    const columnDefs: ColDef<Cafe>[] = [
        { field: 'logo', headerName: "", cellRenderer: CustomImageComponent, flex: 1 },
        { field: 'name', flex: 2 },
        { field: 'description', flex: 2 },
        { field: 'employeeCount', headerName: 'Employees', flex: 1, cellClass: 'clickable-cell text-right', headerClass: 'right-align-header', onCellClicked: onCellClicked },
        { field: 'location', flex: 2 },
        { headerName: "", cellRenderer: EditDelete, cellClass: "clickable-cell", cellRendererParams: { editAction: onClickEdit, deleteAction: onClickDelete }, flex: 1 }
    ];

    const handleClose = useCallback(() => {
        setDialog({
            ...dialog,
            open: false
        });
    }, [dialog]);

    useEffect(() => {
        dispatch(getCafesFetch(""));
    }, [dispatch]);

    useEffect(() => {
        setRowData(cafes);
    }, [cafes]);

    useEffect(() => {
        if (deleteSuccess && dialog.open) {
            dispatch(getCafesFetch(""));
            handleClose();
        }
    }, [deleteSuccess, dialog.open, dispatch, handleClose]);

    const onChangeLocation = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(getCafesFetch({ location: event.target.value }));
    };

    const handleAgree = () => {
        if (dialog.data?.cafeId) {
            dispatch(deleteCafeFetch(dialog.data.cafeId));
        }
    };

    return (
        <section>
            <div className="flex justify-between">
                <Link to="editCafe">
                    <Button variant="contained" color="primary">
                        Add Café
                    </Button>
                </Link>
                <TextField id="standard-basic" label="Filter By Location" onChange={onChangeLocation} variant="standard" />
            </div>
            <div className="mt-5 relative">
                <div style={{ width: '100%', height: 500 }} className="ag-theme-quartz ag-theme-alpine">
                    {(cafes.length > 0 || !isLoading) && <AgGridReact rowData={rowData} columnDefs={columnDefs} />}
                </div>
                {isLoading && <CircularProgress className="absolute left-[50%] top-[50%] z-[10000]" />}
            </div>
            <Dialog
                open={dialog.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Cafe {dialog.data?.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are going to delete cafe {dialog.data?.name}.
                        {dialog.data?.employeeCount !== undefined && dialog.data?.employeeCount > 0 && `You will lose ${dialog.data?.employeeCount} employees assigned to your cafe.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAgree} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
};

export default Cafes;
