import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical, Users, Save, RotateCcw } from 'lucide-react';

// Formation templates based on sport
const FORMATIONS = {
  Football: ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '5-3-2'],
  Basketball: ['2-1-2', '1-3-1', '2-3', '1-2-2'],
  Volleyball: ['4-2', '5-1', '6-2'],
  Hockey: ['2-3', '1-2-2', '1-4'],
  Rugby: ['1-3-3-1', '1-3-2-2'],
};

// Position configurations
const POSITION_CONFIGS: any = {
  Football: {
    '4-4-2': {
      positions: [
        { id: 'gk', label: 'GK', x: 50, y: 90 },
        { id: 'lb', label: 'LB', x: 20, y: 70 },
        { id: 'cb1', label: 'CB', x: 40, y: 70 },
        { id: 'cb2', label: 'CB', x: 60, y: 70 },
        { id: 'rb', label: 'RB', x: 80, y: 70 },
        { id: 'lm', label: 'LM', x: 20, y: 45 },
        { id: 'cm1', label: 'CM', x: 40, y: 45 },
        { id: 'cm2', label: 'CM', x: 60, y: 45 },
        { id: 'rm', label: 'RM', x: 80, y: 45 },
        { id: 'st1', label: 'ST', x: 40, y: 20 },
        { id: 'st2', label: 'ST', x: 60, y: 20 },
      ]
    },
    '4-3-3': {
      positions: [
        { id: 'gk', label: 'GK', x: 50, y: 90 },
        { id: 'lb', label: 'LB', x: 20, y: 70 },
        { id: 'cb1', label: 'CB', x: 40, y: 70 },
        { id: 'cb2', label: 'CB', x: 60, y: 70 },
        { id: 'rb', label: 'RB', x: 80, y: 70 },
        { id: 'cm1', label: 'CM', x: 30, y: 50 },
        { id: 'cdm', label: 'CDM', x: 50, y: 55 },
        { id: 'cm2', label: 'CM', x: 70, y: 50 },
        { id: 'lw', label: 'LW', x: 20, y: 20 },
        { id: 'st', label: 'ST', x: 50, y: 15 },
        { id: 'rw', label: 'RW', x: 80, y: 20 },
      ]
    }
  },
  Basketball: {
    '2-1-2': {
      positions: [
        { id: 'pg', label: 'PG', x: 50, y: 75 },
        { id: 'sg', label: 'SG', x: 70, y: 75 },
        { id: 'sf', label: 'SF', x: 50, y: 50 },
        { id: 'pf', label: 'PF', x: 30, y: 30 },
        { id: 'c', label: 'C', x: 70, y: 30 },
      ]
    }
  },
  Volleyball: {
    '4-2': {
      positions: [
        { id: 'oh1', label: 'OH', x: 20, y: 30 },
        { id: 'oh2', label: 'OH', x: 50, y: 30 },
        { id: 's1', label: 'S', x: 35, y: 50 },
        { id: 's2', label: 'S', x: 65, y: 50 },
        { id: 'mb1', label: 'MB', x: 30, y: 70 },
        { id: 'mb2', label: 'MB', x: 70, y: 70 },
      ]
    }
  }
};

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  avatar?: string;
}

interface DraggablePlayerProps {
  player: Player;
  x: number;
  y: number;
  label: string;
  onDrop: (playerId: string, positionId: string) => void;
  positionId: string;
}

const DraggablePlayer = ({ player, x, y, label, onDrop, positionId }: DraggablePlayerProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'player',
    item: { playerId: player.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'player',
    drop: (item: { playerId: string }) => {
      onDrop(item.playerId, positionId);
    },
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="absolute cursor-move"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <Avatar className="h-12 w-12 border-2 border-white shadow-lg ring-2 ring-[#FC8936]">
          <AvatarImage src={player.avatar} alt={player.name} />
          <AvatarFallback className="bg-gradient-to-br from-[#FC8936] to-[#E67A2E] text-white text-xs font-bold">
            {player.number}
          </AvatarFallback>
        </Avatar>
        <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
          <p className="text-xs font-semibold text-gray-900">{label}</p>
        </div>
        <div className="bg-[#FC8936] text-white px-2 py-0.5 rounded-full shadow-sm">
          <p className="text-xs font-bold">{player.name.split(' ')[0]}</p>
        </div>
      </div>
    </div>
  );
};

