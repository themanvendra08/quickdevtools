"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import * as jose from "jose";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ClaimsTable } from "./ClaimsTable";

export function JwtDebugger() {
  const [activeTab, setActiveTab] = useState("decoder");
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
  );
  const [header, setHeader] = useState<jose.JWTHeader>({});
  const [payload, setPayload] = useState<jose.JWTPayload>({});
  const [secret, setSecret] = useState(
    "a-string-secret-at-least-256-bits-long",
  );
  const [isValid, setIsValid] = useState(false);
  const [isSignatureVerified, setIsSignatureVerified] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [activeHeaderTab, setActiveHeaderTab] = useState("json");
  const [activePayloadTab, setActivePayloadTab] = useState("json");

  // Encoder state
  const [encoderHeader, setEncoderHeader] = useState(
    JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2),
  );
  const [encoderPayload, setEncoderPayload] = useState(
    JSON.stringify(
      { sub: "1234567890", name: "John Doe", admin: true },
      null,
      2,
    ),
  );
  const [generatedToken, setGeneratedToken] = useState("");

  useEffect(() => {
    const decodeToken = async () => {
      if (token) {
        try {
          const decodedHeader = jose.decodeProtectedHeader(token);
          const decodedPayload = jose.decodeJwt(token);
          setHeader(decodedHeader);
          setPayload(decodedPayload);
          setIsValid(true);
          try {
            const encoder = new TextEncoder();
            await jose.jwtVerify(token, encoder.encode(secret));
            setIsSignatureVerified(true);
          } catch (e) {
            setIsSignatureVerified(false);
          }
        } catch (error) {
          setIsValid(false);
          setIsSignatureVerified(false);
          setHeader({});
          setPayload({});
        }
      } else {
        setIsValid(false);
        setIsSignatureVerified(false);
        setHeader({});
        setPayload({});
      }
    };
    if (activeTab === "decoder") {
      decodeToken();
    }
  }, [token, secret, activeTab]);

  const handleClear = () => {
    setToken("");
  };

  const generateExample = () => {
    setToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7Smq3p-QV30",
    );
  };

  const handleGenerateToken = async () => {
    try {
      const parsedHeader = JSON.parse(encoderHeader);
      const parsedPayload = JSON.parse(encoderPayload);
      const jws = await new jose.SignJWT(parsedPayload)
        .setProtectedHeader(parsedHeader)
        .sign(new TextEncoder().encode(secret));
      setGeneratedToken(jws);
    } catch (error: any) {
      setGeneratedToken(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant={activeTab === "decoder" ? "default" : "outline"}
            onClick={() => setActiveTab("decoder")}
          >
            JWT Decoder
          </Button>
          <Button
            variant={activeTab === "encoder" ? "default" : "outline"}
            onClick={() => setActiveTab("encoder")}
          >
            JWT Encoder
          </Button>
        </div>
        {activeTab === "decoder" && (
          <Button variant="outline" onClick={generateExample}>
            Generate example
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {activeTab === "decoder" && (
          <>
            {/* Left Panel - Encoded Value */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Encoded Value
                </span>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="auto-focus"
                    checked={autoFocus}
                    onCheckedChange={() => setAutoFocus(!autoFocus)}
                  />
                  <label
                    htmlFor="auto-focus"
                    className="text-xs text-muted-foreground"
                  >
                    Enable auto-focus
                  </label>
                </div>
              </div>
              <Card className="flex-1 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between py-3 border-b">
                  <CardTitle className="text-sm font-medium">
                    JSON WEB TOKEN (JWT)
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(token)}
                    >
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-4">
                  <div
                    className={cn(
                      "p-2 rounded-md text-sm mb-2",
                      isValid
                        ? "bg-green-950/50 border border-green-500/30 text-green-400"
                        : "bg-red-950/50 border border-red-500/30 text-red-400",
                      !token && "hidden",
                    )}
                  >
                    {isValid ? "Valid JWT" : "Invalid JWT"}
                  </div>
                  <div
                    className={cn(
                      "p-2 rounded-md text-sm mb-2",
                      isSignatureVerified
                        ? "bg-green-950/50 border border-green-500/30 text-green-400"
                        : "bg-orange-950/50 border border-orange-500/30 text-orange-400",
                      !isValid && "hidden",
                    )}
                  >
                    {isSignatureVerified
                      ? "Signature Verified"
                      : "Signature Not Verified"}
                  </div>
                  <div className="flex-1 bg-muted/30 rounded-md p-4 relative min-h-[200px]">
                    {/* Colored token overlay */}
                    <div className="font-mono text-sm break-all pointer-events-none absolute inset-4 overflow-auto">
                      {token && (
                        <span>
                          <span className="text-red-400">
                            {token.split(".")[0]}
                          </span>
                          <span className="text-muted-foreground">.</span>
                          <span className="text-purple-400">
                            {token.split(".")[1]}
                          </span>
                          <span className="text-muted-foreground">.</span>
                          <span className="text-cyan-400">
                            {token.split(".")[2]}
                          </span>
                        </span>
                      )}
                    </div>
                    {/* Editable textarea */}
                    <Textarea
                      placeholder="Paste your JWT here"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="absolute inset-0 w-full h-full bg-transparent border-none resize-none focus-visible:ring-0 font-mono text-sm text-transparent caret-white p-4"
                      autoFocus={autoFocus}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Decoded Data */}
            <div className="flex flex-col gap-4 h-full">
              {/* Decoded Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Decoded Header
                  </span>
                </div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={
                          activeHeaderTab === "json" ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setActiveHeaderTab("json")}
                        className="text-xs"
                      >
                        JSON
                      </Button>
                      <Button
                        variant={
                          activeHeaderTab === "claims" ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setActiveHeaderTab("claims")}
                        className="text-xs"
                      >
                        Claims Table
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            JSON.stringify(header, null, 2),
                          )
                        }
                      >
                        Copy
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {Object.keys(header).length === 0 ? (
                      <div className="bg-muted/30 p-4 rounded-md text-sm text-muted-foreground italic">
                        Paste a JWT to see the decoded header
                      </div>
                    ) : activeHeaderTab === "json" ? (
                      <pre className="bg-muted/30 p-4 rounded-md overflow-x-auto font-mono text-sm">
                        <span className="text-muted-foreground">{"{\n"}</span>
                        {Object.entries(header).map(
                          ([key, value], index, arr) => (
                            <span key={key}>
                              {"  "}
                              <span className="text-red-400">
                                &quot;{key}&quot;
                              </span>
                              <span className="text-muted-foreground">: </span>
                              <span className="text-cyan-400">
                                &quot;{String(value)}&quot;
                              </span>
                              {index < arr.length - 1 && (
                                <span className="text-muted-foreground">,</span>
                              )}
                              {"\n"}
                            </span>
                          ),
                        )}
                        <span className="text-muted-foreground">{"}"}</span>
                      </pre>
                    ) : (
                      <ClaimsTable data={header} />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Decoded Payload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Decoded Payload
                  </span>
                </div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={
                          activePayloadTab === "json" ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setActivePayloadTab("json")}
                        className="text-xs"
                      >
                        JSON
                      </Button>
                      <Button
                        variant={
                          activePayloadTab === "claims" ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setActivePayloadTab("claims")}
                        className="text-xs"
                      >
                        Claims Table
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            JSON.stringify(payload, null, 2),
                          )
                        }
                      >
                        Copy
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {Object.keys(payload).length === 0 ? (
                      <div className="bg-muted/30 p-4 rounded-md text-sm text-muted-foreground italic">
                        Paste a JWT to see the decoded payload
                      </div>
                    ) : activePayloadTab === "json" ? (
                      <pre className="bg-muted/30 p-4 rounded-md overflow-x-auto font-mono text-sm">
                        <span className="text-muted-foreground">{"{\n"}</span>
                        {Object.entries(payload).map(
                          ([key, value], index, arr) => (
                            <span key={key}>
                              {"  "}
                              <span className="text-red-400">
                                &quot;{key}&quot;
                              </span>
                              <span className="text-muted-foreground">: </span>
                              <span
                                className={
                                  typeof value === "boolean"
                                    ? "text-purple-400"
                                    : typeof value === "number"
                                      ? "text-green-400"
                                      : "text-cyan-400"
                                }
                              >
                                {typeof value === "string"
                                  ? `"${value}"`
                                  : String(value)}
                              </span>
                              {index < arr.length - 1 && (
                                <span className="text-muted-foreground">,</span>
                              )}
                              {"\n"}
                            </span>
                          ),
                        )}
                        <span className="text-muted-foreground">{"}"}</span>
                      </pre>
                    ) : (
                      <ClaimsTable data={payload} />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* JWT Signature Verification */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    JWT Signature Verification{" "}
                    <span className="text-muted-foreground/60">(Optional)</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Enter the secret used to sign the JWT below:
                </p>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 border-b">
                    <CardTitle className="text-sm font-medium">
                      Secret
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(secret)}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSecret("")}
                      >
                        Clear
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div
                      className={cn(
                        "p-2 rounded-md text-sm mb-2",
                        isSignatureVerified
                          ? "bg-green-950/50 border border-green-500/30 text-green-400"
                          : "bg-muted/30 border border-muted text-muted-foreground",
                        !isValid && "hidden",
                      )}
                    >
                      {isSignatureVerified
                        ? "Valid secret"
                        : "Enter secret to verify"}
                    </div>
                    <div className="bg-muted/30 rounded-md p-4 font-mono text-sm">
                      <input
                        type="text"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="w-full bg-transparent border-none outline-none"
                        placeholder="Enter your secret here"
                      />
                    </div>
                    <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground">
                      <span>Encoding Format</span>
                      <select className="ml-2 bg-muted border border-border rounded px-2 py-1">
                        <option>UTF-8</option>
                        <option>Base64</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === "encoder" && (
          <>
            {/* Left Column - Input sections */}
            <div className="flex flex-col gap-4">
              {/* Header Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Header: Algorithm & Token Type
                  </span>
                </div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 border-b">
                    <div
                      className={cn(
                        "p-2 rounded-md text-sm flex-1",
                        "bg-green-950/50 border border-green-500/30 text-green-400",
                      )}
                    >
                      Valid header
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() =>
                        setEncoderHeader(
                          JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2),
                        )
                      }
                    >
                      Clear
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="bg-muted/30 rounded-md p-4 relative min-h-[120px]">
                      {/* Colored JSON overlay */}
                      <div className="font-mono text-sm pointer-events-none absolute inset-4 overflow-auto">
                        {(() => {
                          try {
                            const parsed = JSON.parse(encoderHeader);
                            return (
                              <pre>
                                <span className="text-muted-foreground">
                                  {"{\n"}
                                </span>
                                {Object.entries(parsed).map(
                                  ([key, value], index, arr) => (
                                    <span key={key}>
                                      {"  "}
                                      <span className="text-red-400">
                                        &quot;{key}&quot;
                                      </span>
                                      <span className="text-muted-foreground">
                                        :{" "}
                                      </span>
                                      <span className="text-cyan-400">
                                        &quot;{String(value)}&quot;
                                      </span>
                                      {index < arr.length - 1 && (
                                        <span className="text-muted-foreground">
                                          ,
                                        </span>
                                      )}
                                      {"\n"}
                                    </span>
                                  ),
                                )}
                                <span className="text-muted-foreground">
                                  {"}"}
                                </span>
                              </pre>
                            );
                          } catch {
                            return (
                              <span className="text-red-400">
                                {encoderHeader}
                              </span>
                            );
                          }
                        })()}
                      </div>
                      <Textarea
                        value={encoderHeader}
                        onChange={(e) => setEncoderHeader(e.target.value)}
                        className="absolute inset-0 w-full h-full bg-transparent border-none resize-none focus-visible:ring-0 font-mono text-sm text-transparent caret-white p-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payload Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Payload: Data
                  </span>
                </div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 border-b">
                    <div
                      className={cn(
                        "p-2 rounded-md text-sm flex-1",
                        "bg-green-950/50 border border-green-500/30 text-green-400",
                      )}
                    >
                      Valid payload
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() =>
                        setEncoderPayload(
                          JSON.stringify(
                            {
                              sub: "1234567890",
                              name: "John Doe",
                              admin: true,
                              iat: 1516239022,
                            },
                            null,
                            2,
                          ),
                        )
                      }
                    >
                      Clear
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="bg-muted/30 rounded-md p-4 relative min-h-[160px]">
                      {/* Colored JSON overlay */}
                      <div className="font-mono text-sm pointer-events-none absolute inset-4 overflow-auto">
                        {(() => {
                          try {
                            const parsed = JSON.parse(encoderPayload);
                            return (
                              <pre>
                                <span className="text-muted-foreground">
                                  {"{\n"}
                                </span>
                                {Object.entries(parsed).map(
                                  ([key, value], index, arr) => (
                                    <span key={key}>
                                      {"  "}
                                      <span className="text-red-400">
                                        &quot;{key}&quot;
                                      </span>
                                      <span className="text-muted-foreground">
                                        :{" "}
                                      </span>
                                      <span
                                        className={
                                          typeof value === "boolean"
                                            ? "text-purple-400"
                                            : typeof value === "number"
                                              ? "text-green-400"
                                              : "text-cyan-400"
                                        }
                                      >
                                        {typeof value === "string"
                                          ? `"${value}"`
                                          : String(value)}
                                      </span>
                                      {index < arr.length - 1 && (
                                        <span className="text-muted-foreground">
                                          ,
                                        </span>
                                      )}
                                      {"\n"}
                                    </span>
                                  ),
                                )}
                                <span className="text-muted-foreground">
                                  {"}"}
                                </span>
                              </pre>
                            );
                          } catch {
                            return (
                              <span className="text-red-400">
                                {encoderPayload}
                              </span>
                            );
                          }
                        })()}
                      </div>
                      <Textarea
                        value={encoderPayload}
                        onChange={(e) => setEncoderPayload(e.target.value)}
                        className="absolute inset-0 w-full h-full bg-transparent border-none resize-none focus-visible:ring-0 font-mono text-sm text-transparent caret-white p-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Secret Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sign JWT: Secret
                  </span>
                </div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between py-3 border-b">
                    <div
                      className={cn(
                        "p-2 rounded-md text-sm flex-1",
                        secret.length >= 32
                          ? "bg-green-950/50 border border-green-500/30 text-green-400"
                          : "bg-orange-950/50 border border-orange-500/30 text-orange-400",
                      )}
                    >
                      {secret.length >= 32
                        ? "Valid secret"
                        : "Secret should be at least 256 bits"}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => setSecret("")}
                    >
                      Clear
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="bg-muted/30 rounded-md p-4 font-mono text-sm">
                      <input
                        type="text"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="w-full bg-transparent border-none outline-none"
                        placeholder="Enter your secret here"
                      />
                    </div>
                    <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground">
                      <span>Encoding Format</span>
                      <select className="ml-2 bg-muted border border-border rounded px-2 py-1">
                        <option>UTF-8</option>
                        <option>Base64</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Generated Token */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  JSON Web Token
                </span>
              </div>
              <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between py-3 border-b">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateToken}
                  >
                    Generate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigator.clipboard.writeText(generatedToken)
                    }
                  >
                    Copy
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-muted/30 rounded-md p-4 font-mono text-sm break-all min-h-[400px]">
                    {generatedToken ? (
                      <span>
                        <span className="text-red-400">
                          {generatedToken.split(".")[0]}
                        </span>
                        <span className="text-muted-foreground">.</span>
                        <span className="text-purple-400">
                          {generatedToken.split(".")[1]}
                        </span>
                        <span className="text-muted-foreground">.</span>
                        <span className="text-cyan-400">
                          {generatedToken.split(".")[2]}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Click Generate to create a JWT
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
