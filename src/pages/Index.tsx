import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { PredictionResults } from "@/components/PredictionResults";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prediction {
  label: string;
  confidence: number;
  description?: string;
}

const Index = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (data: string) => {
    setImageData(data);
    setPredictions([]);
  };

  const handleAnalyze = async () => {
    if (!imageData) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classify-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ imageData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Classification failed");
      }

      const data = await response.json();
      setPredictions(data.predictions || []);
      
      toast({
        title: "Analysis Complete",
        description: "Your image has been successfully classified!",
      });
    } catch (error) {
      console.error("Classification error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to classify image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
              AI Image Classifier
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload any image and let our AI identify what's in it with confidence scores
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Upload Image
                </h2>
                <ImageUpload 
                  onImageSelect={handleImageSelect} 
                  disabled={isAnalyzing}
                />
                {imageData && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Classify Image
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {predictions.length > 0 && (
                <div className="bg-card p-6 rounded-xl border border-border shadow-lg">
                  <PredictionResults predictions={predictions} />
                </div>
              )}
              {!imageData && predictions.length === 0 && (
                <div className="bg-card/50 p-12 rounded-xl border border-dashed border-border text-center">
                  <p className="text-muted-foreground">
                    Upload an image to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>Powered by Lovable AI • Advanced Image Recognition</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
