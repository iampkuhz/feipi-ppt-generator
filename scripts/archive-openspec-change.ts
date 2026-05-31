const changeId = process.argv[2];

if (!changeId) {
  console.error('Usage: tsx scripts/archive-openspec-change.ts <change-id>');
  process.exit(1);
}

console.log(`Archive workflow for ${changeId} is a first-version stub.`);
