import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

const Settings = () => {
  const [settings, setSettings] = useState({
    workspaceName: "Default Workspace",
    primaryColor: "#2274A5",
    accentColor: "#FADF63",
    dedupeRule: "email",
    defaultColumns: ["full_name", "headline", "company", "location", "match_score"],
    defaultExportMapping: "Default CSV"
  });

  const [logoFile, setLogoFile] = useState(null);

  const handleSaveSettings = () => {
    // Simulate save
    toast.success("Settings updated successfully!");
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(URL.createObjectURL(file));
      toast.info("Logo uploaded (demo only - not saved)");
    }
  };

  const availableColumns = [
    { value: "full_name", label: "Full Name" },
    { value: "headline", label: "Headline" },
    { value: "company", label: "Company" },
    { value: "company_size", label: "Company Size" },
    { value: "industry", label: "Industry" },
    { value: "location", label: "Location" },
    { value: "match_score", label: "Match Score" },
    { value: "email_status", label: "Email Status" },
    { value: "connection_level", label: "Connection Level" },
    { value: "tags", label: "Tags" }
  ];

  const exportMappings = [
    "Default CSV",
    "HS Basic",
    "SF Standard",
    "Pipedrive Standard",
    "Custom Mapping 1"
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Configure your workspace preferences and defaults
        </p>
      </div>

      {/* Workspace Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={settings.workspaceName}
                onChange={(e) => setSettings({...settings, workspaceName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label>Workspace Logo</Label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                {logoFile ? (
                  <img src={logoFile} alt="Logo" className="h-14 w-14 rounded-md object-cover" />
                ) : (
                  <span className="text-white font-bold text-xl">S</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById('logo-upload').click()}>
                  <ApperIcon name="Upload" className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG up to 2MB (demo only)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color (Preview)</Label>
              <div className="flex items-center space-x-2">
                <div
                  className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: settings.accentColor }}
                />
                <Input
                  value={settings.accentColor}
                  disabled
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Accent color is fixed at #FADF63 for this prototype
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Default Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="dedupe-rule">Dedupe Rule</Label>
            <Select
              id="dedupe-rule"
              value={settings.dedupeRule}
              onChange={(e) => setSettings({...settings, dedupeRule: e.target.value})}
              className="mt-1"
            >
              <option value="email">Email Address</option>
              <option value="name_company">Name + Company</option>
              <option value="linkedin_url">LinkedIn URL</option>
              <option value="none">No Deduplication</option>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              How to identify duplicate leads during import
            </p>
          </div>

          <div>
            <Label>Default Table Columns</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableColumns.map((column) => (
                <label key={column.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.defaultColumns.includes(column.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings({
                          ...settings,
                          defaultColumns: [...settings.defaultColumns, column.value]
                        });
                      } else {
                        setSettings({
                          ...settings,
                          defaultColumns: settings.defaultColumns.filter(c => c !== column.value)
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {column.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="default-export">Default Export Mapping</Label>
            <Select
              id="default-export"
              value={settings.defaultExportMapping}
              onChange={(e) => setSettings({...settings, defaultExportMapping: e.target.value})}
              className="mt-1"
            >
              {exportMappings.map((mapping) => (
                <option key={mapping} value={mapping}>{mapping}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Shield" className="h-5 w-5 text-amber-500" />
            <span>Compliance & Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Prototype Disclaimer
                </h4>
                <p className="text-amber-700 dark:text-amber-300">
                  This is a UI prototype only. No actual LinkedIn scraping, data collection, or storage occurs. 
                  All data shown is mock data for demonstration purposes. Any real implementation would need 
                  to comply with LinkedIn's Terms of Service, GDPR, and other applicable regulations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="w-32">
          <ApperIcon name="Save" className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;