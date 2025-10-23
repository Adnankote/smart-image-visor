import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Prediction {
  label: string;
  confidence: number;
  description?: string;
}

interface PredictionResultsProps {
  predictions: Prediction[];
}

export const PredictionResults = ({ predictions }: PredictionResultsProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Classification Results
        </h2>
      </div>

      <div className="space-y-3">
        {predictions.map((prediction, index) => (
          <Card 
            key={index}
            className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">
                    {prediction.label}
                  </h3>
                  {prediction.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {prediction.description}
                    </p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-primary">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">confidence</p>
                </div>
              </div>
              <Progress 
                value={prediction.confidence * 100} 
                className="h-2"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
