import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import camelcase from "camelcase";
import {
  ExecutionMode,
  GeoprocessingJsonConfig,
} from "@seasketch/geoprocessing/client-core";
import metrics from "../../project/metrics.json";

const createReport = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Type of report to create",
      choices: [
        {
          value: "blank",
          name: "Blank report",
        },
        {
          value: "raster",
          name: "Sketch overlap with raster data report",
        },
        {
          value: "vector",
          name: "Sketch overlap with vector data report",
        },
      ],
    },
    {
      type: "input",
      name: "description",
      message: "Describe what this report calculates",
    },
    {
      type: "list",
      name: "executionMode",
      message: "Choose an execution mode for this report",
      choices: [
        {
          value: "sync",
          name: "Sync - Best for quick analyses (< 2s)",
        },
        {
          value: "async",
          name: "Async - Better for long-running processes",
        },
      ],
    },
  ]);

  // Get title of report either from metrics.json or user input
  if (answers.type === "raster") {
    const titleChoiceQuestion = {
      type: "list",
      name: "title",
      message: "Select the metric group to report on",
      choices: metrics.map((metric) => metric.metricId),
    };
    const { title } = await inquirer.prompt([titleChoiceQuestion]);
    answers.title = title;

    const statQuestion = {
      type: "list",
      name: "stat",
      message: "Statistic to calculate",
      choices: ["sum", "count", "area"],
    };
    const { stat } = await inquirer.prompt([statQuestion]);
    answers.stat = stat;
  } else if (answers.type === "blank") {
    const titleQuestion = {
      type: "input",
      name: "title",
      message: "Title for this report, in camelCase",
      default: "newReport",
      validate: (value: any) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
      transformer: (value: any) => camelcase(value),
    };
    const { title } = await inquirer.prompt([titleQuestion]);
    answers.title = title;
  }

  return answers;
};

if (require.main === module) {
  createReport()
    .then(async (answers) => {
      await makeReport(answers, true, "");
    })
    .catch((error) => {
      console.error("Error occurred:", error);
    });
}

