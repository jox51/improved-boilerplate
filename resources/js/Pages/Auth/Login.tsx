import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Logo from '../../../images/logo.png';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Log in" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo and Brand */}
                <div className="flex flex-col items-center">
                    <img
                        src={Logo}
                        alt="Arbscreener"
                        className="w-20 h-20 object-contain mb-4"
                    />
                    <Link
                        href="/"
                        className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
                    >
                        Arbscreener
                    </Link>
                    <p className="text-gray-400 text-sm text-center">
                        Sign in to your account
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-400 bg-green-900/20 border border-green-800 rounded-md p-3">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email"
                                className="text-gray-300 font-medium"
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-gray-300 font-medium"
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData(
                                            'remember',
                                            (e.target.checked || false) as false,
                                        )
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            {canResetPassword && (
                                <div className="text-sm">
                                    <Link
                                        href={route('password.request')}
                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div>
                            <PrimaryButton
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={processing}
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800/50 text-gray-400">
                                    Don't have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/register"
                                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-transparent text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                            >
                                Create new account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
