import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Category, PageProps } from '@/types';
import { FormEventHandler } from 'react';

interface Props extends PageProps {
    category: Category;
}

export default function Edit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        description: category.description || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('blog.admin.categories.update', category.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Edit Category
                    </h2>
                    <Link href={route('blog.admin.categories.index')}>
                        <SecondaryButton>Back to Categories</SecondaryButton>
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Category: ${category.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Category Information
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Update the category details below.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Current slug: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">{category.slug}</code>
                                        <br />
                                        Changing the name will update the slug automatically.
                                    </p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        rows={4}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Optional description for this category..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {category.posts_count !== undefined && category.posts_count > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                    Category in use
                                                </h3>
                                                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                                    <p>
                                                        This category is currently assigned to {category.posts_count} blog post{category.posts_count === 1 ? '' : 's'}.
                                                        Changes to this category will affect those posts.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end space-x-4">
                                    <Link href={route('blog.admin.categories.index')}>
                                        <SecondaryButton type="button">
                                            Cancel
                                        </SecondaryButton>
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Category'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}