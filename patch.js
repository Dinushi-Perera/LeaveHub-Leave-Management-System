const fs = require('fs');
const p = 'backend/handlers/users.go';
let code = fs.readFileSync(p, 'utf8');
code = code.replace(/UPDATE users SET name = \\\, phone = \\\, department = \\\, designation =\s+\\\, updated_at = CURRENT_TIMESTAMP WHERE id = \\\/g, 'UPDATE users SET name = , phone = , department = , designation = , email = , updated_at = CURRENT_TIMESTAMP WHERE id = ');
fs.writeFileSync(p, code);

