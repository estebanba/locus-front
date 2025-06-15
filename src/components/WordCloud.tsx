import React from 'react';
import { useNavigate } from 'react-router-dom';

interface WordCloudProps {
  words: Array<{ text: string; value: number; recency?: number }>;
}

/**
 * Custom WordCloud component using HTML/CSS
 * Creates a responsive word cloud with varying font sizes based on word frequency and recency
 * Uses a mixed layout to avoid the tidy appearance
 * Each word is clickable and navigates to search page with that keyword
 */
export const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
  const navigate = useNavigate();

  // Handle word click - navigate to search page with the clicked word as query
  const handleWordClick = (word: string) => {
    navigate(`/search?q=${encodeURIComponent(word)}`);
  };

  // Apply recency weighting and sort words by final weighted value
  const weightedWords = words.map(word => {
    // Recency factor: more recent = higher multiplier (1.0 to 2.0)
    const recencyMultiplier = word.recency ? 1 + (word.recency / 100) : 1;
    const weightedValue = word.value * recencyMultiplier;
    
    return {
      ...word,
      weightedValue,
    };
  });

  // Sort by weighted value but then shuffle to create mixed layout
  const sortedWords = [...weightedWords].sort((a, b) => b.weightedValue - a.weightedValue);
  
  // Create a better mixed layout by shuffling and redistributing
  const mixedWords: Array<{ text: string; value: number; recency?: number; weightedValue: number }> = [];
  
  // Divide into more granular groups for better mixing
  const groupSize = Math.ceil(sortedWords.length / 6); // Create 6 groups instead of 3
  const groups = [];
  
  for (let i = 0; i < 6; i++) {
    const start = i * groupSize;
    const end = Math.min(start + groupSize, sortedWords.length);
    groups.push(sortedWords.slice(start, end));
  }
  
  // Shuffle each group internally for more randomness
  groups.forEach(group => {
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
  });
  
  // Interleave all groups for maximum mixing
  const maxGroupLength = Math.max(...groups.map(g => g.length));
  for (let i = 0; i < maxGroupLength; i++) {
    groups.forEach(group => {
      if (group[i]) mixedWords.push(group[i]);
    });
  }
  
  // Calculate font sizes with reduced range for better mobile experience
  const maxValue = Math.max(...weightedWords.map(w => w.weightedValue));
  const minValue = Math.min(...weightedWords.map(w => w.weightedValue));
  
  const getFontSize = (weightedValue: number) => {
    const ratio = (weightedValue - minValue) / (maxValue - minValue);
    // Reduced font size range: 12px to 28px (was 14px to 52px)
    return Math.max(12, Math.min(28, 12 + ratio * 16));
  };

  const getOpacity = (weightedValue: number) => {
    const ratio = (weightedValue - minValue) / (maxValue - minValue);
    // Reduced opacity range for less dramatic difference
    return Math.max(0.6, 0.6 + ratio * 0.4); // Opacity between 0.6 and 1.0
  };

  // Add some randomness to positioning for less tidy appearance
  const getRandomOffset = () => {
    return Math.random() * 4 - 2; // Random offset between -2px and 2px
  };

  return (
    <div className="flex flex-wrap gap-1 justify-center items-center p-8 min-h-[400px] leading-relaxed">
      {mixedWords.map((word, index) => (
        <span
          key={`${word.text}-${index}`}
          className="inline-block px-1 py-0.5 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer select-none"
          style={{
            fontSize: `${getFontSize(word.weightedValue)}px`,
            opacity: getOpacity(word.weightedValue),
            fontWeight: word.weightedValue > maxValue * 0.8 ? 500 : word.weightedValue > maxValue * 0.5 ? 450 : 400,
            transform: `translate(${getRandomOffset()}px, ${getRandomOffset()}px)`,
            margin: `${Math.random() * 3}px ${Math.random() * 2}px`, // Random margins for organic feel
          }}
          title={`Click to search for "${word.text}" (${word.value} occurrences${word.recency ? `, recency: ${word.recency}` : ''})`}
          onClick={() => handleWordClick(word.text)}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}; 