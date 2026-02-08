import React, {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    useCallback,
} from "react";

/**
 * ===================================
 * Types & Interfaces
 * ===================================
 */
export type SidebarLink = {
    id: string;
    label: string;
    href?: string;
    icon?: React.ReactNode;
    active?: boolean;
};

export type Stat = {
    id: string;
    label: string;
    value: number | string;
};

export type ProjectStatus = "inProgress" | "upcoming" | "completed" | "paused";

export type Project = {
    id: string;
    name: string;
    subtitle?: string;
    date?: string;
    progress?: number;
    status?: ProjectStatus;
    accentColor?: string;
    participants?: string[];
    daysLeft?: number | string;
    bgColorClass?: string;
};

export type Message = {
    id: string;
    name: string;
    avatarUrl: string;
    text: string;
    date: string;
    starred?: boolean;
};

export type SortBy = "manual" | "date" | "name" | "progress";
export type SortDir = "asc" | "desc";
export type ThemeMode = "light" | "dark" | "system";

export type ProjectDashboardProps = {
    title?: string;
    user?: { name?: string; avatarUrl?: string };
    sidebarLinks?: SidebarLink[];
    stats?: Stat[];
    projects: Project[];
    messages?: Message[];
    view?: "grid" | "list";
    defaultView?: "grid" | "list";
    onViewChange?: (view: "grid" | "list") => void;
    searchQuery?: string;
    defaultSearchQuery?: string;
    onSearchQueryChange?: (q: string) => void;
    showSearch?: boolean;
    searchPlaceholder?: string;
    messagesOpen?: boolean;
    defaultMessagesOpen?: boolean;
    onMessagesOpenChange?: (open: boolean) => void;
    sortBy?: SortBy;
    defaultSortBy?: SortBy;
    sortDir?: SortDir;
    defaultSortDir?: SortDir;
    onSortChange?: (by: SortBy, dir: SortDir) => void;
    statusFilter?: ProjectStatus | "all";
    defaultStatusFilter?: ProjectStatus | "all";
    onStatusFilterChange?: (status: ProjectStatus | "all") => void;
    pageSize?: number;
    initialPage?: number;
    onPageChange?: (page: number) => void;
    virtualizeList?: boolean;
    estimatedRowHeight?: number;
    onProjectClick?: (projectId: string) => void;
    onProjectAction?: (projectId: string, action: "open" | "edit" | "delete") => void;
    onProjectUpdate?: (project: Project) => void;
    onProjectsReorder?: (orderedIds: string[]) => void;
    allowCreate?: boolean;
    onProjectCreate?: (project: Project) => void;
    generateId?: () => string;
    onMessageStarChange?: (messageId: string, starred: boolean) => void;
    showThemeToggle?: boolean;
    onToggleTheme?: () => void;
    theme?: ThemeMode;
    defaultTheme?: ThemeMode;
    onThemeChange?: (mode: ThemeMode) => void;
    persistKey?: string;
    className?: string;
    loading?: boolean;
    emptyProjectsLabel?: string;
    emptyMessagesLabel?: string;
};

const spacing = {
    page: {
        header: "px-4 sm:px-6 lg:px-8 py-4",
        sidebar: "px-2 sm:px-3 py-4",
        main: "px-4 sm:px-6 lg:px-8 py-4",
        messages: "px-4 sm:px-6 py-4"
    },
    card: {
        base: "p-4 sm:p-5 lg:p-6",
        compact: "p-3 sm:p-4"
    },
    button: {
        sm: "px-2.5 py-1.5",
        md: "px-3 py-2",
        lg: "px-4 py-2.5"
    },
    gap: {
        xs: "gap-2",
        sm: "gap-3",
        md: "gap-4",
        lg: "gap-6"
    }
};

const cx = (...classes: Array<string | false | null | undefined>) => {
    return classes.filter(Boolean).join(" ");
};

const parseDateLike = (v?: string): number => {
    if (!v) return 0;
    const ts = Date.parse(v);
    return Number.isNaN(ts) ? 0 : ts;
};

const clamp = (n: number, min: number, max: number) => {
    return Math.min(Math.max(n, min), max);
};

const readLS = <T,>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};

const writeLS = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { }
};

