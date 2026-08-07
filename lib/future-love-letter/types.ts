export interface RelationshipInsight {
  insight: string;
  evidence: string[];
  confidence: "high" | "medium" | "low";
}

export interface RelationshipBrief {
  emotionalNeeds: RelationshipInsight[];
  affectionStyle: RelationshipInsight[];
  attractionPatterns: RelationshipInsight[];
  communicationNeeds: RelationshipInsight[];
  relationshipStrengths: RelationshipInsight[];
  relationshipChallenges: RelationshipInsight[];
  conflictPatterns: RelationshipInsight[];
  fearsOrDefenses: RelationshipInsight[];
  idealPartnerTraits: RelationshipInsight[];
  healthyRelationshipDynamic: RelationshipInsight[];
  specificContradictions: RelationshipInsight[];
  letterHooks: string[];
}

export interface LetterResponse {
  letter: string;
  shareableQuotes: string[];
}

export interface FutureLoveRequest {
  name: string;
  email?: string;
  date: string;
  time: string;
  lat: number;
  lng: number;
  timezone: string;
  placeName: string;
}

export interface FutureLoveResult {
  letter: string;
  shareableQuotes: string[];
  name: string;
}
