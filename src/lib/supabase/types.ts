export interface BrandProfile {
  id: string; // UUID references auth.users
  company_name: string | null;
  website_url: string | null;
  industry: string | null;
  phone: string | null;
  location: string | null;
  business_description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreatorProfile {
  id: string; // UUID references auth.users
  phone: string | null;
  instagram_url: string | null;
  youtube_url: string | null;

  niche: string[] | null;
  location: string | null;
  bio: string | null;
  portfolio_links: Array<{ name: string; url: string }> | null;
  rate_card: {
    video_15s?: number;
    video_30s?: number;
    photoshoot?: number;
    [key: string]: unknown;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignRequirement {
  type: string;
  details: string;
}

export type CampaignStatus = 'Draft' | 'Active' | 'Completed' | 'Paused';

export interface Campaign {
  id: string; // UUID
  brand_id: string; // UUID references brand_profiles
  title: string;
  description: string;
  budget: number;
  requirements: CampaignRequirement[] | null;
  creators_needed: number;
  submissions_count: number;
  deadline: string;
  status: CampaignStatus;
  created_at?: string;
  updated_at?: string;
  brand?: BrandProfile; // Optional joined brand details
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface CampaignApplication {
  id: string; // UUID
  campaign_id: string; // UUID
  creator_id: string; // UUID references creator_profiles
  status: ApplicationStatus;
  cover_letter: string | null;
  proposed_rate: number;
  created_at?: string;
  updated_at?: string;
  campaign?: Campaign; // Optional joined campaign details
  creator?: CreatorProfile; // Optional joined creator details
}

export type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface UgcSubmission {
  id: string; // UUID
  application_id: string; // UUID
  campaign_id: string; // UUID
  creator_id: string; // UUID
  video_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  notes: string | null;
  status: SubmissionStatus;
  feedback: string | null;
  created_at?: string;
  updated_at?: string;
  campaign?: Campaign;
  creator?: CreatorProfile & { full_name?: string; avatar_url?: string };
}

export interface Payment {
  id: string; // UUID
  brand_id: string;
  campaign_id: string;
  amount: number;
  commission: number;
  currency: string;
  status: string;
  transaction_id: string;
  created_at?: string;
  updated_at?: string;
}

export type PocStatus = 'Active' | 'Pending Admin Approval' | 'Rejected';

export interface BrandPoc {
  id: string;
  brand_id: string;
  name: string;
  email: string;
  role: string;
  photo_url: string | null;
  status: PocStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignGroup {
  id: string;
  campaign_id: string;
  title: string;
  is_archived: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  user_type: 'POC' | 'Creator';
  created_at?: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

export interface FeedPost {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string | null;
  niche: string[];
  media_url: string;
  media_type: 'video' | 'image';
  caption: string;
  rating: number;
  created_at?: string;
}
