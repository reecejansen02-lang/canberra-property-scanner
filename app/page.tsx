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
  defaultInterestRate: number;
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
    defaultInterestRate: 5.5,
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
    defaultInterestRate: 5.5,
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
    defaultInterestRate: 5.5,
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
    defaultInterestRate: 5.5,
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
  loanAmount: number,
  interestRate: number
): InvestmentMetrics {
  const annualRent = property.weeklyRent * 52;
  const grossYield = (annualRent / property.purchasePrice) * 100;
  const annualInterestCost = (loanAmount * interestRate) / 100;
  const weeklyInterestCost = annualInterestCost / 52;
  const annualCashFlow = annualRent - annualInterestCost - property.annualExpenses;
  const weeklyCashFlow = annualCashFlow / 52;
  
  const equityBuffer = ((property.purchasePrice - loanAmount) / property.purchasePrice) * 100;
  const cashFlowScore = annualCashFlow > 0 ? 50 : Math.max(0, 50 + (annualCashFlow / (annualRent / 2)));
  const yieldScore = Math.min(30, (grossYield / 5) * 30);
  const equityScore = Math.min(20, (equityBuffer / 50) * 20);
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
  const [interestRate, setInterestRate] = useState(5.5);
  const [filterType, setFilterType] = useState<string>('All');

  const filteredProperties = SAMPLE_PROPERTIES.filter((prop) => {
    const matchesSearch =
      prop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.suburb.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || prop.type === filterType;
    return matchesSearch && matchesType;
  });

  const metrics = selectedProperty
    ? calculateMetrics(selectedProperty, loanAmount || selectedProperty.purchasePrice * 0.8, interestRate)
    : null;

  const propertyToDisplay = selectedProperty || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              🏠
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Property Scanner
              </h1>
              <p className="text-sm text-slate-400">ACT Investment Analysis Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Search & Filter Section */}
        <section className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/10 transition-all">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                🔍 Search Address or Suburb
              </label>
              <input
                type="text"
                placeholder="e.g., Belconnen, Lake Drive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all backdrop-blur"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                🏘️ Property Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['All', 'House', 'Townhouse', 'Unit', 'Apartment'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterType === type
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50 scale-105'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties List */}
          <section className="lg:col-span-1">
            <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></span>
              Available Properties ({filteredProperties.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => setSelectedProperty(prop)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedProperty?.id === prop.id
                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-400/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-bold text-slate-100 truncate">{prop.address}</div>
                    <div className="text-sm text-slate-400 mt-1">
                      {prop.suburb} {prop.postcode}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 inline-block bg-slate-700/50 px-2 py-1 rounded">
                      {prop.type}
                    </div>
                    <div className="text-sm font-bold text-cyan-400 mt-3">
                      ${prop.purchasePrice.toLocaleString()}
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-slate-400 text-center py-8">No properties found</p>
              )}
            </div>
          </section>

          {/* Selected Property & Calculator */}
          {propertyToDisplay && metrics && (
            <section className="lg:col-span-2 space-y-4">
              {/* Property Details */}
              <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {propertyToDisplay.address}
                </h3>
                <p className="text-slate-400 mb-6">
                  {propertyToDisplay.suburb} {propertyToDisplay.postcode} • {propertyToDisplay.type}
                </p>

                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-700/50">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Purchase Price</p>
                    <p className="text-2xl font-bold text-slate-100 mt-2">
                      ${propertyToDisplay.purchasePrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Weekly Rent</p>
                    <p className="text-2xl font-bold text-cyan-400 mt-2">
                      ${propertyToDisplay.weeklyRent}
                    </p>
                  </div>
                </div>

                {/* Loan Calculator */}
                <div className="mt-6 space-y-5">
                  <h4 className="font-bold text-slate-100">💰 Investment Calculator</h4>
                  
                  {/* Loan Amount */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Loan Amount: <span className="text-cyan-400 font-bold">${loanAmount ? loanAmount.toLocaleString() : (propertyToDisplay.purchasePrice * 0.8).toLocaleString()}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={propertyToDisplay.purchasePrice}
                      step="10000"
                      value={loanAmount || propertyToDisplay.purchasePrice * 0.8}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="text-xs text-slate-400 mt-2 flex justify-between">
                      <span>$0</span>
                      <span>${propertyToDisplay.purchasePrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Interest Rate: <span className="text-cyan-400 font-bold">{interestRate.toFixed(2)}%</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="text-xs text-slate-400 mt-2 flex justify-between">
                      <span>2%</span>
                      <span>10%</span>
                    </div>
                  </div>

                  {/* Annual Expenses */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Annual Expenses</p>
                      <p className="text-lg font-bold text-slate-100 mt-2">${propertyToDisplay.annualExpenses.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Score */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-2xl shadow-2xl shadow-cyan-500/20 p-8 text-center">
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Investment Score</h4>
                <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {metrics.investmentScore}
                </div>
                <p className="text-slate-400 mt-2">Out of 100</p>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Gross Yield</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-2">{metrics.grossYield.toFixed(2)}%</p>
                </div>
                <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Annual Rent</p>
                  <p className="text-2xl font-bold text-slate-100 mt-2">
                    ${metrics.annualRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Annual Interest</p>
                  <p className="text-2xl font-bold text-orange-400 mt-2">
                    -${metrics.annualInterestCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className={`backdrop-blur-xl bg-slate-800/50 border-2 rounded-xl p-4 shadow-lg transition-all ${
                  metrics.annualCashFlow >= 0 
                    ? 'border-emerald-400/50 shadow-emerald-500/20' 
                    : 'border-red-400/50 shadow-red-500/20'
                }`}>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Annual Cash Flow</p>
                  <p className={`text-2xl font-bold mt-2 ${
                    metrics.annualCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    ${metrics.annualCashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 shadow-lg hover:shadow-cyan-500/10 transition-all col-span-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Weekly Cash Flow</p>
                  <p className={`text-2xl font-bold mt-2 ${
                    metrics.weeklyCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    ${metrics.weeklyCashFlow.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Empty State */}
          {!propertyToDisplay && (
            <section className="lg:col-span-2 backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center">
              <p className="text-3xl mb-3">👈</p>
              <p className="text-slate-300 text-lg">Select a property to view detailed analysis</p>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-700/50 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-400">
          <p>✨ Canberra Property Scanner v0.2.0 • Modern Edition • Sample data for demonstration</p>
        </div>
      </footer>
    </div>
  );
}
