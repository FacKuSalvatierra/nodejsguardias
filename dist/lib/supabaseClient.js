"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || 'https://hjhpxyblqkbxrrqynwzg.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqaHB4eWJscWtieHJycXlud3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDY3OTYsImV4cCI6MjA2Njc4Mjc5Nn0.uKUl0pSC1t9lsfC7Ng97lL6RUZ0akRF4IiRgKU3eFsw';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
