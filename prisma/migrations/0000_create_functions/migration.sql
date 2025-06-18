CREATE OR REPLACE FUNCTION generate_alphanumeric_id()
RETURNS VARCHAR(5) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(5) := '';
    i INTEGER := 0;
    random_index INTEGER;
BEGIN
    WHILE i < 5 LOOP
        random_index := floor(random() * length(chars) + 1);
        result := result || substr(chars, random_index, 1);
        i := i + 1;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql; 