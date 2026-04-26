// ============================================================
// backend/src/scheduler/jobScheduler.js
// Job Scheduler for Periodic Tasks
// Uses node-cron to schedule jobs at specific intervals
// ============================================================

const cron = require("node-cron");
const { cleanupExpiredRememberMeTokens } = require("../jobs/rememberMeCleanupJob");

/**
 * Initialize all scheduled jobs
 * This function should be called when the server starts
 */
const initializeScheduledJobs = () => {
  console.log("[Job Scheduler] Initializing scheduled jobs...");

  // ============================================================
  // Remember Me Token Cleanup Job
  // Runs every hour at the top of the hour (0 minutes)
  // Cron expression: "0 * * * *" = every hour
  // ============================================================
  const rememberMeCleanupJob = cron.schedule("0 * * * *", async () => {
    console.log("[Job Scheduler] Running Remember Me cleanup job...");
    try {
      const result = await cleanupExpiredRememberMeTokens();
      if (result.success) {
        console.log(`[Job Scheduler] ✅ ${result.message}`);
      } else {
        console.error(`[Job Scheduler] ❌ ${result.message}`);
      }
    } catch (error) {
      console.error("[Job Scheduler] Error running cleanup job:", error);
    }
  });

  // ============================================================
  // Alternative: Run every 30 minutes
  // Uncomment below and comment above if you want more frequent cleanup
  // Cron expression: "*/30 * * * *" = every 30 minutes
  // ============================================================
  // const rememberMeCleanupJob = cron.schedule("*/30 * * * *", async () => {
  //   console.log("[Job Scheduler] Running Remember Me cleanup job...");
  //   try {
  //     const result = await cleanupExpiredRememberMeTokens();
  //     if (result.success) {
  //       console.log(`[Job Scheduler] ✅ ${result.message}`);
  //     } else {
  //       console.error(`[Job Scheduler] ❌ ${result.message}`);
  //     }
  //   } catch (error) {
  //     console.error("[Job Scheduler] Error running cleanup job:", error);
  //   }
  // });

  console.log("[Job Scheduler] ✅ Scheduled jobs initialized successfully");
  console.log("[Job Scheduler] - Remember Me cleanup: Every hour at :00");

  return {
    rememberMeCleanupJob,
  };
};

/**
 * Stop all scheduled jobs
 * Call this when shutting down the server
 *
 * @param {Object} jobs - Object containing all scheduled jobs
 */
const stopScheduledJobs = (jobs) => {
  console.log("[Job Scheduler] Stopping scheduled jobs...");

  if (jobs.rememberMeCleanupJob) {
    jobs.rememberMeCleanupJob.stop();
    console.log("[Job Scheduler] ✅ Remember Me cleanup job stopped");
  }

  console.log("[Job Scheduler] All scheduled jobs stopped");
};

module.exports = {
  initializeScheduledJobs,
  stopScheduledJobs,
};
