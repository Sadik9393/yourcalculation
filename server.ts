import express from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent for telemetry
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('GEMINI_API_KEY is not set or using placeholder. AI features will fall back to smart local algorithms.');
}

// Simple file-based database for persistence
const DB_FILE = path.join(process.cwd(), 'db.json');

interface LocalDB {
  comments: any[];
  savedCalculations: any[];
  favorites: string[];
  deploySettings?: {
    githubToken?: string;
    githubRepo?: string;
    githubBranch?: string;
    vercelDeployHook?: string;
  };
}

const defaultDB: LocalDB = {
  comments: [
    { id: 'c1', calculatorId: 'loan-calculator', author: 'David K.', rating: 5, content: 'This EMI calculator helped me plan my mortgage pre-payments. Saving interest on early repayments is a real hack!', date: '2026-06-25' },
    { id: 'c2', calculatorId: 'loan-calculator', author: 'Sarah M.', rating: 4, content: 'Really clean design. The pie chart helps visualize the interest component clearly.', date: '2026-07-01' },
    { id: 'c3', calculatorId: 'sip-calculator', author: 'John Doe', rating: 5, content: 'Excellent compound interest charts. The 10-year growth is highly motivating!', date: '2026-07-02' },
    { id: 'c4', calculatorId: 'bmi-calculator', author: 'Clara S.', rating: 5, content: 'Super accurate BMI thresholds and BMI status classification!', date: '2026-07-04' },
  ],
  savedCalculations: [],
  favorites: ['loan-calculator', 'sip-calculator'],
  deploySettings: {
    githubToken: '',
    githubRepo: '',
    githubBranch: 'main',
    vercelDeployHook: '',
  },
};

function readDB(): LocalDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB, falling back to default:', err);
  }
  return defaultDB;
}

