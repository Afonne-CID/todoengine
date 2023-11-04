import { createClient } from '@supabase/supabase-js'

const project_url = import.meta.env.VITE_PROJECT_URL
const project_api = import.meta.env.VITE_PROJECT_API

export const supabase = createClient(project_url, project_api)
