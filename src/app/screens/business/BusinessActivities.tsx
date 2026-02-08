import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Calendar, Users, MapPin, QrCode, Dumbbell, Trophy, Award } from 'lucide-react';
import { MOCK_ACTIVITIES, ACTIVITY_TYPES } from '@/app/data/mockData';
import { OrganizerPortfolio } from '@/app/components/OrganizerPortfolio';

interface BusinessActivitiesProps {
  onCreateActivity: () => void;
  onManageAttendance?: (activityId: string) => void;
  onManageSponsors?: (activityId: string) => void;
}

export function BusinessActivities({ onCreateActivity, onManageAttendance, onManageSponsors }: BusinessActivitiesProps) {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const myActivities = MOCK_ACTIVITIES.filter(a => a.type === 'activity');
  const sponsoredEvents = MOCK_ACTIVITIES.filter(a => a.type === 'event');

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Activities</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage events, sessions, and training programs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowPortfolio(true)}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Award className="w-4 h-4" />
            Portfolio
          </Button>
          <Button 
            onClick={onCreateActivity}
            size="sm"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Activity
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Calendar, label: 'Total Activities', value: myActivities.length, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Users, label: 'Participants', value: '245', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Trophy, label: 'Events Hosted', value: sponsoredEvents.length, color: 'text-secondary', bg: 'bg-secondary/10' },
          { icon: Dumbbell, label: 'Active Sessions', value: '8', color: 'text-primary', bg: 'bg-primary/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Grid */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Dumbbell className="w-4 h-4 text-primary" />
              Regular Activities
            </CardTitle>
            <Badge variant="secondary" className="text-xs">{myActivities.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {myActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myActivities.map((activity) => (
                <div key={activity.id} className="group border border-border rounded-xl overflow-hidden hover:shadow-md transition-all bg-card">
                  <div className="relative h-36 bg-muted">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <Badge className="absolute top-2.5 right-2.5 bg-green-500 text-white border-0 text-[10px] px-2">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-foreground mb-0.5 line-clamp-1">{activity.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{activity.sport}</p>
                    
                    <div className="space-y-1.5 text-xs mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        <span>{activity.participants}/{activity.maxParticipants} participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{activity.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-[11px] h-8 gap-1 hover:bg-primary hover:text-primary-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          onManageAttendance?.(activity.id);
                        }}
                      >
                        <QrCode className="w-3 h-3" />
                        Attendance
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-[11px] h-8 gap-1 hover:bg-secondary hover:text-secondary-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          onManageSponsors?.(activity.id);
                        }}
                      >
                        <Trophy className="w-3 h-3" />
                        Sponsors
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">No activities yet</p>
              <p className="text-xs text-muted-foreground mb-4">Create your first activity to get started</p>
              <Button onClick={onCreateActivity} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Plus className="w-4 h-4 mr-1.5" />
                Create Your First Activity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organizer Portfolio Modal */}
      {showPortfolio && (
        <OrganizerPortfolio onClose={() => setShowPortfolio(false)} />
      )}
    </div>
  );
}
