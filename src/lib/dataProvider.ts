import { dataProvider as supabaseDataProvider } from "@refinedev/supabase"
import { supabase } from "./supabaseClient"

export const dataProvider = supabaseDataProvider(supabase)