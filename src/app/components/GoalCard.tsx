import { Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { motion } from 'motion/react';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

interface GoalCardProps {
  title: string;
  description: string;
  progress: number;
  milestones: Milestone[];
  category: string;
  onClick?: () => void;
}

export function GoalCard({
  title,
  description,
  progress,
  milestones,
  category,
  onClick
}: GoalCardProps) {
  const completedMilestones = milestones.filter(m => m.completed).length;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold leading-tight">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="flex-shrink-0">
              {category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Milestones</span>
              <span className="font-medium">
                {completedMilestones}/{milestones.length}
              </span>
            </div>
            <div className="space-y-2">
              {milestones.slice(0, 3).map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-2 text-sm"
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                    {milestone.title}
                  </span>
                </div>
              ))}
              {milestones.length > 3 && (
                <p className="text-xs text-muted-foreground pl-6">
                  +{milestones.length - 3} more milestones
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}