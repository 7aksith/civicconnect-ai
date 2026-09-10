import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Bell,
  Globe,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { addToast } = useApp();

  const [apiUrl, setApiUrl] = useState<string>(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
  );
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'success' | 'mock'>('idle');

  // Preferences
  const [notifyEmergency, setNotifyEmergency] = useState(true);
  const [notifyStatusUpdates, setNotifyStatusUpdates] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [highContrast, setHighContrast] = useState(false);

  const handleTestBackend = async () => {
    setIsTestingApi(true);
    setApiStatus('idle');

    try {
      const res = await fetch(`${apiUrl}/health`, { method: 'GET' });
      if (res.ok) {
        setApiStatus('success');
        addToast({
          type: 'success',
          title: 'FastAPI Backend Online',
          message: `Connected to ${apiUrl} successfully.`,
        });
      } else {
        throw new Error();
      }
    } catch {
      setApiStatus('mock');
      addToast({
        type: 'info',
        title: 'Operating in Autonomous Mock AI Mode',
        message: `FastAPI server at ${apiUrl} not detected. Frontend is running in independent hackathon mode.`,
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('civiconnect_challenges_v1');
    addToast({
      type: 'info',
      title: 'Local Storage Restored',
      message: 'Reloading default SIH26043 challenge registry.',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            System & Architecture Configuration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Platform Settings
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Manage backend integration endpoints, notification preferences, and civic language interfaces.
        </p>
      </div>

      {/* Backend API Configuration (FastAPI) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
            <Server size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Python FastAPI Backend Integration
            </h3>
            <p className="text-xs text-slate-500">
              Configured to connect seamlessly to Python FastAPI ML endpoints
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            FastAPI Base URL (`VITE_API_BASE_URL`)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000/api"
              className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-blue-500 outline-none"
            />
            <button
              onClick={handleTestBackend}
              disabled={isTestingApi}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs whitespace-nowrap"
            >
              {isTestingApi ? 'Testing...' : 'Test Health Endpoint'}
            </button>
          </div>

          {apiStatus === 'success' && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Connected to live FastAPI server ({apiUrl})</span>
            </div>
          )}

          {apiStatus === 'mock' && (
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-50 p-3 rounded-xl border border-blue-200">
              <AlertCircle size={16} className="text-blue-600 shrink-0" />
              <span>Independent Mode: Using high-fidelity mock AI triage engine with sub-second simulation</span>
            </div>
          )}

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Supported REST Endpoints in `src/services/api.ts`:</div>
            <div className="font-mono text-[11px] text-slate-500">
              • POST /v1/ai/analyze (Distress NLP classification & severity) <br />
              • POST /v1/ai/detect-duplicates (Geospatial clustering) <br />
              • POST /v1/ai/match-partners (Multi-criteria expert routing)
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
            <Bell size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Alert Preferences</h3>
            <p className="text-xs text-slate-500">Choose which civic events trigger in-app dispatches</p>
          </div>
        </div>

        <div className="space-y-3 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-3 first:pt-0">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Critical Emergency Warnings</h4>
              <p className="text-[11px] text-slate-500">Flash floods, structural warnings in your district</p>
            </div>
            <input
              type="checkbox"
              checked={notifyEmergency}
              onChange={(e) => setNotifyEmergency(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Authority Triage Updates</h4>
              <p className="text-[11px] text-slate-500">Notify when municipal teams or NGOs accept your report</p>
            </div>
            <input
              type="checkbox"
              checked={notifyStatusUpdates}
              onChange={(e) => setNotifyStatusUpdates(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Community Endorsement Notifications</h4>
              <p className="text-[11px] text-slate-500">Notify when citizens upvote or corroborate filed issues</p>
            </div>
            <input
              type="checkbox"
              checked={notifyComments}
              onChange={(e) => setNotifyComments(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Regional Languages */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <Globe size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Regional Language Dialect</h3>
            <p className="text-xs text-slate-500">Select preferred interface & vernacular speech transcription</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          {['English', 'Hindi (हिंदी)', 'Bengali (বাংলা)', 'Tamil (தமிழ்)', 'Marathi (मराठी)', 'Telugu (తెలుగు)'].map(
            (lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLanguage(lang);
                  addToast({
                    type: 'info',
                    title: 'Language Selected',
                    message: `Interface dialect set to ${lang}.`,
                  });
                }}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                  selectedLanguage === lang
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {lang}
              </button>
            )
          )}
        </div>
      </div>

      {/* Reset Cache / Prototype Database */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Reset Prototype Database</h3>
          <p className="text-xs text-slate-500">
            Restores mock challenge registry and resets test reports for hackathon evaluation.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
        >
          <RotateCcw size={14} />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