const Icons = {
    Dots: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
        </svg>
    ),
    Grid: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    List: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Bell: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    Search: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    Theme: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Plus: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" />
        </svg>
    ),
    Trash: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M3 6h18M8 6V4h8v2m-1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Home: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Chart: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M4 19V5M10 19V9M16 19V3M22 19H2" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Calendar: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M7 2v4M17 2v4M3 8h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Settings: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .33 1.8 1.8 0 0 0-.82 1.51V21.5a2 2 0 1 1-4 0v-.26A1.8 1.8 0 0 0 7 19.4a1.8 1.8 0 0 0-1.98-.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.33-1 1.8 1.8 0 0 0-1.51-.82H2.5a2 2 0 1 1 0-4h.26A1.8 1.8 0 0 0 4.6 7a1.8 1.8 0 0 0-.36-1.98l-.06-.06A2 2 0 1 1 7.01 2.13l.06.06A1.8 1.8 0 0 0 9 4.6c.34 0 .67-.11 1-.33.46-.31.77-.82.82-1.38V2.5a2 2 0 1 1 4 0v.26c.05.56.36 1.07.82 1.38.33.22.66.33 1 .33a1.8 1.8 0 0 0 1.98-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.8 1.8 0 0 0 19.4 9c0 .34.11.67.33 1 .31.46.82.77 1.38.82h.39a2 2 0 1 1 0 4h-.39c-.56.05-1.07.36-1.38.82-.22.33-.33.66-.33 1z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
    ),
    Close: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    Logo: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Chat: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Star: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M12 2l3.1 6.3L22 9.3l-5 4.9 1.2 7-6.2-3.4L5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="currentColor" />
        </svg>
    ),
    Arrow: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M12 5v14m7-7-7 7-7-7" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    )
};

