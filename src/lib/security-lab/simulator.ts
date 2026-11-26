export type SecurityScenarioId =
  | 'sqli'
  | 'xss'
  | 'csrf'
  | 'bruteforce'
  | 'hashing'
  | 'csp';

export type SecurityMode = 'vulnerable' | 'hardened';

export interface SecurityScenarioSpec {
  id: SecurityScenarioId;
  shortLabel: string;
  title: string;
  summary: string;
  presets: Array<{ label: string; value: string }>;
  defaultInput: string;
  inputLabel: string;
  vulnerableCode: string;
  hardenedCode: string;
}

export interface SimulationOutcome {
  statusBadge: string;
  statusTone: 'danger' | 'safe' | 'warn';
  attackerViewTitle: string;
  attackerLines: string[];
  defenderLogJson: string;
  mitigationNote: string;
}

interface MockUserRow {
  id: number;
  username: string;
  role: string;
  note: string;
}

const MOCK_USERS: MockUserRow[] = [
  { id: 1, username: 'alice_demo', role: 'viewer', note: 'Synthetic fixture record #1' },
  { id: 2, username: 'bob_demo', role: 'editor', note: 'Synthetic fixture record #2' },
  { id: 3, username: 'sec_audit_mock', role: 'auditor', note: 'Synthetic fixture record #3' },
];

