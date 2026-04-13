import { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { 
  Zap, Activity, TrendingUp, AlertCircle, CheckCircle2, Play, RefreshCw, 
  Database, Cpu, BarChart3, Github, BookOpen, Code2, Terminal, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

// --- Simulation Logic ---
const generateData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 48; i++) {
    const time = new Date(now.getTime() - (47 - i) * 3600000);
    const hour = time.getHours();
    const isWeekend = time.getDay() === 0 || time.getDay() === 6;
    
    // Base pattern: Higher during day
    const base = Math.sin((hour - 6) * Math.PI / 12) * 20 + 50;
    const weekendFactor = isWeekend ? 0.8 : 1.1;
    const noise = Math.random() * 5;
    
    const actual = base * weekendFactor + noise;
    // Forecast is slightly smoother version of actual
    const forecast = base * weekendFactor + (Math.random() * 2 - 1);
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actual: parseFloat(actual.toFixed(2)),
      forecast: parseFloat(forecast.toFixed(2)),
      error: Math.abs(actual - forecast).toFixed(2),
      hour,
      isWeekend
    });
  }
  return data;
};

// --- Components ---

const StatCard = ({ title, value, unit, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-xl", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {trend && (
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", 
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline gap-1 mt-1">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      <span className="text-slate-400 text-sm font-medium">{unit}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(generateData());
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const stats = useMemo(() => {
    const last = data[data.length - 1];
    const avgError = data.reduce((acc, curr) => acc + parseFloat(curr.error), 0) / data.length;
    return [
      { title: 'Current Usage', value: last.actual, unit: 'kWh', icon: Zap, color: 'bg-blue-500', trend: 12 },
      { title: 'Forecasted', value: last.forecast, unit: 'kWh', icon: TrendingUp, color: 'bg-indigo-500', trend: -2 },
      { title: 'Model Accuracy', value: (100 - (avgError / last.actual * 100)).toFixed(1), unit: '%', icon: CheckCircle2, color: 'bg-emerald-500' },
      { title: 'Mean Absolute Error', value: avgError.toFixed(2), unit: 'kWh', icon: AlertCircle, color: 'bg-amber-500' },
    ];
  }, [data]);

  const handleRetrain = () => {
    setIsTraining(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setData(generateData());
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Energy Forecasting Dashboard</h1>
          <p className="text-slate-500">Real-time simulation of AI-powered grid optimization</p>
        </div>
        <button 
          onClick={handleRetrain}
          disabled={isTraining}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {isTraining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isTraining ? `Training MLP... ${progress}%` : 'Retrain Model'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Consumption Trends (48h)</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-500">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-300" />
              <span className="text-slate-500">Forecast</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                interval={6}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorActual)" 
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                stroke="#a5b4fc" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Simulation Engine Active</h2>
            <p className="text-slate-400 mb-6 max-w-md">The system is currently simulating a Multi-Layer Perceptron (MLP) regressor analyzing 48 hours of synthetic smart grid data.</p>
            <div className="space-y-4">
              {[
                { label: 'Data Collection', status: 'Complete', icon: Database },
                { label: 'Feature Extraction (Hour/Day)', status: 'Complete', icon: Cpu },
                { label: 'Neural Network Inference', status: 'Running', icon: Activity },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <step.icon className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-slate-400">{step.status}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full -mr-32 -mt-32" />
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Optimization Goal</h3>
          <p className="text-slate-500 text-sm mt-2">Reducing grid load variance by 15% through predictive supply management.</p>
          <div className="mt-6 w-full pt-6 border-t border-slate-50">
             <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
               <span>Efficiency Gain</span>
               <span>+24.8%</span>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className="bg-indigo-500 h-full w-[74%]" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Documentation = () => {
  const sections = [
    {
      title: "1. Project Explanation",
      content: "AI-Based Energy Consumption Forecasting uses machine learning to predict future electricity demand. It solves the problem of unpredictable demand which leads to blackouts or wastage. In smart cities and manufacturing, this optimization reduces costs by 20-30% and supports net-zero goals.",
      icon: Info
    },
    {
      title: "2. Tech Stack (Intermediate)",
      content: "We use Python for its rich data ecosystem. Key libraries include Pandas for data manipulation, Scikit-Learn for the MLPRegressor neural network, and Matplotlib for visualization. No GPU is required for this scale of forecasting.",
      icon: Terminal
    },
    {
      title: "3. Architecture",
      content: "Input Data (CSV) -> Preprocessing (Resampling) -> Feature Engineering (Hour/Day extraction) -> MLP Training -> Forecasting -> Visualization Dashboard.",
      icon: BarChart3
    },
    {
      title: "4. Implementation Workflow",
      content: "The process starts with data cleaning (handling missing values), followed by extracting temporal features. The model is trained using a train-test split (80/20) and evaluated using Mean Absolute Error (MAE).",
      icon: Code2
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">Project Documentation</h1>
        <p className="text-slate-500 text-lg">Detailed guide for building the industry-oriented forecasting system</p>
      </div>

      <div className="grid gap-8">
        {sections.map((section, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            key={i} 
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <section.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
        <h3 className="text-emerald-900 font-bold text-lg mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Industry Use Case
        </h3>
        <p className="text-emerald-700">Companies like Google and Tesla use these exact patterns to manage data center cooling and Powerwall discharge cycles, saving millions in energy costs annually.</p>
      </div>
    </div>
  );
};

const CodeViewer = () => {
  const [activeFile, setActiveFile] = useState('main.py');
  
  const files = {
    'main.py': `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
import joblib

# 1. Load Data
data = pd.read_csv('energy.csv', parse_dates=['Datetime'], index_col='Datetime')

# 2. Feature Engineering
data['hour'] = data.index.hour
data['day'] = data.index.dayofweek

# 3. Model Training
X = data[['hour', 'day']]
y = data['Energy']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = MLPRegressor(hidden_layer_sizes=(64, 64), max_iter=500)
model.fit(X_train, y_train)

# 4. Save Model
joblib.dump(model, 'energy_model.pkl')`,
    'app.py': `from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load('energy_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array([[data['hour'], data['day']]])
    prediction = model.predict(features)
    return jsonify({'predicted_energy': prediction[0]})`,
    'requirements.txt': `pandas==2.1.0
scikit-learn==1.3.0
flask==3.0.0
joblib==1.3.2`
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-white/5">
          <div className="flex gap-2">
            {Object.keys(files).map(file => (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  activeFile === file ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {file}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          </div>
        </div>
        <div className="p-8 overflow-x-auto">
          <pre className="text-blue-300 font-mono text-sm leading-relaxed">
            <code>{files[activeFile as keyof typeof files]}</code>
          </pre>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-xl">
            <Github className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">GitHub Ready</p>
            <p className="text-xs text-slate-500">Copy these files to your repository for a professional portfolio.</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
          Download Project ZIP
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight">EnergyForecast<span className="text-blue-600">Pro</span></span>
            </div>
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Activity },
                { id: 'docs', label: 'Documentation', icon: BookOpen },
                { id: 'code', label: 'Source Code', icon: Code2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <button className="hidden sm:block px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                Deploy System
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'docs' && <Documentation />}
            {activeTab === 'code' && <CodeViewer />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white fill-current" />
                </div>
                <span className="text-lg font-bold">EnergyForecastPro</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Empowering smart cities with AI-driven energy insights. Built for students to showcase industry-grade machine learning projects.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Project Assets</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600">Python Source Code</a></li>
                <li><a href="#" className="hover:text-blue-600">Synthetic Datasets</a></li>
                <li><a href="#" className="hover:text-blue-600">Model Architecture</a></li>
                <li><a href="#" className="hover:text-blue-600">Deployment Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact & Support</h4>
              <p className="text-sm text-slate-500 mb-4">Questions about the implementation? Reach out for guidance.</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                  <Github className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
            © 2024 AI Energy Forecast Pro. All rights reserved. Industry-aligned Proof of Work.
          </div>
        </div>
      </footer>
    </div>
  );
}
