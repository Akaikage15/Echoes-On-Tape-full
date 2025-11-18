import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, Lock, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { polls, currentUser } from '../lib/data';

export function PollsPage() {
  const navigate = useNavigate();
  const [votedPolls, setVotedPolls] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  if (!currentUser) {
    navigate('/pricing');
    return null;
  }

  if (!currentUser.subscription || currentUser.subscription === 'lite') {
    navigate('/pricing');
    return null;
  }

  const canVoteInPoll = (pollTier: string) => {
    if (currentUser.subscription === 'pro') return true;
    if (currentUser.subscription === 'fan' && pollTier === 'fan') return true;
    return false;
  };

  const handleVote = (pollId: string) => {
    if (!selectedOptions[pollId]) {
      alert('Выберите вариант для голосования');
      return;
    }
    
    setVotedPolls([...votedPolls, pollId]);
    alert('Ваш голос учтен!');
  };

  const activePollsArr = polls.filter(p => p.status === 'active');
  const completedPollsArr = polls.filter(p => p.status === 'completed');

  const renderPoll = (poll: any, showResults: boolean) => {
    const hasAccess = canVoteInPoll(poll.requiredTier);
    const hasVoted = votedPolls.includes(poll.id) || showResults;

    return (
      <div key={poll.id} className="bg-card p-6 rounded-lg space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground">
                {poll.requiredTier === 'pro' ? 'Pro' : 'Fan'}
              </Badge>
              {poll.status === 'active' && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  До {new Date(poll.deadline).toLocaleDateString('ru-RU')}
                </Badge>
              )}
              {poll.status === 'completed' && (
                <Badge variant="outline" className="text-success border-success gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Завершено
                </Badge>
              )}
            </div>
            <h3 className="font-['Bebas_Neue'] text-2xl mb-2">
              {poll.title}
            </h3>
            <p className="text-sm text-muted-foreground">{poll.description}</p>
          </div>
          <Vote className="h-8 w-8 text-primary flex-shrink-0" />
        </div>

        {hasAccess ? (
          <div className="space-y-3">
            {hasVoted ? (
              // Show results
              <div className="space-y-3">
                {poll.options.map((option: any) => {
                  const percentage = poll.totalVotes > 0 
                    ? Math.round((option.votes / poll.totalVotes) * 100) 
                    : 0;

                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">{option.title}</Label>
                        <span className="text-sm text-muted-foreground">
                          {percentage}% ({option.votes} {option.votes === 1 ? 'голос' : 'голосов'})
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
                <p className="text-sm text-muted-foreground text-center pt-2">
                  Всего голосов: {poll.totalVotes}
                </p>
              </div>
            ) : (
              // Show voting form
              <RadioGroup
                value={selectedOptions[poll.id]}
                onValueChange={(value) => setSelectedOptions({ ...selectedOptions, [poll.id]: value })}
                className="space-y-3"
              >
                {poll.options.map((option: any) => (
                  <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <RadioGroupItem value={option.id} id={`${poll.id}-${option.id}`} />
                    <Label htmlFor={`${poll.id}-${option.id}`} className="flex-1 cursor-pointer">
                      {option.title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {!hasVoted && poll.status === 'active' && (
              <Button
                onClick={() => handleVote(poll.id)}
                className="w-full bg-primary text-primary-foreground hover:bg-accent-secondary"
              >
                Проголосовать
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4 bg-secondary/50 rounded-lg flex items-center gap-3">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm">
                Это голосование доступно для подписчиков {poll.requiredTier === 'pro' ? 'Pro' : 'Fan'}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/pricing')}>
              Повысить тариф
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
              Голосования
            </h1>
            <p className="text-lg text-muted-foreground">
              Влияйте на будущее лейбла: выбирайте обложки, треки для клипов и многое другое
            </p>
          </div>

          {/* Active Polls */}
          {activePollsArr.length > 0 && (
            <div className="mb-12">
              <h2 className="font-['Bebas_Neue'] text-3xl mb-6">Активные голосования</h2>
              <div className="space-y-6">
                {activePollsArr.map(poll => renderPoll(poll, false))}
              </div>
            </div>
          )}

          {/* Completed Polls */}
          {completedPollsArr.length > 0 && (
            <div>
              <h2 className="font-['Bebas_Neue'] text-3xl mb-6">Завершенные голосования</h2>
              <div className="space-y-6">
                {completedPollsArr.map(poll => renderPoll(poll, true))}
              </div>
            </div>
          )}

          {activePollsArr.length === 0 && completedPollsArr.length === 0 && (
            <div className="text-center py-16">
              <Vote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Нет активных голосований</p>
              <p className="text-sm text-muted-foreground mt-2">
                Следите за новостями — скоро появятся новые опросы
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
