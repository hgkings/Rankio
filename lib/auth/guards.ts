import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export type UserRole = 'fan' | 'creator' | 'admin'

export interface UserProfile {
    id: string
    role: UserRole
    display_name: string | null
    avatar_url: string | null
    creator_id: string | null
}

/**
 * Get the current authenticated user and their profile
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return null
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, display_name, avatar_url, creator_id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return null
    }

    return {
        user,
        profile: profile as UserProfile
    }
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
    const userData = await getCurrentUser()

    if (!userData) {
        redirect('/auth/login')
    }

    return userData
}

/**
 * Require specific role - redirects to appropriate dashboard if wrong role
 */
export async function requireRole(allowedRoles: UserRole[]) {
    const { user, profile } = await requireAuth()

    if (!allowedRoles.includes(profile.role)) {
        // Redirect to appropriate dashboard based on actual role
        switch (profile.role) {
            case 'fan':
                redirect('/app/dashboard')
            case 'creator':
                redirect('/studio/dashboard')
            case 'admin':
                redirect('/admin/proofs')
        }
    }

    return { user, profile }
}

/**
 * Require fan role
 */
export async function requireFan() {
    return requireRole(['fan', 'admin'])
}

/**
 * Require creator role
 */
export async function requireCreator() {
    return requireRole(['creator', 'admin'])
}

/**
 * Require admin role
 */
export async function requireAdmin() {
    return requireRole(['admin'])
}

/**
 * Get redirect path based on user role
 */
export function getRedirectPath(role: UserRole): string {
    switch (role) {
        case 'fan':
            return '/app/dashboard'
        case 'creator':
            return '/studio/dashboard'
        case 'admin':
            return '/admin/proofs'
        default:
            return '/app/dashboard'
    }
}
