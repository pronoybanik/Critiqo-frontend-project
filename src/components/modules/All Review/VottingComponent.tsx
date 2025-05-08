/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ArrowUp, ArrowDown, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteCounterProps {
  initialVotes: number;
  dVotes: number;
  onVoteChange?: (newVotes: number, type: 'upvote' | 'downvote') => void;
  className?: string;
}
// pronoy error
const VoteCounter: React.FC<VoteCounterProps> = ({ initialVotes, dVotes, onVoteChange, className }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [dvotes, setDVotes] = useState(dVotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setVotes(prevVotes => {
        const newVotes = hasDownvoted ? prevVotes + 2 : prevVotes + 1;
        onVoteChange?.(newVotes, 'upvote');
        return newVotes;
      });
      setHasUpvoted(true);
      setHasDownvoted(false);
    } else {
      setVotes(prevVotes => {
        const newVotes = prevVotes - 1;
        onVoteChange?.(newVotes, 'upvote');
        return newVotes;
      });
      setHasUpvoted(false);
    }
  };

  const handleDownvote = () => {
    if (!hasDownvoted) {
      setVotes(prevVotes => {
        const newVotes = hasUpvoted ? prevVotes - 2 : prevVotes - 1;
        onVoteChange?.(newVotes, 'downvote');
        return newVotes;
      });
      setHasDownvoted(true);
      setHasUpvoted(false);
    } else {
      setVotes(prevVotes => {
        const newVotes = prevVotes + 1;
        onVoteChange?.(newVotes, 'downvote');
        return newVotes;
      });
      setHasDownvoted(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center gap-4">
        <span>Total Vote : </span>
        <div className='flex justify-center items-center gap-2'>

          <span className="text-gray-700 font-semibold"> {votes}</span>
          <ThumbsUp className="w-5 h-5 text-green-500" />
        </div>
        <div className='flex justify-center items-center gap-2'>
          <span className="text-gray-700 font-semibold">  {dvotes}</span>
          <ThumbsDown className="w-5 h-5 text-green-500" />
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleUpvote}
          className={cn(
            "rounded-full",
            hasUpvoted ? "text-green-500 border-green-500" : "text-gray-500 hover:text-green-500 hover:border-green-500"
          )}
          aria-label="Upvote"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownvote}
          className={cn(
            "rounded-full",
            hasDownvoted ? "text-red-500 border-red-500" : "text-gray-500 hover:text-red-500 hover:border-red-500"
          )}
          aria-label="Downvote"
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default VoteCounter;

