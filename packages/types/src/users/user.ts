import { OnlineModel } from './';

// Subscription types
type SubscriptionType = 0 | 1 | 2; // 0 - None, 1 - Yurba Plus, 2 - Yurba Premium

// Verification status
type VerificationStatus = "" | "Default" | "Organisation" | "Goverment";

// Privacy settings for content visibility
type PrivacyLevel = 0 | 1 | 2; // 0 - all, 1 - friends, 2 - nobody

// Relationship states between users
type RelationshipState = "" | "strangers" | "me_subscribed" | "he_subscribed" | "friends";

// Online display preferences
type OnlineDisplayType = 0 | 1 | 2 | 3; // 0 - default, 1 - approximate, 2 - invisible, 3 - custom

/**
 * UserModule
 */
export interface UserModel {
  // Basic user information
  ID: number; // Unique user identifier
  Name: string; // First name
  Surname: string; // Last name
  Link: string; // Username/handle for profile URL
  RegisterDate: number; // Unix timestamp of registration
  
  // Profile customization
  Avatar: number; // Avatar image ID
  Banner: number; // Profile banner image ID
  CosmeticAvatar: number; // Special avatar effects ID
  Status: string; // User status message
  About: string; // Profile description
  Emoji: string; // Profile emoji (e.g., ":coffee:")
  
  // Account status
  Creative: boolean; // Creative account flag
  Ban: boolean; // Account banned status
  Deleted: boolean; // Account deleted status
  Reports: number; // Number of reports against user
  
  // Location information
  Country: number; // Country ID
  Region: number; // Region ID
  City: number; // City ID
  CityNative: string; // Native city name
  
  // Personal information
  Birthday: string; // Birth date (YYYY-MM-DD format)
  Website: string; // Personal website URL
  WorksAt: string; // Workplace information
  Languages: number[]; // Array of language IDs user speaks
  
  // Account features
  Sub: SubscriptionType; // Subscription level
  Verify: VerificationStatus; // Verification badge type
  Coins: number; // Virtual currency balance
  
  // Social metrics
  Posts: number; // Total posts count
  Friends: number; // Friends count
  Followers: number; // Followers count
  
  // Current status
  Online: OnlineModel; // Online status and last seen
  
  // Account linking
  OriginalAccount: number; // Original account ID (for linked accounts)
  
  // Relationship with current user
  RelationshipState: RelationshipState; // Current relationship status
  
  // Privacy settings - who can perform actions
  PostState: PrivacyLevel; // Who can post on user's wall
  CommentsState: PrivacyLevel; // Who can comment on user's posts
  AddFriendState: boolean; // Whether others can send friend requests
  ViewFriendsState: PrivacyLevel; // Who can see user's friends list
  SendMessageState: PrivacyLevel; // Who can send direct messages
  ViewAvatarState: PrivacyLevel; // Who can see user's avatar
  ViewBirthdayState: PrivacyLevel; // Who can see user's birthday
  SearchState: boolean; // Whether user appears in search results
  OnlineType: OnlineDisplayType; // How online status is displayed
  
  // Optional sensitive data (only for authenticated requests)
  Password?: string; // Encrypted password (admin only)
  Email?: string; // Primary email address
  EmailReserve?: string; // Backup email address
  
  // Optional user-specific data
  TrackList?: number; // Music playlist ID
  NewMessages?: number; // Unread messages count
  NewNotifications?: number; // Unread notifications count
  FriendsRequests?: number; // Pending friend requests count
  Relationships?: number; // Relationship status ID
}