function writeDB(data: LocalDB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Initialize database file on startup
if (!fs.existsSync(DB_FILE)) {
  writeDB(defaultDB);
}

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Comments API
app.get('/api/comments/:calculatorId', (req, res) => {
  const { calculatorId } = req.params;
  const db = readDB();
  const filtered = db.comments.filter((c) => c.calculatorId === calculatorId);
  res.json(filtered);
});

app.post('/api/comments', (req, res) => {
  const { calculatorId, author, rating, content } = req.body;
  if (!calculatorId || !author || !rating || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = readDB();
  const newComment = {
    id: 'c_' + Date.now(),
    calculatorId,
    author,
    rating: Number(rating),
    content,
    date: new Date().toISOString().split('T')[0],
  };

  db.comments.unshift(newComment);
  writeDB(db);
  res.json(newComment);
});

// 2. Saved Calculations / History API
app.get('/api/history', (req, res) => {
  const db = readDB();
  res.json(db.savedCalculations);
});

app.post('/api/history', (req, res) => {
  const { calculatorId, calculatorName, inputs, outputs, explanation } = req.body;
  if (!calculatorId || !calculatorName || !inputs || !outputs) {
    return res.status(400).json({ error: 'Missing calculation data' });
  }

  const db = readDB();
  const newSave = {
    id: 's_' + Date.now(),
    calculatorId,
    calculatorName,
    inputs,
    outputs,
    explanation,
    date: new Date().toLocaleString(),
  };

  db.savedCalculations.unshift(newSave);
  writeDB(db);
  res.json(newSave);
});

app.delete('/api/history/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.savedCalculations = db.savedCalculations.filter((s) => s.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// 3. Favorites API
app.get('/api/favorites', (req, res) => {
  const db = readDB();
  res.json(db.favorites);
});

app.post('/api/favorites/toggle', (req, res) => {
  const { calculatorId } = req.body;
  if (!calculatorId) {
    return res.status(400).json({ error: 'Missing calculatorId' });
  }

  const db = readDB();
  const idx = db.favorites.indexOf(calculatorId);
  if (idx > -1) {
    db.favorites.splice(idx, 1);
  } else {
    db.favorites.push(calculatorId);
  }
  writeDB(db);
  res.json(db.favorites);
});

// 4. Gemini AI Explanation API
app.post('/api/calculate/ai-explain', async (req, res) => {
  const { calculatorId, calculatorName, inputs, outputs } = req.body;

  if (!calculatorId || !outputs) {
    return res.status(400).json({ error: 'Missing calculator metadata' });
  }

  // Fallback if AI is not configured
  if (!ai) {
    return res.json({
      explanation: `**Local Smart Summary:** Calculated result for ${calculatorName}. Inputs: ${JSON.stringify(inputs)}. Outputs: ${JSON.stringify(outputs)}. To enable premium AI explanation, make sure to configure a valid GEMINI_API_KEY in the secrets menu.`,
    });
  }

  try {
    const prompt = `You are the core intelligence at YourCalculation.com, a world-class educational and calculation advisor. 
We just ran the "${calculatorName}" (ID: ${calculatorId}).
User input values:
${JSON.stringify(inputs, null, 2)}

Calculated output values:
${JSON.stringify(outputs, null, 2)}

Please generate an interactive, engaging, and premium explain-the-math response in simple language.
Your explanation must follow this markdown format:
1. **Summary Analysis**: A friendly, simple-language translation of what their result means (e.g. "Your monthly EMI is $X").
2. **Key Insights**: Highlight 2-3 interesting patterns in the calculations.
3. **Smart Optimizations / Tips**: Offer 2-3 highly actionable, expert tips or optimizations (e.g. "If you increase your monthly payment by $100, you save approximately $Y in interest and shut down your loan Z years earlier").

Make sure your tone is helpful, authoritative, but completely jargon-free. Always refer to them as "you". Do not use bullet symbols inside code, use clean markdown. Ensure formatting is perfect.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error('Gemini explanation error:', error);
    res.status(500).json({ error: 'AI failed to generate explanation: ' + error.message });
  }
});

// 5. Gemini Natural Language AI Calculator API
app.post('/api/ai-calculator/query', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (!ai) {
    return res.json({
      analysis: 'AI Services Offline',
      calculatedValues: [
        { label: 'Query Recieved', value: query },
        { label: 'System Notice', value: 'Please connect your GEMINI_API_KEY to test the natural language calculator.' },
      ],
      suggestions: ['Add your GEMINI_API_KEY in Secrets', 'Browse our standard calculators list'],
      explanation: 'To activate the full natural language AI playground, please supply a valid `GEMINI_API_KEY` in the AI Studio environment.',
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `You are the elite "YourCalculation.com Natural Language AI Calculator". 
The user asks: "${query}"

You must parse the user request, identify the math or financial scenario involved, execute the proper mathematical or financial formulas yourself behind the scenes, and output a highly structured JSON response matching the requested schema.

Formulas should be standard (e.g., compound interest, mortgage calculations, salary tax brackets, rent affordability, BMI). Show your calculations in the output.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: 'Short headline or summary of the solution (e.g., "Yes, you can afford this home with custom savings adjustments").',
            },
            calculatedValues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: 'Display label (e.g., "Affordable Monthly Payment")' },
                  value: { type: Type.STRING, description: 'Formatted calculated value (e.g., "$1,250 / month")' },
                },
                required: ['label', 'value'],
              },
              description: 'List of exact calculation fields you computed to reach this answer.',
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 highly targeted, strategic recommendations or scenarios to compare.',
            },
            explanation: {
              type: Type.STRING,
              description: 'A rich explanation in clean markdown format, breaking down the mathematical steps you took, any assumptions made, and friendly advice.',
            },
          },
          required: ['analysis', 'calculatedValues', 'suggestions', 'explanation'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini NLP solver error:', error);
    res.status(500).json({ error: 'AI failed to solve query: ' + error.message });
  }
});

// ==========================================
// ADMIN DEPLOYMENT AND API AUTOMATION ENDPOINTS
// ==========================================

// Helper function to mask secret tokens for secure UI rendering
function maskToken(token?: string): string {
  if (!token) return '';
  if (token.length <= 8) return '********';
  return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
}

// 6. Get Deployment configurations
app.get('/api/admin/deploy-settings', (req, res) => {
  const db = readDB();
  const settings = db.deploySettings || {
    githubToken: '',
    githubRepo: '',
    githubBranch: 'main',
    vercelDeployHook: '',
  };

  res.json({
    githubRepo: settings.githubRepo || '',
    githubBranch: settings.githubBranch || 'main',
    vercelDeployHook: settings.vercelDeployHook || '',
    githubTokenMasked: maskToken(settings.githubToken),
    hasGithubToken: !!settings.githubToken,
  });
});

