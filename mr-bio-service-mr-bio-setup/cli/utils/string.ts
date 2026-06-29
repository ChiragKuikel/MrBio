export function replaceDynamicVariables(input: string, variables: Record<string, any>): string {
  const regex = /\{\{([\w.]+)\}\}/g;

  return input.replace(regex, (match, variable) => {
    const value = variable
      .split('.')
      .reduce((obj: Record<string, any>, key: string) => obj?.[key], variables);

    return value !== undefined ? value : match;
  });
}

export function capitalizeInitial(inputString: string): string {
  if (inputString.length === 0) {
    return inputString;
  }

  return `${inputString[0]!.toUpperCase()}${inputString.slice(1)}`;
}
