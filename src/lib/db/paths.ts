import path from 'path';

export const DEFAULT_DB_DIRECTORY = '.veradmin-dev';
export const DEFAULT_DB_FILENAME = 'veradmin.dev.sqlite';

export type VeradminDbPaths = {
  projectRoot: string;
  dataDirectory: string;
  dbFilePath: string;
};

export type ResolveDbPathsOptions = {
  projectRoot?: string;
  dataDirectoryName?: string;
  dbFileName?: string;
};

export function resolveDbPaths(
  options: ResolveDbPathsOptions = {},
): VeradminDbPaths {
  const projectRoot = options.projectRoot ?? process.cwd();
  const dataDirectoryName = options.dataDirectoryName ?? DEFAULT_DB_DIRECTORY;
  const dbFileName = options.dbFileName ?? DEFAULT_DB_FILENAME;

  const dataDirectory = path.join(projectRoot, dataDirectoryName);
  const dbFilePath = path.join(dataDirectory, dbFileName);

  return {
    projectRoot,
    dataDirectory,
    dbFilePath,
  };
}

export function resolveDbFilePath(
  options: ResolveDbPathsOptions = {},
): string {
  return resolveDbPaths(options).dbFilePath;
}