import { requireCreator } from '@/lib/auth/guards'

export default async function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // This will redirect to login if not authenticated
    // or to /app/dashboard if user is a fan
    await requireCreator()

    return <>{children}</>
}
