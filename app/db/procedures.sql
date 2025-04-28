-- This file contains the SQL procedures for upserting records in the database.
-- It includes procedures for upserting records in the customers, sites, locals, and meters tables.

-- This procedure is used to upsert a site record in the sites table.
CREATE OR REPLACE PROCEDURE upsert_site(
    in_site_id TEXT,
    in_name TEXT,
    in_type TEXT,
    in_customer_id TEXT,
    in_locals_group TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM sites WHERE id = in_site_id) THEN
        UPDATE sites
        SET name = in_name,
            type = in_type,
            customer_id = in_customer_id,
            locals_group = in_locals_group
        WHERE id = in_site_id;
    ELSE
        INSERT INTO sites (id, name, type, customer_id, locals_group)
        VALUES (in_site_id, in_name, in_type, in_customer_id, in_locals_group);
    END IF;
END;
$$;

-- This procedure is used to upsert a local record in the locals table.
CREATE OR REPLACE PROCEDURE upsert_local(
    in_local_id TEXT,
    in_customer_id TEXT,
    in_name TEXT,
    in_type TEXT,
    in_site_id TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM locals WHERE id = in_local_id) THEN
        UPDATE locals
        SET customer_id = in_customer_id,
            name = in_name,
            type = in_type,
            site_id = in_site_id
        WHERE id = in_local_id;
    ELSE
        INSERT INTO locals (id, customer_id, name, type, site_id)
        VALUES (in_local_id, in_customer_id, in_name, in_type, in_site_id);
    END IF;
END;
$$;

-- This procedure is used to upsert a meter record in the meters table.
CREATE OR REPLACE PROCEDURE upsert_meter(
    in_meter_id TEXT,
    in_name TEXT,
    in_type TEXT,
    in_local_id TEXT,
    in_entity_type TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM meters WHERE id = in_meter_id) THEN
        UPDATE meters
        SET name = in_name,
            local_id = in_local_id,
            entity_type = in_entity_type
        WHERE id = in_meter_id;
    ELSE
        INSERT INTO meters (id, name, type, local_id, entity_type)
        VALUES (in_meter_id, in_name, in_type, in_local_id, in_entity_type);
    END IF;
END;
$$;