export const SECURITY_SCENARIOS: SecurityScenarioSpec[] = [
  {
    id: 'sqli',
    shortLabel: 'SQL Injection',
    title: 'SQL Injection vs Parameterized Query + Zod',
    summary:
      'Compare unsafe string concatenation against strict schema validation and bound parameters using a local 3-row fixture.',
    inputLabel: 'Simulated Username Query',
    defaultInput: "' OR '1'='1",
    presets: [
      { label: 'Normal User', value: 'alice_demo' },
      { label: 'Injection Test', value: "' OR '1'='1" },
    ],
    vulnerableCode: `// VULNERABLE: Raw string interpolation alters SQL AST
const sql = "SELECT id, username, role FROM users WHERE username = '" + input + "'";
const rows = await db.raw(sql);`,
    hardenedCode: `// HARDENED: Zod allowlist + parameterized binding
const username = z.string().regex(/^[a-z0-9_]{2,24}$/).parse(input);
const rows = await db.query(
  'SELECT id, username, role FROM users WHERE username = $1',
  [username]
);`,
  },
  {
    id: 'xss',
    shortLabel: 'XSS',
    title: 'Reflected XSS vs Safe Text Encoding & CSP',
    summary:
      'Inspect how unescaped HTML rendering executes injected event handlers versus safe React text escaping + strict nonce CSP.',
    inputLabel: 'Simulated Display Name Input',
    defaultInput: '<img src=x onerror="demoAlert()">',
    presets: [
      { label: 'Safe Text', value: 'Aarna Builder' },
      { label: 'Markup Probe', value: '<img src=x onerror="demoAlert()">' },
    ],
    vulnerableCode: `// VULNERABLE: Injecting raw HTML without encoding or sanitization
container.innerHTML = "<p>Welcome, " + userInput + "</p>";`,
    hardenedCode: `// HARDENED: Auto-escaped JSX text node + strict nonce CSP
return <p>Welcome, {userInput}</p>;
// Response header: script-src 'self' 'nonce-<random>' 'strict-dynamic'`,
  },
  {
    id: 'csrf',
    shortLabel: 'CSRF',
    title: 'Cross-Site Request Forgery vs Origin + CSRF Token',
    summary:
      'Simulate a forged cross-site POST request targeting a session-authenticated profile update endpoint.',
    inputLabel: 'Simulated Request Origin Header',
    defaultInput: 'https://untrusted-site.example',
    presets: [
      { label: 'Trusted Origin', value: 'https://portfolio.local.example' },
      { label: 'Cross-Origin Probe', value: 'https://untrusted-site.example' },
    ],
    vulnerableCode: `// VULNERABLE: Cookie sent cross-site without Origin or CSRF token check
export async function POST(req: Request) {
  await updateEmail(await req.json()); // No Origin or anti-CSRF validation
  return Response.json({ ok: true });
}`,
    hardenedCode: `// HARDENED: SameSite=Strict cookie + Origin allowlist + CSRF token check
if (req.headers.get('origin') !== EXPECTED_ORIGIN) {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
verifyCsrfToken(req.headers.get('x-csrf-token'), session.csrfSecret);`,
  },
  {
    id: 'bruteforce',
    shortLabel: 'Brute-Force',
    title: 'Unlimited Login Attempts vs Sliding-Window Rate Limit',
    summary:
      'Step through consecutive login attempts against a mock account to observe throttling and exponential lockout.',
    inputLabel: 'Attempt Counter (Click Run Attempt)',
    defaultInput: '4',
    presets: [
      { label: 'Attempt #1', value: '1' },
      { label: 'Attempt #4 (Burst)', value: '4' },
    ],
    vulnerableCode: `// VULNERABLE: No rate limit or lockout on authentication route
export async function POST(req: Request) {
  const valid = await checkPassword(body.email, body.password);
  return Response.json({ ok: valid }, { status: valid ? 200 : 401 });
}`,
    hardenedCode: `// HARDENED: Sliding-window limiter + progressive account cooldown
const limit = checkRateLimit(\`login:\${ip}:\${email}\`, 3, 60_000);
if (!limit.allowed) {
  return Response.json({ error: 'Too many attempts' }, {
    status: 429,
    headers: { 'Retry-After': String(limit.retryAfterSeconds) },
  });
}`,
  },
  {
    id: 'hashing',
    shortLabel: 'Password Hashing',
    title: 'Unsalted Fast Digest vs Salted Argon2id KDF',
    summary:
      'Compare fast unsalted hashes susceptible to precomputed tables against memory-hard salted Argon2id digests.',
    inputLabel: 'Synthetic Demo Passphrase (Never Real)',
    defaultInput: 'demo-passphrase-2026',
    presets: [
      { label: 'Sample A', value: 'demo-passphrase-2026' },
      { label: 'Sample B', value: 'builder-try-action' },
    ],
    vulnerableCode: `// VULNERABLE: Unsalted fast hash (microsecond GPU brute-force)
const digest = crypto.createHash('sha256').update(password).digest('hex');`,
    hardenedCode: `// HARDENED: Per-user CSPRNG salt + memory-hard Argon2id
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MiB
  timeCost: 3,
  parallelism: 1,
});`,
  },
  {
    id: 'csp',
    shortLabel: 'Headers & CSP',
    title: 'Missing Security Headers vs Nonce CSP + Framing Lock',
    summary:
      'Inspect HTTP response posture when an untrusted iframe embed or inline script injection is attempted.',
    inputLabel: 'Simulated Threat Vector',
    defaultInput: 'iframe-clickjacking-and-inline-script',
    presets: [
      { label: 'Clickjack + Inline', value: 'iframe-clickjacking-and-inline-script' },
      { label: 'MIME Sniff Probe', value: 'mime-type-confusion' },
    ],
    vulnerableCode: `// VULNERABLE: Default permissive headers
// Missing Content-Security-Policy, X-Frame-Options, nosniff, HSTS`,
    hardenedCode: `// HARDENED: Per-request nonce CSP + strict defense-in-depth headers
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...' 'strict-dynamic'; frame-ancestors 'none'; object-src 'none'
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
  },
];

function deterministicDigestHex(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `${part1}${part2}`.repeat(2);
}

export function runSecuritySimulation(
  scenarioId: SecurityScenarioId,
  mode: SecurityMode,
  rawInput: string,
  attemptCount: number,
): SimulationOutcome {
  const cleanInput = rawInput.slice(0, 120);

  switch (scenarioId) {
    case 'sqli': {
      const looksLikeInjection = /['"=;\\-]|\bOR\b|\bUNION\b/i.test(cleanInput);
      if (mode === 'vulnerable') {
        const returned = looksLikeInjection
          ? MOCK_USERS
          : MOCK_USERS.filter((u) => u.username === cleanInput);
        return {
          statusBadge: looksLikeInjection ? 'BYPASS: ALL MOCK ROWS EXPOSED' : '200 OK (UNSAFE QUERY)',
          statusTone: looksLikeInjection ? 'danger' : 'warn',
          attackerViewTitle: 'Simulated API Response (Mock Fixture)',
          attackerLines: [
            `Interpolated SQL: SELECT id, username, role FROM users WHERE username = '${cleanInput}'`,
            `Rows returned: ${returned.length} -> ${JSON.stringify(returned)}`,
          ],
          defenderLogJson: JSON.stringify(
            {
              event: 'db.query.raw',
              mode: 'vulnerable',
              inputSuspicious: looksLikeInjection,
              rowsLeaked: returned.length,
              action: 'NONE (query executed verbatim)',
            },
            null,
            2,
          ),
          mitigationNote:
            'String concatenation merges untrusted user data into SQL grammar; parameterized queries separate code from data.',
        };
      }

      const validFormat = /^[a-z0-9_]{2,24}$/.test(cleanInput);
      const matched = validFormat
        ? MOCK_USERS.filter((u) => u.username === cleanInput)
        : [];
      return {
        statusBadge: validFormat ? '200 OK (BOUND PARAMETER)' : '422 BLOCKED BY ZOD',
        statusTone: 'safe',
        attackerViewTitle: 'Simulated Hardened Response',
        attackerLines: validFormat
          ? [
              `Prepared SQL: SELECT id, username, role FROM users WHERE username = $1`,
              `Bound $1 = "${cleanInput}" -> ${matched.length} row(s) returned`,
            ]
          : [
              'HTTP 422 Unprocessable Entity',
              '{"error":"Invalid username format. Only lowercase letters, digits, and _ allowed."}',
            ],
        defenderLogJson: JSON.stringify(
          {
            event: validFormat ? 'db.query.parameterized' : 'validation.rejected',
            mode: 'hardened',
            zodPassed: validFormat,
            rowsReturned: matched.length,
          },
          null,
          2,
        ),
        mitigationNote:
          'Zod rejects invalid characters at the HTTP boundary and $1 parameter binding guarantees SQL syntax cannot be altered.',
      };
    }

    case 'xss': {
      const hasHtmlChars = /[<>"]|onerror|onload|<script/i.test(cleanInput);
      if (mode === 'vulnerable') {
        return {
          statusBadge: hasHtmlChars ? 'UNESCAPED HTML INJECTION RISK' : 'RENDERED RAW HTML',
          statusTone: hasHtmlChars ? 'danger' : 'warn',
          attackerViewTitle: 'Simulated Unsafe DOM Inspector (Inert Preview)',
          attackerLines: [
            `Unsafe sink: container.innerHTML = "<p>Welcome, ${cleanInput}</p>"`,
            hasHtmlChars
              ? 'Simulated outcome: Browser HTML parser treats injected tags/attributes as executable markup.'
              : 'Simulated outcome: Safe input rendered as raw HTML.',
          ],
          defenderLogJson: JSON.stringify(
            {
              event: 'dom.render.unescaped',
              mode: 'vulnerable',
              cspHeader: null,
              markupDetected: hasHtmlChars,
            },
            null,
            2,
          ),
          mitigationNote:
            'Writing untrusted text to innerHTML allows tag and event-handler injection if CSP is absent.',
        };
      }

      const escaped = cleanInput
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      return {
        statusBadge: 'ESCAPED AS TEXT + NONCE CSP',
        statusTone: 'safe',
        attackerViewTitle: 'Simulated Hardened DOM & CSP Result',
        attackerLines: [
          `React escaped text node: <p>Welcome, ${escaped}</p>`,
          'Simulated outcome: Characters render literally as inert text; inline scripts lack request nonce and are blocked.',
        ],
        defenderLogJson: JSON.stringify(
          {
            event: 'dom.render.safe_text',
            mode: 'hardened',
            cspEnforced: "script-src 'self' 'nonce-<per-request>' 'strict-dynamic'",
            scriptBlocked: hasHtmlChars,
          },
          null,
          2,
        ),
        mitigationNote:
          'JSX auto-escapes text nodes by default, and nonce CSP acts as defense-in-depth against stray inline scripts.',
      };
    }

    case 'csrf': {
      const isTrusted = cleanInput.trim() === 'https://portfolio.local.example';
      if (mode === 'vulnerable') {
        return {
          statusBadge: isTrusted ? '200 OK (SAME ORIGIN)' : '200 OK (FORGED CROSS-SITE ACCEPTED)',
          statusTone: isTrusted ? 'warn' : 'danger',
          attackerViewTitle: 'Simulated Cross-Site POST Response',
          attackerLines: [
            `Incoming Origin: ${cleanInput || '(missing)'}`,
            'Cookie policy: session=mock123; Path=/ (no SameSite, no CSRF token)',
            'Result: State-changing action executed without verifying request origin.',
          ],
          defenderLogJson: JSON.stringify(
            {
              event: 'profile.email.updated',
              mode: 'vulnerable',
              origin: cleanInput || null,
              csrfTokenVerified: false,
            },
            null,
            2,
          ),
          mitigationNote:
            'Browsers attach ambient cookies to cross-site form/fetch requests unless SameSite, Origin, and CSRF checks block them.',
        };
      }

      return {
        statusBadge: isTrusted ? '200 OK (ORIGIN + TOKEN VERIFIED)' : '403 BLOCKED BY ORIGIN GUARD',
        statusTone: 'safe',
        attackerViewTitle: 'Simulated Hardened POST Response',
        attackerLines: isTrusted
          ? [
              'Origin matches allowlist (https://portfolio.local.example).',
              'SameSite=Strict cookie + X-CSRF-Token verified -> request authorized.',
            ]
          : [
              'HTTP 403 Forbidden',
              `{"error":"Cross-origin state mutation denied for Origin: ${cleanInput || 'none'}"}`,
            ],
        defenderLogJson: JSON.stringify(
          {
            event: isTrusted ? 'profile.email.updated' : 'security.csrf.blocked',
            mode: 'hardened',
            originAllowed: isTrusted,
            sameSiteCookie: 'Strict',
          },
          null,
          2,
        ),
        mitigationNote:
          'Enforcing SameSite=Strict cookies, strict Origin allowlists, and per-session CSRF tokens eliminates cross-site state forgery.',
      };
    }

    case 'bruteforce': {
      const tries = Math.max(1, attemptCount);
      if (mode === 'vulnerable') {
        return {
          statusBadge: `401 ACCEPTED ATTEMPT #${tries} (UNTHROTTLED)`,
          statusTone: tries >= 3 ? 'danger' : 'warn',
          attackerViewTitle: 'Simulated Auth Endpoint Behavior',
          attackerLines: [
            `Attempt #${tries} against demo.builder@example.invalid -> HTTP 401`,
            'Rate limit remaining: Unlimited · Lockout: None · Automation unimpeded.',
          ],
          defenderLogJson: JSON.stringify(
            {
              event: 'auth.login.failed',
              mode: 'vulnerable',
              attemptCount: tries,
              rateLimited: false,
            },
            null,
            2,
          ),
          mitigationNote:
            'Without sliding-window limits and lockout cooldowns, credential-stuffing bots can test thousands of guesses.',
        };
      }

      const blocked = tries > 3;
      const retryAfter = blocked ? Math.min(300, (tries - 3) * 30) : 0;
      return {
        statusBadge: blocked
          ? `429 RATE LIMITED (LOCKOUT ${retryAfter}s)`
          : `401 TRACKED (${3 - tries} TRIES LEFT)`,
        statusTone: 'safe',
        attackerViewTitle: 'Simulated Hardened Auth Response',
        attackerLines: blocked
          ? [
              `HTTP 429 Too Many Requests (Retry-After: ${retryAfter}s)`,
              `Sliding-window quota exceeded at attempt #${tries}. Credentials not even checked during cooldown.`,
            ]
          : [
              `Attempt #${tries} of 3 allowed per 60s window.`,
              `Remaining attempts before exponential backoff: ${3 - tries}.`,
            ],
        defenderLogJson: JSON.stringify(
          {
            event: blocked ? 'auth.rate_limit.triggered' : 'auth.login.failed',
            mode: 'hardened',
            attemptCount: tries,
            blocked,
            retryAfterSeconds: retryAfter,
          },
          null,
          2,
        ),
        mitigationNote:
          'Per-IP and per-account sliding-window rate limits with Retry-After headers stop rapid guessing cold.',
      };
    }

    case 'hashing': {
      const digest = deterministicDigestHex(cleanInput || 'empty');
      if (mode === 'vulnerable') {
        return {
          statusBadge: 'UNSALTED FAST DIGEST (~0.001ms)',
          statusTone: 'danger',
          attackerViewTitle: 'Simulated Database Leak Analysis',
          attackerLines: [
            `Algorithm: Unsalted SHA-256`,
            `Stored digest: ${digest}`,
            'Risk: Identical passphrases always yield identical hashes; rainbow tables & GPUs test billions/sec.',
          ],
          defenderLogJson: JSON.stringify(
            {
              event: 'auth.hash.audit',
              mode: 'vulnerable',
              algorithm: 'sha256-unsalted',
              saltBytes: 0,
              memoryCostKiB: 0,
            },
            null,
            2,
          ),
          mitigationNote:
            'Fast general-purpose digests lack memory hardness and salts, allowing high-speed offline cracking if leaked.',
        };
      }

      const saltPreview = deterministicDigestHex(`${cleanInput}:salt`).slice(0, 16);
      return {
        statusBadge: 'SALTED ARGON2ID (64 MiB COST)',
        statusTone: 'safe',
        attackerViewTitle: 'Simulated Hardened KDF Output',
        attackerLines: [
          `PHC Format: $argon2id$v=19$m=65536,t=3,p=1$${saltPreview}$${digest.slice(0, 22)}`,
          'Protection: Unique 16-byte random salt defeats rainbow tables; 64 MiB RAM requirement throttles GPU cracking.',
        ],
        defenderLogJson: JSON.stringify(
          {
            event: 'auth.hash.audit',
            mode: 'hardened',
            algorithm: 'argon2id',
            saltBytes: 16,
            memoryCostKiB: 65536,
            timeCost: 3,
          },
          null,
          2,
        ),
        mitigationNote:
          'Argon2id pairs per-user cryptographic salts with tunable memory/CPU cost and constant-time verification.',
      };
    }

    case 'csp': {
      if (mode === 'vulnerable') {
        return {
          statusBadge: 'PERMISSIVE HEADERS (EXPOSED)',
          statusTone: 'danger',
          attackerViewTitle: 'Simulated Response Header Scan',
          attackerLines: [
            'Content-Security-Policy: <missing>',
            'X-Frame-Options: <missing> -> Page can be framed for clickjacking overlays.',
            'X-Content-Type-Options: <missing> -> MIME sniffing permitted.',
          ],
          defenderLogJson: JSON.stringify(
            {
              event: 'headers.audit',
              mode: 'vulnerable',
              probe: cleanInput,
              csp: false,
              frameAncestorsBlocked: false,
              hsts: false,
            },
            null,
            2,
          ),
          mitigationNote:
            'Omitting CSP and framing headers exposes users to clickjacking overlays and unauthorized script execution.',
        };
      }

      return {
        statusBadge: 'STRICT NONCE CSP + HSTS ACTIVE',
        statusTone: 'safe',
        attackerViewTitle: 'Simulated Hardened Response Headers',
        attackerLines: [
          "Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<uuid>' 'strict-dynamic'; frame-ancestors 'none'; object-src 'none'",
          'X-Content-Type-Options: nosniff | X-Frame-Options: DENY | Referrer-Policy: strict-origin-when-cross-origin',
        ],
        defenderLogJson: JSON.stringify(
          {
            event: 'headers.audit',
            mode: 'hardened',
            probe: cleanInput,
            cspEnforced: true,
            frameAncestors: "'none'",
            hstsMaxAge: 63072000,
          },
          null,
          2,
        ),
        mitigationNote:
          'Per-request cryptographic nonces + frame-ancestors none block unauthorized scripts and cross-origin iframe overlays.',
      };
    }
  }
}
