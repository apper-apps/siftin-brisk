import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

const Help = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState([]);

  const gettingStartedSteps = [
    {
      id: 1,
      title: "Create Your First Capture",
      description: "Learn how to set up a LinkedIn search and define AI criteria",
      link: "/new-capture",
      icon: "Plus"
    },
    {
      id: 2,
      title: "Review Your Runs",
      description: "Monitor capture progress and manage your search history",
      link: "/runs", 
      icon: "Play"
    },
    {
      id: 3,
      title: "Manage Your Leads",
      description: "Filter, tag, and organize your captured leads",
      link: "/leads",
      icon: "Users"
    },
    {
      id: 4,
      title: "Export to CRM",
      description: "Send leads to your CRM or export as CSV files",
      link: "/exports",
      icon: "Download"
    },
    {
      id: 5,
      title: "Connect Integrations",
      description: "Set up HubSpot, Salesforce, and other CRM connections",
      link: "/integrations",
      icon: "Puzzle"
    },
    {
      id: 6,
      title: "Configure Settings",
      description: "Customize your workspace and set default preferences",
      link: "/settings",
      icon: "Settings"
    }
  ];

  const handleStepClick = (step) => {
    navigate(step.link);
  };

  const toggleStepComplete = (stepId) => {
    setCompletedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const completionPercentage = Math.round((completedSteps.length / gettingStartedSteps.length) * 100);

  const faqs = [
    {
      question: "What is Siftin?",
      answer: "Siftin is a LinkedIn lead capture and routing tool that helps sales teams identify, qualify, and export leads using AI-powered criteria matching."
    },
    {
      question: "How does the AI criteria work?",
      answer: "You describe your ideal leads in natural language (e.g., 'US-based SDR managers at B2B SaaS companies'), and our AI matches profiles based on titles, companies, industries, and locations."
    },
    {
      question: "Can I export leads to my CRM?",
      answer: "Yes! Siftin integrates with HubSpot, Salesforce, Pipedrive, and other popular CRM systems. You can also export as CSV files."
    },
    {
      question: "How do I avoid duplicate leads?",
      answer: "Siftin offers multiple deduplication rules including email address, name + company, and LinkedIn URL matching. Configure this in Settings."
    },
    {
      question: "What LinkedIn URLs are supported?",
      answer: "You can use any LinkedIn search results URL. Copy and paste the URL from your browser after performing a search on LinkedIn."
    },
    {
      question: "Is this demo functional?",
      answer: "This is a UI prototype with mock data. No actual LinkedIn scraping or data collection occurs. All features shown are for demonstration purposes only."
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Help & Getting Started
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Learn how to use Siftin to capture and route LinkedIn leads
        </p>
      </div>

      {/* Getting Started Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Getting Started Checklist</span>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {completedSteps.length} of {gettingStartedSteps.length} complete
              </div>
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gettingStartedSteps.map((step) => (
              <div
                key={step.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <button
                  onClick={() => toggleStepComplete(step.id)}
                  className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    completedSteps.includes(step.id)
                      ? "bg-primary-500 border-primary-500"
                      : "border-gray-300 dark:border-gray-600 hover:border-primary-400"
                  }`}
                >
                  {completedSteps.includes(step.id) && (
                    <ApperIcon name="Check" className="h-4 w-4 text-white" />
                  )}
                </button>
                
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <ApperIcon name={step.icon} className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStepClick(step)}
                >
                  <ApperIcon name="ArrowRight" className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
              onClick={() => navigate("/new-capture")}
            >
              <ApperIcon name="Plus" className="h-6 w-6 text-primary-500" />
              <span className="text-sm font-medium">Start New Capture</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
              onClick={() => navigate("/leads")}
            >
              <ApperIcon name="Users" className="h-6 w-6 text-primary-500" />
              <span className="text-sm font-medium">Browse Leads</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
              onClick={() => navigate("/integrations")}
            >
              <ApperIcon name="Puzzle" className="h-6 w-6 text-primary-500" />
              <span className="text-sm font-medium">Setup Integrations</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </h4>
                  <ApperIcon
                    name={expandedFaq === index ? "ChevronUp" : "ChevronDown"}
                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  />
                </button>
                {expandedFaq === index && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="MessageCircle" className="h-5 w-5" />
            <span>Need More Help?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Can't find what you're looking for? This is a demo interface, but in a real application you would have access to:
          </p>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Mail" className="h-4 w-4" />
              <span>Email support at help@siftin.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="MessageSquare" className="h-4 w-4" />
              <span>Live chat support</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Book" className="h-4 w-4" />
              <span>Comprehensive documentation</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Video" className="h-4 w-4" />
              <span>Video tutorials and training</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;