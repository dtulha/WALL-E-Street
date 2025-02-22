
import { useState } from "react";
import { motion } from "framer-motion";
import AnalystCard from "@/components/AnalystCard";
import InputSection from "@/components/InputSection";
import Report from "@/components/Report";
import { analysts } from "@/data/analysts";
import { AnalysisState } from "@/types/analyst";

const Index = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    currentAnalyst: null,
    report: null,
    reasoningChains: {},
  });

  const handleQuerySubmit = async (query: string) => {
    setAnalysisState({
      isAnalyzing: true,
      currentAnalyst: analysts[0].id,
      report: null,
      reasoningChains: {},
    });

    // Simulate analysis process
    for (const analyst of analysts) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAnalysisState((prev) => ({
        ...prev,
        currentAnalyst: analyst.id,
        reasoningChains: {
          ...prev.reasoningChains,
          [analyst.id]: [
            "Analyzing input data...",
            "Processing information...",
            "Finalizing insights...",
          ],
        },
      }));
    }

    setAnalysisState((prev) => ({
      ...prev,
      isAnalyzing: false,
      currentAnalyst: null,
      report: "Sample analysis report content. This would be replaced with actual AI-generated content.",
    }));
  };

  const handleSpeak = () => {
    // Implement text-to-speech functionality
    console.log("Speaking report");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">AI Equity Research Team</h1>
          <p className="mt-2 text-muted-foreground">Your personal team of AI analysts</p>
        </header>

        <InputSection
          onSubmit={handleQuerySubmit}
          isProcessing={analysisState.isAnalyzing}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analysts.map((analyst) => (
            <AnalystCard
              key={analyst.id}
              analyst={analyst}
              isActive={analyst.id === analysisState.currentAnalyst}
              reasoning={analysisState.reasoningChains[analyst.id] || []}
            />
          ))}
        </div>

        {analysisState.report && (
          <Report
            content={analysisState.report}
            onSpeak={handleSpeak}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Index;
