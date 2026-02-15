
import React, { useState, useEffect } from 'react';
import Step from './components/Step';
import Results from './components/Results';
import { ICONS } from './constants';
import { UserConfig, ConfigResult, InstrumentType, SkillLevel, Space, Budget, Condition, Priority } from './types';
import { getPianoRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [results, setResults] = useState<ConfigResult | null>(null);
  const [config, setConfig] = useState<UserConfig>({
    instrumentType: 'acoustic',
    skillLevel: 'beginner',
    space: 'small',
    budget: '1-3k',
    condition: 'new',
    priorities: ['warm_sound'],
  });

  const totalSteps = 6;

  const handleFinish = () => {
    setCurrentStep(totalSteps);
  };

  useEffect(() => {
    if (currentStep === totalSteps && !results && !isFinishing) {
      const fetchResults = async () => {
        setIsFinishing(true);
        const startTime = Date.now();
        
        try {
          const data = await getPianoRecommendations(config);
          
          const elapsedTime = Date.now() - startTime;
          const minDelay = 1800; 
          if (elapsedTime < minDelay) {
            await new Promise(r => setTimeout(r, minDelay - elapsedTime));
          }
          
          setResults(data);
        } catch (e) {
          console.error("Critical error in recommendation engine:", e);
          // Laat Results component de foutmelding afhandelen
          setResults(null);
        } finally {
          setIsFinishing(false);
        }
      };
      
      fetchResults();
    }
  }, [currentStep, totalSteps, results, isFinishing, config]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateConfig = <K extends keyof UserConfig>(key: K, value: UserConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const togglePriority = (id: Priority) => {
    setConfig(prev => {
      const exists = prev.priorities.includes(id);
      if (exists) {
        return { ...prev, priorities: prev.priorities.filter(p => p !== id) };
      }
      if (prev.priorities.length >= 3) return prev;
      return { ...prev, priorities: [...prev.priorities, id] };
    });
  };

  const reset = () => {
    setResults(null);
    setIsFinishing(false);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-4 sm:py-10 px-4" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col">
        
        <header className="bg-white border-b border-gray-100 py-6 px-6 md:px-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start select-none">
              <span className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-gray-500 font-medium ml-0.5">Sinds 1921</span>
              <span className="text-3xl md:text-4xl font-serif text-schumer-red leading-[0.9] tracking-tight py-0.5">SCHUMER</span>
              <span className="text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-black font-bold whitespace-nowrap ml-0.5">Piano's & Vleugels</span>
            </div>
            
            {currentStep < totalSteps && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full">Stap {currentStep + 1} / {totalSteps}</span>
              </div>
            )}
          </div>
        </header>

        {currentStep < totalSteps && (
          <div className="w-full h-1 bg-gray-50">
            <div 
              className="h-full bg-schumer-red transition-all duration-700 ease-in-out" 
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        )}

        <main className="flex-grow p-6 md:p-12">
          <div className="w-full max-w-3xl mx-auto">
            {currentStep === 0 && (
              <Step
                question="Wat zoekt u precies?"
                subtitle="Laat ons u begeleiden naar het ideale instrument"
                options={[
                  { id: 'acoustic', label: 'Akoestische piano', icon: <ICONS.AcousticPiano /> },
                  { id: 'vleugel', label: 'Vleugel', icon: <ICONS.GrandPiano /> },
                  { id: 'digital', label: 'Digitale piano', icon: <ICONS.Digital /> },
                  { id: 'unsure', label: 'Ik twijfel nog', icon: <ICONS.Question /> },
                ]}
                selectedId={config.instrumentType}
                onSelect={(id) => { updateConfig('instrumentType', id as InstrumentType); handleNext(); }}
              />
            )}

            {currentStep === 1 && (
              <Step
                question="Wat is uw speelniveau?"
                options={[
                  { id: 'beginner', label: 'Beginner', icon: <ICONS.SkillBeginner /> },
                  { id: 'intermediate', label: 'Gevorderd', icon: <ICONS.SkillIntermediate /> },
                  { id: 'advanced', label: 'Vergevorderd / Conservatorium', icon: <ICONS.SkillAdvanced /> },
                  { id: 'professional', label: 'Professioneel', icon: <ICONS.SkillProfessional /> },
                ]}
                selectedId={config.skillLevel}
                onSelect={(id) => { updateConfig('skillLevel', id as SkillLevel); handleNext(); }}
              />
            )}

            {currentStep === 2 && (
              <Step
                question="Waar komt het instrument te staan?"
                options={[
                  { id: 'small', label: 'Klein appartement', icon: <ICONS.SpaceSmall /> },
                  { id: 'medium', label: 'Gemiddelde woonkamer', icon: <ICONS.SpaceMedium /> },
                  { id: 'large', label: 'Grote woonkamer / muziekkamer', icon: <ICONS.SpaceLarge /> },
                  { id: 'unsure', label: 'Weet ik nog niet', icon: <ICONS.Question /> },
                ]}
                selectedId={config.space}
                onSelect={(id) => { updateConfig('space', id as Space); handleNext(); }}
              />
            )}

            {currentStep === 3 && (
              <Step
                question="Wat is uw budgetindicatie?"
                options={[
                  { id: '1-3k', label: '€1.000 – €3.000', icon: <ICONS.Money1 /> },
                  { id: '3-7.5k', label: '€3.000 – €7.500', icon: <ICONS.Money2 /> },
                  { id: '7.5-15k', label: '€7.500 – €15.000', icon: <ICONS.Money3 /> },
                  { id: '15k+', label: '€15.000+', icon: <ICONS.Money4 /> },
                ]}
                selectedId={config.budget}
                onSelect={(id) => { updateConfig('budget', id as Budget); handleNext(); }}
              />
            )}

            {currentStep === 4 && (
              <Step
                question="Wat heeft uw voorkeur?"
                options={[
                  { id: 'new', label: 'Nieuw', icon: <ICONS.ConditionNew /> },
                  { id: 'used', label: 'Tweedehands / gereviseerd', icon: <ICONS.ConditionUsed /> },
                  { id: 'any', label: 'Maakt niet uit', icon: <ICONS.Sparkle /> },
                ]}
                selectedId={config.condition}
                onSelect={(id) => { updateConfig('condition', id as Condition); handleNext(); }}
              />
            )}

            {currentStep === 5 && (
              <div className="flex flex-col">
                <Step
                  question="Wat is belangrijk voor u? (Kies max. 3)"
                  options={[
                    { id: 'warm_sound', label: 'Warme klank', icon: <ICONS.Warm /> },
                    { id: 'bright_sound', label: 'Heldere klank', icon: <ICONS.Bright /> },
                    { id: 'design', label: 'Design & uitstraling', icon: <ICONS.Design /> },
                    { id: 'compact', label: 'Compact formaat', icon: <ICONS.Compact /> },
                    { id: 'value', label: 'Waardebehoud', icon: <ICONS.Value /> },
                    { id: 'silent', label: 'Stil oefenen (Silent)', icon: <ICONS.Silent /> },
                    { id: 'top_brand', label: 'Topmerk', icon: <ICONS.TopBrand /> },
                  ]}
                  selectedId={config.priorities}
                  onSelect={(id) => togglePriority(id as Priority)}
                  multiSelect
                />
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={handleFinish}
                    disabled={config.priorities.length === 0}
                    className={`
                      px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300
                      ${config.priorities.length > 0 
                        ? 'bg-schumer-dark text-white shadow-xl hover:-translate-y-1 hover:bg-black' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    Toon mijn advies
                  </button>
                </div>
              </div>
            )}

            {currentStep === totalSteps && (
              <Results 
                results={results} 
                onReset={reset} 
                isLoading={isFinishing} 
              />
            )}

            {currentStep > 0 && currentStep < totalSteps && (
              <div className="mt-10 flex justify-center">
                <button 
                  onClick={handleBack}
                  className="text-gray-400 hover:text-schumer-red font-medium flex items-center gap-2 transition-colors text-sm uppercase tracking-widest"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Vorige stap
                </button>
              </div>
            )}
          </div>
        </main>

        <footer className="py-10 px-6 md:px-12 border-t border-gray-50 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-schumer-red mb-3 shadow-sm transition-all group-hover:bg-schumer-red group-hover:text-white">
                <ICONS.Specialist />
              </div>
              <h4 className="font-bold text-gray-800 text-xs uppercase tracking-widest mb-1">Dé specialist</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">Sinds 1921 dé piano-specialist van Nederland.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-schumer-red mb-3 shadow-sm transition-all group-hover:bg-schumer-red group-hover:text-white">
                <ICONS.Workshop />
              </div>
              <h4 className="font-bold text-gray-800 text-xs uppercase tracking-widest mb-1">Eigen werkplaats</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">Vakkundig onderhoud door eigen pianotechnici.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-schumer-red mb-3 shadow-sm transition-all group-hover:bg-schumer-red group-hover:text-white">
                <ICONS.Advice />
              </div>
              <h4 className="font-bold text-gray-800 text-xs uppercase tracking-widest mb-1">Eerlijk advies</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">Persoonlijk en eerlijk advies in onze showroom.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
