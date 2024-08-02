import './App.css';
import {Suspense} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FallbackLoading from "./components/ui/FallbackLoading";
import Cafes from "./pages/Cafes";
import Employees from "./pages/Employees";
import EditCafe from "./pages/EditCafe";
import EditEmployee from "./pages/EditEmployee";
import Header from "./components/Header";

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
const theme = createTheme();

function App() {
  return (
      <div className="h-lvh">
          <Router>
              <Suspense fallback={<FallbackLoading />}>
                  <Header/>
                  <ThemeProvider theme={theme}>
                      <CssBaseline />
                      <Container className="p-2">
                          <Routes>
                              <Route  path="/" element={<Cafes />} />
                              <Route  path="/cafes" element={<Cafes />} />
                              <Route  path="/employees" element={<Employees />} />
                              <Route  path="/employees/:cafeId" element={<Employees />} />
                              <Route  path="/cafes/editCafe" element={<EditCafe />} />
                              <Route  path="/editCafe" element={<EditCafe />} />
                              <Route  path="/employees/editEmployee" element={<EditEmployee />} />
                          </Routes>
                      </Container>
                  </ThemeProvider>
              </Suspense>
          </Router>
      </div>
  );
}

export default App;
