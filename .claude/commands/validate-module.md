---
description: Run all validation gates for a module
argument-hint: <module-id>
---

# /validate-module $ARGUMENTS

```bash
python3 tools/validate.py
pwsh tools/validate-manybolts.ps1 -Module $ARGUMENTS
node --check <(python3 -c "import re;print(re.search(r'<script>(.*)</script>',open('course/index.html').read(),re.S).group(1))")
```

Then read the output and act:

- **Failures** block. Fix them.
- **Rule 3 warnings** (unqualified scale claims) are the ones to actually read. Each is a place the module may have reverted to single-mob thinking. Judge each; fix or justify.
- **Rule 7 warnings** (glossary) — add the term to `course/glossary.md` or unbold it.

Then a human check the validator cannot do:

1. Does the module make an argument, or does it list topics?
2. Would a staff engineer already doing this work learn something in the first two minutes?
3. If it has an honest-limit section — is the limit real, or has it been softened into a caveat?
4. Does any sentence sound like it came from a vendor?

Finally, update `PROGRESS.md` and report status.
