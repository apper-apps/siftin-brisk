import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import NewCapture from "@/components/pages/NewCapture";
import Runs from "@/components/pages/Runs";
import Leads from "@/components/pages/Leads";
import Exports from "@/components/pages/Exports";
import Integrations from "@/components/pages/Integrations";
import Settings from "@/components/pages/Settings";
import Help from "@/components/pages/Help";
import RunDetails from "@/components/pages/RunDetails";
import { ThemeProvider } from "@/hooks/useTheme";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<NewCapture />} />
              <Route path="new-capture" element={<NewCapture />} />
              <Route path="runs" element={<Runs />} />
              <Route path="runs/:id" element={<RunDetails />} />
              <Route path="leads" element={<Leads />} />
              <Route path="exports" element={<Exports />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="z-[9999]"
          />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;