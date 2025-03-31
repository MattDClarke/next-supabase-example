// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { createClient } from '@/utils/supabase/server';
import { supabaseIntegration } from '@supabase/sentry-js-integration';

const initSentry = async () => {
  const supabaseServerClient = await createClient();
  Sentry.init({
    dsn: "https://f00798c06f7e7746d563f5382c4925f8@o4506183415103488.ingest.us.sentry.io/4509071921774592",
    integrations: [
      supabaseIntegration(supabaseServerClient, Sentry, {
        tracing: true,
        breadcrumbs: true,
        errors: true,
      }),
      Sentry.winterCGFetchIntegration({
        breadcrumbs: true,
        shouldCreateSpanForRequest: (url) => {
          return !url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest`)
        },
      }),
    ],
    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: true,
  });
};

initSentry().catch(console.error);
