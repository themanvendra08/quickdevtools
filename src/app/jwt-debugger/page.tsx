import type { Metadata } from "next";
import { JwtDebugger } from "@/components/jwt-debugger/jwt-debugger";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InfoBox } from "@/components/jwt-debugger/InfoBox";

export const metadata: Metadata = {
  title: "JWT Debugger",
  description: "Decode, verify, and generate JSON Web Tokens (JWTs).",
};

export default function JwtDebuggerPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">JSON Web Token (JWT) Debugger</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <InfoBox title="What is a JWT?" variant="info">
          <p>
            Decode, verify, and generate JSON Web Tokens, which are an open,
            industry standard{" "}
            <a
              href="https://www.rfc-editor.org/rfc/rfc7519"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              RFC 7519
            </a>{" "}
            method for representing claims securely between two parties.
          </p>
          <p className="mt-2">
            <a href="#" className="text-primary underline mr-4">
              Learn more about JWT
            </a>
            <a href="#" className="text-primary underline">
              See JWT libraries
            </a>
          </p>
        </InfoBox>
        <InfoBox title="Warning about using JWTs" variant="warning">
          <p>
            <span className="text-yellow-400 font-medium underline">
              For your protection, all JWT debugging and validation happens in
              the browser.
            </span>{" "}
            Be careful where you paste or share JWTs as they can represent
            credentials that grant access to resources. This site does not store
            or transmit your JSON Web Tokens outside of the browser.
          </p>
        </InfoBox>
      </div>

      <JwtDebugger />

      {/* JWT Handbook CTA */}
      <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-purple-900">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/20" />
        <div className="relative flex items-center justify-between p-8">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">
              Get the JWT Handbook
            </h2>
            <p className="text-slate-300 text-sm mb-4">
              Learn how JWT came to be and what problems it was designed to
              tackle. Download it today for free.
            </p>
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="#">Download Ebook →</Link>
            </Button>
          </div>
          <div className="hidden md:flex items-center">
            {/* Handbook visualization */}
            <div className="relative">
              <div className="w-48 h-64 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-2xl transform rotate-3 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-black flex items-center justify-center">
                    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="3" fill="#fff" />
                      <path
                        d="M20 5 L20 17"
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M20 23 L20 35"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5 20 L17 20"
                        stroke="#22c55e"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M23 20 L35 20"
                        stroke="#eab308"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 9 L16 16"
                        stroke="#f97316"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M24 24 L31 31"
                        stroke="#06b6d4"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 31 L16 24"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M24 16 L31 9"
                        stroke="#ec4899"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-white">
                    JWT HANDBOOK
                  </p>
                </div>
              </div>
              <div className="absolute -right-8 top-4 w-40 h-56 bg-white rounded-lg shadow-xl transform -rotate-6 p-3">
                <div className="text-[6px] text-slate-400 space-y-1">
                  <p className="font-bold text-slate-600">Contents</p>
                  <p>1. Introduction</p>
                  <p>2. What is a JWT?</p>
                  <p>3. JWT Structure</p>
                  <p>4. Claims</p>
                  <p>5. Signatures</p>
                  <p>6. Best Practices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
