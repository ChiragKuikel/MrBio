export const extractUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};

  try {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
  } catch (error) {
    console.error("Error parsing URL:", error);
  }

  return params;
};

export const extractFonepayParams = (url: string) => {
  const params = extractUrlParams(url);

  return {
    PRN: params.PRN || "",
    PID: params.PID || "",
    PS: params.PS === "true",
    RC: params.RC || "",
    DV: params.DV || "",
    UID: params.UID || "",
    BC: params.BC || "",
    INI: params.INI || "",
    P_AMT: params.P_AMT || "",
    R_AMT: params.R_AMT || "",
  };
};
