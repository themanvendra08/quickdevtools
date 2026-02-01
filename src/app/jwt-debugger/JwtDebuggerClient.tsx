"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { jwtDecode } from "jwt-decode";

export function JwtDebuggerClient() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState({});
  const [payload, setPayload] = useState({});

  const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setToken(value);
    try {
      const decodedHeader = jwtDecode(value, { header: true });
      const decodedPayload = jwtDecode(value);
      setHeader(decodedHeader);
      setPayload(decodedPayload);
    } catch (error) {
      setHeader({});
      setPayload({});
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Encoded Token</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your JWT here"
              value={token}
              onChange={handleTokenChange}
              rows={10}
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Decoded Header</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              {JSON.stringify(header, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Decoded Payload</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
