import { requireFan } from '@/lib/auth/guards'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // This will redirect to login if not authenticated
    // or to /studio/dashboard if user is a creator
    await requireFan()

    return <>{children}</>
}
