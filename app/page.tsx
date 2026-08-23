'use client';

import { useState } from 'react';

interface Property {
  id: string;
  address: string;
  suburb: string;
  postcode: string;
  type: 'House' | 'Townhouse' | 'Unit' | 'Apartment';
  purchasePrice: number;
  weeklyRent: number;
  annualExpenses: number;
  interestRate: number;
}

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: '1',
    address: '42 Eucalyptus Lane',
    suburb: 'Canberra',
    postcode: '2600',
    type: 'House',
    purchasePrice: 750000,
    weeklyRent: 450,
    annualExpenses: 2400,
    interestRate: 5.5,
  },
  {
    id: '2',
    address: '15 Wattle Street',
    suburb: 'Belconnen',
    postcode: '2617',
    type: 'Townhouse',
    purchasePrice: 550000,
    weeklyRent: 350,
    annualExpenses: 1800,
    interestRate: 5.5,
  },
  {
    id: '3',
    address: '201 Gungahlin Plaza',
    suburb: 'Gungahlin',
    postcode: '2912',
    type: 'Unit',
    purchasePrice: 400000,
    weeklyRent: 280,
    annualExpenses: 1200,
    interestRate: 5.5,
  },
  {
    id: '4',
    address: '88 Lake Drive',
    suburb: 'Tuggeranong',
    postcode: '2900',
    type: 'Apartment',
    purchasePrice: 480000,
    weeklyRent: 320,
    annualExpenses: 1500,
    interestRate: 5.5,
  },
];

interface InvestmentMetrics {
  annualRent: number;
  grossYield: number;
  weeklyInterestCost: number;
  annualInterestCost: number;
  weeklyCashFlow: number;
  annualCashFlow: number;
  investmentScore: number;
}

function calculateMetrics(
  property: Property,
  loanAmount: number
): InvestmentMetrics {
  const annualRent = property.weeklyRent * 52;
  const grossYield = (annualRent / property.purchasePrice) * 100;
  const annualInterestCost = (loanAmount * property.interestRate) / 100;
  const weeklyInterestCost = annualInterestCost / 52;
  const annualCashFlow = annualRent - annualInterestCost - property.annualExpenses;
  const weeklyCashFlow = annualCashFlow / 52;
  
  // Basic investment score: positive cash flow (50%), yield (30%), equity buffer (20%)
  const equityBuffer = ((property.purchasePrice - loanAmount) / property.purchasePrice) * 100;
  const cashFlowScore = annualCashFlow > 0 ? 50 : Math.max(0, 50 + (annualCashFlow / (annualRent / 2)));
  const yieldScore = Math.min(30, (grossYield / 5) * 30); // Cap at 30 for 5% yield
  const equityScore = Math.min(20, (equityBuffer / 50) * 20); // Cap at 20 for 50% equity
  const investmentScore = Math.round(cashFlowScore + yieldScore + equityScore);

  return {
    annualRent,
    grossYield,
    weeklyInterestCost,
    annualInterestCost,
    weeklyCashFlow,
    annualCashFlow,
    investmentScore,
  };
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loanAmount, setLoanAmount] = useState(0);
  const [filterType, setFilterType] = useState<string>('All');

  const filteredProperties = SAMPLE_PROPERTIES.filter((prop) => {
    const matchesSearch =
      prop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.suburb.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || prop.type === filterType;
    return matchesSearch && matchesType;
  });

  const metrics = selectedProperty
    ? calculateMetrics(selectedProperty, loanAmount || selectedProperty.purchasePrice * 0.8)
    : null;

  const propertyToDisplay = selectedProperty || null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🏠 Property Scanner</h1>
          <p className="text-sm text-gray-600">ACT Investment Analysis</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search & Filter Section */}
        <section className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Address or Suburb
            </label>
            <input
              type="text"
              placeholder="e.g., Belconnen, Lake Drive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <div className="flex flex-wrap gap-2">
              {['All', 'House', 'Townhouse', 'Unit', 'Apartment'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Properties List */}
          <section className="lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Available Properties ({filteredProperties.length})
            </h2>
            <div className="space-y-3">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => setSelectedProperty(prop)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selectedProperty?.id === prop.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-bold text-gray-900">{prop.address}</div>
                    <div className="text-sm text-gray-600">
                      {prop.suburb} {prop.postcode}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{prop.type}</div>
                    <div className="text-sm font-semibold text-blue-600 mt-2">
                      ${prop.purchasePrice.toLocaleString()}
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No properties found</p>
              )}
            </div>
          </section>

          {/* Selected Property & Calculator */}
          {propertyToDisplay && metrics && (
            <section className="lg:col-span-2 space-y-4">
              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {propertyToDisplay.address}
                </h3>
                <p className="text-gray-600 mb-4">
                  {propertyToDisplay.suburb} {propertyToDisplay.postcode} • {propertyToDisplay.type}
                </p>

                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Purchase Price</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${propertyToDisplay.purchasePrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weekly Rent</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${propertyToDisplay.weeklyRent}
                    </p>
                  </div>
                </div>

                {/* Loan Calculator */}
                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-gray-900">Investment Calculator</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount: ${loanAmount ? loanAmount.toLocaleString() : 'Not set'}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={propertyToDisplay.purchasePrice}
                      step="10000"
                      value={loanAmount || propertyToDisplay.purchasePrice * 0.8}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1 flex justify-between">
                      <span>$0</span>
                      <span>${propertyToDisplay.purchasePrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate: {propertyToDisplay.interestRate}%
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Expenses: ${propertyToDisplay.annualExpenses.toLocaleString()}
                    </label>
                  </div>
                </div>
              </div>

              {/* Investment Metrics */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                <h4 className="text-lg font-bold mb-4">Investment Score</h4>
                <div className="text-5xl font-bold mb-2">{metrics.investmentScore}</div>
                <p className="text-blue-100">Out of 100</p>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-sm text-gray-600 mb-1">Gross Rental Yield</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.grossYield.toFixed(2)}%</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-sm text-gray-600 mb-1">Annual Rent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.annualRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-sm text-gray-600 mb-1">Annual Interest</p>
                  <p className="text-2xl font-bold text-orange-600">
                    -${metrics.annualInterestCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className={`bg-white rounded-lg shadow-md p-4 ${
                  metrics.annualCashFlow >= 0 ? 'border-2 border-green-500' : 'border-2 border-red-500'
                }`}>
                  <p className="text-sm text-gray-600 mb-1">Annual Cash Flow</p>
                  <p className={`text-2xl font-bold ${
                    metrics.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${metrics.annualCashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-sm text-gray-600 mb-1">Weekly Cash Flow</p>
                  <p className={`text-2xl font-bold ${
                    metrics.weeklyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${metrics.weeklyCashFlow.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Empty State */}
          {!propertyToDisplay && (
            <section className="lg:col-span-2 bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">Select a property to view analysis</p>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-gray-100 border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>Canberra Property Scanner v0.1.0 • Sample data for demonstration</p>
        </div>
      </footer>
    </div>
  );
}
