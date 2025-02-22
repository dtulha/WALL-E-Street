
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";

interface InputSectionProps {
  onSubmit: (query: string) => void;
  isProcessing: boolean;
}

const InputSection = ({ onSubmit, isProcessing }: InputSectionProps) => {
  const [query, setQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask your research question..."
        className="flex-1"
        disabled={isProcessing}
      />
      <Button 
        type="submit" 
        disabled={!query.trim() || isProcessing}
        variant="secondary"
      >
        <Send className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={isRecording ? "destructive" : "outline"}
        onClick={() => setIsRecording(!isRecording)}
        disabled={isProcessing}
      >
        <Mic className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default InputSection;