interface FormationBuilderProps {
  sport?: string;
  onSave?: (formation: any) => void;
}

export function FormationBuilder({ sport = 'Football', onSave }: FormationBuilderProps) {
  const availableFormations = FORMATIONS[sport as keyof typeof FORMATIONS] || FORMATIONS.Football;
  const [selectedFormation, setSelectedFormation] = useState(availableFormations[0]);
  
  // Mock players
  const [players, setPlayers] = useState<Record<string, Player>>({
    'gk': { id: 'p1', name: 'John Keeper', number: 1, position: 'GK' },
    'lb': { id: 'p2', name: 'Mike Left', number: 3, position: 'LB' },
    'cb1': { id: 'p3', name: 'Tom Center', number: 4, position: 'CB' },
    'cb2': { id: 'p4', name: 'David Strong', number: 5, position: 'CB' },
    'rb': { id: 'p5', name: 'Alex Right', number: 2, position: 'RB' },
    'lm': { id: 'p6', name: 'Chris Wing', number: 11, position: 'LM' },
    'cm1': { id: 'p7', name: 'James Mid', number: 8, position: 'CM' },
    'cm2': { id: 'p8', name: 'Ryan Play', number: 10, position: 'CM' },
    'rm': { id: 'p9', name: 'Luke Fast', number: 7, position: 'RM' },
    'st1': { id: 'p10', name: 'Mark Score', number: 9, position: 'ST' },
    'st2': { id: 'p11', name: 'Paul Goal', number: 14, position: 'ST' },
  });

  const currentPositions = POSITION_CONFIGS[sport]?.[selectedFormation] || POSITION_CONFIGS.Football['4-4-2'];

  const handlePlayerDrop = (playerId: string, positionId: string) => {
    // Find the player's current position
    const currentPositionId = Object.keys(players).find(key => players[key].id === playerId);
    if (!currentPositionId) return;

    // Swap players
    const newPlayers = { ...players };
    const temp = newPlayers[positionId];
    newPlayers[positionId] = newPlayers[currentPositionId];
    newPlayers[currentPositionId] = temp;
    
    setPlayers(newPlayers);
  };

  const handleSave = () => {
    onSave?.({ formation: selectedFormation, players });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FC8936]" />
                <span className="font-semibold text-gray-900">Formation Setup</span>
              </div>
              <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select formation" />
                </SelectTrigger>
                <SelectContent>
                  {availableFormations.map((formation) => (
                    <SelectItem key={formation} value={formation}>
                      {formation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="bg-orange-50 text-[#FC8936] border-orange-200">
                {sport}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={handleSave}
                size="sm" 
                className="bg-[#FC8936] hover:bg-[#E67A2E]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Formation
              </Button>
            </div>
          </div>
        </Card>

        {/* Formation Field */}
        <Card className="p-6">
          <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-green-600 to-green-700 rounded-lg overflow-hidden">
            {/* Field markings */}
            <div className="absolute inset-0">
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />
              
              {/* Halfway line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30" />
              
              {/* Penalty areas */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/5 border-t-2 border-l-2 border-r-2 border-white/30" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/5 border-b-2 border-l-2 border-r-2 border-white/30" />
              
              {/* Goal boxes */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[10%] border-t-2 border-l-2 border-r-2 border-white/30" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[10%] border-b-2 border-l-2 border-r-2 border-white/30" />
            </div>

            {/* Players */}
            {currentPositions.positions.map((position: any) => {
              const player = players[position.id];
              if (!player) return null;
              
              return (
                <DraggablePlayer
                  key={position.id}
                  player={player}
                  x={position.x}
                  y={position.y}
                  label={position.label}
                  positionId={position.id}
                  onDrop={handlePlayerDrop}
                />
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 flex items-center gap-2">
              <GripVertical className="w-4 h-4" />
              <span className="font-medium">Drag and drop players to change positions</span>
            </p>
          </div>
        </Card>
      </div>
    </DndProvider>
  );
}