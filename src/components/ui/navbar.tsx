import Link from "next/link";
import { Button } from "./button";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl tracking-tight"
              style={{
                fontFamily: "var(--font-darker-grotesque)",
                fontWeight: 800,
              }}
            >
              <span className="text-foreground">Quickdevtools</span>
              <span style={{ color: "#FF6B5B" }}>.</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" passHref>
              <Button variant="ghost">JSON Formatter</Button>
            </Link>
            <Link href="/jwt-debugger" passHref>
              <Button variant="ghost">JWT Debugger</Button>
            </Link>
            <Link href="/diff-checker" passHref>
              <Button variant="ghost">Diff Checker</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
