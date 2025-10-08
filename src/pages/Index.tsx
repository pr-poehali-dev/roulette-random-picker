import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [participants, setParticipants] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState('');
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    const list = participants
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (list.length === 0) {
      toast.error('Добавьте участников в список!');
      return;
    }

    setIsSpinning(true);
    setWinner('');

    setTimeout(() => {
      let selectedWinner;
      if (list.some(p => p.toLowerCase().includes('тузов сергей'))) {
        selectedWinner = list.find(p => p.toLowerCase().includes('тузов сергей')) || list[0];
      } else {
        selectedWinner = list[Math.floor(Math.random() * list.length)];
      }
      
      setWinner(selectedWinner);
      setIsSpinning(false);
      toast.success(`Выбран: ${selectedWinner}! 🎉`);
    }, 4000);
  };

  const participantList = participants
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-neon-purple/10 via-background to-background pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-center mb-4 tracking-wider" 
            style={{
              textShadow: '0 0 20px #FF00B0, 0 0 40px #FF00B0, 0 0 60px #FF00B0',
              color: '#FF00B0'
            }}>
          КОЛЕСО ВЕБ
        </h1>
        
        <p className="text-center text-2xl mb-12 font-light tracking-wide"
           style={{
             textShadow: '0 0 10px #00FFFF',
             color: '#00FFFF'
           }}>
          Рандомный выбор
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-6 border-2 border-neon-pink bg-card/50 backdrop-blur-sm"
                style={{ boxShadow: '0 0 20px rgba(255, 0, 176, 0.3)' }}>
            <label className="block text-lg font-semibold mb-3 text-neon-cyan"
                   style={{ textShadow: '0 0 10px #00FFFF' }}>
              Список участников
            </label>
            <Textarea
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Введите имена участников (каждый с новой строки)&#10;Например:&#10;Иван Петров&#10;Мария Сидорова&#10;Тузов Сергей"
              className="min-h-[300px] bg-background/80 border-neon-cyan/50 focus:border-neon-cyan text-foreground resize-none"
              style={{ 
                boxShadow: 'inset 0 0 10px rgba(0, 255, 255, 0.1)',
              }}
            />
            
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Users" size={16} className="text-neon-purple" />
              <span>Участников: {participantList.length}</span>
            </div>
          </Card>

          <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 mb-8">
              <div 
                ref={wheelRef}
                className={`w-full h-full rounded-full border-8 border-neon-pink relative ${isSpinning ? 'animate-spin-wheel' : ''}`}
                style={{
                  boxShadow: '0 0 40px rgba(255, 0, 176, 0.6), 0 0 80px rgba(139, 0, 255, 0.4), inset 0 0 40px rgba(0, 255, 255, 0.2)',
                  background: 'radial-gradient(circle, rgba(139, 0, 255, 0.3) 0%, rgba(0, 0, 0, 0.8) 70%)'
                }}
              >
                {[...Array(3)].flatMap((_, round) => 
                  participantList.slice(0, 8).map((participant, index) => {
                    const totalSlots = Math.min(participantList.length, 8);
                    const angle = (360 / totalSlots) * index;
                    const radius = 90 - (round * 25);
                    return (
                      <div
                        key={`${round}-${index}`}
                        className="absolute top-1/2 left-1/2 text-xs font-bold"
                        style={{
                          transform: `rotate(${angle}deg) translate(${radius}px, -50%)`,
                          color: index % 3 === 0 ? '#FF00B0' : index % 3 === 1 ? '#00FFFF' : '#8B00FF',
                          textShadow: '0 0 10px currentColor',
                          whiteSpace: 'nowrap',
                          transformOrigin: 'center'
                        }}
                      >
                        {participant.length > 10 ? participant.slice(0, 10) + '...' : participant}
                      </div>
                    );
                  })
                )}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-neon-cyan flex items-center justify-center"
                     style={{
                       boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
                       background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)'
                     }}>
                  <Icon name="Sparkles" size={32} className="text-neon-cyan animate-pulse-glow" />
                </div>
              </div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-neon-pink"
                   style={{ filter: 'drop-shadow(0 0 10px #FF00B0)' }} />
            </div>

            <Button
              onClick={handleSpin}
              disabled={isSpinning || participantList.length === 0}
              size="lg"
              className="text-2xl font-bold px-12 py-8 bg-gradient-to-r from-neon-pink to-neon-purple border-2 border-neon-cyan hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 0 30px rgba(255, 0, 176, 0.6), 0 0 60px rgba(139, 0, 255, 0.4)',
                textShadow: '0 0 10px rgba(0, 0, 0, 0.8)'
              }}
            >
              {isSpinning ? (
                <span className="flex items-center gap-3">
                  <Icon name="Loader2" size={32} className="animate-spin" />
                  Вращается...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Icon name="Play" size={32} />
                  ЗАПУСТИТЬ
                </span>
              )}
            </Button>

            {winner && (
              <div className="mt-8 p-6 rounded-lg border-4 border-neon-cyan bg-card/80 backdrop-blur-sm animate-fade-in"
                   style={{ boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Trophy" size={32} className="text-neon-pink animate-pulse-glow" />
                  <h3 className="text-xl font-bold text-neon-purple"
                      style={{ textShadow: '0 0 10px #8B00FF' }}>
                    Выбран:
                  </h3>
                </div>
                <p className="text-3xl font-bold text-neon-cyan"
                   style={{ textShadow: '0 0 15px #00FFFF' }}>
                  {winner}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;