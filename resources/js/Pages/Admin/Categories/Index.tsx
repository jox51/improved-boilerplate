import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import { Category, PageProps, PaginatedResponse } from '@/types';

interface Props extends PageProps {
    categories: PaginatedResponse<Category>;
    can: {
        create_category: boolean;
    };
}

export default function Index({ categories, can }: Props) {
    const { flash } = usePage().props as any;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showFlashMessage, setShowFlashMessage] = useState(false);

    // Get top 5 categories by posts_count
    const topCategories = [...categories.data]
        .sort((a, b) => (b.posts_count || 0) - (a.posts_count || 0))
        .slice(0, 5);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlashMessage(true);
            const timer = setTimeout(() => {
                setShowFlashMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (!categoryToDelete) return;

        setIsDeleting(true);
        router.delete(route('blog.admin.categories.destroy', categoryToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setCategoryToDelete(null);
            },
            onError: () => {
                // Error handling is done by Inertia automatically
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Categories
                    </h2>
                    {can.create_category && (
                        <Link href={route('blog.admin.categories.create')}>
                            <PrimaryButton>Create New Category</PrimaryButton>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Categories" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {showFlashMessage && (flash?.success || flash?.error) && (
                        <div className={`mb-4 rounded-md p-4 ${
                            flash?.success
                                ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                        }`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {flash?.success ? (
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm font-medium ${
                                        flash?.success
                                            ? 'text-green-800 dark:text-green-200'
                                            : 'text-red-800 dark:text-red-200'
                                    }`}>
                                        {flash?.success || flash?.error}
                                    </p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <div className="-mx-1.5 -my-1.5">
                                        <button
                                            onClick={() => setShowFlashMessage(false)}
                                            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                flash?.success
                                                    ? 'text-green-500 hover:bg-green-100 focus:ring-green-600 dark:text-green-400 dark:hover:bg-green-900/50'
                                                    : 'text-red-500 hover:bg-red-100 focus:ring-red-600 dark:text-red-400 dark:hover:bg-red-900/50'
                                            }`}
                                        >
                                            <span className="sr-only">Dismiss</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content with Sidebar Layout */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Side Menu - Top Categories */}
                        <div className="lg:w-80 flex-shrink-0">
                            <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 sticky top-6">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        Top Categories
                                    </h3>
                                    {topCategories.length > 0 ? (
                                        <div className="space-y-3">
                                            {topCategories.map((category, index) => (
                                                <div
                                                    key={category.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={`#category-${category.id}`}
                                                            className="block"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex-shrink-0">
                                                                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                                                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                                                                            {index + 1}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                        {category.name}
                                                                    </p>
                                                                    {category.description && (
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                            {category.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div className="flex-shrink-0 ml-2">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            {category.posts_count || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            No categories with posts yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 min-w-0">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {categories.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        No categories found.
                                    </p>
                                    {can.create_category && (
                                        <Link href={route('blog.admin.categories.create')}>
                                            <PrimaryButton>Create Your First Category</PrimaryButton>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Slug
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Description
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Posts
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {categories.data.map((category) => (
                                                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {category.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {category.slug}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                            {category.description || '—'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            {category.posts_count || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={route('blog.admin.categories.edit', category.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteClick(category)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {categories.data.length > 0 && categories.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {categories.prev_page_url && (
                                            <Link
                                                href={categories.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {categories.next_page_url && (
                                            <Link
                                                href={categories.next_page_url}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Showing{' '}
                                                <span className="font-medium">{categories.from}</span> to{' '}
                                                <span className="font-medium">{categories.to}</span> of{' '}
                                                <span className="font-medium">{categories.total}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                {categories.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-600 dark:text-indigo-200'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                                                        } ${
                                                            index === 0 ? 'rounded-l-md' : ''
                                                        } ${
                                                            index === categories.links.length - 1 ? 'rounded-r-md' : ''
                                                        } ${
                                                            !link.url ? 'cursor-not-allowed opacity-50' : ''
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={handleDeleteCancel}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Delete Category
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Are you sure you want to delete the category "{categoryToDelete?.name}"?
                        {categoryToDelete?.posts_count && categoryToDelete.posts_count > 0 && (
                            <span className="block mt-2 text-red-600 dark:text-red-400">
                                This category has {categoryToDelete.posts_count} associated post{categoryToDelete.posts_count === 1 ? '' : 's'}.
                                You'll need to remove or reassign the post{categoryToDelete.posts_count === 1 ? '' : 's'} first.
                            </span>
                        )}
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <SecondaryButton onClick={handleDeleteCancel}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleDeleteConfirm} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Category'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}