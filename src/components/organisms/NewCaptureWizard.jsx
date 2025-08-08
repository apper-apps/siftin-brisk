import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Textarea from "@/components/atoms/Textarea";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ProgressIndicator from "@/components/molecules/ProgressIndicator";
import runsService from "@/services/api/runsService";
import leadsService from "@/services/api/leadsService";

const NewCaptureWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [criteria, setCriteria] = useState("");
  const [previewResults, setPreviewResults] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [runLabel, setRunLabel] = useState("");
  const [tags, setTags] = useState([]);

  const steps = ["Source", "AI Criteria", "Preview & Select", "Save & Export"];

  const quickCriteriaChips = [
    "US-based SDR managers at B2B SaaS (11–200), using HubSpot",
    "Founders in fintech, Series A–B, NYC or remote",
    "VP Sales at enterprise software companies (500+ employees)",
    "Revenue Operations leaders at high-growth SaaS companies"
  ];

  const validateUrl = (url) => {
    if (!url.trim()) {
      return "LinkedIn URL is required";
    }
    if (!url.includes("linkedin.com")) {
      return "Please enter a valid LinkedIn search URL";
    }
    return "";
  };

  const handleContinueFromSource = () => {
    const error = validateUrl(sourceUrl);
    setSourceError(error);
    if (!error) {
      setCurrentStep(2);
    }
  };

  const handlePreviewMatches = async () => {
    if (!criteria.trim()) {
      toast.error("Please enter your criteria first");
      return;
    }

    setLoading(true);
    try {
      // Get actual leads for preview
      const allLeads = await leadsService.getAll();
      
      // Simulate AI scoring
      const shuffled = [...allLeads].sort(() => 0.5 - Math.random());
      const preview = shuffled.slice(0, 8).map(lead => ({
        ...lead,
        match_score: Math.floor(Math.random() * 40) + 60, // 60-99
        match_reason: generateMatchReason(criteria, lead)
      }));
      
      setPreviewResults(preview);
      setCurrentStep(3);
    } catch (error) {
      toast.error("Failed to generate preview");
    } finally {
      setLoading(false);
    }
  };

  const generateMatchReason = (criteria, lead) => {
    const reasons = [
      `Matches "${criteria.split(" ")[0]}" criteria at ${lead.company}`,
      `Strong fit for ${lead.industry} industry requirements`,
      `${lead.headline} aligns with search criteria`,
      `Location and experience match criteria`,
      `Company size (${lead.company_size}) fits requirements`
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const handleSaveSelection = async () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select at least one lead");
      return;
    }

    const defaultLabel = `Run – ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    setRunLabel(defaultLabel);
    setCurrentStep(4);
  };

  const handleSaveRun = async () => {
    if (!runLabel.trim()) {
      toast.error("Please enter a run label");
      return;
    }

    setLoading(true);
    try {
      await runsService.create({
        label: runLabel,
        source_url: sourceUrl,
        criteria_text: criteria,
        found_count: previewResults.length,
        selected_count: selectedLeads.length,
        status: "Completed",
        created_by: "John Doe"
      });

      toast.success("Run saved successfully!");
      navigate("/runs");
    } catch (error) {
      toast.error("Failed to save run");
    } finally {
      setLoading(false);
    }
  };

  const toggleLeadSelection = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const selectAllLeads = () => {
    setSelectedLeads(previewResults.map(lead => lead.Id));
  };

  const deselectAllLeads = () => {
    setSelectedLeads([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          New Capture
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create a new LinkedIn lead capture run
        </p>
      </div>

      <ProgressIndicator 
        steps={steps} 
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step <= currentStep) setCurrentStep(step);
        }}
      />

      {/* Step 1: Source */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: LinkedIn Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="source-url">LinkedIn Search URL</Label>
              <Input
                id="source-url"
                placeholder="https://www.linkedin.com/search/results/people/..."
                value={sourceUrl}
                onChange={(e) => {
                  setSourceUrl(e.target.value);
                  if (sourceError) setSourceError("");
                }}
                className={sourceError ? "border-red-500" : ""}
              />
              {sourceError && (
                <p className="text-sm text-red-600 dark:text-red-400">{sourceError}</p>
              )}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <ApperIcon name="Info" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Example format:</p>
                  <code className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded">
                    https://www.linkedin.com/search/results/people/?keywords=SDR%20manager&geoUrn=%5B%22103644278%22%5D
                  </code>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleContinueFromSource}>
                Continue
                <ApperIcon name="ArrowRight" className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: AI Criteria */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Define AI Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="criteria">Describe the leads you want (natural language)</Label>
              <Textarea
                id="criteria"
                placeholder="e.g., US-based SDR managers at B2B SaaS companies with 11-200 employees, preferably using HubSpot or Salesforce..."
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label>Quick chips (click to insert):</Label>
              <div className="flex flex-wrap gap-2">
                {quickCriteriaChips.map((chip, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/50"
                    onClick={() => setCriteria(chip)}
                  >
                    {chip}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
              >
                <ApperIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handlePreviewMatches}
                disabled={loading || !criteria.trim()}
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Generating Preview...
                  </>
                ) : (
                  <>
                    Preview Matches
                    <ApperIcon name="ArrowRight" className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview & Select */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Step 3: Preview & Select Leads</CardTitle>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {previewResults.length} found • {selectedLeads.length} selected
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={selectAllLeads}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAllLeads}>
                    Deselect All
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {previewResults.map((lead) => (
                <div
                  key={lead.Id}
                  className={cn(
                    "flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-colors",
                    selectedLeads.includes(lead.Id)
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  )}
                  onClick={() => toggleLeadSelection(lead.Id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.Id)}
                    onChange={() => toggleLeadSelection(lead.Id)}
                    className="h-4 w-4"
                  />
                  <img
                    src={lead.profile_img}
                    alt={lead.full_name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {lead.full_name}
                      </h4>
                      <Badge variant="accent" className="text-xs">
                        {lead.match_score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lead.headline}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {lead.match_reason}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {lead.location}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(2)}
              >
                <ApperIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handleSaveSelection}
                disabled={selectedLeads.length === 0}
              >
                Save Selection
                <ApperIcon name="ArrowRight" className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Save & Export */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Save & Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="run-label">Run Label</Label>
              <Input
                id="run-label"
                value={runLabel}
                onChange={(e) => setRunLabel(e.target.value)}
                placeholder="Enter a name for this capture run"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Summary</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Source: {sourceUrl}</p>
                <p>Criteria: {criteria}</p>
                <p>Found: {previewResults.length} leads</p>
                <p>Selected: {selectedLeads.length} leads</p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(3)}
              >
                <ApperIcon name="ArrowLeft" className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleSaveRun}
                  disabled={loading}
                >
                  {loading ? (
                    <ApperIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ApperIcon name="Save" className="mr-2 h-4 w-4" />
                  )}
                  Save to Leads Library
                </Button>
                <Button onClick={handleSaveRun} disabled={loading}>
                  {loading ? (
                    <ApperIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ApperIcon name="Download" className="mr-2 h-4 w-4" />
                  )}
                  Save & Export...
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewCaptureWizard;