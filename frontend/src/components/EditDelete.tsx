import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


type Props = {
    data: {},
    editAction: (data: {}) => void,
    deleteAction: (data: {}) => void,
}

const EditDelete = (props: Props) => {
    return (
        <>
            <EditIcon color="primary" fontSize="small" sx={{marginRight: "10px"}} onClick={() => props.editAction(props.data)}/>
            <DeleteIcon color="error" fontSize="small" onClick={() => props.deleteAction(props.data)}/>
        </>
    );
};

export default EditDelete;