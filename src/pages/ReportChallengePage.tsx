import React, { useState } from 'react';
import {
  FileText,
  Upload,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Flame,
  Bot,
  Layers,
  Compass,
  ArrowRight,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VoiceRecorder } from '../components/common/VoiceRecorder';
import { LeafletMap } from '../components/common/LeafletMap';
import { AIAnalysisCard, DuplicateDetectionCard } from '../components/ai/AIComponents';
import { analyzeChallenge } from '../services/api';
import { ChallengeCategory, ChallengeSeverity, Challenge, AIAnalysisResult } from '../types';

export const ReportChallengePage: React.FC = () => {
  const { currentUser, addNewChallenge, setCurrentView, setActiveChallengeId } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State - Step 1: Problem Details
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<ChallengeCategory>('Disaster');
  const [description, setDescription] = useState<string>('');
  const [perceivedUrgency, setPerceivedUrgency] = useState<ChallengeSeverity>('High');
  const [estimatedPeople, setEstimatedPeople] = useState<number>(1200);

  // Form State - Step 2: Evidence
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
  ]);
  const [voiceNote, setVoiceNote] = useState<{ durationSeconds: number; transcript?: string } | null>(null);

  // Form State - Step 3: Location
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6139,
    lng: 77.2090,
  });
  const [address, setAddress] = useState<string>('Ring Road near Sarita Vihar Underpass');
  const [city, setCity] = useState<string>('New Delhi');
  const [stateName, setStateName] = useState<string>('Delhi');
  const [pincode, setPincode] = useState<string>('110076');

  // Step 4: AI Simulation & Result
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState<number>(0);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const categories: ChallengeCategory[] = [
    'Disaster',
    'Water',
    'Roads',
    'Waste Management',
    'Electricity',
    'Healthcare',
    'Environment',
    'Public Safety',
    'Other',
  ];

  const aiProgressSteps = [
    'Extracting semantic embeddings from distress narrative...',
    'Running multi-modal NLP & hazard classification...',
    'Performing geospatial radius scan for duplicate clusters...',
    'Calculating demographic risk and exposure priority (0-100)...',
    'Estimating perimeter population impact via GIS census data...',
    'Matching verified response battalions, universities & NGOs...',
  ];

  // Image upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // In a real app, upload to storage or read as DataURL
    const newImages = Array.from(files).map((_, i) =>
      `https://images.unsplash.com/photo-${1547683905 + i}?auto=format&fit=crop&w=800&q=80`
    );
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // GPS Auto-detect
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationCoords({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
        },
        () => {
          // Fallback simulation
          setLocationCoords({ lat: 28.5355, lng: 77.3910 });
        }
      );
    } else {
      setLocationCoords({ lat: 28.5355, lng: 77.3910 });
    }
  };

  // Run AI analysis
  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    // Sequential simulation animation through the 6 AI steps
    for (let i = 0; i < aiProgressSteps.length; i++) {
      setAnalysisStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    const result = await analyzeChallenge({
      title: title || 'Severe urban waterlogging and submerged electrical infrastructure',
      description: description || 'Torrential rainfall caused 3 feet standing water blocking emergency ambulance corridor.',
      category,
      hasImages: uploadedImages.length > 0,
      hasAudio: !!voiceNote,
      location: { lat: locationCoords.lat, lng: locationCoords.lng, city },
    });

    setAiResult(result);
    setIsAnalyzing(false);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    const newId = `CC-SIH-${Math.floor(920 + Math.random() * 80)}`;

    const finalTitle =
      title || 'Severe inundation blocking transit arterial corridor';

    const finalDescription =
      description ||
      'Torrential rainfall caused acute waterlogging with transformer sparking danger.';

    const finalSeverity = aiResult?.severity || perceivedUrgency;
    const finalPriorityScore = aiResult?.priorityScore || 85;

    try {
      const response = await fetch('http://localhost:5000/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newId,
          title: finalTitle,
          description: finalDescription,
          category,
          severity: finalSeverity,
          priorityScore: finalPriorityScore,
          status: 'Reported',
          reporterId: currentUser.id,
          reporterName: currentUser.name,
          city,
          state: stateName,
          address,
          latitude: locationCoords.lat,
          longitude: locationCoords.lng,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save report');
      }

      const savedReport = await response.json();

      console.log('✅ Report saved to MySQL:', savedReport);

      const now = new Date().toISOString();

      const newChallenge: Challenge = {
        id: newId,
        title: finalTitle,
        description: finalDescription,
        category,
        severity: finalSeverity,
        status: 'AI_Verified',
        priorityScore: finalPriorityScore,
        progressPercent: 20,
        location: {
          address,
          city,
          state: stateName,
          pincode,
          lat: locationCoords.lat,
          lng: locationCoords.lng,
        },
        reporterId: currentUser.id,
        reporterName: currentUser.name,
        reporterRole: currentUser.role,
        createdAt: now,
        updatedAt: now,
        supportersCount: 1,
        isSupportedByMe: true,
        evidence: {
          images:
            uploadedImages.length > 0
              ? uploadedImages
              : [
                  'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
                ],
          voiceAudio: voiceNote
            ? {
                durationSeconds: voiceNote.durationSeconds,
                transcript: voiceNote.transcript,
              }
            : undefined,
        },
        matchedPartners: [],
        aiAnalysis:
          aiResult || {
            category,
            severity: finalSeverity,
            priorityScore: finalPriorityScore,
            confidenceScore: 94,
            affectedPopulationEstimate: estimatedPeople,
            duplicatesDetected: [],
            analysisRationale: [
              'Direct citizen visual and auditory telemetry verified.',
              'Threat assessment flagged potential electrical hazard.',
            ],
            recommendedAction:
              'Rapid drain de-silting and municipal water pump installation.',
            hazardType: `${category} Event`,
            urgencyLevel:
              finalSeverity === 'Critical' ? 'Immediate' : 'Within 24h',
            matchedKeywords: [
              'waterlogging',
              'flooding',
              'infrastructure',
            ],
          },
        timelineEvents: [
          {
            status: 'Reported',
            title: 'Challenge Submitted',
            description:
              'Geotagged crowdsourced report registered by citizen.',
            timestamp: now,
            actor: currentUser.name,
          },
          {
            status: 'AI_Verified',
            title: 'AI Classification Completed',
            description: `Classified as ${category} with severity ${finalSeverity}.`,
            timestamp: now,
            actor: 'CivicConnect AI Engine',
          },
        ],
        comments: [],
      };

      addNewChallenge(newChallenge);
      setActiveChallengeId(newId);
      setCurrentView('challenge-detail');
    } catch (error) {
      console.error('❌ Error submitting report:', error);

      alert(
        'Could not save the report. Please make sure the CivicConnect backend is running and CORS is enabled.'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            SIH26043 Crowdsourcing Wizard
          </span>
          <span className="text-xs font-semibold text-slate-400">Step {currentStep} of 4</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Report a Societal Challenge
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Submit details of disaster hazards, infrastructure collapses, or public health emergencies. Our AI engine triages and alerts authorities within seconds.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[
            { step: 1, label: 'Describe Problem', icon: FileText },
            { step: 2, label: 'Add Evidence', icon: Upload },
            { step: 3, label: 'Location Pin', icon: MapPin },
            { step: 4, label: 'AI Review & Submit', icon: Sparkles },
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  if (currentStep > s.step) setCurrentStep(s.step);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl transition-all text-left ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : isCompleted
                    ? 'bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent ? 'bg-white/20 text-white' : isCompleted ? 'bg-blue-600 text-white' : 'bg-slate-100'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                </div>
                <div className="hidden sm:block truncate">
                  <div className="text-[10px] opacity-80 uppercase tracking-wider">Step {s.step}</div>
                  <div className="text-xs truncate">{s.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Describe the Problem */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 1: Describe the Problem</h2>
            <p className="text-xs text-slate-500 mt-0.5">Provide a concise, factual summary of the incident</p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Challenge Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Severe waterlogging and submerged transformer near Sector 14 crossing"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category Sector <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ChallengeCategory)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white transition-all font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Perceived Urgency <span className="text-red-500">*</span>
                </label>
                <select
                  value={perceivedUrgency}
                  onChange={(e) => setPerceivedUrgency(e.target.value as ChallengeSeverity)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white transition-all font-medium"
                >
                  <option value="Critical">Critical (Immediate threat to life/property)</option>
                  <option value="High">High (Serious hazard requiring 24h action)</option>
                  <option value="Medium">Medium (Disruptive civic issue)</option>
                  <option value="Low">Low (Routine maintenance)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the exact conditions: water level, electrical sparks, blocked culverts, trapped persons, or structural cracks..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Tip: Mention nearby landmarks (metro stations, schools, hospital gates) for faster AI emergency matching.
              </p>
            </div>

            {/* Estimated people affected */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Estimated Citizens Affected
              </label>
              <input
                type="number"
                value={estimatedPeople}
                onChange={(e) => setEstimatedPeople(Number(e.target.value))}
                min={1}
                max={500000}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!title) {
                  setTitle('Severe Waterlogging and Submerged Transformer');
                }
                if (!description) {
                  setDescription(
                    'Torrential monsoon rain has caused 3.5 ft deep stagnant water. Live electrical transformer is sparking and posing danger to pedestrians.'
                  );
                }
                setCurrentStep(2);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2"
            >
              <span>Continue to Evidence</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Add Evidence (Images + Voice Note) */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Step 2: Attach Evidence</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-modal evidence speeds up AI verification and prevents fake reports
            </p>
          </div>

          {/* Photos Upload Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Upload Photos / Video Frames
            </label>

            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
              <Upload size={32} className="mx-auto text-blue-500 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">
                Drag & drop incident photos, or{' '}
                <label className="text-blue-600 hover:underline cursor-pointer">
                  browse files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Supports JPG, PNG, WEBP up to 10MB each
              </p>
            </div>

            {/* Uploaded Previews */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {uploadedImages.map((imgUrl, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img
                      src={imgUrl}
                      alt={`Evidence ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      Photo {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voice Evidence Recording Component */}
          <div className="space-y-2 pt-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Voice Note Recording (Vernacular / Audio Description)
            </label>
            <VoiceRecorder
              onRecorded={(audio) => setVoiceNote(audio)}
              onClear={() => setVoiceNote(null)}
              defaultDuration={voiceNote?.durationSeconds}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2"
            >
              <span>Continue to Location</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Location on Leaflet Map */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Pin Exact Location</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Drag marker on the map or click to anchor GPS coordinates for rapid dispatch
              </p>
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors border border-blue-200"
            >
              <Compass size={14} />
              <span>Auto-Detect GPS</span>
            </button>
          </div>

          {/* Interactive Leaflet Map in Picker Mode */}
          <div className="space-y-2">
            <LeafletMap
              isPickerMode={true}
              pickerLocation={locationCoords}
              onLocationPick={(coords) => setLocationCoords(coords)}
              height="340px"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-blue-600" />
                <span>Selected Pin: Lat {locationCoords.lat}, Lng {locationCoords.lng}</span>
              </span>
              <span className="text-[11px] text-slate-400">Click anywhere on map to reposition</span>
            </div>
          </div>

          {/* Address & Landmark Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Street Address / Landmark <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Ring Road near Sarita Vihar Underpass"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New Delhi"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                State & Pincode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="Delhi"
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none"
                />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="110076"
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentStep(4);
                // Trigger AI analysis automatically upon reaching step 4!
                if (!aiResult) {
                  handleRunAIAnalysis();
                }
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2"
            >
              <span>Review with AI Engine</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI Pre-Analysis, Duplicate Scanning & Submission */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 4: AI Pre-Analysis & Review</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated triage validates evidence and calculates priority before dispatching
              </p>
            </div>

            {!isAnalyzing && (
              <button
                type="button"
                onClick={handleRunAIAnalysis}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200 font-bold text-xs transition-colors"
              >
                <Sparkles size={13} />
                <span>Re-run AI Analysis</span>
              </button>
            )}
          </div>

          {/* AI Active Processing Simulation */}
          {isAnalyzing && (
            <div className="bg-slate-900 text-white rounded-3xl p-8 border border-blue-900/40 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">CivicConnect AI Engine Triage</h3>
                  <p className="text-xs text-slate-400">SIH26043 Real-time Disaster Pipeline</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((analysisStepIndex + 1) / aiProgressSteps.length) * 100}%` }}
                />
              </div>

              {/* Steps checklist */}
              <div className="space-y-2.5">
                {aiProgressSteps.map((stepText, idx) => {
                  const isDone = idx < analysisStepIndex;
                  const isCurrent = idx === analysisStepIndex;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-xs transition-all ${
                        isDone
                          ? 'text-cyan-400 font-semibold'
                          : isCurrent
                          ? 'text-white font-bold animate-pulse'
                          : 'text-slate-500'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 size={16} className="text-blue-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span>{stepText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Results Output Once Complete */}
          {!isAnalyzing && aiResult && (
            <div className="space-y-6">
              {/* Full AI Analysis Card */}
              <AIAnalysisCard analysis={aiResult} challengeTitle={title} />

              {/* Duplicate Detection Card */}
              <DuplicateDetectionCard duplicates={aiResult.duplicatesDetected} />

              {/* Summary of citizen inputs */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Submission Summary Review
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-900">Title:</span> {title}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Category:</span> {category}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Location:</span> {address}, {city}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Coordinates:</span> {locationCoords.lat}, {locationCoords.lng}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Evidence:</span> {uploadedImages.length} photos, {voiceNote ? '1 voice note' : 'No audio'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Reporter:</span> {currentUser.name} ({currentUser.role})
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleFinalSubmit}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <FileCheck size={18} />
              <span>Confirm & Dispatch Challenge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
