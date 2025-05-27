import { Link, router } from "@inertiajs/react";
import { useState, FormEvent } from "react";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface EnhancedPaginationProps {
    currentPage: number;
    lastPage: number;
    total: number;
    links: PaginationLink[];
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    baseUrl?: string;
    className?: string;
}

export default function EnhancedPagination({
    currentPage,
    lastPage,
    total,
    links,
    prevPageUrl,
    nextPageUrl,
    baseUrl,
    className = "",
}: EnhancedPaginationProps) {
    const [jumpToPage, setJumpToPage] = useState("");
    const [isJumping, setIsJumping] = useState(false);

    // Don't render if there's only one page
    if (lastPage <= 1) {
        return null;
    }

    // Generate smart pagination numbers with ellipsis
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const delta = 2; // Number of pages to show around current page
        
        // Always show first page
        pages.push(1);
        
        // Calculate range around current page
        const rangeStart = Math.max(2, currentPage - delta);
        const rangeEnd = Math.min(lastPage - 1, currentPage + delta);
        
        // Add ellipsis after first page if needed
        if (rangeStart > 2) {
            pages.push("...");
        }
        
        // Add pages around current page
        for (let i = rangeStart; i <= rangeEnd; i++) {
            if (i !== 1 && i !== lastPage) {
                pages.push(i);
            }
        }
        
        // Add ellipsis before last page if needed
        if (rangeEnd < lastPage - 1) {
            pages.push("...");
        }
        
        // Always show last page (if it's not the first page)
        if (lastPage > 1) {
            pages.push(lastPage);
        }
        
        return pages;
    };

    const getPageUrl = (page: number): string => {
        if (baseUrl) {
            // SSR-safe URL construction
            if (typeof window !== 'undefined') {
                const url = new URL(baseUrl, window.location.origin);
                url.searchParams.set("page", page.toString());
                return url.toString();
            } else {
                // SSR fallback: construct relative URL
                const url = new URL(baseUrl, 'http://localhost');
                url.searchParams.set("page", page.toString());
                return url.pathname + url.search;
            }
        }
        
        // Fallback: try to construct URL from existing links
        const pageLink = links.find(link =>
            link.label === page.toString() && link.url
        );
        
        if (pageLink?.url) {
            return pageLink.url;
        }
        
        // Last fallback: use current URL with page parameter (SSR-safe)
        if (typeof window !== 'undefined') {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("page", page.toString());
            return currentUrl.toString();
        } else {
            // SSR fallback: return relative URL with page parameter
            return `?page=${page}`;
        }
    };

    const handleJumpToPage = (e: FormEvent) => {
        e.preventDefault();
        const pageNumber = parseInt(jumpToPage);
        
        if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > lastPage) {
            alert(`Please enter a valid page number between 1 and ${lastPage}`);
            return;
        }
        
        if (pageNumber === currentPage) {
            setJumpToPage("");
            return;
        }
        
        setIsJumping(true);
        const targetUrl = getPageUrl(pageNumber);
        
        router.get(targetUrl, {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsJumping(false);
                setJumpToPage("");
            }
        });
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Page Info */}
            <div className="text-sm text-slate-600">
                Showing page {currentPage} of {lastPage} ({total} total results)
            </div>
            
            {/* Main Pagination Controls */}
            <nav className="flex items-center space-x-2">
                {/* Previous Button */}
                {prevPageUrl ? (
                    <Link
                        href={prevPageUrl}
                        preserveScroll
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors duration-200 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </Link>
                ) : (
                    <span className="px-3 py-2 text-sm font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </span>
                )}

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-sm font-medium text-slate-400"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <Link
                            key={pageNum}
                            href={getPageUrl(pageNum)}
                            preserveScroll
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                isActive
                                    ? "bg-slate-600 text-white"
                                    : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-600"
                            }`}
                        >
                            {pageNum}
                        </Link>
                    );
                })}

                {/* Next Button */}
                {nextPageUrl ? (
                    <Link
                        href={nextPageUrl}
                        preserveScroll
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors duration-200 flex items-center"
                    >
                        Next
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ) : (
                    <span className="px-3 py-2 text-sm font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed flex items-center">
                        Next
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                )}
            </nav>

            {/* Jump to Page */}
            <form onSubmit={handleJumpToPage} className="flex items-center space-x-2">
                <label htmlFor="jump-to-page" className="text-sm text-slate-600 whitespace-nowrap">
                    Jump to:
                </label>
                <input
                    id="jump-to-page"
                    type="number"
                    min="1"
                    max={lastPage}
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    placeholder="Page"
                    className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    disabled={isJumping}
                />
                <button
                    type="submit"
                    disabled={isJumping || !jumpToPage}
                    className="px-3 py-1 text-sm font-medium text-white bg-slate-600 rounded hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isJumping ? "..." : "Go"}
                </button>
            </form>
        </div>
    );
}