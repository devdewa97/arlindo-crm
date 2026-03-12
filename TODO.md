# Fix Login Issue for New Users After Password Change

## Steps:
- [x] 1. Plan approved by user
- [x] 2. Add debug logging to server.js change-password and login endpoints ✓
- [ ] 3. User restarts server and tests create user → login → change password → relogin (confirmed initial login works, fails after PW change)
- [ ] 4. Analyze server console logs during failed attempts
- [ ] 5. Fix root cause based on logs (likely user error or bcrypt issue)
- [ ] 6. Remove debug logs
- [ ] 7. Test complete flow
- [ ] 8. attempt_completion

