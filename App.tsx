
import React, { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import CameraView from './components/CameraView';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeSkinImage } from './services/geminiService';
import { translations, Language } from './translations';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [lang, setLang] = useState<Language>('ko');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];

  const handleCapture = async (image: string) => {
    setCapturedImage(image);
    setAppState('ANALYZING');
    setError(null);
    try {
      const result = await analyzeSkinImage(image, lang);
      setAnalysisResult(result);
      setAppState('RESULT');
    } catch (err) {
      console.error(err);
      setError(lang === 'ko' ? "AI 분석에 실패했습니다. 더 선명한 사진으로 다시 시도해주세요." : "AI analysis failed. Please try again with a clearer photo.");
      setAppState('CAPTURE');
    }
  };

  const resetApp = () => {
    setAppState('HOME');
    setAnalysisResult(null);
    setCapturedImage(null);
    setError(null);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ko' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <i className="fa-solid fa-leaf"></i>
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">{t.title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-bold transition flex items-center gap-2"
            >
              <i className="fa-solid fa-globe"></i>
              {lang === 'en' ? 'KO' : 'EN'}
            </button>
            <button 
              onClick={() => setAppState('CAPTURE')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition"
            >
              {t.getStarted}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {appState === 'HOME' && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mt-12 md:mt-24">
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="inline-block px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold uppercase tracking-widest border border-indigo-100">
                AI Powered Dermatologist
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                {lang === 'ko' ? <>{t.heroTitle.split('.')[0]}<span className="text-indigo-600"> {t.heroTitle.split('.')[1]}</span></> : t.heroTitle}
              </h2>
              <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
                {t.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => setAppState('CAPTURE')}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-indigo-200 shadow-indigo-100 hover:scale-[1.02] transition active:scale-95"
                >
                  {t.analyzeMySkin}
                </button>
                <div className="flex items-center gap-4 p-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 rounded-full border-2 border-white" alt="user" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">
                    {t.heroJoin}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="w-full aspect-square bg-indigo-100 rounded-[60px] relative overflow-hidden shadow-2xl">
                <img src="https://picsum.photos/seed/skincare-model/800/800" className="w-full h-full object-cover mix-blend-overlay" alt="Skin Care" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent"></div>
                <div className="absolute top-10 right-10 bg-white/90 backdrop-blur shadow-xl p-4 rounded-2xl animate-bounce">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Hydration</p>
                      <p className="text-xs text-gray-400">Improved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {appState === 'CAPTURE' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-8">{t.takePhoto}</h2>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-semibold">
                {error}
              </div>
            )}
            <CameraView 
              onCapture={handleCapture}
              onCancel={() => setAppState('HOME')}
              lang={lang}
            />
          </div>
        )}

        {appState === 'ANALYZING' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-microscope text-indigo-600 text-3xl animate-pulse"></i>
              </div>
            </div>
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-gray-900">{t.analyzingTitle}</h3>
              <p className="text-gray-500 animate-pulse">{t.analyzingSubtitle}</p>
              {capturedImage && (
                <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-indigo-200 mt-4 opacity-50 grayscale">
                  <img src={capturedImage} className="w-full h-full object-cover" alt="captured" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-[scan_2s_infinite]"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {appState === 'RESULT' && analysisResult && (
          <AnalysisDashboard 
            result={analysisResult} 
            onReset={resetApp}
            lang={lang}
          />
        )}
      </main>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(96px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
