-- Enforce the product rule: each user belongs to exactly one workspace.
-- A workspace can still have multiple users (one row per user_id).
CREATE UNIQUE INDEX uq_memberships_single_workspace_per_user
    ON vozly.memberships(user_id);
