import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdwhhisuykqywatsixwm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd2hoaXN1eWtxeXdhdHNpeHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2MzUwNDcsImV4cCI6MjA0NTIxMTA0N30.t3_qEyuFUJDosdLoGzOLyXIurD880Sudf6QralXu6II';

export const supabase = createClient(supabaseUrl, supabaseKey);