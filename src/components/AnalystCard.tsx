
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Analyst } from "@/types/analyst";

interface AnalystCardProps {
  analyst: Analyst;
  isActive: boolean;
  reasoning: string[];
}

const AnalystCard = ({ analyst, isActive, reasoning }: AnalystCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`p-6 transition-all duration-300 ${
        isActive ? 'ring-2 ring-primary shadow-lg' : ''
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={analyst.avatar} alt={analyst.name} />
            <AvatarFallback>{analyst.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{analyst.name}</h3>
            <p className="text-sm text-muted-foreground">{analyst.role}</p>
          </div>
          {reasoning.length > 0 && (
            <div className="mt-4 w-full">
              <h4 className="text-sm font-medium mb-2">Chain of Thought</h4>
              <ul className="text-sm space-y-2">
                {reasoning.map((thought, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-muted-foreground"
                  >
                    {thought}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default AnalystCard;
