export type UserRole = 'fan' | 'creator' | 'admin'

export type MissionType = 'comment' | 'quiz' | 'raid' | 'screenshot'

export type MissionStatus = 'pending' | 'approved' | 'rejected'

export type Platform = 'tiktok' | 'instagram' | 'youtube'

export type LedgerKind = 'points' | 'coins'

export type LedgerDirection = 'credit' | 'debit'

export interface Profile {
    id: string
    role: UserRole
    display_name: string | null
    avatar_url: string | null
    creator_id: string | null
    verification_code: string | null
    is_verified: boolean
    created_at: string
    updated_at: string
}

export interface Creator {
    id: string
    owner_profile_id: string
    name: string
    platform: Platform | null
    profile_url: string | null
    avatar_url: string | null
    is_active: boolean
    created_at: string
}

export interface Mission {
    id: string
    creator_id: string
    type: MissionType
    title: string
    description: string | null
    points_base: number
    points_bonus: number
    starts_at: string | null
    ends_at: string | null
    is_active: boolean
    metadata: Record<string, any>
    created_at: string
    creator?: Creator
}

export interface MissionAttempt {
    id: string
    mission_id: string
    user_profile_id: string
    status: MissionStatus
    submitted_at: string
    approved_at: string | null
    reviewer_profile_id: string | null
    metadata: Record<string, any>
    mission?: Mission
    user_profile?: Profile
    proofs?: Proof[]
}

export interface Proof {
    id: string
    attempt_id: string
    user_profile_id: string
    file_path: string | null
    type: 'screenshot' | 'text'
    ai_status: string | null
    review_status: MissionStatus
    reviewer_profile_id: string | null
    created_at: string
    attempt?: MissionAttempt
}

export interface Wallet {
    profile_id: string
    coins_balance: number
    points_balance: number
    updated_at: string
}

export interface LedgerEntry {
    id: string
    profile_id: string
    kind: LedgerKind
    direction: LedgerDirection
    amount: number
    reason: string | null
    ref_type: string | null
    ref_id: string | null
    created_at: string
}
