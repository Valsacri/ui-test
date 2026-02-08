import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Sparkles, Target, Calendar, TrendingUp } from 'lucide-react';

interface ConfirmationProps {
  onComplete: () => void;
}

export function Confirmation({ onComplete }: ConfirmationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Progress */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className="h-1 flex-1 rounded-full bg-blue-600 transition-colors"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="space-y-8">
          {/* Success Animation Area */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-full mb-4 animate-bounce">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold">You're all set! 🎉</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our AI has created a personalized plan based on your goals and interests
            </p>
          </div>

          {/* AI Plan Preview */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Your Personalized Goals</h3>
                  <p className="text-sm text-muted-foreground">AI-powered milestones ready</p>
                </div>
              </div>

              <div className="space-y-3 pl-2">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Weekly Activity Plan</p>
                    <p className="text-sm text-muted-foreground">
                      3 activities matched to your interests
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Progress Tracking</p>
                    <p className="text-sm text-muted-foreground">
                      Smart milestones to keep you motivated
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">AI Recommendations</p>
                    <p className="text-sm text-muted-foreground">
                      Workouts and activities tailored for you
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">12+</p>
                <p className="text-xs text-muted-foreground mt-1">Activities near you</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">5</p>
                <p className="text-xs text-muted-foreground mt-1">Goals created</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">24</p>
                <p className="text-xs text-muted-foreground mt-1">Milestones ready</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
