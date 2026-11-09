// Hook PreToolUse: impede que ferramentas do Claude Code leiam segredos ou
// executem comandos destrutivos no banco. Cobre também o shell, que as regras
// Read/Edit de permissions não alcançam.
const SECRET = /(?<![\w.])\.env(?!\.example\b)(?![\w-])|firebase-key\.json/i;
const DESTRUCTIVE = /prisma(\.cmd)?\s+(migrate\s+reset|db\s+push)|--accept-data-loss/i;

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
}

let raw = '';
process.stdin.setEncoding('utf8');
for await (const chunk of process.stdin) raw += chunk;

let input = {};
try {
  input = JSON.parse(raw).tool_input ?? {};
} catch {
  process.exit(0);
}

const targets = [input.file_path, input.path, input.glob, input.command].filter(Boolean);

if (targets.some((value) => SECRET.test(value))) {
  deny('Bloqueado: arquivo de segredos (.env ou firebase-key.json). Use .env.example ou peça ao usuário.');
} else if (input.command && DESTRUCTIVE.test(input.command)) {
  deny('Bloqueado: comando destrutivo do Prisma. Use npm run db:migrate, que valida o banco local.');
}
