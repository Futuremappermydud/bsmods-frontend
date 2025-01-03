export function zip(a: string[], b: string[]) {
  return a.map((k, i) => {
    return {
      label: k,
      value: b[i],
    };
  });
}
