const safeExit = (code: number | null): void => {
  if (typeof code === 'number') {
    process.exitCode = code;
  }
};

export default safeExit;
