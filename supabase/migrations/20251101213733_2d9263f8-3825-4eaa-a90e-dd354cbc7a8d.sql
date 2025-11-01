-- Fix hash_token function with proper implementation
-- Using plpgsql instead of sql to handle the digest function properly
DROP FUNCTION IF EXISTS public.hash_token(_token text);

CREATE OR REPLACE FUNCTION public.hash_token(_token text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE STRICT
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Use pgcrypto's digest function via dynamic schema reference
  RETURN encode(digest(_token::bytea, 'sha256'), 'hex');
END;
$$;