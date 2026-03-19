const fs = require('fs'); let code = fs.readFileSync('models/models.go', 'utf8'); code = code.replace(/Name        string \json:\
ame\\\\n        Email       string \json:\email\\\\n        Email     string    \json:\email\\/g, 'Name      string    \json:\
ame\\\\n        Email     string    \json:\email\\'); fs.writeFileSync('models/models.go', code);
