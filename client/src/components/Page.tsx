import React, { type ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar/Navbar";
import { Footer } from "./Footer/Footer";
import { useLocation } from "react-router-dom";

interface PageProps {
  children: ReactNode;
  showFaq?: boolean;
}

export const Page: React.FC<PageProps> = ({ children, showFaq }) => {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="w-full z-50">
        <Navbar />
      </div>

      <main className="flex-1 w-[90%] max-w-[1200px]">
        {children}
      </main>

      <div className="w-full mt-15">
        <Footer showFaq={showFaq} />
      </div>
    </div>
  );
};