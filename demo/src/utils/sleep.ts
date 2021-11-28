export const sleep = (delay = 1_000) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

export default sleep;
