import { useState } from "react";
import { Link } from "react-router-dom";
import { Google } from "../../components/Icons/Icons";
import { registerUser } from "../../api/user";
import type { UserCreateRequest } from "../../types/user";
import { Loading } from "../../components/Loading";

type RegisterFieldErrors = {
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    confirmPassword?: string;
};

export const Register: React.FC = () => {
    // -----------------------------
    // Form State
    // -----------------------------
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});

    const buildUserData = (): UserCreateRequest => {
        return {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            confirmPassword
        };
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            await registerUser(buildUserData());
        } catch (err: any) {
            if (err?.response?.data?.detail) {
                const apiErrors: RegisterFieldErrors = {};

                err.response.data.detail.forEach((e: any) => {
                    const field = e.loc[1] as keyof RegisterFieldErrors;
                    apiErrors[field] = e.msg;
                });

                setFieldErrors(apiErrors);
            } else {
                setError("Failed to create account.");
            }
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Handle Google Login
    // -----------------------------
    const handleGoogleRegister= async () => {
        setLoading(true);
        window.location.href = "api/v1/auth/google/login";
    };


    return (
        <section className="flex flex-col items-center justify-center mt-15 ">
            <div className="w-full max-w-lg">
                <div className="card rounded-lg">
                    <div className="card-body space-y-6 py-0 md:pt-8 md:pb-12 px-0 text-color">
                        <div className="flex flex-col items-start gap-1">
                            <h1 className="text-4xl font-semibold primary-color">Create Account</h1>
                            <p className="text-lg mt-2 text-gray-500">Create your free account!</p>
                        </div>

                        {
                            error && (
                                <p className="text-error">{error}</p>
                            )
                        }

                        <div className="flex flex-col space-y-5">

                            <div className="flex flex-row gap-4">

                                <label className="flex-1 form-control">
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        className={`input input-lg input-bordered text-sm ${fieldErrors.first_name ? "input-error" : ""}`}
                                        name="first_name"
                                        autoComplete="given-name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                    {fieldErrors.first_name && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.first_name}</p>
                                    )}
                                </label>

                                <label className="flex-1 form-control">
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        className={`input input-lg input-bordered text-sm ${fieldErrors.last_name ? "input-error" : ""}`}
                                        name="last_name"
                                        autoComplete="family-name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                    {fieldErrors.last_name && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.last_name}</p>
                                    )}
                                </label>

                            </div>

                            <label className="form-control">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className={`input input-lg input-bordered w-full text-sm ${fieldErrors.email ? "input-error" : ""}`}
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {fieldErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                                )}
                            </label>

                            <label className="form-control">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={`input input-lg input-bordered w-full text-sm ${fieldErrors.password ? "input-error" : ""}`}
                                    name="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {fieldErrors.password && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                                )}
                            </label>

                            <label className="form-control">
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    className={`input input-lg input-bordered w-full text-sm ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                                    name="confirm_password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                {fieldErrors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                                )}
                            </label>

                            <div className="card-actions pt-4 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="btn btn-lg text-[15px] primary-color-bg surface-color font-medium rounded-lg btn-block"
                                >
                                    {
                                        loading ?
                                            <div>
                                                <Loading size="sm" />
                                            </div>
                                            :
                                            <p>Create account</p>
                                    }
                                </button>

                                <div className="h-px divider before:bg-gray-300 after:bg-gray-300 text-gray-400">
                                    OR
                                </div>

                                <button
                                    onClick={handleGoogleRegister}
                                    disabled={loading}
                                    className="btn btn-lg text-[15px] surface-color-bg text-color font-medium rounded-lg border-black btn-block flex items-center justify-center gap-4"
                                >
                                    <Google />
                                    Sign up with Google
                                </button>
                            </div>

                            <p className="mt-2 text-[16px] text-gray-700">
                                Have an account?{" "}
                                <span className="underline hover:text-blue-400">
                                    <Link to="/login">Sign in</Link>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};