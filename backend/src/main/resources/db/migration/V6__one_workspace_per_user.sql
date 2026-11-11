-- Each user may belong to exactly one workspace. A workspace may still contain
-- multiple users, each represented by its own membership.
DO $$
BEGIN
    IF EXISTS (
        SELECT user_id
        FROM vozly.memberships
        GROUP BY user_id
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'V6 cannot be applied: users with multiple workspace memberships must be reconciled first';
    END IF;
END $$;

CREATE UNIQUE INDEX uq_memberships_single_workspace_per_user
    ON vozly.memberships(user_id);
