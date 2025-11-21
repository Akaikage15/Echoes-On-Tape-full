import { useState, useEffect } from 'react';
import { useSessionStore } from '../lib/store';
import { fetchAllPolls, submitPollVote } from '../lib/services';
import { Vote, BackendVoteOption } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Lock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { Paywall } from '../components/Paywall';
import { useSubscription } from '../hooks/useSubscription';

interface PollOptionProps {
  option: BackendVoteOption;
  totalVotes: number;
  hasVoted: boolean;
  userVoteId?: string;
  onClick: (optionId: string) => void;
  pollStatus: 'active' | 'completed';
}

function PollOption({ option, totalVotes, hasVoted, userVoteId, onClick, pollStatus }: PollOptionProps) {
  const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
  const isSelected = userVoteId === option.id;

  return (
    <div
      className={`relative p-3 rounded-md border transition-colors cursor-pointer
        ${hasVoted && isSelected ? 'border-primary ring-2 ring-primary' : 'border-border'}
        ${hasVoted && !isSelected && pollStatus === 'active' ? 'opacity-50' : ''}
        ${pollStatus === 'completed' ? 'hover:bg-card/50' : 'hover:bg-card/50'}
      `}
      onClick={() => !hasVoted && pollStatus === 'active' && onClick(option.id)}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{option.label}</span>
        {hasVoted && (
          <span className="text-xs text-muted-foreground">
            {option.votes} голосов ({percentage}%)
          </span>
        )}
      </div>
      {hasVoted && (
        <Progress value={percentage} className="h-2 w-full" />
      )}
      {option.image && (
        <img src={option.image} alt={option.label} className="w-full h-auto mt-2 rounded-sm" />
      )}
      {hasVoted && isSelected && (
        <div className="absolute top-2 right-2 flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" />
        </div>
      )}
    </div>
  );
}

interface PollCardProps {
  poll: Vote;
}

function PollCard({ poll }: PollCardProps) {
  const { currentUser, isAuthenticated } = useSessionStore();
  const { hasAccess } = useSubscription();
  const [userVoted, setUserVoted] = useState(poll.hasVoted);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(poll.userVote);
  const [currentPoll, setCurrentPoll] = useState(poll);
  const [submittingVote, setSubmittingVote] = useState(false);

  const totalVotes = currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const isPollCompleted = new Date(currentPoll.deadline) < new Date() || currentPoll.status === 'completed';

  const canView = currentPoll.is_public || hasAccess(currentPoll.required_tier);
  const canVote = isAuthenticated && canView && !userVoted && !isPollCompleted;

  const handleVote = async (optionId: string) => {
    if (!canVote) return;

    setSubmittingVote(true);
    try {
      const updatedPoll = await submitPollVote(currentPoll.id, optionId);
      setCurrentPoll(updatedPoll); // Update poll with new vote count
      setUserVoted(true);
      setSelectedOption(optionId);
      toast.success('Ваш голос учтен!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Не удалось проголосовать.');
      console.error(err);
    } finally {
      setSubmittingVote(false);
    }
  };

  return (
    <div
      className={`relative bg-card p-6 rounded-lg transition-all hover:shadow-md
        ${!canView ? 'opacity-50 blur-sm pointer-events-none' : ''}
      `}
    >
      {!canView && <Paywall requiredTier={poll.required_tier} />}
      
      <h3 className="font-['Bebas_Neue'] text-2xl mb-4">{currentPoll.question}</h3>
      
      <div className="space-y-3">
        {currentPoll.options.map((option) => (
          <PollOption
            key={option.id}
            option={option}
            totalVotes={totalVotes}
            hasVoted={userVoted || isPollCompleted}
            userVoteId={selectedOption}
            onClick={handleVote}
            pollStatus={isPollCompleted ? 'completed' : 'active'}
          />
        ))}
      </div>

      <div className="mt-6 text-sm text-muted-foreground flex justify-between items-center">
        {isPollCompleted ? (
          <span>Голосование завершено</span>
        ) : (
          <span>Осталось: {Math.ceil((new Date(currentPoll.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} дней</span>
        )}
        {!currentPoll.is_public && (
          <Badge className="bg-primary text-primary-foreground gap-1">
            <Lock className="size-3" />
            Для подписчиков
          </Badge>
        )}
      </div>

    </div>
  );
}

export function PollsPage() {
  const [polls, setPolls] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPolls = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPolls = await fetchAllPolls();
        // Simulate user's past votes if needed, for now just assign to state
        setPolls(fetchedPolls);
      } catch (err: any) {
        setError('Не удалось загрузить голосования. Попробуйте обновить страницу.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPolls();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-lg space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-['Bebas_Neue'] text-4xl text-destructive">{error}</h1>
          <Button onClick={() => window.location.reload()} className="mt-4">Повторить</Button>
        </div>
      </div>
    );
  }

  const activePolls = polls.filter(p => !new Date(p.deadline).getTime() < Date.now() && p.status === 'active');
  const completedPolls = polls.filter(p => new Date(p.deadline).getTime() < Date.now() || p.status === 'completed');

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
            Голосования
          </h1>
          <p className="text-lg text-muted-foreground">
            Ваш голос важен! Участвуйте в жизни лейбла.
          </p>
        </div>

        {activePolls.length > 0 && (
          <div className="mb-12">
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-6">
              Активные голосования
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activePolls.map(poll => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          </div>
        )}

        {completedPolls.length > 0 && (
          <div className="mb-12">
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-6">
              Завершенные голосования
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedPolls.map(poll => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          </div>
        )}

        {polls.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <h3 className="font-['Bebas_Neue'] text-3xl mb-4">
              Пока нет голосований
            </h3>
            <p className="text-muted-foreground">
              Возвращайтесь позже, чтобы принять участие в жизни лейбла!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}