-- Create a security definer function to check if a user is enrolled in the course containing a specific lesson
CREATE OR REPLACE FUNCTION public.user_can_access_lesson(lesson_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
    JOIN courses c ON m.course_id = c.id
    LEFT JOIN enrollments e ON c.id = e.course_id AND e.user_id = user_can_access_lesson.user_id
    WHERE l.id = user_can_access_lesson.lesson_id
    AND (
      -- Allow access if user is enrolled in the course
      e.user_id IS NOT NULL
      OR
      -- Allow access if the module is marked as free
      m.is_free = true
    )
  );
$$;

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view lessons" ON public.lessons;

-- Create new secure policy that checks enrollment or free status
CREATE POLICY "Users can view lessons they have access to"
ON public.lessons
FOR SELECT
TO authenticated
USING (
  public.user_can_access_lesson(id, auth.uid())
);

-- Allow unauthenticated users to view only free lessons
CREATE POLICY "Anonymous users can view free lessons"
ON public.lessons  
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1
    FROM modules m
    WHERE m.id = lessons.module_id
    AND m.is_free = true
  )
);