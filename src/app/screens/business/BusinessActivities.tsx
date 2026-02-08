import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Calendar, Users, MapPin, QrCode, Dumbbell, Trophy, Mountain, Tent, Activity as ActivityIcon, Award } from 'lucide-react';
import { MOCK_ACTIVITIES, ACTIVITY_TYPES } from '@/app/data/mockData';
import { OrganizerPortfolio } from '@/app/components/OrganizerPortfolio';
import { PageHeader } from '@/app/components/PageHeader';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface BusinessActivitiesProps {
  onCreateActivity: () => void;
  onManageAttendance?: (activityId: string) => void;
  onManageSponsors?: (activityId: string) => void;
}

// Custom arrow components
const CustomNextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
      aria-label="Next"
    />
  );
};

const CustomPrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
      aria-label="Previous"
    />
  );
};

export function BusinessActivities({ onCreateActivity, onManageAttendance, onManageSponsors }: BusinessActivitiesProps) {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const myActivities = MOCK_ACTIVITIES.filter(a => a.type === 'activity');
  const sponsoredEvents = MOCK_ACTIVITIES.filter(a => a.type === 'event');

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        title="Activities"
        subtitle="Manage events, sessions, and activities"
        actions={
          <>
            <Button 
              onClick={() => setShowPortfolio(true)}
              variant="outline"
              className="gap-2"
            >
              <Award className="w-4 h-4" />
              Portfolio
            </Button>
            <Button 
              onClick={onCreateActivity}
              className="bg-[#FC8936] hover:bg-[#E67A2F] gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Activity
            </Button>
          </>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-soft rounded-xl">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold text-foreground">{myActivities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft rounded-xl">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/8 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold text-foreground">245</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft rounded-xl">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/8 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Events Hosted</p>
                <p className="text-2xl font-bold text-foreground">{sponsoredEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft rounded-xl">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regular Activities Section */}
      <Card className="card-soft rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-primary" />
                </div>
                Regular Activities
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Recurring workouts, sessions, and training
              </p>
            </div>
            <Badge variant="secondary" className="rounded-lg bg-muted text-muted-foreground">{myActivities.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {myActivities.length > 0 ? (
            <Slider
              dots={false}
              infinite={false}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              arrows={true}
              nextArrow={<CustomNextArrow />}
              prevArrow={<CustomPrevArrow />}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  }
                }
              ]}
            >
              {myActivities.map((activity) => (
                <div key={activity.id} className="px-2">
                  <div className="border border-border/60 rounded-xl overflow-hidden card-soft cursor-pointer">
                    <div className="relative h-40 bg-muted">
                      <img 
                        src={activity.image} 
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                      <Badge 
                        variant="secondary"
                        className="absolute top-2.5 right-2.5 rounded-lg bg-emerald-500/90 text-white border-0"
                      >
                        Active
                      </Badge>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm flex-1 text-foreground">{activity.title}</h3>
                        {(activity as any).activityType && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {ACTIVITY_TYPES.find(t => t.id === (activity as any).activityType)?.icon}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{activity.sport}</p>
                      
                      <div className="flex flex-col gap-2 text-xs mb-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{activity.participants}/{activity.maxParticipants} participants</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{activity.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs h-8 flex items-center gap-1.5 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onManageAttendance) {
                              onManageAttendance(activity.id);
                            }
                          }}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Manage Attendance
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs h-8 flex items-center gap-1.5 rounded-lg hover:bg-secondary hover:text-white hover:border-secondary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onManageSponsors) {
                              onManageSponsors(activity.id);
                            }
                          }}
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          Manage Sponsors
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium mb-1">No activities yet</p>
              <p className="text-sm text-muted-foreground/70 mb-6">Get started by creating your first activity</p>
              <Button onClick={onCreateActivity} className="bg-secondary hover:bg-secondary/90 text-white rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
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
