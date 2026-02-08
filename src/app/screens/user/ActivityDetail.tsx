import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { MapView } from '@/app/components/MapView';
import { SportBadge } from '@/app/components/SportBadge';
import { MOCK_ACTIVITIES } from '@/app/data/mockData';
import { 
  ArrowLeft, Calendar, MapPin, Users, Clock, 
  Trophy, Share2, Heart, MessageCircle 
} from 'lucide-react';

interface ActivityDetailProps {
  activityId: string;
  onBack: () => void;
}

export function ActivityDetail({ activityId, onBack }: ActivityDetailProps) {
  const activity = MOCK_ACTIVITIES.find(a => a.id === activityId);

  if (!activity) {
    return <div>Activity not found</div>;
  }

  const participants = [
    { id: '1', name: 'Sarah M.', image: '' },
    { id: '2', name: 'Mike R.', image: '' },
    { id: '3', name: 'Emma L.', image: '' },
    { id: '4', name: 'John D.', image: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <Card className="shadow-lg">
          <CardContent className="p-0 space-y-6">
            {/* Image Header */}
            <div className="relative">
              {activity.image && (
                <div className="h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 rounded-t-lg">
                  <img 
                    src={activity.image} 
                    alt={activity.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Back Button */}
              <button
                onClick={onBack}
                className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content padding wrapper */}
            <div className="p-6 space-y-6">
              {/* Title & Badge */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-1">{activity.title}</h1>
                    <p className="text-muted-foreground">{activity.sport}</p>
                  </div>
                  <SportBadge 
                    sport={activity.sport} 
                    level={activity.level} 
                    size="md"
                  />
                </div>
              </div>

              {/* Sponsor Banner */}
              {activity.sponsored && activity.sponsor && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{activity.sponsor.logo}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold text-yellow-900">
                          Sponsored Event
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        {activity.sponsor.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{activity.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{activity.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 col-span-2">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{activity.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 col-span-2">
                  <Users className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="font-medium mb-2">
                      {activity.participants}/{activity.maxParticipants} joined
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {participants.slice(0, 4).map((participant) => (
                          <Avatar key={participant.id} className="w-8 h-8 border-2 border-white">
                            <AvatarImage src={participant.image} />
                            <AvatarFallback className="text-xs">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {activity.participants > 4 && (
                        <span className="text-sm text-muted-foreground">
                          +{activity.participants - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About this activity</h3>
                <p className="text-muted-foreground">
                  {activity.description}
                </p>
              </div>

              {/* What to Bring */}
              <div>
                <h3 className="font-semibold mb-2">What to bring</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Comfortable athletic wear
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Water bottle
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {activity.sport === 'Running' ? 'Running shoes' : 'Appropriate equipment'}
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Map Location */}
              {activity.coordinates && (
                <div>
                  <h3 className="font-semibold mb-3">Location</h3>
                  <div className="overflow-hidden rounded-lg">
                    <MapView
                      center={[activity.coordinates.lat, activity.coordinates.lng]}
                      zoom={14}
                      markers={[
                        {
                          position: [activity.coordinates.lat, activity.coordinates.lng],
                          title: activity.title,
                          description: activity.location,
                        }
                      ]}
                      height="250px"
                      className="rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Discussion Section */}
        <Card className="mt-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Discussion
              </h3>
              <Badge variant="secondary">3 messages</Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center py-4">
              Join this activity to see the discussion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button variant="outline" className="flex-1">
            Ask Question
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            Join Activity
          </Button>
        </div>
      </div>
    </div>
  );
}