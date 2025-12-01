import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Google } from "../../components/Icons/Icons";
import type { UserLoginRequest } from "../../types/user";
import { useAuth } from "../../contexts/auth";
import { Loading } from "../../components/Loading";

export const Login: React.FC = () => {
    // -----------------------------
    // Form State
    // -----------------------------
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const { login } = useAuth();

    // -----------------------------
    // Build login payload
    // -----------------------------
    const buildLoginData = (): UserLoginRequest => {
        return {
            email,
            password
        };
    };

    // -----------------------------
    // Handle Login
    // -----------------------------
    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            await login(buildLoginData());
            navigate("/account")
        } catch (e: any) {
            const serverError = e?.response?.data?.detail || "Failed to sign in.";
            setError(serverError);
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Handle Google Login
    // -----------------------------
    const handleGoogleLogin = async () => {
        setLoading(true);
        window.location.href = "api/v1/auth/google/login";
    };

    return (
        <section className="flex flex-col items-center justify-center mt-15">
            <div className="w-full max-w-lg">
                <div className="card rounded-lg">
                    <div className="card-body space-y-6 py-0 md:pt-8 md:pb-12 px-0 text-color">
                        <div className="flex flex-col items-start gap-1">
                            <h1 className="text-4xl font-semibold primary-color">Sign in</h1>
                            <p className="text-lg mt-2 text-gray-500">
                                Sign in to your account!
                            </p>
                        </div>

                        {
                            error && (
                                <p className="text-error">{error}</p>
                            )
                        }

                        <div className="flex flex-col space-y-5">
                            <label className="form-control">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className={`input input-lg input-bordered w-full text-sm ${error && "input-error"}`}
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>

                            <label className="form-control relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className={`input input-lg input-bordered w-full text-sm pr-12  ${error && "input-error"}`}
                                    name="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                            <div className="absolute right-4 inset-y-0 flex items-center z-20">
                                <button
                                    type="button"
                                    className="text-gray-600 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            </label>

                            <div className="card-actions pt-4 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="btn btn-lg text-[15px] primary-color-bg surface-color font-medium rounded-lg btn-block"
                                >
                                    {
                                        loading ?
                                            <div className="surface-color">
                                                <Loading size="sm" />
                                            </div>
                                        :
                                            <p>Sign in</p>
                                    }
                                </button>

                                <div className="h-px divider before:bg-gray-300 after:bg-gray-300 text-gray-400">
                                    OR
                                </div>

                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="btn btn-lg text-[15px] surface-color-bg text-color font-medium rounded-lg border-black btn-block flex items-center justify-center gap-4"
                                >
                                    <Google />
                                    Sign in with Google
                                </button>
                            </div>

                            <p className="mt-2 text-[16px] text-gray-700">
                                Don't have an account?{" "}
                                <span className="underline hover:text-blue-400">
                                    <Link to="/register">Sign up</Link>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};