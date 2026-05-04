# Sanity Tests

Manual test plan for the Account Provisioning MCP server.

## Prerequisites

- `CLOUDINARY_ACCOUNT_URL` set (format: `account://key:secret@account_id`)
- Server running: `node bin/mcp-server.js start`

## Automated runner

```bash
node sanity-test-runner.mjs           # SSE transport (default)
node sanity-test-runner.mjs --streamable  # Streamable HTTP transport
```

## Test phases

### Phase 1: Product Environments (read-only)
- [ ] List product environments
- [ ] Get a specific product environment

### Phase 2: Users (read-only)
- [ ] List users
- [ ] Get a specific user
- [ ] Get groups for user

### Phase 3: User Groups (read-only)
- [ ] List user groups
- [ ] Get a specific user group
- [ ] List users in a user group

### Phase 4: Access Keys (read-only)
- [ ] List access keys for a product environment

### Phase 5: Billing (read-only)
- [ ] Get billing usage

### Phase 6: Permissions (read-only)
- [ ] Get catalog (system roles and policies)
- [ ] Get Cedar schema
- [ ] List roles
- [ ] List system policies
- [ ] List custom policies
- [ ] List effective policies

### Phase 7: Mutating operations (create/update/delete)
- [ ] Create user group (prefixed `sdk-test-*`)
- [ ] Update user group
- [ ] Add user to group
- [ ] Remove user from group
- [ ] Delete user group
- [ ] Create custom role (if permissions enabled)
- [ ] Delete custom role

### Phase 8: Cleanup
- [ ] Verify all test-created resources are deleted
