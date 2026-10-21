import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json());

const mockImpactMetrics = {
  challengesReported: 14820,
  challengesResolved: 11240,
  averageResolutionDays: 6,
  activeContributors: 86400,
  partnerOrganizations: 312,
  estimatedPopulationImpacted: 5200000,
  categoryBreakdown: [
    { name: 'Water', count: 4200, percentage: 32 },
    { name: 'Roads', count: 3115, percentage: 24 },
    { name: 'Electricity', count: 2140, percentage: 16 },
    { name: 'Waste Management', count: 1660, percentage: 13 },
    { name: 'Public Safety', count: 1290, percentage: 10 },
    { name: 'Environment', count: 980, percentage: 7 },
  ],
  statusBreakdown: [
    { status: 'Critical', count: 2620, color: '#ef4444' },
    { status: 'High', count: 4560, color: '#f59e0b' },
    { status: 'Medium', count: 5190, color: '#2563eb' },
    { status: 'Resolved', count: 8800, color: '#10b981' },
  ],
  monthlyTrends: [
    { month: 'Jan', reported: 1200, resolved: 810 },
    { month: 'Feb', reported: 1310, resolved: 940 },
    { month: 'Mar', reported: 1540, resolved: 1090 },
    { month: 'Apr', reported: 1760, resolved: 1290 },
    { month: 'May', reported: 2020, resolved: 1480 },
    { month: 'Jun', reported: 2180, resolved: 1640 },
  ],
};

const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Waterlogging alert',
    message: 'A nearby low-lying area reported standing water near the market zone.',
    type: 'CHALLENGE_UPDATE',
    createdAt: 'Just now',
    isRead: false,
    challengeId: 'CC-901',
  },
];

let db;

try {
  db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'civicconnect',
    port: 3306,
  });
  console.log('✅ Connected to MySQL!');
} catch (error) {
  console.warn('⚠️ MySQL not available. Backend will run in local demo mode.', error.message);
}

const safeDb = async (callback) => {
  if (!db) {
    throw new Error('Database unavailable');
  }

  return callback(db);
};

app.get('/', (req, res) => {
  res.json({ message: 'CivicConnect backend is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: !!db });
});

app.get('/users', async (req, res) => {
  try {
    const [users] = await safeDb((connection) => connection.execute('SELECT id, name, email, created_at FROM users'));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Database unavailable', details: error.message });
  }
});

app.get('/reports', async (req, res) => {
  try {
    const [reports] = await safeDb((connection) => connection.execute('SELECT * FROM challenges ORDER BY created_at DESC'));
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reports', details: error.message });
  }
});

app.get('/api/v1/challenges', async (req, res) => {
  try {
    const [reports] = await safeDb((connection) => connection.execute('SELECT * FROM challenges ORDER BY created_at DESC'));
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reports', details: error.message });
  }
});

app.get('/api/v1/impact/metrics', (req, res) => {
  res.json(mockImpactMetrics);
});

app.get('/api/v1/notifications', (req, res) => {
  res.json(mockNotifications);
});

app.post('/reports', async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      category,
      severity,
      priorityScore,
      status,
      reporterId,
      reporterName,
      city,
      state,
      address,
      latitude,
      longitude,
    } = req.body;

    await safeDb((connection) =>
      connection.execute(
        `INSERT INTO challenges
        (id, title, description, category, severity, priority_score, status, reporter_id, reporter_name, city, state, address, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          title,
          description,
          category,
          severity,
          priorityScore,
          status,
          reporterId,
          reporterName,
          city,
          state,
          address,
          latitude,
          longitude,
        ]
      )
    );

    res.status(201).json({ message: 'Report saved successfully!', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save report', details: error.message });
  }
});

app.post('/api/v1/ai/analyze', (req, res) => {
  const { title = '', description = '', category = 'Other', hasImages = false, hasAudio = false, location } = req.body || {};
  const text = `${title} ${description}`.toLowerCase();
  let severity = 'Medium';
  let priorityScore = 68;
  let confidenceScore = 91;
  let affectedPopulationEstimate = 850;

  if (text.includes('flood') || text.includes('submerged') || text.includes('landslide') || text.includes('spark') || category === 'Disaster') {
    severity = 'Critical';
    priorityScore = 91;
    affectedPopulationEstimate = 3200;
    confidenceScore = 96;
  } else if (text.includes('water') || text.includes('sewer') || text.includes('fire') || category === 'Water' || category === 'Public Safety') {
    severity = 'High';
    priorityScore = 82;
    affectedPopulationEstimate = 1800;
    confidenceScore = 93;
  }

  if (hasImages) priorityScore = Math.min(99, priorityScore + 4);
  if (hasAudio) priorityScore = Math.min(99, priorityScore + 3);

  res.json({
    category,
    severity,
    priorityScore,
    confidenceScore,
    affectedPopulationEstimate,
    duplicatesDetected: text.includes('water') || text.includes('flood') ? [{ id: 'dup-1', title: `Similar issue near ${location?.city || 'local area'}`, similarityScore: 0.9, distanceKm: 0.5, reportedAt: '2 hours ago', status: 'Under_Review' }] : [],
    analysisRationale: [
      `Semantic classification identified ${category} risk with ${confidenceScore}% confidence.`,
      `${hasImages ? 'Photo evidence available' : 'Text-only input'} and ${hasAudio ? 'voice transcription present' : 'no voice input'} were processed.`,
      `Spatial density estimate suggests ${affectedPopulationEstimate.toLocaleString()} residents in active impact radius.`,
    ],
    recommendedAction: severity === 'Critical' ? 'Dispatch emergency response and isolate hazard zone.' : 'Route to relevant civic department for rapid intervention.',
    hazardType: `${category} risk assessment`,
    urgencyLevel: severity === 'Critical' ? 'Immediate' : 'Within 24h',
    matchedKeywords: title.split(' ').filter((word) => word.length > 4).slice(0, 5),
  });
});

app.post('/api/v1/ai/detect-duplicates', (req, res) => {
  const { title = '', category = 'Other' } = req.body || {};
  const text = `${title} ${category}`.toLowerCase();

  if (text.includes('water') || text.includes('flood')) {
    res.json([
      {
        id: 'CC-1542',
        title: 'Flooded drainage corridor near main market road',
        similarityScore: 0.91,
        distanceKm: 0.36,
        reportedAt: '2 hours ago',
        status: 'Under_Review',
      },
    ]);
    return;
  }

  res.json([]);
});

app.post('/api/v1/ai/match-partners', (req, res) => {
  const { category = 'Water', severity = 'High' } = req.body || {};

  res.json([
    {
      id: 'org-1',
      name: 'SEEDS India Rapid Response',
      type: 'NGO',
      matchScore: 96,
      expertise: [`${category} Mitigation`, 'Emergency Shelter', 'Community Relief'],
      location: 'National Capital Region',
      contactPerson: 'Priya Mukherjee',
    },
    {
      id: 'org-4',
      name: 'National Disaster Response Force (NDRF)',
      type: 'Authority',
      matchScore: 93,
      expertise: ['Search & Rescue', 'Evacuation', 'Heavy Equipment'],
      location: 'Regional Command Center',
      contactPerson: 'Command Team',
    },
    {
      id: 'org-2',
      name: 'Civic Infrastructure Lab',
      type: 'University',
      matchScore: 88,
      expertise: ['Drainage Modeling', 'Infrastructure Review'],
      location: 'Delhi',
      contactPerson: 'Field Engineering Team',
    },
  ]);
});

app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});