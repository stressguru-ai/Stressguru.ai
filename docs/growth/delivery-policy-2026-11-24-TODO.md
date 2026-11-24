# Mandatory GitHub delivery: November 24, 2026

- [x] Update the saved growth-agent runbook so every successful run requires verified delivery to stressguru-ai/Stressguru.ai main. Preserve existing safety approvals, assets, pending work and AWS deployment separation. If delivery is blocked, report the run as delivery-blocked rather than successfully delivered.
- [x] Update only the existing Sunday automation’s receiving instructions. Preserve Sunday 10:00 America/New_York, enabled state, current-session target and existing listening configuration. Do not create a replacement task or timer.
- [ ] Validate and preserve the instruction records, keep the pending root todo.md untouched, and deliver the existing validated commits plus this instruction update to GitHub without force or overwriting concurrent work. Verify the remote SHA after success; otherwise preserve the commits and report the exact authentication or conflict blocker.
