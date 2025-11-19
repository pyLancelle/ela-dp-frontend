import { BigQuery } from '@google-cloud/bigquery';

// Configuration centralisée
// On parse les credentials une seule fois au démarrage
const credentials = process.env.GCS_KEY
  ? JSON.parse(process.env.GCS_KEY)
  : undefined;

if (!credentials) {
  console.warn('Warning: GCS_KEY environment variable is not set or empty.');
}

// Instance unique (Singleton) exportée pour toute l'application
export const bigquery = new BigQuery({
  projectId: 'polar-scene-465223-f7',
  credentials,
});
