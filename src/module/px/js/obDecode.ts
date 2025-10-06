/**
 * PerimeterX Payload Decoder Demo
 * Standalone JavaScript decoder for PerimeterX payloads and requests
 */

// Base64 decoder function
function b64decode(s: string): string {
    const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let out: string = "", i: number = 0;
    
    s = s.replace(/[^A-Za-z0-9+/=]/g, "");
    while (s.length % 4) s += "=";
    
    while (i < s.length) {
        const a: number = chars.indexOf(s[i++]), b: number = chars.indexOf(s[i++]);
        const c: number = chars.indexOf(s[i++]), d: number = chars.indexOf(s[i++]);
        const n: number = (a << 18) | (b << 12) | ((c & 63) << 6) | (d & 63);
        
        out += String.fromCharCode((n >> 16) & 255);
        if (c !== 64) out += String.fromCharCode((n >> 8) & 255);
        if (d !== 64) out += String.fromCharCode(n & 255);
    }
    return out;
}

// Decode PerimeterX response payload
function decodeResponse(obPayload: string, version: string): string[] | null {
    try {
        // Hash version for XOR key
        let h: number = 0;
        for (let i = 0; i < version.length; i++) {
            h = (h * 31 + version.charCodeAt(i)) % 2147483647;
        }
        const key: number = parseInt((h % 900 + 100).toString(), 10) % 128;

        // Decode and XOR
        const decoded: string = b64decode(obPayload);
        let xored: string = "";
        for (let i = 0; i < decoded.length; i++) {
            xored += String.fromCharCode(key ^ decoded.charCodeAt(i));
        }

        return xored.split("~~~~");
    } catch (error) {
        console.error("Error decoding response:", error);
        return null;
    }
}

// Parse PerimeterX response commands into array
function parsePxResponse(commands: string[]): string[][] {
    if (!commands || !Array.isArray(commands)) {
        return [];
    }

    return commands.map(command => command.split('|'));
}

// Decode request payload (base64 encoded JSON)
function decodeRequestPayload(payload: string): any | null {
    try {
        const decoded: string = b64decode(payload);
        return JSON.parse(decoded);
    } catch (error) {
        console.error("Error decoding request payload:", error);
        return null;
    }
}

// Demo function to test the decoder
function runDemo() {
    console.log("=== PerimeterX Payload Decoder Demo ===\n");

    // Example 1: Decode a response payload
    console.log("1. Decoding Response Payload:");
    const exampleResponsePayload = "VGhpcyBpcyBhIGRlbW8gcGF5bG9hZA=="; // "This is a demo payload" in base64
    const version = "1.0.0";
    
    const decodedResponse = decodeResponse(exampleResponsePayload, version);
    console.log("Raw decoded:", decodedResponse);
    
    if (decodedResponse) {
        const parsedCommands = parsePxResponse(decodedResponse);
        console.log("Split commands:", parsedCommands);
    }

    console.log("\n" + "=".repeat(50) + "\n");

    // Example 2: Decode a request payload
    console.log("2. Decoding Request Payload:");
    const exampleRequestPayload = "eyJ0IjoiVjBrbFRSRW5LWDg9IiwiZCI6eyJJQ0pTSm1WSlVSMD0iOlsiUERGIFZpZXdlciIsIkNocm9tZSBQREYgVmlld2VyIl19fQ==";
    
    const decodedRequest = decodeRequestPayload(exampleRequestPayload);
    console.log("Decoded request:", JSON.stringify(decodedRequest, null, 2));

    console.log("\n" + "=".repeat(50) + "\n");

    // Example 3: Parse command array
    console.log("3. Parsing Command Array:");
    const exampleCommands = [
        "OOlllO|cookie_value|domain",
        "OOOOOO|visitor_id",
        "lOlllO|feature1|enabled",
        "lOllll|feature2,feature3"
    ];
    
    const splitCommands = parsePxResponse(exampleCommands);
    console.log("Split commands:", splitCommands);
}

// Only attach to window in browser environment
const isBrowser = typeof window !== 'undefined';
const isServer = !isBrowser;

// Utility functions for interactive use - only in browser environment
if (isBrowser) {
    // Safe browser environment operations
    try {
        (window as any).PXDecoder = {
            decodeResponse,
            parsePxResponse,
            decodeRequestPayload,
            b64decode,
            runDemo
        };
        
        console.log("PerimeterX Decoder loaded. Use PXDecoder.runDemo() to see examples.");
        console.log("Available functions:");
        console.log("- PXDecoder.decodeResponse(payload, version)");
        console.log("- PXDecoder.parsePxResponse(commands)");
        console.log("- PXDecoder.decodeRequestPayload(payload)");
        console.log("- PXDecoder.b64decode(string)");
    } catch (e) {
        console.error("Error attaching to window:", e);
    }
} else if (isServer && typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Only run demo in development environment on server
    try {
        runDemo();
    } catch (e) {
        console.error("Error running demo:", e);
    }
}

// ES module exports
export {
    decodeResponse,
    parsePxResponse,
    decodeRequestPayload,
    b64decode,
    runDemo
};