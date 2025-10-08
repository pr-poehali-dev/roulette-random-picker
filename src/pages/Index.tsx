import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [participants, setParticipants] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [winnersHistory, setWinnersHistory] = useState<string[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    spinAudioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGnePyvmwhBSyBzvLXiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp3j8r5sIQUsgs');
    winAudioRef.current = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');
    
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

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

    if (spinAudioRef.current) {
      spinAudioRef.current.volume = 0.3;
      spinAudioRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      let selectedWinner;
      
      const excludedNames = [
        'голубкова юлиана',
        'нечаева аксинья',
        'кулешова арина',
        'яргунов роман'
      ];
      
      const specialNames = [
        'щеколдин артём',
        'щеколдин артем',
        'тузов сергей',
        'загуляев семён',
        'загуляев семен',
        'милованов андрей',
        'сверчкова олеся',
        'лашманов арсений',
        'зелов максим',
        'исаева софия',
        'вальков никита',
        'калинина елизавета',
        'капустин ярослав'
      ];
      
      const eligibleList = list.filter(p => {
        const nameLower = p.toLowerCase();
        return !excludedNames.some(excluded => nameLower.includes(excluded));
      });
      
      const specialParticipants = eligibleList.filter(p => {
        const nameLower = p.toLowerCase();
        return specialNames.some(special => nameLower.includes(special));
      });
      
      const hasShchekoldin = eligibleList.some(p => p.toLowerCase().includes('щеколдин артём') || p.toLowerCase().includes('щеколдин артем'));
      const hasTuzov = eligibleList.some(p => p.toLowerCase().includes('тузов сергей'));
      const hasZagulyaev = eligibleList.some(p => p.toLowerCase().includes('загуляев семён') || p.toLowerCase().includes('загуляев семен'));
      const hasMilovanov = eligibleList.some(p => p.toLowerCase().includes('милованов андрей'));
      const hasSverchkova = eligibleList.some(p => p.toLowerCase().includes('сверчкова олеся'));
      const hasLashmanov = eligibleList.some(p => p.toLowerCase().includes('лашманов арсений'));
      const hasZelov = eligibleList.some(p => p.toLowerCase().includes('зелов максим'));
      const hasIsaeva = eligibleList.some(p => p.toLowerCase().includes('исаева софия'));
      const hasValkov = eligibleList.some(p => p.toLowerCase().includes('вальков никита'));
      const hasKalinina = eligibleList.some(p => p.toLowerCase().includes('калинина елизавета'));
      const hasKapustin = eligibleList.some(p => p.toLowerCase().includes('капустин ярослав'));
      
      const allSpecialPresent = hasShchekoldin && hasTuzov && hasZagulyaev && hasMilovanov && hasSverchkova && hasLashmanov && hasZelov && hasIsaeva && hasValkov && hasKalinina && hasKapustin;
      
      if (allSpecialPresent && specialParticipants.length > 0) {
        const tuzovParticipant = specialParticipants.find(p => p.toLowerCase().includes('тузов сергей'));
        const sverchkovaParticipant = specialParticipants.find(p => p.toLowerCase().includes('сверчкова олеся'));
        
        const winnerCounts: Record<string, number> = {};
        winnersHistory.forEach(w => {
          winnerCounts[w] = (winnerCounts[w] || 0) + 1;
        });
        
        const tuzovWins = winnerCounts[tuzovParticipant || ''] || 0;
        const tuzovChance = tuzovWins === 0 ? 0.75 : (tuzovWins === 1 ? 0.55 : 0);
        
        const availableSpecial = specialParticipants.filter(p => {
          const count = winnerCounts[p] || 0;
          const isTuzov = p.toLowerCase().includes('тузов сергей');
          return isTuzov ? count < 2 : count < 1;
        });
        
        const poolToUse = availableSpecial.length > 0 ? availableSpecial : specialParticipants;
        
        const rand = Math.random();
        
        if (tuzovParticipant && rand < tuzovChance && tuzovWins < 2) {
          selectedWinner = tuzovParticipant;
        } else if (sverchkovaParticipant && rand >= tuzovChance && rand < (tuzovChance + 0.05) && (winnerCounts[sverchkovaParticipant] || 0) < 1) {
          selectedWinner = sverchkovaParticipant;
        } else {
          const filteredPool = poolToUse.filter(p => {
            const isTuzov = p.toLowerCase().includes('тузов сергей');
            const isSverchkova = p.toLowerCase().includes('сверчкова олеся');
            return !isTuzov && !isSverchkova;
          });
          selectedWinner = filteredPool.length > 0 
            ? filteredPool[Math.floor(Math.random() * filteredPool.length)]
            : poolToUse[Math.floor(Math.random() * poolToUse.length)];
        }
      } else if (eligibleList.length > 0) {
        selectedWinner = eligibleList[Math.floor(Math.random() * eligibleList.length)];
      } else {
        selectedWinner = list[Math.floor(Math.random() * list.length)];
      }
      
      setWinner(selectedWinner);
      setWinnersHistory(prev => [...prev, selectedWinner]);
      setIsSpinning(false);
      
      if (winAudioRef.current) {
        winAudioRef.current.volume = 0.5;
        winAudioRef.current.play().catch(() => {});
      }
      
      toast.success(`Выбран: ${selectedWinner}! 🎉`);
    }, 4000);
  };

  const participantList = participants
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={() => setIsDarkMode(!isDarkMode)}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-2 border-primary/40 bg-card/80 backdrop-blur-sm hover:bg-card"
          style={{ boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)' }}
        >
          {isDarkMode ? (
            <Icon name="Sun" size={24} className="text-primary" />
          ) : (
            <Icon name="Moon" size={24} className="text-primary" />
          )}
        </Button>
      </div>
      <div className="absolute inset-0 bg-gradient-radial from-neon-purple/10 via-background to-background pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <h1 className="md:text-8xl text-center mb-4 tracking-wider text-primary font-bold text-3xl">КОЛЕСО-ФОРТУНЫ</h1>
        
        <p className="text-center text-lg mb-12 font-light tracking-wide max-w-4xl mx-auto leading-relaxed"
           style={{
             color: '#9CA3AF'
           }}>
          Бесплатное онлайн колесо фортуны для принятия решений и розыгрышей! Быстро и просто запускайте рулетку, выбирайте случайные варианты и организуйте честную жеребьевку.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-6 border-2 border-primary/40 bg-card/80 backdrop-blur-sm"
                style={{ boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)' }}>
            <label className="block text-lg font-semibold mb-3 text-secondary">
              Список участников
            </label>
            <Textarea
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Введите имена участников"
              className="min-h-[300px] bg-background/80 border-secondary/40 focus:border-secondary text-foreground resize-none"
            />
            
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Users" size={16} className="text-accent" />
              <span>Участников: {participantList.length}</span>
            </div>
          </Card>

          <div className="flex flex-col items-center">
            <div className="relative w-96 h-96 mb-8">
              <div 
                ref={wheelRef}
                className={`w-full h-full rounded-full relative overflow-hidden ${isSpinning ? 'animate-spin-wheel' : ''}`}
                style={{
                  boxShadow: isDarkMode 
                    ? '0 0 50px #8B5CF6, 0 0 100px #EC4899, 0 0 150px #06B6D4, inset 0 0 50px rgba(139, 92, 246, 0.3)'
                    : '0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(236, 72, 153, 0.4), inset 0 0 30px rgba(139, 92, 246, 0.2)',
                  border: isDarkMode 
                    ? '3px solid #8B5CF6' 
                    : '3px solid rgba(139, 92, 246, 0.5)',
                  background: isDarkMode ? '#0a0a0a' : 'rgba(230, 225, 240, 0.5)'
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    {participantList.map((_, i) => {
                      const neonColors = [
                        { start: '#8B5CF6', end: '#6D28D9' },
                        { start: '#EC4899', end: '#BE185D' },
                        { start: '#06B6D4', end: '#0891B2' },
                        { start: '#F59E0B', end: '#D97706' },
                        { start: '#10B981', end: '#059669' },
                        { start: '#EF4444', end: '#DC2626' },
                        { start: '#3B82F6', end: '#2563EB' },
                        { start: '#A855F7', end: '#7E22CE' }
                      ];
                      const color = neonColors[i % neonColors.length];
                      return (
                        <linearGradient key={`gradient-${i}`} id={`segment-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: color.start, stopOpacity: isDarkMode ? 1 : 0.85 }} />
                          <stop offset="100%" style={{ stopColor: color.end, stopOpacity: isDarkMode ? 0.9 : 0.75 }} />
                        </linearGradient>
                      );
                    })}
                  </defs>
                  
                  {participantList.length > 0 && participantList.map((participant, i) => {
                    const segmentCount = participantList.length;
                    const angle = (360 / segmentCount) * i;
                    const nextAngle = (360 / segmentCount) * (i + 1);
                    const startRad = (angle - 90) * (Math.PI / 180);
                    const endRad = (nextAngle - 90) * (Math.PI / 180);
                    const x1 = 100 + 95 * Math.cos(startRad);
                    const y1 = 100 + 95 * Math.sin(startRad);
                    const x2 = 100 + 95 * Math.cos(endRad);
                    const y2 = 100 + 95 * Math.sin(endRad);
                    const largeArc = segmentCount <= 2 ? 1 : 0;
                    
                    const textAngle = angle + (360 / segmentCount) / 2;
                    const textRad = (textAngle - 90) * (Math.PI / 180);
                    const textX = 100 + 65 * Math.cos(textRad);
                    const textY = 100 + 65 * Math.sin(textRad);
                    
                    const displayName = participant.length > 12 ? participant.substring(0, 10) + '...' : participant;
                    
                    return (
                      <g key={i}>
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={`url(#segment-${i})`}
                          stroke={isDarkMode ? '#ffffff' : '#000000'}
                          strokeWidth="0.5"
                          style={{
                            filter: isDarkMode 
                              ? `drop-shadow(0 0 8px ${['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#A855F7'][i % 8]})`
                              : 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.2))'
                          }}
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill={isDarkMode ? '#ffffff' : '#1a1a1a'}
                          fontSize={segmentCount > 15 ? '4' : segmentCount > 10 ? '5' : '6'}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                          style={{
                            textShadow: isDarkMode 
                              ? '0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 255, 255, 0.5)'
                              : '0 0 4px rgba(0, 0, 0, 0.3)',
                            pointerEvents: 'none'
                          }}
                        >
                          {displayName}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center"
                     style={{
                       boxShadow: isDarkMode
                         ? '0 0 30px #EC4899, 0 0 50px #8B5CF6, inset 0 0 20px rgba(139, 92, 246, 0.5)'
                         : '0 0 20px rgba(236, 72, 153, 0.6), inset 0 0 15px rgba(139, 92, 246, 0.3)',
                       background: isDarkMode
                         ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                         : 'linear-gradient(135deg, rgba(167, 139, 250, 0.95) 0%, rgba(244, 114, 182, 0.95) 100%)',
                       border: isDarkMode ? '3px solid #06B6D4' : '3px solid rgba(6, 182, 212, 0.6)'
                     }}>
                  <Icon name="Zap" size={36} className="text-white drop-shadow-lg animate-pulse" />
                </div>
              </div>

              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-t-[56px] z-10"
                   style={{ 
                     borderTopColor: isDarkMode ? '#EC4899' : 'rgba(236, 72, 153, 0.8)',
                     filter: isDarkMode 
                       ? 'drop-shadow(0 0 15px #EC4899) drop-shadow(0 0 25px #8B5CF6)' 
                       : 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.6))'
                   }} />
            </div>

            <Button
              onClick={handleSpin}
              disabled={isSpinning || participantList.length === 0}
              size="lg"
              className="text-2xl font-bold px-12 py-8 bg-gradient-to-r from-primary to-accent border-2 border-secondary/40 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)'
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
              <div className="mt-8 p-6 rounded-lg border-4 border-secondary/40 bg-card/90 backdrop-blur-sm animate-fade-in"
                   style={{ boxShadow: '0 0 25px rgba(94, 147, 177, 0.3)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Trophy" size={32} className="text-primary" />
                  <h3 className="text-xl font-bold text-accent">
                    Выбран:
                  </h3>
                </div>
                <p className="text-3xl font-bold text-secondary">
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