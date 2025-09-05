'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Upload, 
  Download, 
  Activity, 
  TrendingDown,
  Users,
  Zap,
  BarChart3,
  Map,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  ChevronRight,
  Sparkles,
  Shield,
  Target,
  IndianRupee,
  Clock,
  FileText,
  Brain,
  Gauge
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from 'recharts';

export default function TheftDetectionPage() {
  // State Management
  const [activeTab, setActiveTab] = useState('calculator');
  const [uploadedData, setUploadedData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('ensemble');
  const [utilityMetrics, setUtilityMetrics] = useState({
    consumers: '',
    atcLoss: 22,
    monthlyRevenue: '',
    state: 'Maharashtra',
    smartMeterCoverage: 45
  });
  const [suspiciousMeters, setSuspiciousMeters] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const fileInputRef = useRef(null);

  // Sample data for visualization
  const sampleTheftPatterns = [
    { time: '00:00', normal: 0.8, suspicious: 2.1 },
    { time: '03:00', normal: 0.6, suspicious: 2.8 },
    { time: '06:00', normal: 1.2, suspicious: 1.9 },
    { time: '09:00', normal: 2.4, suspicious: 1.2 },
    { time: '12:00', normal: 2.8, suspicious: 1.1 },
    { time: '15:00', normal: 2.6, suspicious: 1.3 },
    { time: '18:00', normal: 3.2, suspicious: 1.8 },
    { time: '21:00', normal: 2.1, suspicious: 2.4 },
  ];

  const riskDistribution = [
    { name: 'Critical', value: 12, color: '#ef4444' },
    { name: 'High', value: 28, color: '#f59e0b' },
    { name: 'Medium', value: 45, color: '#eab308' },
    { name: 'Low', value: 115, color: '#22c55e' },
  ];

  const neighborhoodComparison = [
    { subject: 'Night Usage', A: 120, B: 45, fullMark: 150 },
    { subject: 'Weekend Pattern', A: 98, B: 130, fullMark: 150 },
    { subject: 'Base Load', A: 86, B: 20, fullMark: 150 },
    { subject: 'Peak Hours', A: 99, B: 85, fullMark: 150 },
    { subject: 'Consistency', A: 85, B: 15, fullMark: 150 },
    { subject: 'Seasonal', A: 65, B: 90, fullMark: 150 },
  ];

  const monthlyTrend = [
    { month: 'Jan', detected: 45, recovered: 32, loss: 4.2 },
    { month: 'Feb', detected: 52, recovered: 41, loss: 3.8 },
    { month: 'Mar', detected: 61, recovered: 48, loss: 3.5 },
    { month: 'Apr', detected: 73, recovered: 58, loss: 3.1 },
    { month: 'May', detected: 89, recovered: 72, loss: 2.8 },
    { month: 'Jun', detected: 95, recovered: 78, loss: 2.5 },
  ];

  // Calculate potential savings
  const calculateSavings = () => {
    if (!utilityMetrics.consumers || !utilityMetrics.monthlyRevenue) return null;
    
    const consumers = parseInt(utilityMetrics.consumers.replace(/,/g, ''));
    const revenue = parseFloat(utilityMetrics.monthlyRevenue);
    const lossPercentage = utilityMetrics.atcLoss / 100;
    
    const currentLoss = revenue * lossPercentage;
    const potentialRecovery = currentLoss * 0.4; // 40% recovery potential
    const annualRecovery = potentialRecovery * 12;
    
    return {
      currentLoss: currentLoss.toFixed(2),
      monthlyRecovery: potentialRecovery.toFixed(2),
      annualRecovery: annualRecovery.toFixed(2),
      roiMonths: 3,
      detectionRate: 85,
      falsePositiveRate: 12
    };
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate parsing CSV
      setUploadedData({
        fileName: file.name,
        meters: 15420,
        readings: 445000,
        dateRange: 'Jan 2024 - Jun 2024'
      });
      
      // Trigger analysis
      setTimeout(() => {
        analyzeData();
      }, 500);
    }
  };

  // Simulate data analysis
  const analyzeData = () => {
    setIsAnalyzing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const mockResults = {
        totalMeters: 15420,
        suspiciousMeters: 743,
        criticalCases: 82,
        estimatedLoss: 4250000,
        recoveryPotential: 1700000,
        confidence: 87.3,
        patterns: [
          { type: 'Direct Hooking', count: 145, severity: 'high' },
          { type: 'Meter Bypass', count: 89, severity: 'critical' },
          { type: 'Meter Tampering', count: 234, severity: 'medium' },
          { type: 'Consumption Anomaly', count: 275, severity: 'low' }
        ]
      };
      
      setAnalysisResults(mockResults);
      generateSuspiciousMeters();
      setIsAnalyzing(false);
    }, 3000);
  };

  // Generate mock suspicious meters
  const generateSuspiciousMeters = () => {
    const meters = Array.from({ length: 20 }, (_, i) => ({
      id: `MTR${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      name: `Consumer ${i + 1}`,
      area: ['Pune', 'Mumbai', 'Nashik', 'Nagpur'][Math.floor(Math.random() * 4)],
      theftProbability: Math.random() * 60 + 40,
      pattern: ['Night consumption spike', 'Meter bypass detected', 'Sudden drop pattern', 'Inconsistent readings'][Math.floor(Math.random() * 4)],
      avgConsumption: Math.floor(Math.random() * 500) + 100,
      anomalyScore: Math.random() * 5 + 5,
      lastReading: '2 hours ago',
      status: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)],
      estimatedLoss: Math.floor(Math.random() * 50000) + 10000
    })).sort((a, b) => b.theftProbability - a.theftProbability);
    
    setSuspiciousMeters(meters);
  };

  // Export results
  const exportResults = () => {
    const dataStr = JSON.stringify(analysisResults, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'theft_analysis_results.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GridGuard AI</h1>
                <p className="text-sm text-gray-500">Smart Meter Theft Detection System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">System Active</span>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'calculator', label: 'ROI Calculator', icon: IndianRupee },
              { id: 'upload', label: 'Analyze Data', icon: Upload },
              { id: 'patterns', label: 'Theft Patterns', icon: Activity },
              { id: 'dashboard', label: 'Live Dashboard', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-1 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ROI Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Utility Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Consumers
                  </label>
                  <input
                    type="text"
                    value={utilityMetrics.consumers}
                    onChange={(e) => setUtilityMetrics({...utilityMetrics, consumers: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 500,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current AT&C Loss (%)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      value={utilityMetrics.atcLoss}
                      onChange={(e) => setUtilityMetrics({...utilityMetrics, atcLoss: parseFloat(e.target.value)})}
                      className="w-full"
                      min="5"
                      max="40"
                      step="0.5"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5%</span>
                      <span className="font-bold text-blue-600">{utilityMetrics.atcLoss}%</span>
                      <span>40%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Revenue (₹ Crores)
                  </label>
                  <input
                    type="text"
                    value={utilityMetrics.monthlyRevenue}
                    onChange={(e) => setUtilityMetrics({...utilityMetrics, monthlyRevenue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Region
                  </label>
                  <select
                    value={utilityMetrics.state}
                    onChange={(e) => setUtilityMetrics({...utilityMetrics, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                    <option>Gujarat</option>
                    <option>Uttar Pradesh</option>
                    <option>Tamil Nadu</option>
                    <option>Rajasthan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Smart Meter Coverage (%)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      value={utilityMetrics.smartMeterCoverage}
                      onChange={(e) => setUtilityMetrics({...utilityMetrics, smartMeterCoverage: parseFloat(e.target.value)})}
                      className="w-full"
                      min="0"
                      max="100"
                      step="5"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span className="font-bold text-blue-600">{utilityMetrics.smartMeterCoverage}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                  Calculate Savings
                </button>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-2 space-y-6">
              {calculateSavings() && (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Current Loss</p>
                          <p className="text-2xl font-bold text-red-600">₹{calculateSavings().currentLoss}Cr</p>
                          <p className="text-xs text-gray-400">Monthly</p>
                        </div>
                        <TrendingDown className="h-8 w-8 text-red-200" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Recovery Potential</p>
                          <p className="text-2xl font-bold text-green-600">₹{calculateSavings().monthlyRecovery}Cr</p>
                          <p className="text-xs text-gray-400">Monthly</p>
                        </div>
                        <Target className="h-8 w-8 text-green-200" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Annual Savings</p>
                          <p className="text-2xl font-bold text-blue-600">₹{calculateSavings().annualRecovery}Cr</p>
                          <p className="text-xs text-gray-400">Projected</p>
                        </div>
                        <IndianRupee className="h-8 w-8 text-blue-200" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">ROI Timeline</p>
                          <p className="text-2xl font-bold text-purple-600">{calculateSavings().roiMonths} Months</p>
                          <p className="text-xs text-gray-400">Payback Period</p>
                        </div>
                        <Clock className="h-8 w-8 text-purple-200" />
                      </div>
                    </div>
                  </div>

                  {/* Detection Performance Chart */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recovery Trend Analysis</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="detected" stackId="1" stroke="#3b82f6" fill="#93c5fd" name="Detected Cases" />
                        <Area type="monotone" dataKey="recovered" stackId="2" stroke="#10b981" fill="#86efac" name="Recovered Amount" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Comparison with Peers */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Industry Comparison</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm opacity-90">Your AT&C Loss</p>
                        <p className="text-2xl font-bold">{utilityMetrics.atcLoss}%</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">State Average</p>
                        <p className="text-2xl font-bold">18.5%</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Best in Class</p>
                        <p className="text-2xl font-bold">8.2%</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/10 rounded-lg">
                      <p className="text-sm">
                        <span className="font-semibold">Insight:</span> Your utility has {utilityMetrics.atcLoss > 18.5 ? 'higher' : 'lower'} losses than state average. 
                        With GridGuard AI, you can achieve best-in-class performance within 12-18 months.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Upload & Analysis Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Upload Section */}
            {!uploadedData && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="max-w-2xl mx-auto text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Meter Data</h2>
                  <p className="text-gray-500 mb-6">
                    Upload your smart meter data (CSV format) to detect theft patterns using our AI algorithms
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      Choose File
                    </button>
                    <button
                      onClick={() => {
                        setUploadedData({
                          fileName: 'sample_data.csv',
                          meters: 15420,
                          readings: 445000,
                          dateRange: 'Jan 2024 - Jun 2024'
                        });
                        analyzeData();
                      }}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Use Sample Data
                    </button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <Info className="inline h-4 w-4 mr-1" />
                      Your data is processed securely and never stored. Analysis happens in real-time.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">Analyzing Your Data</h3>
                  <p className="text-gray-500 text-center mb-4">Running multiple AI algorithms to detect theft patterns...</p>
                  
                  <div className="space-y-2">
                    {[
                      'Loading meter data...',
                      'Running Isolation Forest algorithm...',
                      'Analyzing consumption patterns...',
                      'Comparing with neighborhood baselines...',
                      'Calculating risk scores...'
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysisResults && !isAnalyzing && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <span className="text-xs text-gray-500">Total Analyzed</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{analysisResults.totalMeters.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">meters</p>
                  </div>

                  <div className="bg-red-50 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="text-xs text-red-600">Suspicious</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{analysisResults.suspiciousMeters}</p>
                    <p className="text-sm text-red-600">theft cases detected</p>
                  </div>

                  <div className="bg-yellow-50 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <IndianRupee className="h-5 w-5 text-yellow-600" />
                      <span className="text-xs text-yellow-600">Monthly Loss</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">₹{(analysisResults.estimatedLoss / 100000).toFixed(1)}L</p>
                    <p className="text-sm text-yellow-600">estimated</p>
                  </div>

                  <div className="bg-green-50 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <span className="text-xs text-green-600">Recovery</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">₹{(analysisResults.recoveryPotential / 100000).toFixed(1)}L</p>
                    <p className="text-sm text-green-600">potential</p>
                  </div>
                </div>

                {/* Suspicious Meters Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Top Suspicious Meters</h3>
                    <button
                      onClick={exportResults}
                      className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export Report</span>
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meter ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theft Pattern</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Loss</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {suspiciousMeters.slice(0, 10).map((meter, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">{meter.id}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meter.area}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{meter.pattern}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      meter.theftProbability > 70 ? 'bg-red-500' : 
                                      meter.theftProbability > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${meter.theftProbability}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {meter.theftProbability.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{(meter.estimatedLoss / 1000).toFixed(1)}K
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => {
                                  setSelectedMeter(meter);
                                  setShowDetailModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pattern Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {riskDistribution.map((item) => (
                        <div key={item.name} className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Confidence</h3>
                    <div className="flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        <svg className="w-48 h-48 transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            fill="none"
                          />
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 88 * analysisResults.confidence / 100} ${2 * Math.PI * 88}`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-gray-900">{analysisResults.confidence}%</span>
                          <span className="text-sm text-gray-500">Confidence</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Detection Rate</span>
                        <span className="font-medium text-gray-900">85%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">False Positives</span>
                        <span className="font-medium text-gray-900">12%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Algorithm</span>
                        <span className="font-medium text-gray-900">Ensemble ML</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && (
          <div className="space-y-6">
            {/* Pattern Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Direct Hooking',
                  description: 'Bypassing meter to draw power directly from lines',
                  indicators: ['Night consumption spikes', 'Zero readings during peak hours', 'Inconsistent base load'],
                  severity: 'critical',
                  frequency: '23% of cases',
                  icon: Zap
                },
                {
                  title: 'Meter Tampering',
                  description: 'Physical manipulation to slow down meter readings',
                  indicators: ['Too consistent readings', 'No seasonal variation', 'Lower than neighborhood average'],
                  severity: 'high',
                  frequency: '34% of cases',
                  icon: AlertCircle
                },
                {
                  title: 'Load Pattern Anomaly',
                  description: 'Unusual consumption patterns indicating theft',
                  indicators: ['Sudden consumption drops', 'Weekend higher than weekday', 'No correlation with weather'],
                  severity: 'medium',
                  frequency: '43% of cases',
                  icon: Activity
                }
              ].map((pattern, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${
                      pattern.severity === 'critical' ? 'bg-red-100' : 
                      pattern.severity === 'high' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <pattern.icon className={`h-6 w-6 ${
                        pattern.severity === 'critical' ? 'text-red-600' : 
                        pattern.severity === 'high' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      pattern.severity === 'critical' ? 'bg-red-100 text-red-700' : 
                      pattern.severity === 'high' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {pattern.severity.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pattern.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{pattern.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-gray-700 uppercase">Key Indicators:</p>
                    {pattern.indicators.map((indicator, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <span>{indicator}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Frequency</span>
                      <span className="font-medium text-gray-900">{pattern.frequency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Consumption Pattern Comparison */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Normal vs Suspicious Consumption Patterns</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sampleTheftPatterns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" label={{ value: 'Consumption (kWh)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="normal" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    name="Normal Pattern"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="suspicious" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#ef4444', r: 4 }}
                    name="Suspicious Pattern"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="inline h-4 w-4 mr-1" />
                  <span className="font-medium">Pattern Analysis:</span> The suspicious pattern shows high nighttime consumption 
                  (2-5 AM) and lower daytime usage, indicating possible direct hooking or meter bypass during off-peak hours.
                </p>
              </div>
            </div>

            {/* Neighborhood Comparison Radar */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood Comparison Analysis</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={neighborhoodComparison}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                  <PolarRadiusAxis angle={90} domain={[0, 150]} stroke="#6b7280" />
                  <Radar 
                    name="Normal Consumer" 
                    dataKey="A" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.3}
                  />
                  <Radar 
                    name="Suspicious Consumer" 
                    dataKey="B" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Live Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Active Meters', value: '524,321', change: '+2.3%', icon: Gauge, color: 'blue' },
                { label: 'Alerts Today', value: '147', change: '+12', icon: AlertTriangle, color: 'red' },
                { label: 'Cases Resolved', value: '89', change: '+5', icon: CheckCircle, color: 'green' },
                { label: 'Recovery Rate', value: '72%', change: '+3.2%', icon: Target, color: 'purple' }
              ].map((metric, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`h-5 w-5 text-${metric.color}-500`} />
                    <span className={`text-xs font-medium ${
                      metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Real-time Detection Feed */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Real-time Detection Feed</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">Live</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { time: '2 min ago', meter: 'MTR004521', pattern: 'Sudden consumption drop', risk: 'high' },
                  { time: '5 min ago', meter: 'MTR008934', pattern: 'Night consumption spike', risk: 'critical' },
                  { time: '8 min ago', meter: 'MTR002156', pattern: 'Meter tampering suspected', risk: 'medium' },
                  { time: '12 min ago', meter: 'MTR009871', pattern: 'Neighborhood outlier detected', risk: 'high' },
                  { time: '15 min ago', meter: 'MTR003421', pattern: 'Load pattern anomaly', risk: 'low' }
                ].map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.risk === 'critical' ? 'bg-red-500' :
                        alert.risk === 'high' ? 'bg-orange-500' :
                        alert.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{alert.meter}</p>
                        <p className="text-xs text-gray-500">{alert.pattern}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{alert.time}</p>
                      <span className={`text-xs font-medium ${
                        alert.risk === 'critical' ? 'text-red-600' :
                        alert.risk === 'high' ? 'text-orange-600' :
                        alert.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {alert.risk.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Alerts →
              </button>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Performance</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Isolation Forest', accuracy: 78, precision: 82 },
                    { name: 'Pattern Recognition', accuracy: 85, precision: 88 },
                    { name: 'Time Series Analysis', accuracy: 72, precision: 75 },
                    { name: 'Ensemble Model', accuracy: 91, precision: 93 }
                  ].map((algo, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{algo.name}</span>
                        <span className="text-gray-500">Accuracy: {algo.accuracy}%</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${algo.accuracy}%` }}
                          ></div>
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${algo.precision}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Monthly Impact Report</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Theft Cases Detected</span>
                    <span className="text-2xl font-bold">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Revenue Recovered</span>
                    <span className="text-2xl font-bold">₹3.2 Cr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Field Verifications</span>
                    <span className="text-2xl font-bold">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Success Rate</span>
                    <span className="text-2xl font-bold">87%</span>
                  </div>
                </div>
                <button className="w-full mt-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  Generate Full Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedMeter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Meter Analysis Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Meter Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Meter ID</p>
                  <p className="font-semibold text-gray-900">{selectedMeter.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">{selectedMeter.area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Risk Level</p>
                  <p className={`font-semibold ${
                    selectedMeter.status === 'critical' ? 'text-red-600' :
                    selectedMeter.status === 'high' ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    {selectedMeter.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Theft Probability</p>
                  <p className="font-semibold text-gray-900">{selectedMeter.theftProbability.toFixed(1)}%</p>
                </div>
              </div>

              {/* Pattern Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Detected Pattern</h4>
                <p className="text-sm text-gray-600">{selectedMeter.pattern}</p>
                <div className="mt-3 flex items-center space-x-4">
                  <div>
                    <span className="text-xs text-gray-500">Anomaly Score</span>
                    <p className="text-lg font-semibold text-gray-900">{selectedMeter.anomalyScore.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Estimated Monthly Loss</span>
                    <p className="text-lg font-semibold text-red-600">₹{(selectedMeter.estimatedLoss / 1000).toFixed(1)}K</p>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Recommended Action</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Schedule immediate field verification</li>
                  <li>• Check meter physical condition and seals</li>
                  <li>• Compare with neighborhood consumption</li>
                  <li>• Document evidence for legal action if theft confirmed</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                  Schedule Inspection
                </button>
                <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Flag for Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