export function ProjectDashboard({
    title = "Portfolio",
    user = {
        name: "You",
        avatarUrl:
            "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=96&q=80&auto=format&fit=crop",
    },
    sidebarLinks = [
        { id: "home", label: "Home", active: true },
        { id: "charts", label: "Charts" },
        { id: "calendar", label: "Calendar" },
        { id: "settings", label: "Settings" },
    ],
    stats,
    projects,
    messages = [],
    view,
    defaultView = "grid",
    onViewChange,
    searchQuery,
    defaultSearchQuery = "",
    onSearchQueryChange,
    showSearch = true,
    searchPlaceholder = "Search",
    messagesOpen,
    defaultMessagesOpen = false,
    onMessagesOpenChange,
    sortBy,
    defaultSortBy = "date",
    sortDir,
    defaultSortDir = "desc",
    onSortChange,
    statusFilter,
    defaultStatusFilter = "all",
    onStatusFilterChange,
    pageSize = 9,
    initialPage = 1,
    onPageChange,
    virtualizeList = false,
    estimatedRowHeight = 140,
    onProjectClick,
    onProjectAction,
    onProjectUpdate,
    onProjectsReorder,
    allowCreate = true,
    onProjectCreate,
    generateId,
    onMessageStarChange,
    showThemeToggle = true,
    onToggleTheme,
    theme,
    defaultTheme = "system",
    onThemeChange,
    persistKey,
    className = "",
    loading = false,
    emptyProjectsLabel = "No projects match your search.",
    emptyMessagesLabel = "No messages yet.",
}: ProjectDashboardProps) {
    const lsKey = persistKey ? (k: string) => `pd:${persistKey}:${k}` : null;

    const [internalView, setInternalView] = useState<"grid" | "list">(
        lsKey ? readLS(lsKey("view"), defaultView) : defaultView
    );
    const viewMode = view ?? internalView;

    const [internalQuery, setInternalQuery] = useState<string>(
        lsKey ? readLS(lsKey("query"), defaultSearchQuery) : defaultSearchQuery
    );
    const query = searchQuery ?? internalQuery;

    const [internalMessagesOpen, setInternalMessagesOpen] = useState<boolean>(
        lsKey ? readLS(lsKey("messagesOpen"), defaultMessagesOpen) : defaultMessagesOpen
    );
    const isMessagesOpen = messagesOpen ?? internalMessagesOpen;

    const [internalSortBy, setInternalSortBy] = useState<SortBy>(
        lsKey ? readLS(lsKey("sortBy"), defaultSortBy) : defaultSortBy
    );
    const [internalSortDir, setInternalSortDir] = useState<SortDir>(
        lsKey ? readLS(lsKey("sortDir"), defaultSortDir) : defaultSortDir
    );
    const activeSortBy = sortBy ?? internalSortBy;
    const activeSortDir = sortDir ?? internalSortDir;

    const [internalStatusFilter, setInternalStatusFilter] = useState<ProjectStatus | "all">(
        lsKey ? readLS(lsKey("statusFilter"), defaultStatusFilter) : defaultStatusFilter
    );
    const activeStatusFilter = statusFilter ?? internalStatusFilter;

    const [page, setPage] = useState<number>(
        lsKey ? readLS(lsKey("page"), initialPage) : initialPage
    );

    const [localProjects, setLocalProjects] = useState<Project[]>(projects);

    useEffect(() => {
        if (onProjectUpdate || onProjectsReorder) return;
        setLocalProjects(projects);
    }, [projects, onProjectUpdate, onProjectsReorder]);

    const dataProjects = onProjectUpdate || onProjectsReorder ? projects : localProjects;

    const searchInputId = useId();
    const statusSelectId = useId();

    const computedStats: Stat[] = useMemo(() => {
        if (stats) return stats;
        const total = dataProjects.length;
        const byStatus = dataProjects.reduce(
            (acc, p) => {
                acc[p.status ?? "inProgress"]++;
                return acc;
            },
            { inProgress: 0, upcoming: 0, completed: 0, paused: 0 } as Record<ProjectStatus, number>
        );
        return [
            { id: "inProgress", label: "In Progress", value: byStatus.inProgress },
            { id: "upcoming", label: "Upcoming", value: byStatus.upcoming },
            { id: "completed", label: "Completed", value: byStatus.completed },
            { id: "total", label: "Total Projects", value: total },
        ];
    }, [stats, dataProjects]);

    const orderMap = useMemo(() => {
        const map = new Map<string, number>();
        dataProjects.forEach((p, i) => map.set(p.id, i));
        return map;
    }, [dataProjects]);

    const preparedProjects = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = dataProjects.slice();

        if (activeStatusFilter !== "all") {
            list = list.filter((p) => (p.status ?? "inProgress") === activeStatusFilter);
        }
        if (q) {
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    (p.subtitle?.toLowerCase().includes(q) ?? false)
            );
        }

        list.sort((a, b) => {
            let cmp = 0;
            switch (activeSortBy) {
                case "manual":
                    cmp = (orderMap.get(a.id)! - orderMap.get(b.id)!);
                    break;
                case "date":
                    cmp = parseDateLike(a.date) - parseDateLike(b.date);
                    break;
                case "name":
                    cmp = a.name.localeCompare(b.name);
                    break;
                case "progress":
                    cmp = (a.progress ?? 0) - (b.progress ?? 0);
                    break;
            }
            return activeSortBy === "manual" ? cmp : activeSortDir === "asc" ? cmp : -cmp;
        });

        return list;
    }, [dataProjects, query, activeSortBy, activeSortDir, activeStatusFilter, orderMap]);

    const totalPages = virtualizeList ? 1 : Math.max(1, Math.ceil(preparedProjects.length / pageSize));
    const currentPage = virtualizeList ? 1 : clamp(page, 1, totalPages);
    const pagedProjects = useMemo(() => {
        if (virtualizeList) return preparedProjects;
        const start = (currentPage - 1) * pageSize;
        return preparedProjects.slice(start, start + pageSize);
    }, [preparedProjects, currentPage, pageSize, virtualizeList]);

    useEffect(() => {
        if (!virtualizeList) setPage(1);
    }, [query, activeStatusFilter, activeSortBy, activeSortDir, pageSize, virtualizeList]);

    const [internalTheme, setInternalTheme] = useState<ThemeMode>(() => {
        if (theme) return theme;
        if (lsKey) return readLS(lsKey("theme"), "system");
        return defaultTheme;
    });
    const activeTheme = theme ?? internalTheme;

    const applyTheme = useCallback((mode: ThemeMode) => {
        const root = document.documentElement;
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
        const isDark = mode === "dark" || (mode === "system" && prefersDark);
        root.classList.toggle("dark", isDark);
    }, []);

    useEffect(() => {
        applyTheme(activeTheme);
        if (lsKey) writeLS(lsKey("theme"), activeTheme);
    }, [activeTheme, applyTheme, lsKey]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isMessagesOpen) setMessagesOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isMessagesOpen]);

    const setView = (next: "grid" | "list") => {
        if (view === undefined) setInternalView(next);
        onViewChange?.(next);
    };

    const setSearch = (q: string) => {
        if (searchQuery === undefined) setInternalQuery(q);
        onSearchQueryChange?.(q);
    };

    const setMessagesOpen = (open: boolean) => {
        if (messagesOpen === undefined) setInternalMessagesOpen(open);
        onMessagesOpenChange?.(open);
    };

    const setStatusFilter = (status: ProjectStatus | "all") => {
        if (statusFilter === undefined) setInternalStatusFilter(status);
        onStatusFilterChange?.(status);
    };

    return (
        <div className={cx("pd-container flex flex-col h-screen bg-slate-50 dark:bg-slate-900", className)}>
            <header className={cx("flex items-center justify-between border-b border-slate-200 dark:border-slate-700", spacing.page.header, spacing.gap.sm)}>
                <div className={cx("flex items-center min-w-0", spacing.gap.sm)}>
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
                        <Icons.Logo className="size-5" />
                    </span>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">{title}</h1>
                </div>
                <div className={cx("flex items-center", spacing.gap.xs)}>
                    <img src={user?.avatarUrl} alt="" className="size-8 rounded-md object-cover" />
                    <span className="hidden sm:inline text-sm font-medium text-slate-800 dark:text-slate-100">{user?.name}</span>
                </div>
            </header>
            <main className={cx("flex-1 overflow-y-auto", spacing.page.main)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {preparedProjects.map(p => (
                        <div key={p.id} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold">{p.name}</h3>
                            <p className="text-sm text-slate-500">{p.subtitle}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default ProjectDashboard;
