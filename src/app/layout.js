import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DesNote - Manajemen Notulensi DesNet",
  description: "Aplikasi Notulensi",

  icons:{
    icon: [
      {
        url: "./favicon.ico",
        href: "./favicon.ico",
      }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

          {children}
          <ToastContainer />
 
      </body>
    </html>
  );
}