export async function makeReport(
  options: ReportOptions,
  interactive = true,
  basePath = "./"
) {
  // Start interactive spinner
  const spinner = interactive
    ? ora("Creating new geoprocessing handler").start()
    : { start: () => false, stop: () => false, succeed: () => false };
  spinner.start(`creating handler from templates`);

  // Get paths
  const projectFunctionPath = "./src/functions";
  const projectComponentPath = basePath + "./src/components";
  const templatePath = "./src/util";
  if (!fs.existsSync(path.join(basePath, "src"))) {
    fs.mkdirSync(path.join(basePath, "src"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "functions"))) {
    fs.mkdirSync(path.join(basePath, "src", "functions"));
  }
  if (!fs.existsSync(path.join(basePath, "src", "components"))) {
    fs.mkdirSync(path.join(basePath, "src", "components"));
  }

  const defaultFunctionName =
    options.type === "raster" ? "rasterFunction" : "blankFunction";
  const defaultCompName =
    options.type === "raster" ? "RasterCard" : "BlankCard";

  const functionCode = await fs.readFile(
    `${templatePath}/${defaultFunctionName}.ts`
  );
  const testFunctionCode = await fs.readFile(
    `${templatePath}/${defaultFunctionName}Smoke.test.ts`
  );
  const componentCode = await fs.readFile(
    `${templatePath}/${defaultCompName}.tsx`
  );
  const storiesComponentCode = await fs.readFile(
    `${templatePath}/${defaultCompName}.stories.tsx`
  );

  // BLANK REPORT
  if (options.type === "blank") {
    await fs.writeFile(
      `${projectFunctionPath}/${options.title}.ts`,
      functionCode
        .toString()
        .replace(/blankFunction/g, options.title)
        .replace(
          /blankFunction/g,
          options.title.slice(0, 1).toUpperCase() + options.title.slice(1)
        )
        .replace(/functionName/g, options.title)
        .replace(`"async"`, `"${options.executionMode}"`)
        .replace("Function description", options.description)
    );
    await fs.writeFile(
      `${projectFunctionPath}/${options.title}Smoke.test.ts`,
      testFunctionCode
        .toString()
        .replace(/blankFunction/g, options.title)
        .replace("./blankFunction", `./${options.title}`)
    );

    await fs.writeFile(
      `${projectComponentPath}/${
        options.title.charAt(0).toUpperCase() + options.title.slice(1)
      }.tsx`,
      componentCode
        .toString()
        .replace(
          /BlankCard/g,
          `${options.title.charAt(0).toUpperCase() + options.title.slice(1)}`
        )
        .replace(`"blankFunction"`, `"${options.title}"`)
        .replace(`functions/blankFunction`, `functions/${options.title}`)
    );

    await fs.writeFile(
      `${projectComponentPath}/${
        options.title.charAt(0).toUpperCase() + options.title.slice(1)
      }.stories.tsx`,
      storiesComponentCode
        .toString()
        .replace(
          /BlankCard/g,
          `${options.title.charAt(0).toUpperCase() + options.title.slice(1)}`
        )
        .replace(`"blankFunction"`, `"${options.title}"`)
    );
  } else if (options.type === "raster") {
    // RASTER REPORT

    await fs.writeFile(
      `${projectFunctionPath}/${options.title}.ts`,
      functionCode
        .toString()
        .replace(/rasterFunction/g, options.title)
        .replace(
          /rasterFunction/g,
          options.title.slice(0, 1).toUpperCase() + options.title.slice(1)
        )
        .replace(/functionName/g, options.title)
        .replace(`"async"`, `"${options.executionMode}"`)
        .replace("Function description", options.description)
        .replace(`"sum"`, `"${options.stat}"`)
    );
    await fs.writeFile(
      `${projectFunctionPath}/${options.title}Smoke.test.ts`,
      testFunctionCode
        .toString()
        .replace(/rasterFunction/g, options.title)
        .replace("./rasterFunction", `./${options.title}`)
    );

    await fs.writeFile(
      `${projectComponentPath}/${
        options.title.charAt(0).toUpperCase() + options.title.slice(1)
      }.tsx`,
      componentCode
        .toString()
        .replace(
          /RasterCard/g,
          `${options.title.charAt(0).toUpperCase() + options.title.slice(1)}`
        )
        .replace(`"rasterFunction"`, `"${options.title}"`)
        .replace(/rasterFunction/g, options.title)
        .replace(`functions/rasterFunction`, `functions/${options.title}`)
        .replace(`"sum"`, `"${options.stat}"`)
    );

    await fs.writeFile(
      `${projectComponentPath}/${
        options.title.charAt(0).toUpperCase() + options.title.slice(1)
      }.stories.tsx`,
      storiesComponentCode
        .toString()
        .replace(
          /RasterCard/g,
          `${options.title.charAt(0).toUpperCase() + options.title.slice(1)}`
        )
        .replace(`"rasterFunction"`, `"${options.title}"`)
    );
  }

  // Add function to geoprocessing.json
  const geoprocessingJson = JSON.parse(
    fs.readFileSync(path.join(basePath, "geoprocessing.json")).toString()
  ) as GeoprocessingJsonConfig;
  geoprocessingJson.geoprocessingFunctions =
    geoprocessingJson.geoprocessingFunctions || [];
  geoprocessingJson.geoprocessingFunctions.push(
    `src/functions/${options.title}.ts`
  );
  fs.writeFileSync(
    path.join(basePath, "geoprocessing.json"),
    JSON.stringify(geoprocessingJson, null, "  ")
  );

  // Finish and show next steps
  spinner.succeed(
    `Created ${options.title} function in ${projectFunctionPath} and ${options.title} component in ${projectComponentPath}/`
  );
  if (interactive) {
    console.log(chalk.blue(`\nReport successfully created!`));
    console.log(`\nNext Steps:
    * Edit your function: ${`${projectFunctionPath}/${options.title}.ts`}
    * Edit your component: ${`${projectComponentPath}/${
      options.title.charAt(0).toUpperCase() + options.title.slice(1)
    }.tsx`}
    * Smoke test in ${`${projectFunctionPath}/${options.title}Smoke.test.ts`} will be run the next time you use 'npm test'
    * Populate examples/sketches folder with sketches for smoke test to run against
    * Add your new <${
      options.title.charAt(0).toUpperCase() + options.title.slice(1)
    } /> component to your reports by adding it to Viability.tsx or Representation.tsx
    * View your report using 'npm start-storybook' with smoke test output for all geoprocessing functions
  `);
  }
}

export { createReport };

interface ReportOptions {
  type: string;
  stat?: string;
  title: string;
  executionMode: ExecutionMode;
  description: string;
}
