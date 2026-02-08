import { Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { motion } from 'motion/react';
import { spacing, elevation, iconSize } from '@/lib/design-system';

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
        className={`${elevation.low} hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className={`flex items-start justify-between ${spacing.sm}`}>
            <div className={`flex items-start ${spacing.sm} flex-1`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#003C66] to-[#005A99] flex items-center justify-center flex-shrink-0 shadow-md">
                <Target className={`${iconSize.md} text-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg leading-tight text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className="flex-shrink-0 bg-gradient-to-r from-blue-100 to-green-100 text-[#003C66] border-0"
            >
              {category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className={spacing.md}>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">Overall Progress</span>
              <span className={`font-bold flex items-center ${spacing.xs} text-[#003C66]`}>
                <TrendingUp className={iconSize.sm} />
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-600 font-medium">Milestones</span>
              <span className="font-semibold text-gray-900">
                {completedMilestones}/{milestones.length}
              </span>
            </div>
            <div className={spacing.xs}>
              {milestones.slice(0, 3).map((milestone) => (
                <div
                  key={milestone.id}
                  className={`flex items-center ${spacing.xs} text-sm py-1`}
                >
                  {milestone.completed ? (
                    <CheckCircle2 className={`${iconSize.sm} text-green-600 flex-shrink-0`} />
                  ) : (
                    <Circle className={`${iconSize.sm} text-gray-400 flex-shrink-0`} />
                  )}
                  <span className={milestone.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                    {milestone.title}
                  </span>
                </div>
              ))}
              {milestones.length > 3 && (
                <p className="text-xs text-gray-500 pl-6 mt-1">
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