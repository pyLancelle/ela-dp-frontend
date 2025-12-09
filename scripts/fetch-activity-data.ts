/**
 * Script pour requêter BigQuery et récupérer la structure des données d'activités
 */

import { BigQuery } from '@google-cloud/bigquery';
import * as fs from 'fs';
import * as path from 'path';

const bigquery = new BigQuery({
  projectId: 'polar-scene-465223-f7',
  keyFilename: path.join(__dirname, '../gcs_key.json'),
});

async function fetchActivityData() {
  try {
    const query = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_activites__last_run\`
      LIMIT 1
    `;

    console.log('🔍 Querying BigQuery...');
    console.log('Query:', query);

    const [rows] = await bigquery.query(query);

    if (rows.length === 0) {
      console.log('❌ No data found in the view');
      return;
    }

    const activity = rows[0];

    console.log('\n✅ Data fetched successfully!');
    console.log('\n📊 Activity Summary:');
    console.log(`   Activity ID: ${activity.activityId}`);
    console.log(`   Name: ${activity.activityName}`);
    console.log(`   Date: ${activity.startTimeGMT}`);
    console.log(`   Distance: ${activity.distance}m`);
    console.log(`   Duration: ${activity.duration}s`);
    console.log(`   Type: ${activity.typeKey}`);

    // Analyser la structure
    console.log('\n🔍 Structure Analysis:');
    console.log('\n--- Fields ---');
    Object.keys(activity).forEach(key => {
      const value = activity[key];
      const type = Array.isArray(value) ? 'Array' : typeof value === 'object' && value !== null ? 'Object/Struct' : typeof value;
      console.log(`   ${key}: ${type}`);
    });

    // Détails des structures complexes
    if (activity.fastestSplits) {
      console.log('\n--- fastestSplits ---');
      console.log(JSON.stringify(activity.fastestSplits, null, 2));
    }

    if (activity.hr_zones) {
      console.log('\n--- hr_zones ---');
      console.log(JSON.stringify(activity.hr_zones, null, 2));
    }

    if (activity.power_zones) {
      console.log('\n--- power_zones ---');
      console.log(JSON.stringify(activity.power_zones, null, 2));
    }

    if (activity.kilometer_laps && activity.kilometer_laps.length > 0) {
      console.log('\n--- kilometer_laps (first 3) ---');
      console.log(JSON.stringify(activity.kilometer_laps.slice(0, 3), null, 2));
    }

    if (activity.training_intervals && activity.training_intervals.length > 0) {
      console.log('\n--- training_intervals ---');
      console.log(JSON.stringify(activity.training_intervals, null, 2));
    }

    // Sauvegarder les données complètes
    const outputDir = path.join(__dirname, '../data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'activity-sample.json');
    fs.writeFileSync(outputPath, JSON.stringify(activity, null, 2));

    console.log(`\n💾 Full data saved to: ${outputPath}`);

    // Générer les types TypeScript
    console.log('\n📝 Generating TypeScript interfaces...');
    generateTypeScriptInterfaces(activity);

  } catch (error) {
    console.error('❌ Error querying BigQuery:', error);
    throw error;
  }
}

function generateTypeScriptInterfaces(activity: any) {
  let interfaces = `// Auto-generated from BigQuery data
// Generated on ${new Date().toISOString()}

`;

  // FastestSplits
  if (activity.fastestSplits) {
    interfaces += `interface FastestSplits {
`;
    Object.keys(activity.fastestSplits).forEach(key => {
      interfaces += `  ${key}: number | null;\n`;
    });
    interfaces += `}\n\n`;
  }

  // HR Zones
  if (activity.hr_zones) {
    interfaces += `interface HRZones {
`;
    Object.keys(activity.hr_zones).forEach(key => {
      interfaces += `  ${key}: number | null;\n`;
    });
    interfaces += `}\n\n`;
  }

  // Power Zones
  if (activity.power_zones) {
    interfaces += `interface PowerZones {
`;
    Object.keys(activity.power_zones).forEach(key => {
      interfaces += `  ${key}: number | null;\n`;
    });
    interfaces += `}\n\n`;
  }

  // Kilometer Lap
  if (activity.kilometer_laps && activity.kilometer_laps.length > 0) {
    const lap = activity.kilometer_laps[0];
    interfaces += `interface KilometerLap {
`;
    Object.keys(lap).forEach(key => {
      const value = lap[key];
      const type = typeof value === 'number' ? 'number' : typeof value === 'string' ? 'string' : 'any';
      interfaces += `  ${key}: ${type} | null;\n`;
    });
    interfaces += `}\n\n`;
  }

  // Training Interval
  if (activity.training_intervals && activity.training_intervals.length > 0) {
    const interval = activity.training_intervals[0];
    interfaces += `interface TrainingInterval {
`;
    Object.keys(interval).forEach(key => {
      const value = interval[key];
      const type = typeof value === 'number' ? 'number' : typeof value === 'string' ? 'string' : 'any';
      interfaces += `  ${key}: ${type} | null;\n`;
    });
    interfaces += `}\n\n`;
  }

  // Main Activity interface
  interfaces += `interface Activity {
  activityId: number;
  activityName: string;
  startTimeGMT: string;
  endTimeGMT: string;
  typeKey: string;
  distance: number | null;
  duration: number | null;
  elapsedDuration: number | null;
  elevationGain: number | null;
  elevationLoss: number | null;
  averageSpeed: number | null;
  hasPolyline: boolean | null;
  calories: number | null;
  averageHR: number | null;
  maxHR: number | null;
  aerobicTrainingEffect: number | null;
  anaerobicTrainingEffect: number | null;
  minElevation: number | null;
  maxElevation: number | null;
  activityTrainingLoad: number | null;
  fastestSplits: FastestSplits | null;
  hr_zones: HRZones | null;
  power_zones: PowerZones | null;
  kilometer_laps: KilometerLap[] | null;
  training_intervals: TrainingInterval[] | null;
}
`;

  const interfacesPath = path.join(__dirname, '../types/activity-bigquery.ts');
  const typesDir = path.dirname(interfacesPath);
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  fs.writeFileSync(interfacesPath, interfaces);
  console.log(`   ✅ Interfaces saved to: ${interfacesPath}`);
}

// Run the script
fetchActivityData().catch(console.error);
