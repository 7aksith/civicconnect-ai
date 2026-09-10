import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  MapPin,
  Users,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  Flame,
  Building2,
  Share2,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useApp();

  const workflowSteps = [
    {
      step: '01',
      title: 'Citizen Reporting',
      desc: 'Capture geotagged text, photo evidence, and voice descriptions in regional languages.',
      icon: MapPin,
      badge: 'Multi-Modal Input',
    },
    {
      step: '02',
      title: 'AI Analysis & Triage',
      desc: 'Instant NLP semantic classification, spatial duplicate clustering, and severity scoring (0-100).',
      icon: Cpu,
      badge: 'Sub-second AI',
    },
    {
      step: '03',
      title: 'Partner Matching',
      desc: 'Algorithm matches verified NGOs, universities (IITs/NITs), startups, and NDRF battalions.',
      icon: Users,
      badge: 'Automated Match',
    },
    {
      step: '04',
      title: 'Action & Execution',
      desc: 'Mobilization of pumps, earthmovers, sandbags, and emergency medical supplies with live tracking.',
      icon: Building2,
      badge: 'Field Response',
    },
    {
      step: '05',
      title: 'Verified Impact',
      desc: 'Transparent public audit trail from submission to verified on-ground citizen resolution.',
      icon: CheckCircle2,
      badge: '100% Transparent',
    },
  ];

  const stats = [
    { label: 'Challenges Reported', value: '14,820+', sub: 'Across 28 States & UTs' },
    { label: 'Challenges Resolved', value: '11,240+', sub: '75.8% Resolution Rate' },
    { label: 'Active Citizen Contributors', value: '86,400+', sub: 'Verified Crowd Reporters' },
    { label: 'Partner Organizations', value: '312+', sub: 'NGOs, IITs & Authorities' },
  ];

  const featureCards = [
    {
      title: 'Multi-Modal Voice & Vision Reporting',
      desc: 'Report without typing friction. Upload smartphone photos and record vernacular voice audio notes. AI automatically transcribes and geo-anchors the distress filing.',
      icon: Layers,
      color: 'from-blue-500/10 to-cyan-500/10 text-blue-600',
    },
    {
      title: 'Spatial AI Duplicate Detection',
      desc: 'Prevents municipal dispatch fatigue by clustering overlapping reports within an adaptive 500m-2km radius, elevating urgency score rather than creating separate tickets.',
      icon: Share2,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600',
    },
    {
      title: 'Demographic Priority Scoring',
      desc: 'Proprietary priority engine computes severity, hazard multiplier (e.g. proximity to schools or power transformers), and population exposure to rank triage queues.',
      icon: Flame,
      color: 'from-red-500/10 to-rose-500/10 text-red-600',
    },
    {
      title: 'Automated Expert & University Matching',
      desc: 'Direct pipeline linking complex geotechnical or stormwater challenges to specialized engineering faculty and startup innovators equipped for rapid intervention.',
      icon: Users,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Banner: SIH 2026 Announcement */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-extrabold bg-blue-600 text-white text-[10px] tracking-wider uppercase">
              SIH 2026
            </span>
            <span className="font-semibold text-white">Smart India Hackathon 2026</span>
            <span className="text-slate-400 hidden sm:inline">• Problem SIH26043: Crowdsourcing Societal Challenges (Disaster Management)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Team: <strong className="text-white">Tech Manias</strong></span>
            <span>Category: <strong className="text-white">Software</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/50">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-2xs">
              <Sparkles size={14} className="text-blue-600" />
              <span>National Civic Technology Platform</span>
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span>AI-Powered Disaster Triage</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Turn community problems into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700">
                real-world solutions.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Empowering citizens to report urban flooding, slope instability, and infrastructure failures via text, photos, voice, and location. CivicConnect AI categorizes, deduplicates, and connects cases with emergency authorities, NGOs, and technical experts.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setCurrentView('report')}
                className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all flex items-center gap-2.5"
              >
                <span>Report a Challenge</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => setCurrentView('explore')}
                className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex items-center gap-2"
              >
                <span>Explore Live Challenges</span>
                <ChevronRight size={18} className="text-slate-400" />
              </button>

              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center gap-2"
              >
                <Cpu size={18} className="text-cyan-400" />
                <span>Open Dashboard</span>
              </button>
            </div>

            {/* Quick Demo Hint */}
            <p className="mt-4 text-xs text-slate-500 font-medium">
              💡 No account needed to test — click any button above to explore all features
            </p>
          </div>

          {/* Workflow Interactive Visual Strip */}
          <div className="mt-16 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80">
            <div className="text-center mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                End-to-End Civic Pipeline
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                From Citizen Incident to Verified Resolution
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {workflowSteps.map((ws, i) => {
                const Icon = ws.icon;
                return (
                  <div
                    key={ws.step}
                    className="relative bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70 hover:border-blue-300 hover:bg-white transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-slate-400 font-mono">
                        {ws.step}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {ws.badge}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center mb-3 shadow-2xs border border-slate-200/60 transition-colors">
                      <Icon size={20} />
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {ws.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {ws.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Counter */}
      <section className="py-14 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {stats.map((stat, i) => (
              <div key={i} className={i > 0 ? 'pt-6 lg:pt-0' : ''}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-cyan-400 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep-Dive Feature Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Designed for National Disaster & Civic Resilience
            </h2>
            <p className="text-slate-600 text-base mt-3">
              Combines edge mobile crowdsourcing with server-side AI intelligence to eliminate bottlenecks in municipal governance and emergency response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featureCards.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disaster Management Focus Callout */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold mb-3 border border-cyan-400/30">
              <ShieldCheck size={14} />
              <span>SIH 2026 Theme: Disaster Management</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Rapid Response Protocol for Flash Floods, Landslides & Grid Failures
            </h3>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              When natural disasters strike, standard emergency hotlines choke. CivicConnect AI establishes an open, geotagged priority queue that enables local administration and disaster forces to instantly identify hotspots and coordinate civilian evacuation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('authority-dashboard')}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
            >
              <Flame size={16} />
              <span>Authority Command View</span>
            </button>
            <button
              onClick={() => setCurrentView('map')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <MapPin size={16} className="text-cyan-400" />
              <span>Live Disaster Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-white font-black text-lg mb-3">
                <Cpu size={22} className="text-blue-500" />
                <span>CivicConnect<span className="text-cyan-400">AI</span></span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                Smart India Hackathon 2026 project by Team Tech Manias. Building national-scale civic crowdsourcing and disaster mitigation software.
              </p>
              <div className="mt-4 text-[11px] text-slate-500">
                Problem Statement ID: SIH26043 • Category: Software
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentView('report')} className="hover:text-white">Report Challenge</button></li>
                <li><button onClick={() => setCurrentView('explore')} className="hover:text-white">Explore Issues</button></li>
                <li><button onClick={() => setCurrentView('map')} className="hover:text-white">Live Map</button></li>
                <li><button onClick={() => setCurrentView('impact')} className="hover:text-white">Impact Analytics</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Collaboration</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentView('collaborate')} className="hover:text-white">Solution Partners</button></li>
                <li><button onClick={() => setCurrentView('organizations')} className="hover:text-white">NGO Directory</button></li>
                <li><button onClick={() => setCurrentView('authority-dashboard')} className="hover:text-white">Authority Portal</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">About & Help</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentView('settings')} className="hover:text-white">API Settings</button></li>
                <li><button onClick={() => setCurrentView('profile')} className="hover:text-white">User Profile</button></li>
                <li><span className="text-slate-500">FastAPI Ready Architecture</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px]">
            <div>
              © 2026 CivicConnect AI • Team Tech Manias • Smart India Hackathon 2026
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>NDMA Guidelines</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
