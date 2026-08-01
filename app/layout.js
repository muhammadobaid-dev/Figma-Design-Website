import { Manrope, Instrument_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Efandex | Admin Dashboard — MUHAMMAD OBAID",
  description: "Professional property management admin dashboard by MUHAMMAD OBAID",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${instrument.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
