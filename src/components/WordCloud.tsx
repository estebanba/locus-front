import React from 'react';

interface WordCloudProps {
  words: Array<{ text: string; value: number; recency?: number }>;
}

/**
 * Custom WordCloud component using HTML/CSS
 * Creates a responsive word cloud with varying font sizes based on word frequency and recency
 * Uses a mixed layout to avoid the tidy appearance
 */
export const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
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
  
  // Create a mixed layout by interleaving high and low value words
  const mixedWords = [];
  const highValue = sortedWords.slice(0, Math.ceil(sortedWords.length / 3));
  const mediumValue = sortedWords.slice(Math.ceil(sortedWords.length / 3), Math.ceil(sortedWords.length * 2 / 3));
  const lowValue = sortedWords.slice(Math.ceil(sortedWords.length * 2 / 3));
  
  // Interleave the arrays for a more natural distribution
  const maxLength = Math.max(highValue.length, mediumValue.length, lowValue.length);
  for (let i = 0; i < maxLength; i++) {
    if (highValue[i]) mixedWords.push(highValue[i]);
    if (mediumValue[i]) mixedWords.push(mediumValue[i]);
    if (lowValue[i]) mixedWords.push(lowValue[i]);
  }
  
  // Calculate font sizes based on weighted values
  const maxValue = Math.max(...weightedWords.map(w => w.weightedValue));
  const minValue = Math.min(...weightedWords.map(w => w.weightedValue));
  
  const getFontSize = (weightedValue: number) => {
    const ratio = (weightedValue - minValue) / (maxValue - minValue);
    return Math.max(14, Math.min(52, 14 + ratio * 38)); // Font size between 14px and 52px
  };

  const getOpacity = (weightedValue: number) => {
    const ratio = (weightedValue - minValue) / (maxValue - minValue);
    return Math.max(0.5, 0.5 + ratio * 0.5); // Opacity between 0.5 and 1.0
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
          className="inline-block px-1 py-0.5 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-default select-none"
          style={{
            fontSize: `${getFontSize(word.weightedValue)}px`,
            opacity: getOpacity(word.weightedValue),
            fontWeight: word.weightedValue > maxValue * 0.7 ? 600 : word.weightedValue > maxValue * 0.4 ? 500 : 400,
            transform: `translate(${getRandomOffset()}px, ${getRandomOffset()}px)`,
            margin: `${Math.random() * 3}px ${Math.random() * 2}px`, // Random margins for organic feel
          }}
          title={`${word.text}: ${word.value} occurrences${word.recency ? ` (recency: ${word.recency})` : ''}`}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}; 