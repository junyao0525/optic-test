// generateSupabaseTypes.js

const { execSync } = require("child_process");
require("dotenv").config();

const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error(
    "SUPABASE_PROJECT_ID is not defined in the environment variables."
  );
  process.exit(1);
}

try {
  execSync(
    `npx supabase gen types typescript --project-id ${projectId} --schema public > types/supabase.ts`,
    { stdio: "inherit" }
  );
  console.log("Supabase types generated successfully!");
} catch (error) {
  console.error("Failed to generate Supabase types:", error);
  process.exit(1);
}
