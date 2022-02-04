export const preprocess = (data: Uint8Array): String[] =>
  new TextDecoder()
    .decode(data)
    .replace(/[^\w\s]/gi, " ")
    .replace(/\n/g, ",")
    .replace(/\s{2,}/g, " ")
    .split(",")
    .filter((item) => item.indexOf("cudos") > -1)
    .map((item) => item.trim());
export const fetchData = (data: String[]) =>
  data.map((item) => {
    const splits = item.split(" ");
    const id = splits[0];
    const creator = splits.findIndex((j) => j.includes("cudos"));
    const name = splits.slice(1, creator).join(" ");
    return {
      id,
      name,
      creator: splits[creator],
    };
  });