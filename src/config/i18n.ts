
export const i18nMap: Record<string, string> = {
    "OK": "OK",
    "Cancel": "Cancel",
    "Search": "Search",
};

export const i18n = (words: TemplateStringsArray, args: any[] = []) => {
    const acm: string[] = [];
    for (let i = 0; i !== words.length; i++) {
        const word = words[i];
        acm.push(i18nMap[word] || word);
        if (i !== args.length) {
            acm.push(args[i]);
        }
    }
    return acm.join('');
};

export default i18n;
