-- Create storage bucket for email template assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('email-templates', 'email-templates', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload email template assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'email-templates');

-- Create policy to allow public read access
CREATE POLICY "Public read access for email template assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'email-templates');

-- Create policy to allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete email template assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'email-templates');