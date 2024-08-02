import {useState, useEffect, useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {Button, CircularProgress, Typography} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {AgGridReact} from "ag-grid-react";

import EditDelete from "../components/EditDelete";
import GridHeader from "../components/GridHeader";
import TwoRowGrid from "../components/TwoRowGrid";

import {getEmployeesFetch, deleteEmployeeFetch} from "../store/redux/reducers/employee";
import {Employee, RootState} from "../utils/types";
import {ColDef} from "ag-grid-community";


type DialogType = { open: boolean; data: { employeeId: string; name?: string; cafeDetails?: {name: string} } };


const Cafes = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const employees = useSelector((state: RootState) => state.employees.employees);
    const isLoading = useSelector((state: RootState) => state.employees.isLoading);
    const deleteSuccess = useSelector((state: RootState) => state.employees.deleteSuccess);

    const onClickDelete = (data: Employee) => {
        setDialog({open: true, data: data});
    };

    const onClickEdit = (data: Employee) => {
        navigate(`editEmployee`, {state: data});
    };

    const normalScreenColumnDef: ColDef<Employee>[] = [
        {field: 'employeeId', headerName: 'Employee Id', flex: 1,},
        {field: 'name', flex: 1},
        {field: 'email', headerName: 'Email Aaddress', flex: 1},
        {field: 'phone', headerName: 'Phone Number', flex: 1},
        {field: 'daysWorked', headerName: 'Days Worked', flex: 1, cellClass: 'text-right', headerClass: 'right-align-header', valueFormatter: (data) => data.value !== null ? data.value : "--"},
        {field: 'cafeDetails.name', headerName: 'Café Name', flex: 1, valueFormatter: (data) => data.value || "--"},
        {headerName: "", cellRenderer: EditDelete, cellRendererParams: {editAction: onClickEdit, deleteAction: onClickDelete}, flex:1, cellClass: "clickable-cell"}
    ];

    const smallScreenColumnDef: ColDef<Employee>[] = [
        { field: 'employeeId', headerComponent: GridHeader, headerComponentParams: {top: "Employee Id", bottom: "Name"}, cellRenderer: TwoRowGrid, cellRendererParams: {top: "employeeId", bottom: "name"}, flex: 2, rowSpan: ()=> 2, autoHeight: true },
        { field: 'email', headerComponent: GridHeader, headerComponentParams: {top: "Email", bottom: "Phone"}, cellRenderer: TwoRowGrid, cellRendererParams: {top: "email", bottom: "phone"}, flex: 2 },
        { field: 'daysWorked', headerComponent: GridHeader, headerComponentParams: {top: "Days Worked", bottom: "Café Name"}, cellRenderer: TwoRowGrid, cellRendererParams: {top: "daysWorked", bottom: "cafeDetails.name"}, flex: 2 },
        { headerName: "", cellRenderer: EditDelete, cellClass: "clickable-cell", cellRendererParams: { editAction: onClickEdit, deleteAction: onClickDelete } , rowSpan: ()=> 2, autoHeight: true, width: 85}
    ];

    const [rowData, setRowData] = useState<Employee[]>([]);
    const [dialog, setDialog] = useState<DialogType>({open: false, data: {employeeId: ""}});
    const [columnDefs, setColumnDefs] = useState<ColDef<Employee>[]>([]);

    const handleClose = useCallback(() => {
        setDialog({
            ...dialog,
            open: false
        });
    }, [dialog]);

    const onResize = (width: number) => {
        if (width < 888) {
            setColumnDefs(smallScreenColumnDef);
        } else {
            setColumnDefs(normalScreenColumnDef);
        }
    };

    useEffect(() => {
        onResize(window.innerWidth);

        const handleWindowResize = (e: UIEvent) => {
            const target = e.target as Window;
            onResize(target.innerWidth)
        };

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, []);

    useEffect(()=> {
        dispatch(getEmployeesFetch({cafeId: location.state?.cafeId}));
    }, [dispatch, location.state?.cafeId]);

    useEffect(() => {
        setRowData(employees);
    }, [employees]);

    useEffect(() => {
        if (deleteSuccess && dialog.open) {
            dispatch(getEmployeesFetch({cafeId: location.state?.cafeId}));
            handleClose();
        }
    }, [deleteSuccess, dialog.open, dispatch, handleClose, location.state?.cafeId]);

    const resetFilter = () => {
        dispatch(getEmployeesFetch(""));
        location.state = null;
    };

    const handleAgree = () => {
        if (dialog.data?.employeeId) {
            dispatch(deleteEmployeeFetch(dialog.data.employeeId))
        }
    };

    return (
        <section>
            <div className="flex justify-between h-[48px]">
                <Link to="editEmployee">
                    <Button
                        variant="contained"
                        color="primary">
                        Add Employee
                    </Button>
                </Link>
                {location.state?.cafeName &&
                    <div className="flex items-center">
                        <Typography variant="h5" sx={{marginRight: "5px"}} className="flex items-center">{location.state.cafeName} Employees</Typography>
                        <Button variant="contained"
                                color="secondary" onClick={resetFilter} className="h-[36px]">Reset</Button>
                    </div>
                }
            </div>
            <div className="mt-5 relative">
                <div
                    style={{ width: '100%', height: 500 }}
                    className="ag-theme-quartz ag-theme-alpine">
                    {(employees.length > 0 || !isLoading) && <AgGridReact rowData={rowData} columnDefs={columnDefs} />}
                </div>
                {isLoading && <CircularProgress className="absolute left-[50%] top-[50%] z-[10000]"/>}
            </div>
            <Dialog
                open={dialog.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Employee {dialog.data?.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <span>You are going to delete {dialog.data?.name}</span> <br/>
                        <span>Employee Id: {dialog.data?.employeeId}</span> <br/>
                        <span>Cafe: {dialog.data?.cafeDetails?.name}</span>
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