// 7. Save Deployment configurations
app.post('/api/admin/deploy-settings', (req, res) => {
  const { githubToken, githubRepo, githubBranch, vercelDeployHook } = req.body;
  const db = readDB();

  if (!db.deploySettings) {
    db.deploySettings = {};
  }

  // Update only if provided, or retain existing if not modified (for token masking scenario)
  if (githubToken !== undefined && githubToken !== '***RETAINED***') {
    db.deploySettings.githubToken = githubToken;
  }
  if (githubRepo !== undefined) {
    db.deploySettings.githubRepo = githubRepo;
  }
  if (githubBranch !== undefined) {
    db.deploySettings.githubBranch = githubBranch || 'main';
  }
  if (vercelDeployHook !== undefined) {
    db.deploySettings.vercelDeployHook = vercelDeployHook;
  }

  writeDB(db);
  res.json({ success: true, message: 'Deployment settings saved successfully' });
});

// 8. Trigger Automated Deployment (Git pushing to GitHub or Vercel Webhook)
app.post('/api/admin/deploy-trigger', async (req, res) => {
  const { mode } = req.body; // 'github' or 'vercel'
  const db = readDB();
  const settings = db.deploySettings;

  if (!settings) {
    return res.status(400).json({ error: 'No deployment configurations found.' });
  }

  if (mode === 'vercel') {
    const { vercelDeployHook } = settings;
    if (!vercelDeployHook) {
      return res.status(400).json({ error: 'Vercel Deploy Hook URL is not configured.' });
    }

    try {
      const response = await fetch(vercelDeployHook, { method: 'POST' });
      const responseText = await response.text();
      return res.json({ 
        success: true, 
        message: 'Successfully triggered Vercel deployment hook!', 
        details: responseText 
      });
    } catch (err: any) {
      console.error('Error calling Vercel deploy hook:', err);
      return res.status(500).json({ error: 'Failed to trigger Vercel deploy hook: ' + err.message });
    }
  } else if (mode === 'github') {
    const { githubToken, githubRepo, githubBranch = 'main' } = settings;
    if (!githubToken || !githubRepo) {
      return res.status(400).json({ error: 'GitHub Personal Access Token and Repository must be configured.' });
    }

    try {
      const cwd = process.cwd();
      const runSafe = (cmd: string, secretToHide?: string) => {
        try {
          return execSync(cmd, { cwd, encoding: 'utf8', stdio: 'pipe' });
        } catch (err: any) {
          let errMsg = err.message || '';
          if (secretToHide) {
            errMsg = errMsg.split(secretToHide).join('[REDACTED_TOKEN]');
          }
          throw new Error(errMsg);
        }
      };

      // Ensure it is a git repo
      let hasGit = false;
      try {
        execSync('git rev-parse --is-inside-work-tree', { cwd, stdio: 'ignore' });
        hasGit = true;
      } catch (e) {}

      if (!hasGit) {
        runSafe('git init');
      }

      runSafe('git config user.name "YourCalculation Deployer"');
      runSafe('git config user.email "sadikshaikh8367@gmail.com"');

      // Set origin url with credentials
      const remoteUrl = `https://x-access-token:${githubToken}@github.com/${githubRepo}.git`;
      
      try {
        execSync('git remote remove origin', { cwd, stdio: 'ignore' });
      } catch (e) {}

      runSafe(`git remote add origin ${remoteUrl}`, githubToken);

      // Stage all files
      runSafe('git add .');

      // Commit changes if any
      let hasChanges = true;
      try {
        const status = execSync('git status --porcelain', { cwd, encoding: 'utf8' });
        if (!status.trim()) {
          hasChanges = false;
        }
      } catch (e) {}

      if (hasChanges) {
        runSafe('git commit -m "Auto-update from YourCalculation.com Workspace"');
      }

      // Push to target branch
      runSafe(`git push -u origin ${githubBranch} --force`, githubToken);

      return res.json({ 
        success: true, 
        message: `Successfully synchronized and pushed latest changes to GitHub branch "${githubBranch}"! Vercel will auto-build this commit.` 
      });
    } catch (err: any) {
      console.error('Error pushing to GitHub:', err);
      return res.status(500).json({ error: 'GitHub synchronization failed: ' + err.message });
    }
  } else {
    return res.status(400).json({ error: 'Invalid deployment mode selected.' });
  }
});

// ==========================================
// VITE OR STATIC FILE SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`YourCalculation Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
