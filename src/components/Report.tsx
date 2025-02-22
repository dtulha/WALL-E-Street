
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Speaker } from "lucide-react";

interface ReportProps {
  content: string;
  onSpeak: () => void;
}

const Report = ({ content, onSpeak }: ReportProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Analysis Report</h2>
          <Button variant="ghost" size="icon" onClick={onSpeak}>
            <Speaker className="h-4 w-4" />
          </Button>
        </div>
        <div className="prose prose-sm max-w-none">
          {content}
        </div>
      </Card>
    </motion.div>
  );
};

export default Report;
