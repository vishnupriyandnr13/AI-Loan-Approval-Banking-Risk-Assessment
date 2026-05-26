import React, { useEffect, useState } from "react";
import { Loader2, Check, Circle, ShieldAlert, BadgeCheck } from "lucide-react";
import { UNDERWRITING_STAGES } from "../data";

interface AnalysisStageProps {
  applicantName: string;
  onAnalysisSuccess: () => void;
}

export default function AnalysisStage({ applicantName, onAnalysisSuccess }: AnalysisStageProps) {
  const [currentStepId, setCurrentStepId] = useState<number>(1);
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    // Stage transition timer
    const totalSteps = UNDERWRITING_STAGES.length;
    
    // Slow interval to progress through the 8 stages
    const stepInterval = setInterval(() => {
      setCurrentStepId((prev) => {
        if (prev >= totalSteps) {
          clearInterval(stepInterval);
          // Small delay before announcing success
          setTimeout(() => {
            onAnalysisSuccess();
          }, 600);
          return totalSteps;
        }
        return prev + 1;
      });
    }, 1100);

    // Dynamic percent progress bar
    const progressInterval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 85);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onAnalysisSuccess]);

  // Current stage details
  const currentStage = UNDERWRITING_STAGES.find(s => s.id === currentStepId) || UNDERWRITING_STAGES[0];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10 animate-fade-in text-slate-100">
      
      {/* PROCESSING CARD */}
      <div className="bg-[#121214] border border-slate-800 p-8 rounded-2xl shadow-lg text-center space-y-5">
        
        <div className="relative inline-flex items-center justify-center p-4 bg-[#0c0c0e] rounded-full border border-slate-800">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          <BadgeCheck className="w-4 h-4 text-emerald-400 absolute bottom-3 right-3 bg-[#121214] rounded-full p-0.5 border border-slate-800" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-sans text-slate-100 tracking-tight font-bold">Securing Decisional Assessment</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            AI Underwriting Engine is cross-referencing files for <span className="font-semibold text-slate-200">{applicantName}</span>.
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="max-w-md mx-auto space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>PLATFORM VERIFICATION ENGINE</span>
            <span>{percent}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-300"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        {/* LOG BRIEF */}
        <div className="p-3 bg-[#0c0c0e] rounded-xl border border-slate-800 max-w-md mx-auto text-xs font-mono text-slate-350">
          <span className="text-slate-500">Current Agent Exec:</span> {currentStage.desc}
        </div>

      </div>

      {/* TIMELINE STEPS */}
      <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3 font-semibold">Underwriting Framework Pipelines</h3>
        
        <div className="space-y-4">
          {UNDERWRITING_STAGES.map((stage) => {
            const isCompleted = stage.id < currentStepId;
            const isCurrent = stage.id === currentStepId;

            return (
              <div 
                key={stage.id} 
                className={`flex items-center justify-between gap-4 p-3 rounded-xl border transition-all duration-300 ${
                  isCurrent 
                    ? "bg-[#09090b] border-indigo-505/80 scale-[1.002] shadow-sm border-indigo-500" 
                    : isCompleted 
                    ? "bg-emerald-950/10 border-emerald-900/10 opacity-75"
                    : "bg-[#09090b]/50 border-slate-850 opacity-40"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Icon step */}
                  <div className="flex items-center justify-center shrink-0">
                    {isCompleted ? (
                      <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                        <Check className="w-3.5 h-3.5 font-bold" />
                      </div>
                    ) : isCurrent ? (
                      <div className="p-1 rounded-full bg-indigo-950 text-indigo animate-pulse border border-indigo-500 text-indigo-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full text-slate-650">
                        <Circle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className={`text-sm font-medium ${isCurrent ? "text-slate-100 font-bold" : "text-slate-300"}`} style={{ fontFamily: isCurrent ? 'system-ui' : 'inherit' }}>
                      {stage.label}
                    </h4>
                    {isCurrent && (
                      <p className="text-xs text-slate-405 mt-0.5">{stage.desc}</p>
                    )}
                  </div>
                </div>

                <div className="text-xs font-mono">
                  {isCompleted ? (
                    <span className="text-emerald-400 font-semibold uppercase text-[10px] tracking-wide bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-sm">Passed</span>
                  ) : isCurrent ? (
                    <span className="text-indigo-400 font-semibold uppercase text-[10px] tracking-wide animate-pulse bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded-sm">Running</span>
                  ) : (
                    <span className="text-slate-600 uppercase text-[10px] tracking-wide">Queued</span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
