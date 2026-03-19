import "./globals.css";

export const metadata = {
  title: "CSRF Bank Demo",
  description: "CSRF Attack and Protection Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}