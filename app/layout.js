import "./globals.css";

export const metadata = {
  title: "Aesthetic Social Kit — Instant Status Engine",
  description:
    "Design aesthetic story templates, build viral short-form scripts, and format Instagram captions — all in your browser, zero backend needed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
