import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { mockImpactMetrics } from '../data/mockData';

export const ImpactDashboardPage: React.FC = () => {
  const metrics = mockImpactMetrics;

  const severityColors = ['#ef4444', '#f59e0b', '#2563eb', '#10b981'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Civic Transparency
          </span>
          <span className="text-xs font-semibold text-slate-400">National Impact Index</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Community Impact & Resolution Analytics
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Live telemetric performance indicators tracking disaster mitigation velocity, population relief, and resource optimization.
        </p>
      </div>

      {/* Top Highlight Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reported</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {metrics.challengesReported.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-2">
            <ArrowUpRight size={14} />
            <span>+18.4% month-over-month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved Hazards</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {metrics.challengesResolved.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-slate-500 mt-2">
            <span>75.8% Successful Mitigation Rate</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Citizens Impacted</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {(metrics.estimatedPopulationImpacted / 1000000).toFixed(2)}M+
          </div>
          <div className="text-xs font-bold text-purple-600 mt-2">
            <span>Across 28 states & union territories</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Mean Triage Speed</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {metrics.averageResolutionDays} Days
          </div>
          <div className="text-xs font-bold text-emerald-600 mt-2">
            <span>58% faster than traditional helplines</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend of Reports vs Resolutions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Incident vs. Resolution Trend</h3>
              <p className="text-xs text-slate-500">Comparing intake volume against municipal closures</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reported"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorReported)"
                  name="Reported Incidents"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                  name="Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Challenges by Sector</h3>
              <p className="text-xs text-slate-500">Distribution across civic disaster domains</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.categoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Reports Filed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Pie Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">AI Severity Triage Share</h3>
          <p className="text-xs text-slate-500">Proportion of high vs routine emergency filings</p>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {metrics.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || severityColors[index % severityColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Innovation & Field Efficiency Highlights */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border border-blue-900/40 shadow-lg space-y-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-300">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold">SIH AI Acceleration Gains</h3>
              <span className="text-[10px] text-slate-400">Benchmarked vs. Manual Helpline Protocols</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between font-bold text-sm text-cyan-300">
                <span>Duplicate Clustering Savings</span>
                <span>3,240 Hours</span>
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Over 4,100 duplicate tickets merged into geo-clusters, saving field teams hundreds of redundant reconnaissance trips.
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between font-bold text-sm text-emerald-400">
                <span>Partner Auto-Dispatch Ratio</span>
                <span>88.2% Direct Match</span>
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Critical drainage, landslide, and power hazards mapped directly to specialized IIT labs and NDRF battalions within 15 minutes.
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between font-bold text-sm text-amber-300">
                <span>Citizen Trust Index</span>
                <span>94.6% Satisfaction</span>
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Multi-stage audit timeline guarantees photographic proof of resolution before a case is officially marked resolved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
