import { Menu, ArrowLeftToLine, Music, Guitar, User, FileSearchCorner, LogOut, type LucideProps } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/auth";

interface MobileDrawItemProps {
    icon: React.ComponentType<LucideProps>;
    name: string;
    link: string;
    closeDrawer: () => void;
}

interface CollapseItemProps {
    name: string;
    link: string;
}

interface MobileDrawCollapseItemProps {
    icon: React.ComponentType<LucideProps>;
    name: string;
    items: CollapseItemProps[];
    closeDrawer: () => void;

}

export const MobileDrawer: React.FC = () => {

    const { isAuthenticated, user, loadingUser } = useAuth();
    
    const genres: CollapseItemProps[] = [
        {name: "Classical", link: "/category/genre/classical"},
        {name: "Country", link: "/category/genre/country"},
        {name: "Folk", link: "/category/genre/folk"},
        {name: "Indie", link: "/category/genre/indie"},
        {name: "Metal", link: "/category/genre/metal"},
        {name: "Pop", link: "/category/genre/pop"},
        {name: "Rock", link: "/category/genre/rock"},
    ]
    
    const styles: CollapseItemProps[] = [
        {name: "Finger picking", link: "/category/style/finger-picking"},
        {name: "Strumming", link: "/category/style/strumming"},
        {name: "Electric", link: "/category/style/electric"},
        {name: "Bass", link: "/category/style/bass"},
    ]
    
    const closeDrawer = () => {
        const drawer = document.getElementById("my-drawer-5") as HTMLInputElement | null;
        if (drawer) drawer.checked = false;
    };

    return (
        <div className="drawer drawer-end z-100">
            <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content ">
                <label htmlFor="my-drawer-5" className="drawer-button">
                    <Menu size={24} />
                </label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="menu primary-color-bg min-h-full w-80 p-0">
                    <ul>
                        <MobileDrawCloseItem />
                        <MobileDrawItem icon={FileSearchCorner} name="Browse songs" link="/browse" closeDrawer={closeDrawer} />
                        <MobileDrawCollapseItem icon={Music} name="Genres" items={genres} closeDrawer={closeDrawer} />
                        <MobileDrawCollapseItem icon={Guitar} name="Styles" items={styles} closeDrawer={closeDrawer} />
                        {
                            !loadingUser && (
                                isAuthenticated() && user ?
                                    <>
                                        <MobileDrawItem icon={User} name="Downloaded tabs" link="/account" closeDrawer={closeDrawer} />
                                        <MobileDrawItem icon={LogOut} name="Log out" link="/logout" closeDrawer={closeDrawer} />
                                    </>
                                :
                                    <MobileDrawItem icon={User} name="Sign in" link="/account" closeDrawer={closeDrawer} />
                            )
                        }
                    </ul>
                    <img
                        src="/images/logo.png"
                        alt="Background logo"
                        className="absolute right-0 bottom-0 opacity-10 w-[200px] pointer-events-none select-none z-0"
                    />
                </div>
            </div>
        </div>
    )
}

export const MobileDrawItem: React.FC<MobileDrawItemProps> = ({icon: Icon, name, link, closeDrawer}) => {
    return (
        <li className="p-6 pr-2 border-b-2 border-gray-700 primary-color-bg hover:text-white transition-colors z-50" onClick={closeDrawer}>
            <Link to={link} className="p-0">
              <div className="flex items-center gap-3 text-gray-300">
                {<Icon size={18} />}
                    <p className="text-sm font-light">{name}</p>
                </div>
            </Link>
        </li>
    )
}

export const MobileDrawCloseItem: React.FC = () => {
    return (
        <li>
            <label htmlFor="my-drawer-5" aria-label="close sidebar" className="p-6 pr-2 drawer-overlay border-b-2 border-gray-700 primary-color-bg hover:text-white transition-colors z-50">
                <div className="flex items-center gap-3 p-0 text-gray-300">
                    <ArrowLeftToLine size={18} />
                    <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay">
                        <p className="text-sm font-light">Back</p>
                    </label>
                </div>
            </label>
        </li>
    )
}

export const MobileDrawCollapseItem: React.FC<MobileDrawCollapseItemProps> = ({icon: Icon, name, items, closeDrawer}) => {
    return (
        <li className="p-6 pr-2 border-b-2 border-gray-700 primary-color-bg collapse collapse-arrow text-gray-300 p-0 z-50">
            <input type="checkbox" />
            <div className="collapse-title flex items-center gap-3 p-0 text-sm font-light">
                <Icon size={18} />
                <p className="text-sm font-light">{name}</p>
            </div>
            <div className="collapse-content p-0">
                <ul className="space-y-2 pt-5">
                    {items.map((item, idx) => {
                        return (
                            <li key={idx} className="hover:text-white transition-colors cursor-pointer" onClick={closeDrawer}>
                                <Link to={item.link}>{item.name}</Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </li>
    )
}