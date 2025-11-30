import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Google } from "../../components/Icons/Icons";
import type { UserLoginRequest } from "../../types/user";
import { useAuth } from "../../contexts/auth";

export const Login: React.FC = () => {
    // -----------------------------
    // Form State
    // -----------------------------
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
        } catch {
            setError("Failed to sign in.");
            alert("Failed to sign in.");
            console.log(loading)
             console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center mt-15">
            <div className="w-full max-w-lg">
                <div className="card rounded-lg">
                    <div className="card-body space-y-6 pb-10 pt-8 px-8 pb-12 text-color">
                        <div className="flex flex-col items-start gap-1">
                            <h1 className="text-4xl font-semibold primary-color">Sign in</h1>
                            <p className="text-lg mt-2 text-gray-500">
                                Sign in to your account!
                            </p>
                        </div>

                        <div className="flex flex-col space-y-5">
                            <label className="form-control">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="input input-lg input-bordered w-full text-sm"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>

                            <label className="form-control">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input input-lg input-bordered w-full text-sm"
                                    name="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>

                            <div className="card-actions pt-4 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    onClick={handleLogin}
                                    className="btn btn-lg text-[15px] primary-color-bg surface-color font-medium rounded-lg btn-block"
                                >
                                    Sign In
                                </button>

                                {/* <div className="h-px divider before:bg-gray-300 after:bg-gray-300 text-gray-400">
                                    OR
                                </div>

                                <button
                                    className="btn btn-lg text-[15px] surface-color-bg text-color font-medium rounded-lg border-black btn-block flex items-center justify-center gap-4"
                                >
                                    <Google />
                                    Sign in with Google
                                </button> */}
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