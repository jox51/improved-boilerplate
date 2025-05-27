import { Head, useForm, router } from "@inertiajs/react";
import { FormEventHandler, useRef, useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import { PageProps } from "@/types";

interface BlogSettingsProps extends PageProps {
    bannerImageUrl?: string;
    currentThemePaletteId: string;
    availableThemes: {
        [key: string]: {
            name: string;
            colors: {
                primary: string;
                secondary: string;
                accent: string;
                neutral: string;
                base: string;
            };
        };
    };
    flash?: {
        success?: boolean;
        message?: string;
        bannerImageUrl?: string;
    };
}

export default function BlogSettings({ bannerImageUrl, currentThemePaletteId, availableThemes, flash }: BlogSettingsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(bannerImageUrl || null);
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<string>(currentThemePaletteId);
    const [isSavingTheme, setIsSavingTheme] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        banner_image: null as File | null,
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.message) {
            setMessage({
                type: flash.success ? 'success' : 'error',
                text: flash.message
            });
            
            if (flash.success && flash.bannerImageUrl) {
                setPreviewUrl(flash.bannerImageUrl);
            }
        }
    }, [flash]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('banner_image', file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.banner_image) {
            setMessage({ type: 'error', text: 'Please select an image to upload.' });
            return;
        }

        setIsUploading(true);
        setMessage(null);

        router.post(route('blog.admin.settings.banner.upload'), {
            banner_image: data.banner_image,
        }, {
            onSuccess: () => {
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: (errors) => {
                setMessage({ type: 'error', text: 'An error occurred while uploading the image.' });
            },
            onFinish: () => {
                setIsUploading(false);
            },
        });
    };

    const handleRemove = () => {
        setIsRemoving(true);
        setMessage(null);

        router.delete(route('blog.admin.settings.banner.remove'), {
            onSuccess: () => {
                setPreviewUrl(null);
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: (errors) => {
                setMessage({ type: 'error', text: 'An error occurred while removing the image.' });
            },
            onFinish: () => {
                setIsRemoving(false);
            },
        });
    };

    const handleThemeSave = () => {
        setIsSavingTheme(true);
        setMessage(null);

        router.put(route('blog.admin.settings.updateTheme'), {
            theme_palette_id: selectedTheme,
        }, {
            onSuccess: () => {
                setMessage({ type: 'success', text: 'Blog theme updated successfully!' });
            },
            onError: (errors) => {
                setMessage({ type: 'error', text: 'An error occurred while updating the theme.' });
            },
            onFinish: () => {
                setIsSavingTheme(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Blog Settings
                </h2>
            }
        >
            <Head title="Blog Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Banner Image Settings
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Upload a custom banner image for your blog index page. The image will be displayed as the background of the hero section.
                                </p>

                                {/* Message Display */}
                                {message && (
                                    <div className={`mb-4 p-4 rounded-md ${
                                        message.type === 'success' 
                                            ? 'bg-green-50 text-green-800 border border-green-200' 
                                            : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}>
                                        {message.text}
                                    </div>
                                )}

                                {/* Current Banner Preview */}
                                {previewUrl && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                                            Current Banner Image
                                        </h4>
                                        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={previewUrl}
                                                alt="Banner preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Upload Form */}
                                <form onSubmit={handleUpload} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Banner Image
                                        </label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Accepted formats: JPEG, PNG, JPG, GIF, WebP. Max size: 2MB.
                                        </p>
                                        <InputError message={errors.banner_image} className="mt-2" />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <PrimaryButton 
                                            type="submit" 
                                            disabled={isUploading || !data.banner_image}
                                        >
                                            {isUploading ? 'Uploading...' : 'Upload Banner'}
                                        </PrimaryButton>

                                        {previewUrl && (
                                            <DangerButton
                                                type="button"
                                                onClick={handleRemove}
                                                disabled={isRemoving}
                                            >
                                                {isRemoving ? 'Removing...' : 'Remove Banner'}
                                            </DangerButton>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Theme Selector Section */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Blog Theme
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Choose a color palette for your blog. The selected theme will be applied to all public blog pages.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {Object.entries(availableThemes).map(([paletteId, theme]) => (
                                        <div
                                            key={paletteId}
                                            onClick={() => setSelectedTheme(paletteId)}
                                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                                                selectedTheme === paletteId
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {/* Theme Name */}
                                            <h4 className="font-medium text-gray-900 mb-3">
                                                {theme.name}
                                            </h4>

                                            {/* Color Palette */}
                                            <div className="flex space-x-2 mb-3">
                                                {Object.entries(theme.colors).map(([colorName, colorValue]) => (
                                                    <div
                                                        key={colorName}
                                                        className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                                                        style={{ backgroundColor: colorValue }}
                                                        title={`${colorName}: ${colorValue}`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Selection Indicator */}
                                            {selectedTheme === paletteId && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Current Theme Indicator */}
                                            {currentThemePaletteId === paletteId && selectedTheme !== paletteId && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="px-2 py-1 bg-gray-500 text-white text-xs rounded">
                                                        Current
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Save Theme Button */}
                                <div className="flex items-center">
                                    <PrimaryButton
                                        onClick={handleThemeSave}
                                        disabled={isSavingTheme || selectedTheme === currentThemePaletteId}
                                    >
                                        {isSavingTheme ? 'Saving Theme...' : 'Save Theme'}
                                    </PrimaryButton>
                                    {selectedTheme === currentThemePaletteId && (
                                        <span className="ml-3 text-sm text-gray-500">
                                            This theme is already active
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}