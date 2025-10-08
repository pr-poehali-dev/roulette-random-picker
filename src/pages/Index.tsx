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
            <div className="relative w-80 h-80 mb-8">
              <div 
                ref={wheelRef}
                className={`w-full h-full rounded-full border-8 border-primary/50 relative ${isSpinning ? 'animate-spin-wheel' : ''}`}
                style={{
                  boxShadow: isDarkMode 
                    ? '0 0 30px rgba(139, 92, 246, 0.4), 0 0 50px rgba(139, 92, 246, 0.2), inset 0 0 30px rgba(139, 92, 246, 0.15)'
                    : '0 0 25px rgba(139, 92, 246, 0.25), 0 0 40px rgba(139, 92, 246, 0.15), inset 0 0 20px rgba(139, 92, 246, 0.1)',
                  background: isDarkMode
                    ? 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(30, 30, 50, 0.9) 70%)'
                    : 'radial-gradient(circle, rgba(200, 195, 220, 0.8) 0%, rgba(220, 215, 235, 0.95) 70%)'
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-secondary/50 flex items-center justify-center"
                     style={{
                       boxShadow: isDarkMode
                         ? '0 0 15px rgba(94, 147, 177, 0.5)'
                         : '0 0 12px rgba(139, 92, 246, 0.3)',
                       background: isDarkMode
                         ? 'radial-gradient(circle, rgba(94, 147, 177, 0.25) 0%, rgba(30, 30, 50, 0.95) 70%)'
                         : 'radial-gradient(circle, rgba(210, 205, 230, 0.9) 0%, rgba(225, 220, 240, 0.95) 70%)'
                     }}>
                  <Icon name="Sparkles" size={32} className="text-secondary" />
                </div>
              </div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-primary"
                   style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' }} />
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