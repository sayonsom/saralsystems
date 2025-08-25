"use client";

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Building,
  Shield,
  AlertTriangle,
  Sun,
  Server,
  CreditCard,
  Settings,
  BarChart3,
  Layers,
  Clock,
  Percent,
} from 'lucide-react';

function DataCenterAnalysisTool() {
  const [activeTab, setActiveTab] = useState('executive');

  const [savedScenarios, setSavedScenarios] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState([]);

  const [projectInputs, setProjectInputs] = useState({
    projectName: 'New Data Center Project',
    location: 'usa',
    state: 'virginia',
    indianState: 'maharashtra',
    tier: 3,
    deploymentModel: 'traditional',
    businessModel: 'colocation',
    facilitySize: 50000,
    raisedFloorArea: 25000,
    itLoad: 10,
    totalPower: 15,
    rackCount: 500,
    averageRackDensity: 20,
    targetPUE: 1.4,
    targetWUE: 1.8,
    coolingType: 'air',
    landCost: 150,
    constructionCost: 1500,
    fitOutCost: 2000,
    electricityCost: 0.07,
    waterCost: 3.5,
    discountRate: 10,
    corporateTaxRate: 21,
    targetIRR: 15,
    debtRatio: 60,
    interestRate: 6.5,
    loanTerm: 10,
    pricingModel: 'power',
    basePrice: 150,
    annualEscalation: 3,
    contractLength: 5,
    targetUtilization: 85,
    rampPeriod: 36,
    customerMix: { enterprise: 40, cloudProviders: 30, aiCompanies: 20, other: 10 },
    staffingModel: 'standard',
    maintenanceStrategy: 'balanced',
    insuranceCoverage: 'comprehensive',
    complianceLevel: 'tier3',
    renewableTarget: 50,
    carbonNeutralTarget: 2030,
    wasteHeatRecovery: false,
    batteryStorage: false,
    solarCapacity: 0,
    inflationRate: 3,
    energyPriceVolatility: 15,
    demandUncertainty: 20,
    constructionDelayRisk: 'medium',
    aiOptimization: true,
    edgeNodes: 0,
    interconnectionDensity: 'high',
    disasterRecovery: 'warm',
  });

  const [taxConfig, setTaxConfig] = useState({
    federalRate: 21,
    stateRate: 6,
    depreciation: {
      method: 'MACRS',
      serverLife: 5,
      infrastructureLife: 15,
      buildingLife: 39,
      bonusDepreciation: 100,
    },
    incentives: {
      renewable: 30,
      localGrants: 0,
      propertyTaxAbatement: 0,
      salesTaxExemption: false,
      sezBenefits: false,
    },
  });

  const [financialMetrics, setFinancialMetrics] = useState({
    totalCapex: 0,
    landAcquisition: 0,
    construction: 0,
    powerInfrastructure: 0,
    coolingInfrastructure: 0,
    itEquipment: 0,
    networkInfrastructure: 0,
    securitySystems: 0,
    softCosts: 0,
    contingency: 0,
    totalOpex: 0,
    electricity: 0,
    water: 0,
    staffing: 0,
    maintenance: 0,
    insurance: 0,
    property: 0,
    compliance: 0,
    bandwidth: 0,
    marketing: 0,
    annualRevenue: 0,
    recurringRevenue: 0,
    interconnectionRevenue: 0,
    managedServices: 0,
    npv: 0,
    irr: 0,
    paybackPeriod: 0,
    roi: 0,
    ebitda: 0,
    ebitdaMargin: 0,
    dscr: 0,
    valueAtRisk: 0,
    worstCaseNPV: 0,
    bestCaseNPV: 0,
    probabilityOfSuccess: 0,
  });

  // Add simulation results state
  const [simulationResults, setSimulationResults] = useState({
    iterations: 0,
    npvValues: [],
    irrValues: [],
    paybackValues: [],
    pSuccess: 0,
    worstNPV: 0,
    bestNPV: 0,
    medianNPV: 0,
  });

  const tierSpecifications = {
    1: { uptime: 99.671, redundancy: 'N', costMultiplier: 1.0, capexPerMW: 11.5 },
    2: { uptime: 99.741, redundancy: 'N+1', costMultiplier: 1.3, capexPerMW: 12.5 },
    3: { uptime: 99.982, redundancy: 'N+1', costMultiplier: 1.6, capexPerMW: 23 },
    4: { uptime: 99.995, redundancy: '2N+1', costMultiplier: 2.0, capexPerMW: 25 },
  };

  const locationFactors = {
    usa: {
      virginia: { powerCost: 0.07, landCost: 150, laborIndex: 1.0, taxRate: 6 },
      texas: { powerCost: 0.085, landCost: 100, laborIndex: 0.95, taxRate: 0 },
      california: { powerCost: 0.15, landCost: 300, laborIndex: 1.3, taxRate: 8.84 },
      oregon: { powerCost: 0.06, landCost: 120, laborIndex: 1.1, taxRate: 0 },
      illinois: { powerCost: 0.09, landCost: 140, laborIndex: 1.05, taxRate: 4.95 },
    },
    india: {
      maharashtra: { powerCost: 0.08, landCost: 50, laborIndex: 0.3, taxRate: 0 },
      karnataka: { powerCost: 0.075, landCost: 45, laborIndex: 0.28, taxRate: 0 },
      tamilnadu: { powerCost: 0.07, landCost: 40, laborIndex: 0.25, taxRate: 0 },
      telangana: { powerCost: 0.065, landCost: 55, laborIndex: 0.27, taxRate: 0 },
      delhi: { powerCost: 0.09, landCost: 100, laborIndex: 0.35, taxRate: 0 },
    },
  };

  const calculateDetailedCapex = () => {
    const tier = tierSpecifications[projectInputs.tier];
    const location =
      projectInputs.location === 'usa'
        ? locationFactors.usa[projectInputs.state]
        : locationFactors.india[projectInputs.indianState];

    const landSize = projectInputs.facilitySize * 2;
    const landAcquisition = landSize * location.landCost;

    const shellConstruction = projectInputs.facilitySize * projectInputs.constructionCost * tier.costMultiplier;
    const dataHallFitOut = projectInputs.raisedFloorArea * projectInputs.fitOutCost * tier.costMultiplier;

    const utilityConnection = projectInputs.totalPower * 500000;
    const switchgear = projectInputs.totalPower * 300000 * tier.costMultiplier;
    const ups = projectInputs.itLoad * 800000 * tier.costMultiplier;
    const generators = projectInputs.totalPower * 400000 * tier.costMultiplier;
    const powerDistribution = projectInputs.rackCount * 5000 * tier.costMultiplier;

    let coolingCost = projectInputs.itLoad * 1500000 * tier.costMultiplier;
    if (projectInputs.coolingType === 'liquid') coolingCost *= 1.5;
    else if (projectInputs.coolingType === 'hybrid') coolingCost *= 1.25;

    const rackInfra = projectInputs.rackCount * 8000;
    const networkCore = projectInputs.itLoad * 500000;
    const cabling = projectInputs.raisedFloorArea * 50;

    const physicalSecurity = projectInputs.facilitySize * 25;
    const dcim = projectInputs.itLoad * 100000;
    const fireSupression = projectInputs.raisedFloorArea * 40;

    const design = (shellConstruction + dataHallFitOut) * 0.08;
    const permits = projectInputs.location === 'usa' ? 250000 : 100000;
    const commissioning = projectInputs.itLoad * 150000;
    const projectManagement = (shellConstruction + dataHallFitOut) * 0.05;

    const contingencyRate =
      projectInputs.constructionDelayRisk === 'high' ? 0.2 : projectInputs.constructionDelayRisk === 'medium' ? 0.15 : 0.1;

    const subtotal =
      landAcquisition +
      shellConstruction +
      dataHallFitOut +
      utilityConnection +
      switchgear +
      ups +
      generators +
      powerDistribution +
      coolingCost +
      rackInfra +
      networkCore +
      cabling +
      physicalSecurity +
      dcim +
      fireSupression +
      design +
      permits +
      commissioning +
      projectManagement;

    const contingency = subtotal * contingencyRate;
    const totalCapex = subtotal + contingency;

    let additionalCapex = 0;
    if (projectInputs.solarCapacity > 0) additionalCapex += projectInputs.solarCapacity * 1430000;
    if (projectInputs.batteryStorage) additionalCapex += projectInputs.itLoad * 0.5 * 400000;
    if (projectInputs.wasteHeatRecovery) additionalCapex += projectInputs.itLoad * 0.3 * 1000000;

    return {
      landAcquisition,
      construction: shellConstruction + dataHallFitOut,
      powerInfrastructure: utilityConnection + switchgear + ups + generators + powerDistribution,
      coolingInfrastructure: coolingCost,
      itEquipment: rackInfra + networkCore + cabling,
      securitySystems: physicalSecurity + dcim + fireSupression,
      softCosts: design + permits + commissioning + projectManagement,
      contingency,
      additionalCapex,
      totalCapex: totalCapex + additionalCapex,
    };
  };

  const calculateDetailedOpex = () => {
    const location =
      projectInputs.location === 'usa'
        ? locationFactors.usa[projectInputs.state]
        : locationFactors.india[projectInputs.indianState];

    const annualPowerConsumption = projectInputs.itLoad * projectInputs.targetPUE * 8760 * 1000;
    const electricityCost = annualPowerConsumption * projectInputs.electricityCost;

    const annualWaterUsage = projectInputs.itLoad * projectInputs.targetWUE * 8760 * 1000;
    const waterCost = (annualWaterUsage / 3785) * (projectInputs.waterCost / 1000);

    const ftePerMW = projectInputs.tier >= 3 ? 1.8 : 1.2;
    const totalFTE = Math.ceil(projectInputs.itLoad * ftePerMW);
    const avgSalary = projectInputs.location === 'usa' ? 85000 : 25000;
    const staffingCost = totalFTE * avgSalary * location.laborIndex * 1.3;

    const capexValue = calculateDetailedCapex().totalCapex;
    const maintenanceCost = capexValue * 0.03;

    const insuranceRate = projectInputs.insuranceCoverage === 'comprehensive' ? 0.012 : projectInputs.insuranceCoverage === 'standard' ? 0.008 : 0.005;
    const insuranceCost = capexValue * insuranceRate;

    const propertyTax = projectInputs.location === 'usa' ? capexValue * 0.015 : capexValue * 0.005;
    const lease = 0;

    const complianceCost =
      projectInputs.complianceLevel === 'tier4' ? 500000 : projectInputs.complianceLevel === 'tier3' ? 300000 : projectInputs.complianceLevel === 'standard' ? 150000 : 50000;

    const bandwidthCost = projectInputs.itLoad * 50000;

    const marketingCost = projectInputs.businessModel === 'colocation' ? projectInputs.rackCount * 1000 : projectInputs.itLoad * 100000;

    return {
      electricity: electricityCost,
      water: waterCost,
      staffing: staffingCost,
      maintenance: maintenanceCost,
      insurance: insuranceCost,
      property: propertyTax + lease,
      compliance: complianceCost,
      bandwidth: bandwidthCost,
      marketing: marketingCost,
      totalOpex:
        electricityCost +
        waterCost +
        staffingCost +
        maintenanceCost +
        insuranceCost +
        propertyTax +
        lease +
        complianceCost +
        bandwidthCost +
        marketingCost,
    };
  };

  const calculateRevenue = () => {
    let baseRevenue = 0;
    let interconnectionRevenue = 0;
    let managedServicesRevenue = 0;

    if (projectInputs.businessModel === 'colocation') {
      const utilizablePower = projectInputs.itLoad * 0.85;
      const avgUtilization = projectInputs.targetUtilization / 100;
      const monthlyPowerRevenue = utilizablePower * 1000 * projectInputs.basePrice * avgUtilization;
      baseRevenue = monthlyPowerRevenue * 12;

      const crossConnects = projectInputs.rackCount * 4;
      const crossConnectPrice = projectInputs.location === 'usa' ? 300 : 150;
      interconnectionRevenue = crossConnects * crossConnectPrice * 12 * avgUtilization;

      managedServicesRevenue = baseRevenue * 0.15;
    } else if (projectInputs.businessModel === 'hyperscale') {
      const pricePerMW = projectInputs.location === 'usa' ? 1500000 : 800000;
      baseRevenue = projectInputs.itLoad * pricePerMW * (projectInputs.targetUtilization / 100);
    } else if (projectInputs.businessModel === 'edge') {
      const edgePremium = 1.5;
      const monthlyRackRevenue = 5000 * edgePremium;
      baseRevenue = projectInputs.rackCount * monthlyRackRevenue * 12 * (projectInputs.targetUtilization / 100);
    }

    const aiPremium = (projectInputs.customerMix.aiCompanies / 100) * 0.5;
    baseRevenue *= 1 + aiPremium;

    return {
      recurring: baseRevenue,
      interconnection: interconnectionRevenue,
      managedServices: managedServicesRevenue,
      total: baseRevenue + interconnectionRevenue + managedServicesRevenue,
    };
  };

  const generateCashFlows = (capex, opex, revenue) => {
    const cashFlows = [-capex];
    const rampMonths = projectInputs.rampPeriod;

    for (let year = 1; year <= 10; year++) {
      let yearlyRevenue = revenue;
      let yearlyOpex = opex;

      if (year <= Math.ceil(rampMonths / 12)) {
        const rampProgress = Math.min(1, (year * 12) / rampMonths);
        yearlyRevenue *= rampProgress;
      }

      yearlyRevenue *= Math.pow(1 + projectInputs.annualEscalation / 100, year - 1);
      yearlyOpex *= Math.pow(1 + projectInputs.inflationRate / 100, year - 1);

      const ebitda = yearlyRevenue - yearlyOpex;

      const depreciation = calculateDepreciation(capex, year);
      const taxableIncome = ebitda - depreciation;
      const effectiveTaxRate = (taxConfig.federalRate + taxConfig.stateRate) / 100;
      const taxes = Math.max(0, taxableIncome * effectiveTaxRate);

      const fcf = ebitda - taxes;
      cashFlows.push(fcf);
    }

    return cashFlows;
  };

  const calculateDepreciation = (capex, year) => {
    const equipmentCapex = capex * 0.4;
    const infrastructureCapex = capex * 0.4;
    const buildingCapex = capex * 0.2;

    const macrs5 = [0.2, 0.32, 0.192, 0.1152, 0.1152, 0.0576];
    const macrs15 = [
      0.05,
      0.095,
      0.0855,
      0.077,
      0.0693,
      0.0623,
      0.059,
      0.059,
      0.0591,
      0.059,
      0.0591,
      0.059,
      0.0591,
      0.059,
      0.0591,
      0.0295,
    ];

    let depreciation = 0;

    if (year <= 6) depreciation += equipmentCapex * macrs5[year - 1];
    if (year <= 16) depreciation += infrastructureCapex * macrs15[year - 1];
    depreciation += buildingCapex / 39;

    if (year === 1 && taxConfig.depreciation.bonusDepreciation > 0) {
      depreciation += (equipmentCapex + infrastructureCapex) * (taxConfig.depreciation.bonusDepreciation / 100 - macrs5[0] - macrs15[0]);
    }

    return depreciation;
  };

  const calculateNPV = (cashFlows, discountRate) => {
    return cashFlows.reduce((npv, cf, year) => npv + cf / Math.pow(1 + discountRate, year), 0);
  };

  const calculateIRR = (cashFlows) => {
    let rate = 0.1;
    const tolerance = 0.00001;
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let dnpv = 0;
      for (let j = 0; j < cashFlows.length; j++) {
        npv += cashFlows[j] / Math.pow(1 + rate, j);
        dnpv -= (j * cashFlows[j]) / Math.pow(1 + rate, j + 1);
      }
      const newRate = rate - npv / dnpv;
      if (Math.abs(newRate - rate) < tolerance) return newRate * 100;
      rate = newRate;
    }

    return rate * 100;
  };

  const calculatePayback = (cashFlows) => {
    let cumulative = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      cumulative += cashFlows[i];
      if (cumulative > 0) return i - (cumulative - cashFlows[i]) / cashFlows[i];
    }
    return cashFlows.length;
  };

  // Monte Carlo simulation for risk analysis
  const runMonteCarloSimulation = (iterations = 1000) => {
    const npvValues = [];
    const irrValues = [];
    const paybackValues = [];

    for (let i = 0; i < iterations; i++) {
      const demandVariation = 1 + (Math.random() - 0.5) * (projectInputs.demandUncertainty / 100);
      const energyPriceVariation = 1 + (Math.random() - 0.5) * (projectInputs.energyPriceVolatility / 100);
      const constructionCostVariation = 1 + Math.random() * 0.2; // up to +20%

      const adjustedRevenue = calculateRevenue().total * demandVariation;
      const adjustedOpex = calculateDetailedOpex().totalOpex * energyPriceVariation;
      const adjustedCapex = calculateDetailedCapex().totalCapex * constructionCostVariation;

      const cashFlows = generateCashFlows(adjustedCapex, adjustedOpex, adjustedRevenue);
      const npv = calculateNPV(cashFlows, projectInputs.discountRate / 100);
      const irr = calculateIRR(cashFlows);
      const payback = calculatePayback(cashFlows);

      npvValues.push(npv);
      irrValues.push(irr);
      paybackValues.push(payback);
    }

    const sorted = [...npvValues].sort((a, b) => a - b);
    const medianNPV = sorted[Math.floor(sorted.length / 2)] || 0;
    const worstNPV = sorted[0] || 0;
    const bestNPV = sorted[sorted.length - 1] || 0;
    const pSuccess = npvValues.length ? (npvValues.filter((v) => v > 0).length / npvValues.length) * 100 : 0;

    setSimulationResults({
      iterations,
      npvValues,
      irrValues,
      paybackValues,
      pSuccess,
      worstNPV,
      bestNPV,
      medianNPV,
    });

    setFinancialMetrics((prev) => ({
      ...prev,
      worstCaseNPV: worstNPV,
      bestCaseNPV: bestNPV,
      probabilityOfSuccess: pSuccess,
      valueAtRisk: Math.min(0, medianNPV),
    }));
  };

  useEffect(() => {
    const capex = calculateDetailedCapex();
    const opex = calculateDetailedOpex();
    const revenue = calculateRevenue();
    const cashFlows = generateCashFlows(capex.totalCapex, opex.totalOpex, revenue.total);

    const npv = calculateNPV(cashFlows, projectInputs.discountRate / 100);
    const irr = calculateIRR(cashFlows);
    const payback = calculatePayback(cashFlows);
    const roi = ((revenue.total * 10 - capex.totalCapex) / capex.totalCapex) * 100;
    const ebitda = revenue.total - opex.totalOpex;
    const ebitdaMargin = revenue.total > 0 ? (ebitda / revenue.total) * 100 : 0;

    const debtService =
      projectInputs.debtRatio > 0
        ? (capex.totalCapex * projectInputs.debtRatio) / 100 * (projectInputs.interestRate / 100 + 1 / projectInputs.loanTerm)
        : 0;
    const dscr = debtService > 0 ? ebitda / debtService : 0;

    setFinancialMetrics((prev) => ({
      ...prev,
      ...capex,
      ...opex,
      annualRevenue: revenue.total,
      recurringRevenue: revenue.recurring,
      interconnectionRevenue: revenue.interconnection,
      managedServices: revenue.managedServices,
      npv,
      irr,
      paybackPeriod: payback,
      roi,
      ebitda,
      ebitdaMargin,
      dscr,
      valueAtRisk: 0,
      worstCaseNPV: 0,
      bestCaseNPV: 0,
      probabilityOfSuccess: 0,
    }));
  }, [projectInputs, taxConfig]);

  const ExecutiveSummary = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Net Present Value</p>
              <p className="text-3xl font-bold">${(financialMetrics.npv / 1000000).toFixed(1)}M</p>
              <p className="text-blue-100 text-xs mt-1">{financialMetrics.npv > 0 ? 'Positive NPV' : 'Negative NPV'}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Internal Rate of Return</p>
              <p className="text-3xl font-bold">{financialMetrics.irr.toFixed(1)}%</p>
              <p className="text-green-100 text-xs mt-1">Target: {projectInputs.targetIRR}%</p>
            </div>
            <Percent className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Payback Period</p>
              <p className="text-3xl font-bold">{financialMetrics.paybackPeriod.toFixed(1)}</p>
              <p className="text-purple-100 text-xs mt-1">Years</p>
            </div>
            <Clock className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">EBITDA Margin</p>
              <p className="text-3xl font-bold">{financialMetrics.ebitdaMargin.toFixed(1)}%</p>
              <p className="text-orange-100 text-xs mt-1">${(financialMetrics.ebitda / 1000000).toFixed(1)}M Annual</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Project Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold">
              {projectInputs.location === 'usa' ? projectInputs.state : projectInputs.indianState}
              {projectInputs.location === 'usa' ? ', USA' : ', India'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tier Level</p>
            <p className="font-semibold">Tier {projectInputs.tier}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">IT Load</p>
            <p className="font-semibold">{projectInputs.itLoad} MW</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Business Model</p>
            <p className="font-semibold capitalize">{projectInputs.businessModel}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Capital Investment Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Land', value: financialMetrics.landAcquisition },
                  { name: 'Construction', value: financialMetrics.construction },
                  { name: 'Power Infra', value: financialMetrics.powerInfrastructure },
                  { name: 'Cooling', value: financialMetrics.coolingInfrastructure },
                  { name: 'IT Equipment', value: financialMetrics.itEquipment },
                  { name: 'Other', value: financialMetrics.securitySystems + financialMetrics.softCosts },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">10-Year Cash Flow Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={(() => {
                const capex = calculateDetailedCapex();
                const opex = calculateDetailedOpex();
                const revenue = calculateRevenue();
                const cashFlows = generateCashFlows(capex.totalCapex, opex.totalOpex, revenue.total);
                return cashFlows.map((cf, index) => ({
                  year: index === 0 ? 'Initial' : `Year ${index}`,
                  cashFlow: cf / 1000000,
                  cumulative: cashFlows.slice(0, index + 1).reduce((a, b) => a + b, 0) / 1000000,
                }));
              })()}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(1)}M`} />
              <Legend />
              <Line type="monotone" dataKey="cashFlow" stroke="#3B82F6" name="Annual Cash Flow" />
              <Line type="monotone" dataKey="cumulative" stroke="#10B981" name="Cumulative" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Analysis Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="text-sm text-gray-600">Construction Risk</p>
            <p className="font-semibold capitalize">{projectInputs.constructionDelayRisk}</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600">Demand Uncertainty</p>
            <p className="font-semibold">{projectInputs.demandUncertainty}%</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <p className="text-sm text-gray-600">Energy Price Volatility</p>
            <p className="font-semibold">{projectInputs.energyPriceVolatility}%</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectConfiguration = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={projectInputs.projectName}
              onChange={(e) => setProjectInputs({ ...projectInputs, projectName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              value={projectInputs.location}
              onChange={(e) => setProjectInputs({ ...projectInputs, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="usa">United States</option>
              <option value="india">India</option>
            </select>
          </div>

          {projectInputs.location === 'usa' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={projectInputs.state}
                onChange={(e) => setProjectInputs({ ...projectInputs, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="virginia">Virginia</option>
                <option value="texas">Texas</option>
                <option value="california">California</option>
                <option value="oregon">Oregon</option>
                <option value="illinois">Illinois</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={projectInputs.indianState}
                onChange={(e) => setProjectInputs({ ...projectInputs, indianState: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="maharashtra">Maharashtra</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamilnadu">Tamil Nadu</option>
                <option value="telangana">Telangana</option>
                <option value="delhi">Delhi NCR</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tier Level</label>
            <select
              value={projectInputs.tier}
              onChange={(e) => setProjectInputs({ ...projectInputs, tier: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">Tier 1 (99.671% uptime)</option>
              <option value="2">Tier 2 (99.741% uptime)</option>
              <option value="3">Tier 3 (99.982% uptime)</option>
              <option value="4">Tier 4 (99.995% uptime)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deployment Model</label>
            <select
              value={projectInputs.deploymentModel}
              onChange={(e) => setProjectInputs({ ...projectInputs, deploymentModel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="traditional">Traditional Build</option>
              <option value="modular">Modular</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Model</label>
            <select
              value={projectInputs.businessModel}
              onChange={(e) => setProjectInputs({ ...projectInputs, businessModel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="colocation">Colocation</option>
              <option value="hyperscale">Hyperscale</option>
              <option value="edge">Edge</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cooling Type</label>
            <select
              value={projectInputs.coolingType}
              onChange={(e) => setProjectInputs({ ...projectInputs, coolingType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="air">Air Cooling</option>
              <option value="liquid">Liquid Cooling</option>
              <option value="hybrid">Hybrid Cooling</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Facility Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Facility Size (sq ft)</label>
            <input
              type="number"
              value={projectInputs.facilitySize}
              onChange={(e) => setProjectInputs({ ...projectInputs, facilitySize: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raised Floor Area (sq ft)</label>
            <input
              type="number"
              value={projectInputs.raisedFloorArea}
              onChange={(e) => setProjectInputs({ ...projectInputs, raisedFloorArea: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IT Load (MW)</label>
            <input
              type="number"
              value={projectInputs.itLoad}
              onChange={(e) => setProjectInputs({ ...projectInputs, itLoad: parseFloat(e.target.value) || 0 })}
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Power (MW)</label>
            <input
              type="number"
              value={projectInputs.totalPower}
              onChange={(e) => setProjectInputs({ ...projectInputs, totalPower: parseFloat(e.target.value) || 0 })}
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Racks</label>
            <input
              type="number"
              value={projectInputs.rackCount}
              onChange={(e) => setProjectInputs({ ...projectInputs, rackCount: parseInt(e.target.value || '0', 10) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avg Rack Density (kW)</label>
            <input
              type="number"
              value={projectInputs.averageRackDensity}
              onChange={(e) => setProjectInputs({ ...projectInputs, averageRackDensity: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target PUE</label>
            <input
              type="number"
              value={projectInputs.targetPUE}
              onChange={(e) => setProjectInputs({ ...projectInputs, targetPUE: parseFloat(e.target.value) || 1 })}
              step="0.01"
              min="1.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target WUE (L/kWh)</label>
            <input
              type="number"
              value={projectInputs.targetWUE}
              onChange={(e) => setProjectInputs({ ...projectInputs, targetWUE: parseFloat(e.target.value) || 0 })}
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Mix (%)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enterprise</label>
            <input
              type="number"
              value={projectInputs.customerMix.enterprise}
              onChange={(e) =>
                setProjectInputs({
                  ...projectInputs,
                  customerMix: { ...projectInputs.customerMix, enterprise: parseFloat(e.target.value) || 0 },
                })
              }
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cloud Providers</label>
            <input
              type="number"
              value={projectInputs.customerMix.cloudProviders}
              onChange={(e) =>
                setProjectInputs({
                  ...projectInputs,
                  customerMix: { ...projectInputs.customerMix, cloudProviders: parseFloat(e.target.value) || 0 },
                })
              }
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AI Companies</label>
            <input
              type="number"
              value={projectInputs.customerMix.aiCompanies}
              onChange={(e) =>
                setProjectInputs({
                  ...projectInputs,
                  customerMix: { ...projectInputs.customerMix, aiCompanies: parseFloat(e.target.value) || 0 },
                })
              }
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other</label>
            <input
              type="number"
              value={projectInputs.customerMix.other}
              onChange={(e) =>
                setProjectInputs({
                  ...projectInputs,
                  customerMix: { ...projectInputs.customerMix, other: parseFloat(e.target.value) || 0 },
                })
              }
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {Object.values(projectInputs.customerMix).reduce((a, b) => a + b, 0) !== 100 && (
          <p className="text-red-500 text-sm mt-2">
            Total must equal 100% (currently {Object.values(projectInputs.customerMix).reduce((a, b) => a + b, 0)}%)
          </p>
        )}
      </div>
    </div>
  );

  // New tab: Capex details
  const CapexView = () => {
    const capex = calculateDetailedCapex();
    const data = [
      { name: 'Land', value: capex.landAcquisition },
      { name: 'Construction', value: capex.construction },
      { name: 'Power', value: capex.powerInfrastructure },
      { name: 'Cooling', value: capex.coolingInfrastructure },
      { name: 'IT Equip', value: capex.itEquipment },
      { name: 'Security', value: capex.securitySystems },
      { name: 'Soft', value: capex.softCosts },
      { name: 'Contingency', value: capex.contingency },
      { name: 'Add-ons', value: capex.additionalCapex },
    ];
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">CAPEX Breakdown</h3>
          <p className="text-sm text-gray-600 mb-4">Total: ${ (capex.totalCapex/1_000_000).toFixed(2) }M</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `$${(v/1_000_000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => `$${(v/1_000_000).toFixed(2)}M`} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // New tab: Opex details
  const OpexView = () => {
    const opex = calculateDetailedOpex();
    const data = [
      { name: 'Electricity', value: opex.electricity },
      { name: 'Water', value: opex.water },
      { name: 'Staffing', value: opex.staffing },
      { name: 'Maintenance', value: opex.maintenance },
      { name: 'Insurance', value: opex.insurance },
      { name: 'Property', value: opex.property },
      { name: 'Compliance', value: opex.compliance },
      { name: 'Bandwidth', value: opex.bandwidth },
      { name: 'Marketing', value: opex.marketing },
    ];
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">OPEX Breakdown (Annual)</h3>
          <p className="text-sm text-gray-600 mb-4">Total: ${ (opex.totalOpex/1_000_000).toFixed(2) }M</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `$${(v/1_000_000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => `$${(v/1_000_000).toFixed(2)}M`} />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // New tab: Revenue details
  const RevenueView = () => {
    const rev = calculateRevenue();
    const data = [
      { name: 'Recurring', value: rev.recurring },
      { name: 'Interconnection', value: rev.interconnection },
      { name: 'Managed Services', value: rev.managedServices },
    ];
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Revenue Breakdown (Annual)</h3>
          <p className="text-sm text-gray-600 mb-4">Total: ${ (rev.total/1_000_000).toFixed(2) }M</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `$${(v/1_000_000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => `$${(v/1_000_000).toFixed(2)}M`} />
              <Bar dataKey="value" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // New tab: Tax & Incentives
  const TaxIncentives = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Corporate Tax Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Federal/National (%)</label>
            <input
              type="number"
              value={taxConfig.federalRate}
              onChange={(e) => setTaxConfig({ ...taxConfig, federalRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State (%)</label>
            <input
              type="number"
              value={taxConfig.stateRate}
              onChange={(e) => setTaxConfig({ ...taxConfig, stateRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Effective: {(taxConfig.federalRate + taxConfig.stateRate).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Depreciation & Bonuses</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Depreciation (%)</label>
            <input
              type="number"
              value={taxConfig.depreciation.bonusDepreciation}
              onChange={(e) => setTaxConfig({
                ...taxConfig,
                depreciation: { ...taxConfig.depreciation, bonusDepreciation: parseFloat(e.target.value) || 0 },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <input id="salesTaxExemption" type="checkbox" checked={taxConfig.incentives.salesTaxExemption} onChange={(e) => setTaxConfig({ ...taxConfig, incentives: { ...taxConfig.incentives, salesTaxExemption: e.target.checked } })} />
              <label htmlFor="salesTaxExemption" className="text-sm">Sales tax exemption</label>
            </div>
            <div className="flex items-center gap-2">
              <input id="sezBenefits" type="checkbox" checked={taxConfig.incentives.sezBenefits} onChange={(e) => setTaxConfig({ ...taxConfig, incentives: { ...taxConfig.incentives, sezBenefits: e.target.checked } })} />
              <label htmlFor="sezBenefits" className="text-sm">SEZ benefits (India)</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local Grants ($)</label>
              <input type="number" value={taxConfig.incentives.localGrants} onChange={(e) => setTaxConfig({ ...taxConfig, incentives: { ...taxConfig.incentives, localGrants: parseFloat(e.target.value) || 0 } })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // New tab: Risk Analysis
  const RiskAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Demand Uncertainty (%)</label>
            <input type="number" value={projectInputs.demandUncertainty} onChange={(e) => setProjectInputs({ ...projectInputs, demandUncertainty: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Energy Price Volatility (%)</label>
            <input type="number" value={projectInputs.energyPriceVolatility} onChange={(e) => setProjectInputs({ ...projectInputs, energyPriceVolatility: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Construction Delay Risk</label>
            <select value={projectInputs.constructionDelayRisk} onChange={(e) => setProjectInputs({ ...projectInputs, constructionDelayRisk: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <button onClick={() => runMonteCarloSimulation(1000)} className="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Run Monte Carlo (1,000)</button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded border">
          <p className="text-sm text-gray-600">P(NPV > 0)</p>
          <p className="text-2xl font-bold">{simulationResults.pSuccess.toFixed(0)}%</p>
        </div>
        <div className="p-4 rounded border">
          <p className="text-sm text-gray-600">Worst-case NPV</p>
          <p className="text-2xl font-bold">${(simulationResults.worstNPV/1_000_000).toFixed(1)}M</p>
        </div>
        <div className="p-4 rounded border">
          <p className="text-sm text-gray-600">Median NPV</p>
          <p className="text-2xl font-bold">${(simulationResults.medianNPV/1_000_000).toFixed(1)}M</p>
        </div>
        <div className="p-4 rounded border">
          <p className="text-sm text-gray-600">Best-case NPV</p>
          <p className="text-2xl font-bold">${(simulationResults.bestNPV/1_000_000).toFixed(1)}M</p>
        </div>
      </div>
    </div>
  );

  // New tab: Sustainability
  const SustainabilityView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sustainability Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Renewable Target (%)</label>
            <input type="number" value={projectInputs.renewableTarget} onChange={(e) => setProjectInputs({ ...projectInputs, renewableTarget: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carbon Neutral By</label>
            <input type="number" value={projectInputs.carbonNeutralTarget} onChange={(e) => setProjectInputs({ ...projectInputs, carbonNeutralTarget: parseInt(e.target.value || '0', 10) })} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Solar Capacity (MW)</label>
            <input type="number" value={projectInputs.solarCapacity} onChange={(e) => setProjectInputs({ ...projectInputs, solarCapacity: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="flex items-center gap-3">
            <input id="batteryStorage" type="checkbox" checked={projectInputs.batteryStorage} onChange={(e) => setProjectInputs({ ...projectInputs, batteryStorage: e.target.checked })} />
            <label htmlFor="batteryStorage" className="text-sm">Battery Storage</label>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <input id="wasteHeatRecovery" type="checkbox" checked={projectInputs.wasteHeatRecovery} onChange={(e) => setProjectInputs({ ...projectInputs, wasteHeatRecovery: e.target.checked })} />
            <label htmlFor="wasteHeatRecovery" className="text-sm">Waste Heat Recovery</label>
          </div>
          <div className="flex items-center gap-3">
            <input id="aiOptimization" type="checkbox" checked={projectInputs.aiOptimization} onChange={(e) => setProjectInputs({ ...projectInputs, aiOptimization: e.target.checked })} />
            <label htmlFor="aiOptimization" className="text-sm">AI Optimization</label>
          </div>
        </div>
      </div>
    </div>
  );

  // New tab: Compliance
  const ComplianceView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance & Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Level</label>
            <select value={projectInputs.complianceLevel} onChange={(e) => setProjectInputs({ ...projectInputs, complianceLevel: e.target.value })} className="w-full px-3 py-2 border rounded">
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="tier3">Tier 3</option>
              <option value="tier4">Tier 4</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interconnection Density</label>
            <select value={projectInputs.interconnectionDensity} onChange={(e) => setProjectInputs({ ...projectInputs, interconnectionDensity: e.target.value })} className="w-full px-3 py-2 border rounded">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disaster Recovery</label>
            <select value={projectInputs.disasterRecovery} onChange={(e) => setProjectInputs({ ...projectInputs, disasterRecovery: e.target.value })} className="w-full px-3 py-2 border rounded">
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // New tab: Scenarios
  const ScenariosView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Saved Scenarios</h3>
          <button
            onClick={() =>
              setSavedScenarios((prev) => [
                ...prev,
                {
                  name: `${projectInputs.projectName} (${new Date().toLocaleString()})`,
                  inputs: projectInputs,
                  metrics: financialMetrics,
                },
              ])
            }
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Current Scenario
          </button>
        </div>
        {savedScenarios.length === 0 ? (
          <p className="text-sm text-gray-600">No scenarios saved yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">Select</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Location</th>
                  <th className="py-2 pr-4">Tier</th>
                  <th className="py-2 pr-4">IT Load (MW)</th>
                  <th className="py-2 pr-4">NPV ($M)</th>
                  <th className="py-2 pr-4">IRR (%)</th>
                </tr>
              </thead>
              <tbody>
                {savedScenarios.map((s, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 pr-4">
                      <input
                        type="checkbox"
                        checked={selectedScenarios.includes(idx)}
                        onChange={(e) =>
                          setSelectedScenarios((prev) =>
                            e.target.checked ? [...prev, idx] : prev.filter((i) => i !== idx)
                          )
                        }
                      />
                    </td>
                    <td className="py-2 pr-4">{s.name}</td>
                    <td className="py-2 pr-4">
                      {s.inputs.location === 'usa' ? `${s.inputs.state}, USA` : `${s.inputs.indianState}, India`}
                    </td>
                    <td className="py-2 pr-4">{s.inputs.tier}</td>
                    <td className="py-2 pr-4">{s.inputs.itLoad}</td>
                    <td className="py-2 pr-4">{(s.metrics.npv/1_000_000).toFixed(1)}</td>
                    <td className="py-2 pr-4">{s.metrics.irr.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedScenarios.length === 2 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Scenario Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedScenarios.map((idx) => (
              <div key={idx} className="rounded border p-4">
                <p className="font-semibold">{savedScenarios[idx].name}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">NPV</div>
                  <div>${(savedScenarios[idx].metrics.npv/1_000_000).toFixed(2)}M</div>
                  <div className="text-gray-600">IRR</div>
                  <div>{savedScenarios[idx].metrics.irr.toFixed(1)}%</div>
                  <div className="text-gray-600">Payback</div>
                  <div>{savedScenarios[idx].metrics.paybackPeriod.toFixed(1)} yrs</div>
                  <div className="text-gray-600">EBITDA</div>
                  <div>${(savedScenarios[idx].metrics.ebitda/1_000_000).toFixed(2)}M</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'executive', label: 'Executive Summary', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'configuration', label: 'Project Configuration', icon: <Settings className="w-4 h-4" /> },
    { id: 'capex', label: 'Capital Investment', icon: <Building className="w-4 h-4" /> },
    { id: 'opex', label: 'Operating Expenses', icon: <Calculator className="w-4 h-4" /> },
    { id: 'revenue', label: 'Revenue Model', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'tax', label: 'Tax & Incentives', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'risk', label: 'Risk Analysis', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'sustainability', label: 'Sustainability', icon: <Sun className="w-4 h-4" /> },
    { id: 'compliance', label: 'Compliance', icon: <Shield className="w-4 h-4" /> },
    { id: 'scenarios', label: 'Scenario Planning', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Server className="w-8 h-8" />
            Data Center Economic Analysis Tool
          </h1>
          <p className="text-blue-100 mt-2">Professional-grade financial planning for data center investments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="transition-all">
          {activeTab === 'executive' && <ExecutiveSummary />}
          {activeTab === 'configuration' && <ProjectConfiguration />}
          {activeTab === 'capex' && <CapexView />}
          {activeTab === 'opex' && <OpexView />}
          {activeTab === 'revenue' && <RevenueView />}
          {activeTab === 'tax' && <TaxIncentives />}
          {activeTab === 'risk' && <RiskAnalysis />}
          {activeTab === 'sustainability' && <SustainabilityView />}
          {activeTab === 'compliance' && <ComplianceView />}
          {activeTab === 'scenarios' && <ScenariosView />}
        </div>
      </div>
    </div>
  );
}

export default function DataCenterDesigner() {
  return (
    <ProtectedRoute>
      <DataCenterAnalysisTool />
    </ProtectedRoute>
  );
}
