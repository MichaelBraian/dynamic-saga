export interface MoralityScoreProps {
  alignmentScore: number;
  goodEvilScale: number;
  lawfulChaoticScale: number;
}

export interface AlignmentDisplayProps {
  score: number;
  showIcon?: boolean;
}

export interface MoralityScalesProps {
  goodEvilScale: number;
  lawfulChaoticScale: number;
  showIcons?: boolean;
} 