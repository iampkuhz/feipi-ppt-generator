import { changeCommand } from '../../src/cli/commands/change.js';

const command = changeCommand();
await command.parseAsync(['node', 'create_change', ...process.argv.slice(2)]);
