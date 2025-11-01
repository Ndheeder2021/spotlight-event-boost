-- Drop the existing public policy that allows anyone to view events
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;

-- Create a new policy that requires authentication to view events
CREATE POLICY "Authenticated users can view events"
ON public.events
FOR SELECT
TO authenticated
USING (true);