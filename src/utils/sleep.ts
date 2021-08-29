export const sleep = (timeout = 1000) => new Promise<void>((res) => setTimeout(() => res(), timeout));

export default sleep;
