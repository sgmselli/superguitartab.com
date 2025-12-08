import { ChevronDown, User } from "lucide-react";
import { Link } from "react-router-dom";

import { LogoAndTextWhite } from "../Logo";
import { SearchBarModal } from "./Seach";
import type { DropdownItem } from "./Dropdown";
import { NavbarDropdown } from "./Dropdown";
import { MobileDrawer } from "./MobileDrawer";
import { useAuth } from "../../contexts/auth";
import { formatTitle } from "../../utils/wordFormatting";

export const Navbar: React.FC = () => {

    const { isAuthenticated, user, loadingUser } = useAuth();

    const genres: DropdownItem[] = [
        {name: "Classical", link: "/category/genre/classical"},
        {name: "Country", link: "/category/genre/country"},
        {name: "Folk", link: "/category/genre/folk"},
        {name: "Indie", link: "/category/genre/indie"},
        {name: "Metal", link: "/category/genre/metal"},
        {name: "Pop", link: "/category/genre/pop"},
        {name: "Rock", link: "/category/genre/rock"},
    ]

    const styles: DropdownItem[] = [
        {name: "Finger picking", link: "/category/style/finger-picking"},
        {name: "Strumming", link: "/category/style/strumming"},
        {name: "Electric", link: "/category/style/electric"},
        {name: "Bass", link: "/category/style/bass"},
    ]

    const account: DropdownItem[] = [
        {name: "Downloaded tabs", link: "/account"},
        {name: "Log out", link: "/logout"},
    ]

    return (
    <div className="w-full primary-color-bg surface-color flex flex-col items-center justify-center">
        <div className="relative w-[90%] max-w-[1200px] h-[140px] md:h-[100px] flex flex-col md:flex-row justify-center gap-4 md:gap-0 md:items-center md:justify-between overflow-hidden ">
            <div className="flex items-center justify-between">
                <Link to="/" className="w-50 md:w-70 md:pb-2 md:pr-4">
                    <LogoAndTextWhite/>
                </Link>
                <div className="md:hidden">
                    <MobileDrawer />
                </div>
            </div>
            <SearchBarModal />
            <img
                src="/images/logo.png"
                alt="Background logo"
                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 w-[120px] pointer-events-none select-none z-0"
            />
        </div>
        <hr className="hidden md:inline w-full h-px bg-gray-700 border-0"/>
        <div className="hidden md:flex w-[90%] max-w-[1200px] h-[55px] items-center justify-between gap-8">
            <div className="flex items-center gap-8">
                <NavbarDropdown name="Genre" icon={ChevronDown} items={genres} />
                <NavbarDropdown name="Style" icon={ChevronDown} items={styles} />
                <div tabIndex={0} role="button" className="flex items-center text-sm text-gray-300 font-light gap-2 cursor-pointer hover:text-white">
                    <Link to="/browse">Browse</Link>
                </div>
            </div>
            <div className="flex items-center gap-8">
                {
                    !loadingUser && (
                        isAuthenticated() && user ?
                            <NavbarDropdown name={`${formatTitle(user.first_name)} ${formatTitle(user.last_name)}`} icon={User} items={account} />
                        :
                            <Link to="/login">
                                <div className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
                                    <div className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
                                        <p className="text-sm font-light">Sign in</p>
                                        <User size={18} />
                                    </div>
                                </div>
                            </Link>
                    )
                }
            </div>
        </div>
    </div>
    );
};