import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {Button} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {useState} from "react";
import {RootState} from "../utils/types";
// Todo: change the menu to MUI
const Header = ()=> {
    const location = useLocation();
    const navigate = useNavigate()
    const isCafeChangeAvailable = useSelector((state: RootState) => state.cafes.changesAvailable);
    const isEmployeeChangeAvailable = useSelector((state: RootState) => state.employees.changesAvailable);
    const [dialog, setDialog] = useState({open: false, route: ""})

    const menu = [
        {
            route: "/cafes",
            name: "Cafés",
            default: true
        },
        {
            route: "/employees",
            name: "Employees",
            default: false
        }
    ];

    const navigateTo = (route: string) => {
        let isChange;
        switch (location.pathname) {
            case "/cafes/editCafe":
                isChange = isCafeChangeAvailable;
                break;
            case "/employees/editEmployee":
                isChange = isEmployeeChangeAvailable;
                break;
        }

        if (!isChange) {
            navigate(route);
        } else {
            setDialog({open: true, route: route});
        }
    };

    const handleClose = () => {
        setDialog({
            ...dialog,
            open: false
        });
    };

    const handleAgree = () => {
        navigate(dialog.route);
        handleClose();
    }

  return (
      <section className="flex justify-center font-bold bg-indigo-900 text-white">
          {menu.map(
              menuItem =>
                  <button onClick={() => navigateTo(menuItem.route)} key={menuItem.route} className={`p-4 hover:text-pink-300 ${location.pathname === menuItem.route || (location.pathname === "/" && menuItem.default) ? "menu-active" : "" }`}>{menuItem.name}</button>
          )}

          <Dialog
              open={dialog.open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
                  Unsaved Changes
              </DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                      <span>Unsaved changes available. You will loose your filled data if continue.</span>
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button variant="contained" onClick={handleClose}>Cancel</Button>
                  <Button variant="contained" color="error" onClick={handleAgree} autoFocus>
                      Continue
                  </Button>
              </DialogActions>
          </Dialog>
      </section>
  );
};

export default Header;